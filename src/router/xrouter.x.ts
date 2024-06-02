import {assertEvent, raise, setup} from 'xstate'

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
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgA8AnLAVwBcwj8QAHLWAS3MawxoMQEYAmdAT249kI5EA */
  id: 'xrouter',
  context({input: {router}}) {
    return {
      router,
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
      target: 'Processing_navigation',
    },
  },
  initial: 'Processing_navigation',
  states: {
    Processing_navigation: {},
  },
})
