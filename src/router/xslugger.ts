import type { User } from '@/auth/user.type'
import type { RouteLocationNormalized } from 'vue-router'
import {
  assign,
  setup,
} from 'xstate'
import type { NavEvent } from './nav-event.type'
import type { UserRole } from '@/auth/user-role.type'

export namespace xslugger {
  export type Input = {
    to: RouteLocationNormalized
    user?: User
  }
  export type Output =
    | {
        ok: true
        path: string
        x_event: NavEvent['type']
        role: UserRole
      }
    | {
        ok: false
        message?: string
        path?: string
        role?: string
      }
  export type Context = {
    to: RouteLocationNormalized
    user?: User
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
              role: 'guest::viewer',
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
              if (
                !context
                  .output
                  ?.path ||
                !context.user
                  ?.nik
              ) {
                throw new Error(
                  'This action should not be called if either path or nik is missing',
                )
              }

              return {
                ...context.output,
                path: `${context.output.path}/${context.user.nik}`,
              }
            },
          }),
      },
      guards: {
        is_nik_slug_present:
          function ({
            context,
            event,
          }) {
            return !!context
              .to.params.nik
          },
        is_user: function ({
          context,
          event,
        }) {
          return !!context.user
        },
        has_user_nik:
          function ({
            context,
            event,
          }) {
            if (
              !context.user
            ) {
              throw new Error(
                'This guard should not be called if user is missing',
              )
            }
            return !!context
              .user.nik
          },
        is_niks_equal:
          function ({
            context,
            event,
          }) {
            if (
              !context.user
                ?.nik ||
              !context.to
                .params.nik
            ) {
              throw new Error(
                'This guard should not be called if either nik is missing',
              )
            }

            return (
              context.user
                .nik ===
              context.to
                .params.nik
            )
          },
        is_public: function ({
          context,
          event,
        }) {
          return context.to
            .meta.public
        },
      },
    }).createMachine({
      context({ input }) {
        return {
          ...input,
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
                                '#nik_slugger.User::viewer',
                            },
                        },
                    },
                  },
                User_without_nik:
                  {
                    always: {
                      target:
                        '#nik_slugger.User::viewer',
                    },
                  },
              },
            },
            Guest: {
              always: {
                target:
                  '#nik_slugger.Guest::viewer',
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
                                '#nik_slugger.User::viewer',
                            },
                          ],
                      },
                  },
                },
                Guest: {
                  always: {
                    target:
                      '#nik_slugger.Guest::viewer',
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
                      '#nik_slugger.Guest::forbidden',
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
            params({
              context,
            }) {
              if (
                !context
                  .output
                  ?.path
              ) {
                throw new Error(
                  'Guest::viewer => Path is missing',
                )
              }

              return {
                ok: true,
                x_event:
                  context.to
                    .meta
                    .x_event,
                role: 'guest::viewer',
                path: context
                  .output
                  .path,
              }
            },
          },
        },
        'User::viewer': {
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
                  'User::viewer => Path is missing',
                )
              }

              return {
                ok: true,
                role: 'user::viewer',
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
                  'User::viewer => Path is missing',
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
        'Guest::forbidden': {
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
