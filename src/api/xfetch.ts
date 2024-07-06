import { url_param_replacer } from '@/utils/url-params-replacer.util'
import { fn_to_promise_logic } from '@/utils/x.fn-to-promise-logic.util'
import {
  assertEvent,
  assign,
  not,
  setup,
  type AnyActorRef,
  type ErrorActorEvent,
} from 'xstate'
import type { api } from './api.namespace'

type OutputSuccess<
  T = unknown,
> = {
  _: 'success'
  success: T
}
type OutputException<
  T = unknown,
> = {
  _: 'exception'
  exception: T
}
type OutputError<
  T = unknown,
> = {
  _: 'error'
  error: T
}

export namespace xfetch {
  export type Output =
    | OutputSuccess
    | OutputException
    | OutputError
  export type Input = {
    is_private?: boolean
    exception_in_body?: boolean
    res_as?: null | 'json'
    payload: api.Req<
      api.Method,
      api.Path
    >
  }
  export type Context = {
    exception_in_body: boolean
    res_as: 'json' | null
    payload: Input['payload']
    xauth?: AnyActorRef
    is_private: boolean
    is_refresh_processing: boolean
    output?: Output
    is_first_private_request_attempt: boolean
    get_access_token: () =>
      | string
      | null
  }

  export type Events =
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
    | ErrorActorEvent<
        OutputException,
        'fetch'
      >
  export const machine =
    setup({
      types: {
        events: {} as Events,
        input: {} as Input,
        context:
          {} as Context,
        output: {} as Output,
      },
      actions: {
        notify_unauthorized:
          ({
            context: {
              xauth,
            },
          }) => {
            if (!xauth) {
              throw new Error(
                'xauth actor is not found in the system',
              )
            }
            xauth.send({
              type: 'auth.unauthorized',
            } as Events)
          },
        subscribe_on_refresh_update:
          ({
            context: {
              xauth,
            },
            self,
          }) => {
            if (!xauth) {
              throw new Error(
                'xauth actor is not found in the system',
              )
            }
            xauth.send({
              type: 'auth.subscribe_on_refresh_update',
              payload: {
                xfetch: self,
              },
            } satisfies Events)
          },
        mark_first_private_request_attempt_as_complete:
          assign({
            is_first_private_request_attempt:
              false,
          }),
        assign_output_success:
          assign({
            output: (
              _,
              params: OutputSuccess,
            ) => {
              return params
            },
          }),
        assign_output_exception:
          assign({
            output: (
              _,
              params: OutputException,
            ) => params,
          }),
        assign_output_error:
          assign({
            output: (
              _,
              params: OutputError,
            ) => params,
          }),
      },
      actors: {
        fetch:
          fn_to_promise_logic(
            async (
              context: xfetch.Context,
            ) => {
              const res =
                await fetch(
                  `${'http://localhost:3000'}${context.payload.params ? url_param_replacer(context.payload.path, context.payload.params) : context.payload.path}`,
                  {
                    method:
                      context
                        .payload
                        .method,
                    body:
                      context
                        .payload
                        .body &&
                      JSON.stringify(
                        context
                          .payload
                          .body,
                      ),
                    headers: {
                      'Content-Type':
                        'application/json',
                      ...(context
                        .payload
                        .headers ||
                        {}),
                      ...(context.is_private && {
                        Authorization: `Bearer ${context.get_access_token()}`,
                      }),
                    },
                  },
                )

              if (res.ok) {
                if (
                  context.res_as
                ) {
                  const data =
                    await res[
                      context
                        .res_as
                    ]()

                  return {
                    _: 'success',
                    success:
                      data,
                  } satisfies xfetch.Output
                } else {
                  return {
                    _: 'success',
                    success:
                      null,
                  } satisfies xfetch.Output
                }
              } else if (
                context.exception_in_body ||
                [
                  401, 403,
                ].includes(
                  res.status,
                )
              ) {
                const data =
                  await res.json()

                throw {
                  _: 'exception',
                  exception:
                    data,
                } satisfies xfetch.Output
              }

              throw res
            },
          ),
      },
      guards: {
        is_private:
          function ({
            context: {
              is_private,
            },
          }) {
            return is_private
          },
        is_refresh_processing:
          function ({
            context: {
              is_refresh_processing,
            },
          }) {
            return is_refresh_processing
          },
        is_exception:
          function (
            _,
            params: something,
          ) {
            return is_exception(
              params,
            )
          },
        is_unauthorized:
          function (
            _,
            params: OutputException,
          ) {
            return is_exception_is_unauthorized(
              params,
            )
          },
        is_first_private_request_attempt:
          function ({
            context: {
              is_first_private_request_attempt,
            },
          }) {
            return is_first_private_request_attempt
          },
        is_not_first_private_request_attempt:
          not(
            'is_first_private_request_attempt',
          ),
      },
    }).createMachine({
      /** @xstate-layout N4IgpgJg5mDOIC5QA8BmYAuBjAFgOgAUAnAeyzlgH0BDAVwxwGIBtABgF1FQAHE2ASwz8SAOy4hkiAIwBOACx4ATK1YBWKQGZZm5QA5VAGhABPRAHZ1eOQDY5urTNWPFc1QF83RtJlyFS5WCo6BhYpTiQQXgEhUXFJBFkFZTVNbQ09QxNEGSkzPA1WM0UzM2tVOVkzOQ8vdGx8Yn4AN2oMMD8yCkoiMFQe2CY2cJ4+QWExCPiZayk8C0VVM30pVQ0zRyNTBFVWWdYCtdZdRRlWRQ05MxqJOt9GlraOgKoevrhBsPEosdjJ7Jm5qoFkt1Kt1pktmU8tZ1jC5IpFNYkVJrt56n5mq12gB1aiCSioEhEbq9fpMCCidr8ERNEgAa3arzJlFo3AgWMosFoACNYFgiPxuDEREMvqNhXFpEUZFYzBocqddCoZIpNohVqw8LokUCKrtbKprKjbg0BQ8cXiMASiSS3gNGGAiKQiHhuAAbVqEogAWzwTPeLLZHK5vP5guFooi3wlfwQCN0CnkiJsGjWcl2arj1kUc0RqkWR0cMJRnhuPlNmMeuPxXttZMYyFgGCxeGoqDaRAAFMlWABKBsmjHmvDVq21-0DSMjaLjSVxk6J+G2aypqoZrIIDTlPAyOWOKRSXTyJZXUtou5mlsAMXL1KgjApIipNPp7RNU8i4tnsYRth3S5TNN10hLQ5ikGZUzsFVNGNcsh2vW8RHvR1nVdD0MC9X13w4MUZ1+FBpF0OU8COVhrGOLR4SOORMxKVQtXlew1HlcDdF0WD0XuFtiE6QI7wJPE3RYHCoy-fCJHVbMrF0XIgTOewFMzeENHyJECmmI5VjsDiL0rdoeOefjUEE0Jhk-PCJgI+dtyTZdV3TKRMxk-IERyRZpn3E4dIrYcDIofiwGQcghXGYSzOjb8rN-RdkxXIDHI3KRETwWx0kUBNFFkGEzm8+DHj8vikMoQLguFUzcJ+SyJIQaZZnmRZljBDYNz1JQYS3XILnIpKjTPQcuPy-x-KKkqwBC0QWEUcKxKq+IESqf9Yvs4DEEyvJ02zS51BXVgVWqPq4IIHk3X4LA8Bveo7wfSk8GpWkGTwbDposudosWuz4szRx6K0ew5AuJUziOXKju5E6zou3ArpQok0M9IksPLD8IvEubk3ewC1wSrZVhlGwiPlDQjwKXIQeO07zsQ5CnVh914Z9R6kc+USXp-BYYo+rGlMuJRMouIFidOc4PFLEQSAgOA4hNCqYysgBaaxMzl+iZFVtX1bVooQaGwIaHoHAZci6r4S+o4tUKMxNBUVwU21vTDdRxBUx+lYjjYo8KNVDc0v-OR-vS-Rd0y3rakOy9Bt4l5SXeB3ZvMdY8CcA9iiqHIkRojdbBlQ9dl2xYzGVU9Q848OLRrG0JwNlnKrnHQVLkXct22+QdjMJSC8T-MZEBnYXCcO3h0hnA71j17dhzWQgXctZi0VzOThS05dvSg5Mv24vdN8nWBCK4z+DdUfYyJlStB2d2PfOL2tlKaw8CShu2OKZR0nXssS70p5hqgYqgrG2XzJrrGOUeQLDqCXiqZIEJEDwlmOlcCFhZBJnSCHN+dxyZYEPlZVMuglAKSJuAmYJQnJ+xSn7dQMlrC7nKCWDeDR0GU0ukhTB1Uia3xXgpAhuQ24bhkKBaYVRUzTGyuUXKABlWgWBnjMLmpcHBhMViN13OROeWx+FzFOKrIi1gjgrHcAddEV5BLSNWqobULl0qXAbimbhWx0o5m1JUOBeYEQizcEAA */
      context: function ({
        input,
      }) {
        return {
          payload:
            input.payload,
          res_as:
            input.res_as ===
            undefined
              ? 'json'
              : input.res_as,
          exception_in_body:
            input.exception_in_body ??
            true,
          get_access_token:
            () =>
              localStorage.getItem(
                'access_token',
              ),
          is_first_private_request_attempt:
            false,
          is_private:
            input.is_private ??
            false,
          is_refresh_processing:
            false,
        }
      },
      entry: assign({
        xauth: ({
          system,
        }) => {
          const xauth =
            system.get(
              'xauth',
            )!
          console.assert(
            !!xauth,
            'xauth actor is not found in the system',
          )

          return xauth
        },
      }),
      id: 'xfetch',
      initial: 'Process_auth',
      states: {
        Process_auth: {
          always: [
            {
              target:
                'Private',
              guard: {
                type: 'is_private',
              },
            },
            {
              target:
                'Public',
            },
          ],
        },
        Private: {
          initial:
            'Process_refresh',
          states: {
            Process_refresh: {
              always: [
                {
                  target:
                    'Wait_for_refresh',
                  actions: [
                    {
                      type: 'subscribe_on_refresh_update',
                    },
                    {
                      type: 'mark_first_private_request_attempt_as_complete',
                    },
                  ],
                  guard: {
                    type: 'is_refresh_processing',
                  },
                },
                {
                  target:
                    'Fetching',
                },
              ],
            },
            Wait_for_refresh:
              {
                after: {
                  '2000': {
                    target:
                      '#xfetch.Fail',
                    actions: {
                      type: 'assign_output_error',
                      params:
                        {
                          _: 'error',
                          error:
                            'Too long waiting for refresh',
                        },
                    },
                  },
                },
                on: {
                  'xfetch.refresh.success':
                    {
                      target:
                        'Fetching',
                    },
                  'xfetch.refresh.fail':
                    {
                      target:
                        '#xfetch.Fail',
                      actions:
                        {
                          type: 'assign_output_error',
                          params:
                            {
                              _: 'error',
                              error:
                                'Failed to refresh',
                            },
                        },
                    },
                },
              },
            Fetching: {
              invoke: {
                id: 'fetch',
                input: ({
                  context,
                }) => context,
                onDone: {
                  target:
                    '#xfetch.Success',
                  actions: {
                    type: 'assign_output_success',
                    params: ({
                      event,
                    }) => ({
                      _: 'success',
                      success:
                        event.output,
                    }),
                  },
                },
                onError: {
                  target:
                    'Processing_fail',
                },
                src: 'fetch',
              },
            },
            Processing_fail: {
              always: [
                {
                  target:
                    'Processing_exception',
                  guard: {
                    type: 'is_exception',
                  },
                },
                {
                  target:
                    '#xfetch.Fail',
                },
              ],
            },
            Processing_exception:
              {
                always: [
                  {
                    target:
                      '#xfetch.Fail',
                    actions: {
                      type: 'assign_output_exception',
                      params:
                        ({
                          event,
                        }) => {
                          assertEvent(
                            event,
                            'xstate.error.actor.fetch',
                          )

                          return event.error
                        },
                    },
                    guard: {
                      type: 'is_not_first_private_request_attempt',
                    },
                  },
                  {
                    target:
                      'Wait_for_refresh',
                    actions: [
                      {
                        type: 'notify_unauthorized',
                      },
                      {
                        type: 'subscribe_on_refresh_update',
                      },
                      {
                        type: 'mark_first_private_request_attempt_as_complete',
                      },
                    ],
                    guard: {
                      type: 'is_unauthorized',
                      params:
                        ({
                          event,
                        }) => {
                          assertEvent(
                            event,
                            'xstate.error.actor.fetch',
                          )
                          return event.error
                        },
                    },
                  },
                  {
                    target:
                      '#xfetch.Fail',
                  },
                ],
              },
          },
        },
        Public: {
          initial: 'Fetching',
          states: {
            Fetching: {
              invoke: {
                id: 'fetch',
                input: ({
                  context,
                }) => context,
                onDone: {
                  target:
                    '#xfetch.Success',
                  actions: {
                    type: 'assign_output_success',
                    params: ({
                      event,
                    }) => ({
                      _: 'success',
                      success:
                        event.output,
                    }),
                  },
                },
                onError: [
                  {
                    target:
                      '#xfetch.Fail',
                    guard: {
                      type: 'is_exception',
                      params:
                        ({
                          event,
                        }) =>
                          event.error,
                    },
                    actions: {
                      type: 'assign_output_exception',
                      params:
                        ({
                          event,
                        }) =>
                          event.error as OutputException,
                    },
                  },
                  {
                    target:
                      '#xfetch.Fail',
                    actions: {
                      type: 'assign_output_error',
                      params:
                        ({
                          event,
                        }) => ({
                          _: 'error',
                          error:
                            event.error,
                        }),
                    },
                  },
                ],
                src: 'fetch',
              },
            },
          },
        },
        Success: {
          type: 'final',
        },
        Fail: {
          type: 'final',
        },
      },
    })
}

function is_exception(
  params: something,
): params is OutputException {
  return Object.keys(
    new Object(params),
  ).includes(
    'exception' satisfies keyof OutputException,
  )
}

function is_exception_is_unauthorized(
  params: something,
): params is OutputException<{
  status: 401 | 403
}> {
  return [401, 403].includes(
    (
      params as Partial<{
        exception: {
          status: number
        }
      }>
    )?.exception
      ?.status as number,
  )
}
