import {expect, it, describe} from 'vitest'
import router from './mod.router'

describe('Router username, navigation, redirects', () => {
  it.each([
    {
      path_to_push: '/test',
      expected_path: '/home',
    },
    {
      path_to_push: '/',
      expected_path: '/home',
    },
    {
      path_to_push: '/home/luffy',
      expected_path: '/home/luffy',
    },
    {
      path_to_push: '/profile/onepiece/luffy',
      expected_path: '/profile/onepiece/luffy',
    },
    {
      path_to_push: '/profile/onepiece',
      expected_path: '/profile/onepiece',
    },
    {
      path_to_push: '/profile',
      expected_path: '/home',
    },
  ])(
    '$path_to_push => $expected_path',
    async ({expected_path, path_to_push}) => {
      await router.push(path_to_push)
      expect(router.currentRoute.value.path).toBe(
        expected_path,
      )
    },
  )
})
