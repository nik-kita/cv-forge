import {setup} from 'xstate'
import {xrouter_machine} from './router/xrouter.x'

export const xapp_machine = setup({
  types: {} as x.xapp,
  actors: {
    xrouter: xrouter_machine,
  },
}).createMachine({
  id: 'xapp',
})
