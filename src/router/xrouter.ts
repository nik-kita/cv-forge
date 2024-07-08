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
  }
  export type Context = {
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
          is_navigation_allowed:
            false,
        }
      },
      id: 'xrouter',
      type: 'parallel',
      on: {
        nav: {
          target:
            '#xrouter.Computation.Processing',
        },
        'nav.Home': {
          target:
            '#xrouter.Pages.Home',
        },
        'nav.About': {
          target:
            '#xrouter.Pages.About',
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
      entry: {
        type: 'integrate_router',
      },
      states: {
        Computation: {
          initial: 'Idle',
          states: {
            Idle: {},
            Processing: {
              invoke: {
                id: 'xslugger',
                input({
                  event,
                }) {
                  assertEvent(
                    event,
                    'nav',
                  )

                  return {
                    to: event.to,
                  }
                },
                onDone: {
                  actions:
                    'raise_navigate',
                  target:
                    'Idle',
                },
                src: 'xslugger',
              },
            },
          },
        },
        Pages: {
          initial: 'Idle',
          states: {
            Idle: {},
            Home: {
              entry: {
                type: 'navigate',
              },
            },
            SingleProfile: {
              entry: {
                type: 'navigate',
              },
            },
            ProfilesList: {
              entry: {
                type: 'navigate',
              },
            },
            About: {
              entry: {
                type: 'navigate',
              },
            },
          },
        },
      },
    })
}
