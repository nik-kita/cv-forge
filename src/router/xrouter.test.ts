import {describe, expect, it} from 'vitest'
import {machine} from './xrouter'
import {createActor} from 'xstate'
import router from './mod.router'

describe('xrouter', () => {
  it.each([
    {
      link: '/',
      expected: '/home',
    },
  ])('', async ({link}) => {
    const xrouter = createActor(machine, {
      input: {
        router,
      },
    })
    xrouter.start()
  })
})
