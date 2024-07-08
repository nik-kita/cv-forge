import { use_app_store } from '@/app.store'
import type { ViewerRole } from '@/auth/user-role.type'
import type { RouteLocationNormalized } from 'vue-router'
import {
  assign,
  setup,
} from 'xstate'
import type { NavEvent } from './nav-event.type'

export namespace xslugger {
  export type Input = {
    to: RouteLocationNormalized
  }
  export type Output =
    | {
        ok: true
        path: string
        x_event: NavEvent['type']
        role: ViewerRole
      }
    | {
        ok: false
        message?: string
        path?: string
        role?: string
      }
  export type Context = {
    to: RouteLocationNormalized
    output?: Output
  }
  export const machine =
    setup({
      types: {
        input: {} as Input,
        context:
          {} as Context,
        output: {} as Output,
      },
      actions: {
        init_output: assign({
          output: ({
            context,
          }) =>
            ({
              ok: true,
              path: context.to
                .path,
              x_event:
                context.to
                  .meta
                  .x_event,
              role: 'guest',
            }) as const,
        }),
        generate_output:
          assign({
            output(
              _,
              params: Output,
            ) {
              const { ok } =
                params
              if (ok) {
                const {
                  path,
                  role,
                  x_event,
                } = params
                return {
                  ok,
                  path,
                  role,
                  x_event,
                } as const
              } else {
                return {
                  ok,
                  message:
                    params.message,
                } as const
              }
            },
          }),
        add_own_nik_to_nik_slug:
          assign({
            output({
              context,
            }) {
              const app_store =
                use_app_store()
              if (
                !context
                  .output
                  ?.path ||
                !app_store.nik
              ) {
                throw new Error(
                  'This action should not be called if either path or nik is missing',
                )
              }

              return {
                ...context.output,
                path: `${context.output.path}/${app_store.nik}`,
              }
            },
          }),
      },
      guards: {
        is_nik_slug_present:
          function ({
            context,
          }) {
            return !!context
              .to.params.nik
          },
        is_user: function () {
          return !!use_app_store()
            .user
        },
        has_user_nik:
          function () {
            const app_store =
              use_app_store()
            return !!app_store.nik
          },
        is_niks_equal:
          function ({
            context,
          }) {
            const app_store =
              use_app_store()
            if (
              !app_store.nik ||
              !context.to
                .params.nik
            ) {
              throw new Error(
                'This guard should not be called if either nik is missing',
              )
            }

            return (
              app_store.nik ===
              context.to
                .params.nik
            )
          },
        is_public: function ({
          context,
        }) {
          return context.to
            .meta.public
        },
      },
    }).createMachine({
      context({ input }) {
        return {
          to: input.to,
          user: use_app_store()
            .user,
        }
      },
      output({ context }) {
        if (!context.output) {
          throw new Error(
            'Output is missing',
          )
        }

        return context.output
      },
      entry: 'init_output',
      id: 'nik_slugger',
      initial:
        'Compute_nik_slug',
      states: {
        Compute_nik_slug: {
          always: [
            {
              target:
                'With_nik_slug',
              guard: {
                type: 'is_nik_slug_present',
              },
            },
            {
              target:
                'No_nik_slug',
            },
          ],
        },
        With_nik_slug: {
          initial:
            'Compute_auth',
          states: {
            Compute_auth: {
              always: [
                {
                  target:
                    'User',
                  guard: {
                    type: 'is_user',
                  },
                },
                {
                  target:
                    'Guest',
                },
              ],
            },
            User: {
              initial:
                'Compute_user_nik',
              states: {
                Compute_user_nik:
                  {
                    always: [
                      {
                        target:
                          'User_with_nik',
                        guard:
                          {
                            type: 'has_user_nik',
                          },
                      },
                      {
                        target:
                          'User_without_nik',
                      },
                    ],
                  },
                User_with_nik:
                  {
                    initial:
                      'Compute_niks_equality',
                    states: {
                      Compute_niks_equality:
                        {
                          always:
                            [
                              {
                                target:
                                  'niks_are_equal',
                                guard:
                                  {
                                    type: 'is_niks_equal',
                                  },
                              },
                              {
                                target:
                                  'niks_are_not_equal',
                              },
                            ],
                        },
                      niks_are_equal:
                        {
                          always:
                            {
                              target:
                                '#nik_slugger.Owner',
                            },
                        },
                      niks_are_not_equal:
                        {
                          always:
                            {
                              target:
                                '#nik_slugger.User',
                            },
                        },
                    },
                  },
                User_without_nik:
                  {
                    always: {
                      target:
                        '#nik_slugger.User',
                    },
                  },
              },
            },
            Guest: {
              always: {
                target:
                  '#nik_slugger.Guest',
              },
            },
          },
        },
        No_nik_slug: {
          initial:
            'Compute_route_privacy',
          states: {
            Compute_route_privacy:
              {
                always: [
                  {
                    target:
                      'Public_route',
                    guard: {
                      type: 'is_public',
                    },
                  },
                  {
                    target:
                      'Private_route',
                  },
                ],
              },
            Public_route: {
              initial:
                'Compute_auth',
              states: {
                Compute_auth:
                  {
                    always: [
                      {
                        target:
                          'User',
                        guard:
                          {
                            type: 'is_user',
                          },
                      },
                      {
                        target:
                          'Guest',
                      },
                    ],
                  },
                User: {
                  initial:
                    'Process_own_nik',
                  states: {
                    Process_own_nik:
                      {
                        always:
                          [
                            {
                              target:
                                '#nik_slugger.Owner',
                              actions:
                                {
                                  type: 'add_own_nik_to_nik_slug',
                                },
                              guard:
                                {
                                  type: 'has_user_nik',
                                },
                            },
                            {
                              target:
                                '#nik_slugger.User',
                            },
                          ],
                      },
                  },
                },
                Guest: {
                  always: {
                    target:
                      '#nik_slugger.Guest',
                  },
                },
              },
            },
            Private_route: {
              initial:
                'Compute_auth',
              states: {
                Compute_auth:
                  {
                    always: [
                      {
                        target:
                          'User',
                        guard:
                          {
                            type: 'is_user',
                          },
                      },
                      {
                        target:
                          'Guest',
                      },
                    ],
                  },
                User: {
                  always: {
                    target:
                      '#nik_slugger.Owner',
                  },
                },
                Guest: {
                  always: {
                    target:
                      '#nik_slugger.Forbidden',
                  },
                },
              },
            },
          },
        },
        Guest: {
          type: 'final',
          entry: {
            type: 'generate_output',
            params({
              context,
            }) {
              if (
                !context
                  .output
                  ?.path
              ) {
                throw new Error(
                  'Guest => Path is missing',
                )
              }

              return {
                ok: true,
                x_event:
                  context.to
                    .meta
                    .x_event,
                role: 'guest',
                path: context
                  .output
                  .path,
              }
            },
          },
        },
        User: {
          type: 'final',
          entry: {
            type: 'generate_output',
            params({
              context,
            }) {
              if (
                !context
                  .output
                  ?.path
              ) {
                throw new Error(
                  'User => Path is missing',
                )
              }

              return {
                ok: true,
                role: 'user',
                x_event:
                  context.to
                    .meta
                    .x_event,
                path: context
                  .output
                  .path,
              }
            },
          },
        },
        Owner: {
          type: 'final',
          entry: {
            type: 'generate_output',
            params({
              context,
            }) {
              if (
                !context
                  .output
                  ?.path
              ) {
                throw new Error(
                  'User => Path is missing',
                )
              }

              return {
                ok: true,
                role: 'owner',
                x_event:
                  context.to
                    .meta
                    .x_event,
                path: context
                  .output
                  .path,
              }
            },
          },
        },
        Forbidden: {
          type: 'final',
          entry: {
            type: 'generate_output',
            params({
              context,
            }) {
              return {
                ok: false,
                message:
                  'Forbidden',
                path: context
                  .output
                  ?.path,
              }
            },
          },
        },
      },
    })
}
