import {assign, setup, spawnChild} from 'xstate'
import {xrouter_machine} from './router/xrouter.x'
import type {Router} from 'vue-router'

export const xapp_machine = setup({
  types: {} as x.xapp,
  actors: {
    xrouter: xrouter_machine,
  },
  actions: {},
}).createMachine({
  id: 'xapp',
  context({input, spawn}) {
    spawn('xrouter', {
      input: input.for_router,
      id: 'xrouter',
      systemId: 'xrouter',
    })
  },
})
