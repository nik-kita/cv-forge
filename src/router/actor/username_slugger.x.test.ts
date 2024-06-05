import {it, expect, describe} from 'vitest'
import {
  createMemoryHistory,
  createRouter,
  type RouteMeta,
} from 'vue-router'
import {
  createActor,
  waitFor,
  type StateValueFrom,
} from 'xstate'
import {username_slugger_machine} from './username_slugger.x'

const component = {
  template: `<button>Click to see nothing!</button>`,
}

describe('x: username_slugger', () => {
  it.each([
    {
      path: '/hello/world',
      auth: 'guest' as 'guest' | 'user',
      _with: '',
      own_username: '',
      expected: 'Guest::viewer',
      meta: {
        is_public: true,
        x_nav_ev_name: 'nav.to.Home',
      },
    },
    {
      path: '/hello/world/:username',
      _path: '/hello/world/luffy',
      auth: 'guest' as 'guest' | 'user',
      _with: '',
      own_username: '',
      expected: 'Guest::viewer',
      meta: {
        is_public: true,
        x_nav_ev_name: 'nav.to.Home',
        username_slug: {
          required: false,
        },
      },
    },
    {
      path: '/hello/world/:username',
      _path: '/hello/world/luffy',
      auth: 'user' as 'guest' | 'user',
      _with: 'with',
      own_username: 'luffy',
      expected: 'User::owner',
      meta: {
        is_public: true,
        x_nav_ev_name: 'nav.to.Home',
        username_slug: {
          required: false,
        },
      },
    },
    {
      path: '/hello/world',
      auth: 'guest' as 'guest' | 'user',
      _with: '',
      own_username: '',
      expected: 'Guest::forbidden',
      meta: {
        is_public: false,
        x_nav_ev_name: 'nav.to.Home',
      },
    },
    {
      path: '/hello/world',
      auth: 'user' as 'guest' | 'user',
      _with: '',
      own_username: '',
      expected: 'User::owner',
      meta: {
        is_public: false,
        x_nav_ev_name: 'nav.to.Home',
      },
    },
    {
      path: '/hello/world/:username',
      _path: '/hello/world/luffy',
      auth: 'user' as 'guest' | 'user',
      _with: 'with',
      own_username: 'zoro',
      expected: 'User::viewer',
      meta: {
        is_public: true,
        x_nav_ev_name: 'nav.to.Home',
        username_slug: {
          required: false,
        },
      },
    },
  ] satisfies {
    path: string
    _path?: string
    meta: RouteMeta
    auth: 'user' | 'guest'
    own_username: string
    _with: 'with' | 'without' | ''
    expected: StateValueFrom<
      typeof username_slugger_machine
    >
  }[])(
    '$auth $_with $own_username on $path should be $expected',
    async ({
      path,
      meta,
      auth,
      expected,
      own_username,
      _path,
    }) => {
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [
          {
            path,
            meta,
            component,
          },
        ],
      })
      let is_router_before_each_called = false
      let is_username_slugger_subscribtion_called = false
      let done: Promise<any>
      router.beforeEach(async (to, from) => {
        is_router_before_each_called = true
        const username_slugger = createActor(
          username_slugger_machine,
          {
            input: {
              is_user: auth === 'user',
              route: {
                to,
              },
              own_username,
            },
          },
        )
        username_slugger.subscribe(s => {
          is_username_slugger_subscribtion_called = true
          expect(s.status).toBe('done')
          expect(s.value).toBe(expected)
        })
        username_slugger.start()
        done = waitFor(
          username_slugger,
          s => s.status === 'done',
        )
      })

      await router.push(_path || path)
      await router.isReady()
      await done!
      expect(
        is_router_before_each_called,
        "router.beforeEach wasn't called",
      )
      expect(
        is_username_slugger_subscribtion_called,
        'username_slugger subscribtion was not called',
      )
    },
  )
})
