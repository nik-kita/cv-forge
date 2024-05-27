import {setup} from 'xstate'

export const xrouter = setup({
  types: {} as x.xrouter,
}).createMachine({
  id: 'xrouter',
  context({input}) {
    return {
      ...input
    }
  },
})
