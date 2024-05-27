import {createActor} from 'xstate'
import {xapp_machine} from './App.x'
import router from './router/mod.router'

const init_x = () => {
  const xapp = createActor(xapp_machine, {
    input: {for_router: {router}},
  })
}

let x: ReturnType<typeof init_x> | undefined

export const use_x = x ? () => x : (x = init_x())
