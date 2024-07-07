import type { User } from '@/auth/user.type'
import type {
  RouteLocationNormalized,
  Router,
} from 'vue-router'
import {
  assertEvent,
  raise,
  setup,
  type OutputFrom,
} from 'xstate'
import type { NavEvent } from './nav-event.type'
import { xslugger } from './xslugger'

export namespace xrouter {
  export type Input = {
    router: Router
    get_user: () =>
      | User
      | undefined
  }
  export type Context = {
    get_user: () =>
      | User
      | undefined
    router: Router
    is_navigation_allowed: boolean
  }
  export type Events =
    | NavEvent
    | {
        type: 'nav'
        to: RouteLocationNormalized
        from: RouteLocationNormalized
      }
    | x.SuccessDoneActorEv<
        'xslugger',
        OutputFrom<
          typeof xslugger.machine
        >
      >
  export const machine =
    setup({
      types: {
        input: {} as Input,
        context:
          {} as Context,
        events: {} as Events,
      },
      actors: {
        xslugger:
          xslugger.machine,
      },
      actions: {
        integrate_router:
          function ({
            context,
            self,
          }) {
            context.router.beforeEach(
              (to, from) => {
                if (
                  context.is_navigation_allowed
                ) {
                  return true
                }

                self.send({
                  type: 'nav',
                  to,
                  from,
                })

                return false
              },
            )
          },
        navigate:
          async function ({
            context,
            event,
          }) {
            context.is_navigation_allowed =
              true
            assertEvent(
              event,
              [
                'nav.Home',
                'nav.ProfilesList',
                'nav.SingleProfile',
              ],
            )
            await context.router.push(
              event.path,
            )
            context.is_navigation_allowed =
              false
          },
        raise_navigate: raise(
          function ({
            context,
            event,
          }) {
            assertEvent(
              event,
              'xstate.done.actor.xslugger',
            )

            if (
              event.output.ok
            ) {
              return {
                type: event
                  .output
                  .x_event,
                path: event
                  .output
                  .path,
              } as const
            }

            return {
              type: 'nav.Home',
              path: '/home',
            } as const
          },
        ),
      },
    }).createMachine({
      context({ input }) {
        return {
          router:
            input.router,
          get_user:
            input.get_user,
          is_navigation_allowed:
            false,
        }
      },
      entry:
        'integrate_router',
      id: 'xrouter',
      initial: 'Idle',
      on: {
        nav: {
          target:
            '#xrouter._Processing_navigation',
        },
        'nav.Home': {
          target:
            '#xrouter.Pages.Home',
        },
        'nav.SingleProfile': {
          target:
            '#xrouter.Pages.SingleProfile',
        },
        'nav.ProfilesList': {
          target:
            '#xrouter.Pages.ProfilesList',
        },
      },
      states: {
        Idle: {},
        _Processing_navigation:
          {
            invoke: {
              input({
                event,
                context,
              }) {
                assertEvent(
                  event,
                  'nav',
                )

                return {
                  to: event.to,
                  user: context.get_user(),
                }
              },
              onDone: {
                target:
                  'Idle',

                actions: {
                  type: 'raise_navigate',
                },
              },
              src: 'xslugger',
              id: 'xslugger',
            },
          },
        Pages: {
          initial: 'Home',
          states: {
            Home: {
              entry:
                'navigate',
            },
            SingleProfile: {
              entry:
                'navigate',
            },
            ProfilesList: {
              entry:
                'navigate',
            },
          },
        },
      },
    })
}
