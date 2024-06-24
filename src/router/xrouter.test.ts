import {describe, expect, it} from 'vitest'
import {machine} from './xrouter'
import {createActor} from 'xstate'
import router from './mod.router'

describe('xrouter', () => {
  it.each([
    {
      link: '/',
      expected: '/home/luffy',
      get_user: () => ({username: 'luffy'}),
    },
    // {
    //   link: '/home/zoro',
    //   expected: '/home/zoro',
    //   get_user: () => ({username: 'luffy'}),
    // },
  ])(
    '$link => $expected',
    async ({link, get_user, expected}) => {
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
