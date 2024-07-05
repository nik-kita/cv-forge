import {
  assertEvent,
  assign,
  createMachine,
  not,
  setup,
  type ErrorActorEvent,
} from 'xstate'

type OutputSuccess<
  T = unknown,
> = {
  success: T
}
type OutputException<
  T = unknown,
> = {
  exception: T
}
type OutputError<
  T = unknown,
> = {
  error: T
}

export namespace xfetch {
  export type Output =
    | OutputSuccess
    | OutputException
    | OutputError
  export type Input =
    | {
        is_private: true
        is_refresh_processing: boolean
      }
    | {
        is_private?: false
      }
  export type Context = {
    is_private: boolean
    is_refresh_processing: boolean
    output?: Output
    is_first_private_request_attempt: boolean
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
        refresh_update_subscription:
          createMachine({
            /* ... */
          }),
        fetch: createMachine({
          /* ... */
        }),
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
        if (
          input.is_private
        ) {
          return {
            is_private: true,
            is_refresh_processing:
              input.is_refresh_processing,
            is_first_private_request_attempt:
              true,
          }
        } else {
          return {
            is_private: false,
            is_refresh_processing:
              false,
            is_first_private_request_attempt:
              false,
          }
        }
      },
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
                  actions: {
                    type: 'mark_first_private_request_attempt_as_complete',
                  },
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
                          error:
                            'Too long waiting for refresh',
                        },
                    },
                  },
                },
                invoke: {
                  id: 'refresh_update_subscription',
                  input: {},
                  onDone: {
                    target:
                      'Fetching',
                  },
                  onError: {
                    target:
                      '#xfetch.Fail',
                    actions: {
                      type: 'assign_output_error',
                      params:
                        {
                          error:
                            'Failed to refresh',
                        },
                    },
                  },
                  src: 'refresh_update_subscription',
                },
              },
            Fetching: {
              invoke: {
                id: 'fetch',
                input: {},
                onDone: {
                  target:
                    '#xfetch.Success',
                  actions: {
                    type: 'assign_output_success',
                    params: ({
                      event,
                    }) => ({
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
                          const ev =
                            event as ErrorActorEvent<
                              OutputException,
                              'fetch'
                            >
                          assertEvent(
                            ev,
                            'xstate.error.actor.fetch',
                          )

                          return ev.error
                        },
                    },
                    guard: {
                      type: 'is_not_first_private_request_attempt',
                    },
                  },
                  {
                    target:
                      'Wait_for_refresh',
                    actions: {
                      type: 'mark_first_private_request_attempt_as_complete',
                    },
                    guard: {
                      type: 'is_unauthorized',
                      params:
                        ({
                          event,
                        }) => {
                          const ev =
                            event as ErrorActorEvent<
                              OutputException,
                              'fetch'
                            >
                          assertEvent(
                            ev,
                            'xstate.error.actor.fetch',
                          )
                          return ev.error
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
                input: {},
                onDone: {
                  target:
                    '#xfetch.Success',
                  actions: {
                    type: 'assign_output_success',
                    params: ({
                      event,
                    }) => ({
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
