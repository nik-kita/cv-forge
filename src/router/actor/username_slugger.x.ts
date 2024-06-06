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
    is_username_slug_exist: function ({context, event}) {
      return !!context.route.to.params.username
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
    is_username_slug_possible: function ({context, event}) {
      return !!context.route.to.meta.username_slug
    },
    'is.equal': is_equal as typeof is_equal<string>,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4DsCGBbMA+rADbJQzoB0AwgPa4AOyALoahjvkaVAMQDaABgC6iUA1qwAlsym1MYkAA9EAFkGUAzAE5BAVm2rVADgBMq0wEZjAdj0AaEAE9ElwTc2U9AX2+P2WHiEJGQUNPRMrAQBnME8ApaiSCAS0rLyiioI6lq6BkZmFtZ2ji4Ilpaall6+-miBXCHkGJQA6jIAFgSp0gBGxGz1sdxk4YwshNgsHQIiiqkycgrJWZXGepSWNtoAbDq2lqamNqWIR5Sqljsegtq6tqY7xrUgMUEjzVTtzF09Uv2DDjvJpjSKTaYJJLiSSLDIrVyaOyUO53Az5QRGHancrHSiCYyaHQ2HambSHVQ+PyvIbAnhhb6-SR9AbRGmNHiUACq9VBE1ZGH5DTAsyhKRh6WWoFWO20Ni812u21Jl1UJ2cCI0dkEghJ2mMth1Zheb3ZoRaDO6TP+LJNcVG3JadHGUQCgtikPm4qWmVcO1UO3lxJsZhsgh0hOxpm1mx2sb9ipJelMzypto+9M6ltgzMBQo+XJ5DvQBAA7pnbbyXWy4AQwABHZDYYgyJwiz1pb3whDJnLmVXXTSqTR6Kpqsp6PTGLza7WD27BpPG6vp82Zv4At20+2F+ql8vVyu52KwWsNpstj3JBYSn3dvSHSh9oOD4ej7H37TTmdz2XrUxLoFTU+No1ytDc0xBIsCwFMsfk3fBoKFE9sHQQh60bYg2yvL04SlM49GJR9dhsOxLFlVVTGxSwh08UxCTDcNVUnHYALzJoMzg9cbWXSCdxg-dALARDjwIFDCEwWhmFPDCsOhDtcOUVwbDcPEkxoocnknYwqPMUwLhsf0kw8J49VY4Z2NXTiwO4wT8ygos9x+WgWHg4UhFFa9OzwhAAFprD0DQZTo7RNH1UlzB0ix9MM45NBMkizK3YCLS4o8ksoABxZA4GYWSxXkyVFO7HYNk0I5ZT9WUysnKjCT00wAsEBqo1CzQw0SoCwgAOVoVz8ydMECHQZyogYdApAAN2wABjVt3PbWFCqyPzh2qZNDmMfQtgI4xLGxZSOrtYCer6kEBr5Ya+TGyaZrmxIFpvLsVonIiZX0e87GDPb1XKK5DpXKgTogjkAAVkH6KRpqGkahPOqIph+PLPIU5ayNsPFvy2z7duxMq9MpOpbIswHeuB0YwYhqHLtYQ9RIhfh7uwgrbx8qNBDWnah3Z7HvrKOK5Qa-7icoIGeNB8HmypmHEMoEHhumuAT1oEtMFcpGcKWxBWa55EKSqBrsT9GwhbpFpRaJ8XKehiYZbl2gFezAhldV21LzkxaWajYxPzoocSh+2NPxsR49ETE2zRJ07Lcl62aaynL1eZp7jH9eUKTWKoSuU2qysfRrmrDAl2tTMWI5F0nS6gWXxqmqJqdhiI+QRmZ5qZj3k72C4R2oprJ2DMlceuPPw+OiuLfJmvsDr6W4fBRGGY8jWWdsOVlNuIy++93m1DI4eS-H0eo4nm7p5totE-b7y-J1OUPz0CwJzDDxVComjH3owkQqY4wWP3tjTcjmTKucsT6EHrplbKsBcqt3do9K+BhPwEkqHqCwug8iv0JO-Nqn9Bx2BTiPDijJszWjSkBGWDlYJdArLPI+UBaxKCkFA7AmAFYXzgUVKMTxNjp3MPfH+6gHA-XvFOAyKIyLBx2E1bQBDLJEJzLQ8hu5KGuVpkA+hjDmDMNYQvB6XkirWG0Hpai94ozbGDMSLEAdoxan0IOCw+pZS+CpBJCAcBFBAIoLolGWsGr6mxD5VBX4Zwpy2LoY2f9zIANUZXLxmtfLbH8YOf8ESkqEKzPIoBsTbxuDuMiFExFJGhhfj9VmTUMYznxJcbY7hkmE3-mXFK1lSFHVps3LJXZKhHH8RUVQNQUmdVkekkhCiiztO8tRb2WhCR1RChOA2P1LjlJnEFHYhw9gyK+KBYh4FK4yxoa6W0Yz9HaAMJQOM1wMQGUeE1HSU5GraksCOIwDFwl1MiQ0rZGTdn2SUQJIURzViFDOcpK4bgQ4nMoj9fWeJwxhkTLcVZGyQJWW2TZepVcfn8TgtQxuVZBInnQueZgZRYF6KyH2QKcZg4-wqNvbIYYglhnUL+EcSLGmouaXZPixZlEViLCJMS0kmwArOEqM5VLkyrIqIbAySymXzj-Gyz5wygGKKxVQg8-KgjIVQgQCSUlCXEBFd2a54rYzUqlXSgwdyKk-gXLU6kB80mpRGdyxyHQRquWNY8xEUzpmkmHEmQRZRHhTgqU1UKTxVC7FUEqlFXyD4QJyt66icp8kFPcBiSKlACTTNWQZMwbhNBIvNui41rN76CH8SnC4KI5mhXMIiSwJax7otpvXbok9ZrlsOMHXGLaFEUxjvXct5hDGv1vjOIwxJtokleY69F3VW3vOARLSGscG7Ojnh0HthixxnGHAO1VQ713gNGW3dhy0+zFJDSRIJ0782h2OEe3ZJ6pZnx5HbB2SsVZeovWSnxOhLF8xKi+xNb6N1JqgT24Owa1CTjA22kBtcwEwx7Y8m9rhdiUBsQ+2dxb+lHSXYOyep8aY0Laf+7xvlbCYe7DWwWhGAblxI6AyD57SXUb8m4YDiA4oEwXSu4jx7SOoZtvHaDVG4k+UkVWhZWwkUSeYAgBAE0pBgBLBgctRg6U9I2AJjxLQiwqbUxprTUnPZuDpXcW+SLjMIGduZzj0m6KhguIiOD5QyqfgM5XMISmVMADNaDoF6FICArjCrI2kzpqiE4Ay+adYMl1qrMU8r+bEaJB91FMJYWAb1thPCxjRMcai-prC41ySOEKGJ-RPB-tIpjwt2UJrbWl91KjMAaYAARMNYN1ywBXg7AoqKspqJUIX7XxDh-QsoDBlVG047wQA */
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
          target: 'With_possible_username_slug',
          guard: {
            type: 'is_username_slug_possible',
          },
        },
        {
          target: 'Username_slug_impossible',
        },
      ],
    },
    With_possible_username_slug: {
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
              initial: 'Compute_username_slug_existance',

              states: {
                Compute_username_slug_existance: {
                  always: [
                    {
                      target: 'Compute_usernames_equality',
                      guard: 'is_username_slug_exist',
                    },
                    {
                      target:
                        '#username_slugger.User::owner',
                      actions:
                        'add_own_username_to_username_slug',
                    },
                  ],
                },
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
    Username_slug_impossible: {
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
              always: {
                target: '#username_slugger.User::owner',
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
