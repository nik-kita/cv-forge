import {describe, expect, it} from 'vitest'
import {createActor, waitFor} from 'xstate'
import {machine} from './machine.xfetch'
import type {api} from '../api.types'

describe('xfetch machine', () => {
  it('should make simple api call', async () => {
    const api: (
      payload: api.Req<'put', '/user/nik/{nik}'>,
    ) => Promise<
      api_deprecated.Res<'put', '/user/nik/{nik}'>
    > = async payload => {
      return {nik: payload.params.nik}
    }

    const actor = createActor(machine, {
      input: {
        api: api as any,
        payload: {
          body: {},
          headers: {},
          params: {nik: 'luffy'},
          query: {},
        },
      },
    })
    let done: any
    actor.subscribe(s => {
      if (s.status === 'done' && s.output.ok) {
        done = s.output.success
      }
    })

    actor.start()

    await waitFor(actor, s => s.status !== 'active')

    expect(done).toEqual({nik: 'luffy'})
  })
})
