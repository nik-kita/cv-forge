import {beforeEach, describe, expect, it} from 'vitest'
import {
  createActor,
  waitFor,
  type ActorRefFrom,
} from 'xstate'
import {xrouter_machine} from './xrouter.x'
import {
  createRouter,
  type Router,
  createMemoryHistory,
  type RouteRecordRaw,
} from 'vue-router'

describe('x: xrouter', () => {
  it.each([
    {
      username: 'luffy',
      path_to_push: '/',
      path_final: '/luffy',
      is_user: true,
    },
  ])(
    '$path_to_push after username_slugger processing should become $path_final',
    async ({
      is_user,
      path_final,
      path_to_push,
      username,
    }) => {
      const {router, xrouter} = init({
        is_user,
        username,
        routes: [
          {
            path: '/:username?',
            meta: {
              is_public: true,
              x_nav_ev_name: 'nav.to.Home',
              username_slug: {required: false},
            },
          },
        ],
      })
      xrouter.start()
      await router.replace(path_to_push)
      // TODO
      expect(
        router.currentRoute.value.params.username,
      ).toBe(path_final)
      xrouter.stop()
      await waitFor(xrouter, s => {
        return s.status !== 'active'
      })
    },
  )
})

const component = {
  template: `<div></div>`,
}
function init(
  options: {
    routes?: Pick<RouteRecordRaw, 'path' | 'meta'>[]
    username?: string
    is_user?: boolean
  } = {},
) {
  const {
    username = 'luffy',
    is_user = true,
    routes = [
      {
        path: '/:username?',
        meta: {
          is_public: true,
          x_nav_ev_name: 'nav.to.Home',
          username_slug: {
            required: false,
          },
        },
      },
    ],
  } = options
  const router = createRouter({
    history: createMemoryHistory(),
    routes: routes.map(r => ({...r, component})),
  })
  const xrouter = createActor(xrouter_machine, {
    input: {
      router,
      get_username() {
        return username
      },
      is_user() {
        return is_user
      },
    },
  })

  return {
    router,
    xrouter,
  }
}
