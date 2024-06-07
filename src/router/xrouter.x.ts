import {
  assertEvent,
  raise,
  setup,
  type OutputFrom,
} from 'xstate'
import {username_slugger_machine} from './actor/username_slugger.x'

export const xrouter_machine = setup({
  types: {} as x.xrouter.types,
  actions: {
    async allow_navigation({
      event,
      context: {navigation, router},
    }) {
      assertEvent(event, [
        'nav.to.Home',
        'nav.to.Profile[name]',
        'nav.to.Profile[name][username]',
        'nav.to.Settings',
      ])

      navigation.allow = true
      const failure = await router.push(event.payload.path)

      if (failure) {
        console.error('=== Failed to navigate! ===')
        console.error(failure)
      }

      navigation.allow = false
    },
  },
  actors: {
    username_slugger: username_slugger_machine,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgA8AnLAVwBcwj8QAHLWAS3MawxoMQEYAmdAT249kI5EA */
  id: 'xrouter',
  context({input: {router, get_username, is_user}}) {
    return {
      router,
      get_username,
      is_user,
      navigation: {allow: false},
    }
  },
  entry({
    context: {router, navigation: allow_navigation},
    self,
  }) {
    router.beforeEach((to, from) => {
      if (allow_navigation) {
        return true
      }

      self.send({
        type: '_.nav.to',
        payload: {to, from},
      } satisfies x.xrouter.events)

      return false
    })
  },
  on: {
    '_.nav.to': {
      target: '.Processing_navigation',
    },
  },
  initial: 'Init',
  states: {
    Init: {},
    Processing_navigation: {
      invoke: {
        src: 'username_slugger',
        id: 'username_slugger',
        input({context, event, self}) {
          assertEvent(event, '_.nav.to')
          return {
            is_user: context.is_user(),
            route: {
              to: event.payload.to,
            },
            own_username: context.get_username(),
          }
        },
        onDone: {
          actions: raise(({context, event, self}) => {
            console.log(event.output, 'OUTPUT')

            return {
              type: (event as any).output.to.meta
                .x_nav_ev_name,
              payload: {
                path: (event as any).output.to.path,
              },
            }
          }),
        },
      },
    },
  },
})
