import {setup} from 'xstate'
import {xrouter} from './router/xrouter.x'

export const xapp = setup({
  types: {} as x.xapp,
  actors: {
    xrouter,
  },
}).createMachine({
  id: 'xapp',
})
