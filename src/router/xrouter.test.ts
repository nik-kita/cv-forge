import {
  describe,
  expect,
  it,
} from 'vitest'
import { createActor } from 'xstate'
import { init_router } from './mod.router'
import { xrouter } from './xrouter'

describe('xrouter', () => {
  it.each([
    {
      link: '/',
      expected: '/home/luffy',
      get_user: () => ({
        nik: 'luffy',
      }),
    },
    {
      link: '/home/zoro',
      expected: '/home/zoro',
      get_user: () => ({
        nik: 'luffy',
      }),
    },
  ])(
    '$link => $expected',
    async ({
      link,
      get_user,
      expected,
    }) => {
      const router =
        init_router()
      const xrouter_actor =
        createActor(
          xrouter.machine,
          {
            input: {
              router,
              get_user,
            },
          },
        )
      xrouter_actor.start()
      await router.push(link)
      await router.isReady()
      expect(
        router.currentRoute
          .value.path,
      ).toBe(expected)
    },
  )
})
