import {
  describe,
  expect,
  it,
  beforeEach,
} from 'vitest'
import { createActor } from 'xstate'
import { init_router } from './mod.router'
import { xrouter } from './xrouter'
import { _override_app_stuff } from '@/app.stuff'
import {
  createPinia,
  setActivePinia,
} from 'pinia'
import { use_app_store } from '@/app.store'

describe('xrouter', () => {
  beforeEach(() => {
    setActivePinia(
      createPinia(),
    )
  })
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
      use_app_store().user =
        get_user()
      const router =
        init_router()
      const xrouter_actor =
        createActor(
          xrouter.machine,
          {
            input: {
              router,
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
