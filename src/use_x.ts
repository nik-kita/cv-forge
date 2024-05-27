import {createActor} from 'xstate'
import {xapp_machine} from './App.x'
import router from './router/mod.router'
import {ref} from 'vue'

let x: ReturnType<typeof init_x> | undefined
const init_x = () => {
  const xapp = createActor(xapp_machine, {
    input: {for_router: {router}},
  })
  const xapp_snap = xapp.getSnapshot()
  const xapp_state = ref(xapp_snap.value)
  const xrouter = xapp_snap.children.xrouter!
  const xrouter_snap = xrouter.getSnapshot()
  const xrouter_state = ref(xrouter_snap.value)

  xapp.start()

  return {
    xapp,
    xapp_state,
    xrouter,
    xrouter_state,
  }
}

export const use_x =
  x ?
    () => x!
  : () => {
      x = init_x()
      return x!
    }
