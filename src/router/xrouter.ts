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
import {machine as xslugger} from './xslugger'

export const machine = setup({
  types: {
    input: {} as {
      router: Router
    },
    context: {} as {
      router: Router
      is_navigation_allowed: boolean
    },
    events: {} as
      | {type: 'nav.Home'; path: string}
      | {type: 'nav.ProfilesList'; path: string}
      | {type: 'nav.SingleProfile'; path: string}
      | {
          type: 'nav'
          to: RouteLocationNormalized
          from: RouteLocationNormalized
        }
      | x.SuccessDoneActorEv<
          'xslugger',
          OutputFrom<typeof xslugger>
        >,
  },
  actors: {
    xslugger,
  },
  actions: {
    integrate_router: function ({context, self}) {
      context.router.beforeEach((to, from) => {
        if (context.is_navigation_allowed) {
          return true
        }

        self.send({
          type: 'nav',
          to,
          from,
        })

        return false
      })
    },
    navigate: async function ({context, event}) {
      context.is_navigation_allowed = true
      assertEvent(event, [
        'nav.Home',
        'nav.ProfilesList',
        'nav.SingleProfile',
      ])
      await context.router.push(event.path)
      context.is_navigation_allowed = false
    },
    raise_navigate: raise(function ({context, event}) {
      assertEvent(event, 'xstate.done.actor.xslugger')

      if (event.output.ok) {
        return {
          type: event.output.x_event,
          path: event.output.path,
        } as const
      }

      return {
        type: 'nav.Home',
        path: '/home',
      } as const
    }),
  },
}).createMachine({
  context({input}) {
    return {
      router: input.router,
      is_navigation_allowed: false,
    }
  },
  id: 'xrouter',
  initial: '_Processing_navigation',
  on: {
    nav: {
      target: '#xrouter._Processing_navigation',
    },
    'nav.Home': {
      target: '#xrouter.Pages.Home',
    },
    'nav.SingleProfile': {
      target: '#xrouter.Pages.SingleProfile',
    },
    'nav.ProfilesList': {
      target: '#xrouter.Pages.ProfilesList',
    },
  },
  states: {
    _Processing_navigation: {
      invoke: {
        input({event, context}) {
          assertEvent(event, 'nav')
          return {
            to: event.to,
          }
        },
        onDone: {
          target: '_Complete_navigation',

          actions: {
            type: 'raise_navigate',
          },
        },
        src: 'xslugger',
      },
    },
    _Complete_navigation: {},
    Pages: {
      initial: 'Home',
      states: {
        Home: {},
        SingleProfile: {},
        ProfilesList: {},
      },
    },
  },
})
