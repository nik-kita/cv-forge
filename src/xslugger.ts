import type {RouteLocationNormalized} from 'vue-router'
import {assign, setup} from 'xstate'

export const machine = setup({
  types: {
    input: {} as {
      to: RouteLocationNormalized
      user?: User
    },
    context: {} as {
      to: RouteLocationNormalized
      user?: User
      output?:
        | {
            ok: true
            path: string
            role: 'owner' | 'user::viewer' | 'guest::viewer'
          }
        | {
            ok: false
            message?: string
            path?: string
            role?: string
          }
    },
    output: {} as
      | {
          ok: true
          path: string
          role: 'owner' | 'user::viewer' | 'guest::viewer'
        }
      | {
          ok: false
          message?: string
        },
  },
  actions: {
    init_output: assign({
      output: ({context}) =>
        ({
          ok: true,
          path: context.to.path,
          role: 'guest::viewer',
        }) as const,
    }),
    generate_output: assign({
      output(
        _,
        params:
          | {
              ok: true
              role:
                | 'owner'
                | 'user::viewer'
                | 'guest::viewer'
              path: string
            }
          | {
              ok: false
              message?: string
            },
      ) {
        const {ok} = params
        if (ok) {
          const {path, role} = params
          return {
            ok,
            path,
            role,
          } as const
        } else {
          return {
            ok,
            message: params.message,
          } as const
        }
      },
    }),
    add_own_username_to_username_slug: assign({
      output({context}) {
        if (
          !context.output?.path ||
          !context.user?.username
        ) {
          throw new Error(
            'This action should not be called if either path or username is missing',
          )
        }

        return {
          ...context.output,
          path: `${context.output.path}/${context.user.username}`,
        }
      },
    }),
  },
  guards: {
    is_username_slug_present: function ({context, event}) {
      return !!context.to.params.username
    },
    is_user: function ({context, event}) {
      return !!context.user
    },
    has_user_username: function ({context, event}) {
      if (!context.user) {
        throw new Error(
          'This guard should not be called if user is missing',
        )
      }
      return !!context.user.username
    },
    is_usernames_equal: function ({context, event}) {
      if (
        !context.user?.username ||
        !context.to.params.username
      ) {
        throw new Error(
          'This guard should not be called if either username is missing',
        )
      }

      return (
        context.user.username === context.to.params.username
      )
    },
    is_public: function ({context, event}) {
      return context.to.meta.public
    },
  },
}).createMachine({
  context({input}) {
    return {
      ...input,
    }
  },
  output({context}) {
    if (!context.output) {
      throw new Error('Output is missing')
    }

    return context.output
  },
  entry: 'init_output',
  id: 'username_slugger',
  initial: 'Compute_username_slug',
  states: {
    Compute_username_slug: {
      always: [
        {
          target: 'With_username_slug',
          guard: {
            type: 'is_username_slug_present',
          },
        },
        {
          target: 'No_username_slug',
        },
      ],
    },
    With_username_slug: {
      initial: 'Compute_auth',
      states: {
        Compute_auth: {
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
          initial: 'Compute_user_username',
          states: {
            Compute_user_username: {
              always: [
                {
                  target: 'User_with_username',
                  guard: {
                    type: 'has_user_username',
                  },
                },
                {
                  target: 'User_without_username',
                },
              ],
            },
            User_with_username: {
              initial: 'Compute_usernames_equality',
              states: {
                Compute_usernames_equality: {
                  always: [
                    {
                      target: 'Usernames_are_equal',
                      guard: {
                        type: 'is_usernames_equal',
                      },
                    },
                    {
                      target: 'Usernames_are_not_equal',
                    },
                  ],
                },
                Usernames_are_equal: {
                  always: {
                    target: '#username_slugger.Owner',
                  },
                },
                Usernames_are_not_equal: {
                  always: {
                    target:
                      '#username_slugger.User::viewer',
                  },
                },
              },
            },
            User_without_username: {
              always: {
                target: '#username_slugger.User::viewer',
              },
            },
          },
        },
        Guest: {
          always: {
            target: '#username_slugger.Guest::viewer',
          },
        },
      },
    },
    No_username_slug: {
      initial: 'Compute_route_privacy',
      states: {
        Compute_route_privacy: {
          always: [
            {
              target: 'Public_route',
              guard: {
                type: 'is_public',
              },
            },
            {
              target: 'Private_route',
            },
          ],
        },
        Public_route: {
          initial: 'Compute_auth',
          states: {
            Compute_auth: {
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
              initial: 'Process_own_username',
              states: {
                Process_own_username: {
                  always: [
                    {
                      target: '#username_slugger.Owner',
                      actions: {
                        type: 'add_own_username_to_username_slug',
                      },
                      guard: {
                        type: 'has_user_username',
                      },
                    },
                    {
                      target:
                        '#username_slugger.User::viewer',
                    },
                  ],
                },
              },
            },
            Guest: {
              always: {
                target: '#username_slugger.Guest::viewer',
              },
            },
          },
        },
        Private_route: {
          initial: 'Compute_auth',
          states: {
            Compute_auth: {
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
              always: {
                target: '#username_slugger.Owner',
              },
            },
            Guest: {
              always: {
                target:
                  '#username_slugger.Guest::forbidden',
              },
            },
          },
        },
      },
    },
    'Guest::viewer': {
      type: 'final',
      entry: {
        type: 'generate_output',
        params({context}) {
          if (!context.output?.path) {
            throw new Error(
              'Guest::viewer => Path is missing',
            )
          }

          return {
            ok: true,
            role: 'guest::viewer',
            path: context.output.path,
          }
        },
      },
    },
    'User::viewer': {
      type: 'final',
      entry: {
        type: 'generate_output',
        params({context}) {
          if (!context.output?.path) {
            throw new Error(
              'User::viewer => Path is missing',
            )
          }

          return {
            ok: true,
            role: 'user::viewer',
            path: context.output.path,
          }
        },
      },
    },
    Owner: {
      type: 'final',
      entry: {
        type: 'generate_output',
        params({context}) {
          if (!context.output?.path) {
            throw new Error(
              'User::viewer => Path is missing',
            )
          }

          return {
            ok: true,
            role: 'owner',
            path: context.output.path,
          }
        },
      },
    },
    'Guest::forbidden': {
      type: 'final',
      entry: {
        type: 'generate_output',
        params({context}) {
          return {
            ok: false,
            message: 'Forbidden',
            path: context.output?.path,
          }
        },
      },
    },
  },
})
