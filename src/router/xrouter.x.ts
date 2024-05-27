import {setup} from 'xstate'

export const xrouter_machine = setup({
  types: {} as x.xrouter,
}).createMachine({
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
