import {setup} from 'xstate'

export const xrouter_machine = setup({
  types: {} as x.xrouter,
}).createMachine({
  id: 'xrouter',
  context({input}) {
    return {
      ...input
    }
  },
})
