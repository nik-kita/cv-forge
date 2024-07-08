import {
  beforeEach,
  it,
} from 'vitest'
import { xauth } from './xauth'
import { createActor } from 'xstate'
import { ref } from 'vue'
import {
  createPinia,
  setActivePinia,
} from 'pinia'

beforeEach(() => {
  setActivePinia(
    createPinia(),
  )
})

it('xauth', async () => {
  const actor = createActor(
    xauth.machine,
    {
      input: {
        is_user: ref(false),
        nik: ref(null),
      },
    },
  )
  actor.start()
})
