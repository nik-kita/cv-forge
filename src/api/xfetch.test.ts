import { it } from 'vitest'
import { createActor } from 'xstate'
import { xfetch } from './xfetch'

it('xfetch', async () => {
  const actor = createActor(
    xfetch.machine,
    {
      input: {
        is_private: false,
        payload: {
          method: 'get',
          path: '/hello-world',
        },
      },
    },
  )
  actor.start()
})
