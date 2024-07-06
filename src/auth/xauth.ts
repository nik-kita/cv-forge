import type { api } from '@/api/api.namespace'
import type { Ref } from 'vue'
import {
  assign,
  createMachine,
  setup,
  type AnyActorRef,
} from 'xstate'
export namespace xauth {
  export type Input = {
    username: Ref<
      string | null
    >
    is_user: Ref<boolean>
  }
  export type Context =
    Input & {
      xfetch_refresh_waiters: AnyActorRef[]
      update_access_token: (
        token: string | null,
      ) => void
      update_refresh_token: (
        token: string | null,
      ) => void
      get_access_refresh_tokens: () => {
        access_token:
          | string
          | null
        refresh_token:
          | string
          | null
      }
    }
  export type Events =
    | {
        type: 'auth.sign-in'
      }
    | {
        type: 'auth.logout'
      }
    | {
        type: 'auth.subscribe_on_refresh_update'
        payload: {
          xfetch: AnyActorRef
        }
      }
    | {
        type: 'auth.unauthorized'
      }
    | {
        type: 'xfetch.refresh.success'
      }
    | {
        type: 'xfetch.refresh.fail'
      }
  export const machine =
    setup({
      types: {
        input: {} as Input,
        context:
          {} as Context,
        events: {} as Events,
      },
      actions: {
        register_xfetch_waiter:
          assign({
            xfetch_refresh_waiters:
              (
                { context },
                params: AnyActorRef,
              ) => {
                context.xfetch_refresh_waiters.push(
                  params,
                )
                return context.xfetch_refresh_waiters
              },
          }),
        notify_xfetch_waiters:
          assign({
            xfetch_refresh_waiters:
              (
                { context },
                {
                  result,
                }: {
                  result:
                    | 'success'
                    | 'fail'
                },
              ) => {
                const notification =
                  result ===
                  'success'
                    ? ({
                        type: 'xfetch.refresh.success',
                      } as const)
                    : ({
                        type: 'xfetch.refresh.fail',
                      } as const)
                context.xfetch_refresh_waiters
                  .splice(0)
                  .map(w =>
                    w.send(
                      notification satisfies Events,
                    ),
                  )

                return context.xfetch_refresh_waiters
              },
          }),
        update_access_refresh_tokens:
          function (
            {
              context: {
                update_access_token,
                update_refresh_token,
              },
            },
            params: {
              access_token: string
              refresh_token: string
            },
          ) {
            update_access_token(
              params.access_token,
            )
            update_refresh_token(
              params.refresh_token,
            )
          },
        update_username:
          function (
            { context },
            params: {
              username:
                | string
                | null
            } | null,
          ) {
            if (params) {
              context.username.value =
                params.username
            }
          },
        clean_access_refresh_tokens:
          function ({
            context,
          }) {
            context.update_access_token(
              null,
            )
            context.update_refresh_token(
              null,
            )
          },
      },
      actors: {
        xfetch: createMachine(
          {
            /* ... */
          },
        ),
      },
      guards: {
        is_user: function ({
          context,
        }) {
          return context
            .is_user.value
        },
      },
    }).createMachine({
      id: 'xauth',
      context: function ({
        input,
      }) {
        return {
          ...input,
          xfetch_refresh_waiters:
            [],
          update_access_token:
            (
              token?:
                | string
                | null,
            ) => {
              token &&
                localStorage.setItem(
                  'access_token',
                  token,
                )
            },
          update_refresh_token:
            (
              token?:
                | string
                | null,
            ) => {
              token &&
                localStorage.setItem(
                  'refresh_token',
                  token,
                )
            },
          get_access_refresh_tokens:
            () => {
              return {
                access_token:
                  localStorage.getItem(
                    'access_token',
                  ),
                refresh_token:
                  localStorage.getItem(
                    'refresh_token',
                  ),
              }
            },
        }
      },
      initial: 'Init',
      states: {
        Init: {
          always: [
            {
              target: 'User',
              guard: {
                type: 'is_user',
              },
            },
            {
              target: 'Guest',
            },
          ],
        },
        User: {
          initial: 'Idle',
          on: {
            'auth.logout': {
              target:
                '#xauth.User.Processing_logout',
            },
            'auth.unauthorized':
              {
                target:
                  '#xauth.User.Processing_refresh',
              },
          },
          states: {
            Idle: {},
            Processing_logout:
              {
                invoke: {
                  id: 'logout',
                  input: {},
                  onDone: {
                    target:
                      '#xauth.Guest',
                    actions: {
                      type: 'clean_access_refresh_tokens',
                    },
                  },
                  onError: {
                    target:
                      'Idle',
                  },
                  src: 'xfetch',
                },
              },
            Processing_refresh:
              {
                on: {
                  'auth.subscribe_on_refresh_update':
                    {
                      actions:
                        {
                          type: 'register_xfetch_waiter',
                          params:
                            ({
                              event,
                            }) => {
                              return event
                                .payload
                                .xfetch
                            },
                        },
                    },
                },

                invoke: {
                  id: 'refresh',
                  input: {},
                  onDone: {
                    target:
                      'Idle',
                    actions: [
                      {
                        type: 'update_access_refresh_tokens',
                        params:
                          ({
                            event,
                          }) => {
                            const output =
                              event.output as api.Res.Success<
                                'post',
                                '/auth/refresh'
                              >

                            return output
                          },
                      },
                      {
                        type: 'notify_xfetch_waiters',
                        params:
                          {
                            result:
                              'success',
                          },
                      },
                    ],
                  },
                  onError: {
                    target:
                      '#xauth.Guest',
                    actions: [
                      {
                        type: 'clean_access_refresh_tokens',
                      },
                      {
                        type: 'notify_xfetch_waiters',
                        params:
                          {
                            result:
                              'fail',
                          },
                      },
                    ],
                  },
                  src: 'xfetch',
                },
              },
          },
        },
        Guest: {
          initial: 'Idle',
          on: {
            'auth.sign-in': {
              target:
                '#xauth.Guest.Processing_sign-in',
            },
          },
          states: {
            Idle: {},
            'Processing_sign-in':
              {
                invoke: {
                  id: 'sign-in',
                  input: {},
                  onDone: {
                    target:
                      '#xauth.User',
                    actions: [
                      {
                        type: 'update_access_refresh_tokens',
                        params:
                          ({
                            event,
                          }) => {
                            const output =
                              event.output as api.Res.Success<
                                'post',
                                '/auth/sign-in'
                              >
                            return {
                              access_token:
                                output.access_token,
                              refresh_token:
                                output.refresh_token,
                            }
                          },
                      },
                      {
                        type: 'update_username',
                        params:
                          ({
                            context,
                            event,
                          }) => {
                            const {
                              nik = null,
                            } =
                              event.output as api.Res.Success<
                                'post',
                                '/auth/sign-in'
                              >

                            return context
                              .username
                              .value ===
                              nik
                              ? null
                              : {
                                  username:
                                    nik,
                                }
                          },
                      },
                    ],
                  },
                  onError: {
                    target:
                      'Idle',
                  },
                  src: 'xfetch',
                },
              },
          },
        },
      },
    })
}
