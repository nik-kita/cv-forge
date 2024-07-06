import { it } from 'vitest'
import { xauth } from './xauth'
import { createActor } from 'xstate'
import { ref } from 'vue'

it('xauth', async () => {
  const actor = createActor(
    xauth.machine,
    {
      input: {
        is_user: ref(false),
        username: ref(null),
      },
    },
  )
  actor.start()
})
