import {setup} from 'xstate'

export const xrouter = setup({
  types: {} as x.xrouter,
}).createMachine({
  context({input}) {
    return {
      ...input
    }
  },
})
