import {is_equal} from '@/x/common.guard.x'
import {setup} from 'xstate'

export const username_slugger_machine = setup({
  types: {} as x.xrouter.username_slugger.types,
  actions: {
    add_own_username_to_username_slug: function ({
      context,
    }) {
      if (!context.own_username) {
        throw new Error(
          'own_username is required for "add_own_username_to_username_slug" action',
        )
      }

      context.route.to.params = {
        ...context.route.to.params,
        username: context.own_username,
      }
    },
  },
  guards: {
    is_username_slug_present: function ({context, event}) {
      return !!context.route.to.meta.username_slug
    },
    is_public: function ({context, event}) {
      return context.route.to.meta.is_public
    },
    is_user: function ({context, event}) {
      return context.is_user
    },
    has_user_username: function ({context, event}) {
      return !!context.own_username
    },
    'is.equal': is_equal as typeof is_equal<string>,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4DsCGBbMA+rADbJQzoB0AwgPa4AOyALoahjvkaVAMQDaABgC6iUA1qwAlsym1MYkAA9EAFkGUAzAE5BAVm2rVADgBMq0wEZjAdj0AaEAE9ElwTc2U9AX2+P2WHiEJGQUNPRMrAQBnME8ApaiSCAS0rLyiioI6lq6BkZmFtZ2ji4Ilpaall6+-miBXCHkGJQA6jIAFtH1sdxk4YwshNgsHQIiiqkycgrJWdY6lNrL2gBshoVW2qWIutU+fiAxQX3NVO3MXceNPAORw6MJSeKS0xlzrsaLK2sb5ls7BDaAw1Q7XOKhFoXK49E5NSgAVXqdyG3QwaIaYHGzxSr3Ss1A83Wpkopk0qnJBX+lm2zkQmlW1VMBzqHDhPDC0IxvXhSJadEGUQC3KCT0meJmmVcq2ZpPJlJM1NpZVM2k8LKOsJukPOnRF2qgiORfPQBAA7nrwSihVq4AQwABHZDYYgyJzY8VpSUfBDM1TaLw2YyCQyKiymQE6Yyg1mY06cy2205Glom82Jtn4a1sW2we1Ol1usXJKb4qW+0xWQPB0ObCN0hCaEEa8HxqEZuO8431dOXfVgFOYvPYdCER3O4geksS96ExDMmyrUlrGx2Gk2VQ2etlSwUzxkzSCTQ6cl2YyrWqazMQs5tDs824mwe9mHXwexYejgiYWjMfMTqcXi9WdlFcGw3EofRzGPClVmMPRjGMQFLH+ShN1UVY9FMDw4O0YxL1bJoEz7QjH27dELUuWgWH7QDcWAglQIQABaaw9A0YkT0Q1VzGQ1D0Mw7CGWMbRVwIpMiPbEiJNuABxZA4GYOjS29OdfUwrRK1E1Z-Q8ZkkIbSpNBJZlBEEZlTCPL4j3E682yoAA5Wh+2TAV7gIdBqKiBh0CkAA3bAAGN3SEHEVJArJWKbJljBQ4M9EsOwg0sQFwNszsORaJyXPhNzUU81EfP8oKQsST03kYyLKj0PRl3WfQEqS2LkMsC8wRknVKGy0j+gABWQAAjV1Ao8ryBzyqIRkuZSZ0qxBWLwmxILMo99ESvRksjSsYyvDLOu6jrDX6oapBGgrWGzAgprGfgyunBjy2YyzBCZDbjApF6mpShsGSW5l0offbnJ6o7BuG0ahkHShes8wK4DzWgzUwWjQvKssfSej6llUPQqmZQEdJsAH2SBnLbmO8HzoHJ8YdoOHYARpGUbuoCKseyyRLlCkSgbVZ1koLdMJlFtDrCA67PhCnTohi75MUmaHox96lz0HSEs0L5Wo276d2PEz2PMrCrMPTRiYNMXgcO6HfICqIqcu66FbZpXVk8HGqnUfSg20HX6VWP6RYlzLHMtoO+pt7A7bGh3HlusLZse2wlvAkMsLPb3feyGlSUDvbb3FvPreKqPIZNJ30bU1jBH9rwaT0CwaqPDxVGQvc5RNk9NwQtrY0B-PQ8LmHi8Ie25dgJTUfu53K4MANNajCxdDyVvj3bo9O7PVRfEOH8IDgRQQYoNHVKYp6EIMspmMXrwVsEIxyT5jczZvMIJpzMOoGPiL5psZV5vJUwz97J3mkh-L+c1ygWUBE9cyy0Vr3wwv7TQRN2of2Iq+Qub8rqjHAeWSolZoEVFUDtQ+UkMF90HLgn0lh2IX3-tUW+d8KSII8HYIBkldSgMLk+LBwpwRULUolZqDZVYkNFmQsm-QnxpkouQoIAimI0gIYZGqSwfg1UwnrV27Dg4gLkQaKGMj7xBEuuCPM45CzMDKKzCuTErDsUBNBMRaCJEg0MT2WR-Z3xBE-GOAsxAFFZFMtuRACUt6oLzugyRhppEeOMVmE0H4rpfh-H+CxASp62PmKJQQgIKTRlzn3KJbjYkUU6F5fsgTXAaOQqrHRnUuRuLHswKp5RDy5IbMxAp9T+7RNaWfdQ0D3o33gcwx+yCekW2iZdKmBAioBWCv0lCW5IyTKygPChUszpjX6eYbQITyibjQuo1WuNjLaIiUU9Z0ytky3GhEVE10ln7JsI4psayQ43LBtLe2JpdlGBbg2bCS1-QrA0Wc0wPddpXM+W425vzkS03pozZG-DMkn0imSNYkZMIfK6hskmoMTrbMhs0pZW4HANhxvhS5hKplwojiXVgSyaGAp3GsAWoLgSnK0abWl5trkMuHncmOlx+m2DZfOYZ-1+Uv0FVbIetsR7Rz+ei7+LEKjVxxYUul8qP5FyVSKslaqIHMVWGZPJiU8XNIQAgPyUgwBmgwP0owmciG1R1QKqgJpbX2sdc6k17M3CZ2WEtT1crvX1FtYjTAAabEYvmmSGwGhuaUt1qqZxkSWg2oQAAM1oOgAaUgIB70YuFU1rramiIOL4IAA */
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
                        params({context, event}) {
                          return {
                            a: context.own_username!,
                            b: context.route.to.params
                              .username as string,
                          }
                        },
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
