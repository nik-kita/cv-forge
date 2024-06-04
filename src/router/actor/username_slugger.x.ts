import {setup} from 'xstate'

export const username_slugger_machine = setup({
  types: {} as x.xrouter.username_slugger.types,
  actions: {
    add_own_username_to_username_slug: function ({
      context,
      event,
    }) {
      // Add your action code here
      // ...
    },
  },
  guards: {
    is_username_slug_present: function ({context, event}) {
      // Add your guard condition here
      return true
    },
    is_public: function ({context, event}) {
      // Add your guard condition here
      return true
    },
    is_user: function ({context, event}) {
      // Add your guard condition here
      return true
    },
    has_user_username: function ({context, event}) {
      // Add your guard condition here
      return true
    },
    'is.equal': function ({context, event}) {
      // Add your guard condition here
      return true
    },
  },
}).createMachine({
  context({input}) {
    return {
      ...input,
    }
  },
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
                        type: 'is.equal',
                      },
                    },
                    {
                      target: 'Usernames_are_not_equal',
                    },
                  ],
                },
                Usernames_are_equal: {
                  always: {
                    target: '#username_slugger.User::owner',
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
                      target:
                        '#username_slugger.User::owner',
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
                target: '#username_slugger.User::owner',
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
    },
    'User::viewer': {
      type: 'final',
    },
    'User::owner': {
      type: 'final',
    },
    'Guest::forbidden': {
      type: 'final',
    },
  },
})
