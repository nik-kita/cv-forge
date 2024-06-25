import {setup} from 'xstate'

export const machine = setup({
  types: {
    input: {} as {},
    context: {} as {},
  },
}).createMachine({
  id: 'xfetch',
  context({input}) {
    return {
      ...input,
    }
  },
})
