import {setup} from 'xstate'

export const xrouter_machine = setup({
  types: {} as x.xrouter.types,
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgA8AnLAVwBcwj8QAHLWAS3MawxoMQEYAmdAT249kI5EA */
  id: 'xrouter',
  context({input: {router}}) {
    return {
      router,
      allow_navigation: false,
    }
  },
  entry({context: {router, allow_navigation}}) {
    router.beforeEach((to, from) => {
      if (allow_navigation) {
        return true
      }

      return false
    })
  },
})
