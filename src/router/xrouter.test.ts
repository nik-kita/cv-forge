import {beforeEach, describe, expect, it} from 'vitest'
import type {Router} from 'vue-router'
import {createActor} from 'xstate'
import {machine} from './xrouter'
import {init_router} from './mod.router'

describe('xrouter', () => {
  it.each([
    {
      link: '/',
      expected: '/home/luffy',
      get_user: () => ({nik: 'luffy'}),
    },
    {
      link: '/home/zoro',
      expected: '/home/zoro',
      get_user: () => ({nik: 'luffy'}),
    },
  ])(
    '$link => $expected',
    async ({link, get_user, expected}) => {
      const router = init_router()
      const xrouter = createActor(machine, {
        input: {
          router,
          get_user,
        },
      })
      xrouter.start()
      await router.push(link)
      await router.isReady()
      expect(router.currentRoute.value.path).toBe(expected)
    },
  )
})
