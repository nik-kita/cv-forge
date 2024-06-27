import {describe, expect, it} from 'vitest'
import {createActor, waitFor} from 'xstate'
import {machine} from './machine.xfetch'
import type {api} from '../api.types'

describe('xfetch machine', () => {
  it('should make simple api call', async () => {
    const actor = createActor(machine, {
      input: {
        is_public: true,
        payload: {
          endpoint: '/hello-world',
          method: 'get',
        } satisfies api.Req<
          'get',
          '/hello-world'
        > as api.Req<any, any>,
      },
    })
    let done: any
    actor.subscribe(s => {
      console.log(s.value)
      if (s.status === 'done' && s.output.ok) {
        done = s.output.success
      }
    })

    actor.start()

    await waitFor(actor, s => s.status !== 'active')

    expect(done).toEqual({message: 'Hello World!'})
  })
})
