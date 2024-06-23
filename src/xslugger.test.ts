import {expect, it, vi} from 'vitest'
import {createActor, waitFor} from 'xstate'
import {machine} from './xslugger'
import {
  createMemoryHistory,
  createRouter,
  type RouteLocationNormalized,
  type RouteMeta,
} from 'vue-router'

it.each([
  {
    user: {},
    path: '/test/:username?',
    path_to_push: '/test',
    meta: {
      public: true,
      x_event: '_',
    },
    expected: {
      path: '/test',
      role: 'user::viewer',
    },
  },
  {
    user: {username: 'luffy'},
    path: '/test/:username?',
    path_to_push: '/test/zoro',
    meta: {
      public: true,
      x_event: '_',
    },
    expected: {
      path: '/test/zoro',
      role: 'user::viewer',
    },
  },
  {
    user: {username: 'luffy'},
    path: '/test/:username?',
    path_to_push: '/test',
    meta: {
      public: true,
      x_event: '_',
    },
    expected: {
      path: '/test/luffy',
      role: 'owner',
    },
  },
  {
    path: '/test/:username?',
    path_to_push: '/test',
    meta: {
      public: true,
      x_event: '_',
    },
    expected: {
      path: '/test',
      role: 'guest::viewer',
    },
  },
  {
    path: '/test',
    path_to_push: '/test',
    meta: {
      public: false,
      x_event: '_',
    },
    expected: {
      ok: false,
    },
  },
  {
    user: {},
    path: '/test',
    path_to_push: '/test',
    meta: {
      public: false,
      x_event: '_',
    },
    expected: {
      path: '/test',
      role: 'owner',
    },
  },
] as const satisfies ({meta: RouteMeta} & Record<
  string,
  any
>)[])(
  'PROCESSING: \t{ navigate_to: $path_to_push, path: $path, public: $meta.public, user: $user } \n     SHOULD PRODUCE:    { path: $expected.path, role: $expected.role }\n\n',
  async ({meta, path, path_to_push, expected, user}) => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path,
          meta,
          component: {
            template: '<div>Test</div>',
          },
        },
      ],
    })
    const before_each_router_mock = vi.fn(async to => {
      const xslugger = createActor(machine, {
        input: {
          to,
          user,
        },
      })
      xslugger.start()
      await waitFor(xslugger, s => s.status === 'done')
      const snapshot = xslugger.getSnapshot()
      expect(snapshot.output).toMatchObject(expected)
    })
    router.beforeEach(before_each_router_mock)
    await router.push(path_to_push)
    expect(before_each_router_mock).toHaveBeenCalledTimes(1)
  },
)
