import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  createMemoryHistory,
  createRouter,
  type RouteMeta,
} from 'vue-router'
import {
  createActor,
  waitFor,
} from 'xstate'
import { xslugger } from './xslugger'

describe('xslugger', () => {
  it.each([
    {
      user: {},
      path: '/test/:nik?',
      path_to_push: '/test',
      meta: {
        public: true,
        x_event: 'nav.Home',
      },
      expected: {
        path: '/test',
        role: 'user::viewer',
      },
    },
    {
      user: { nik: 'luffy' },
      path: '/test/:nik?',
      path_to_push:
        '/test/zoro',
      meta: {
        public: true,
        x_event: 'nav.Home',
      },
      expected: {
        path: '/test/zoro',
        role: 'user::viewer',
      },
    },
    {
      user: { nik: 'luffy' },
      path: '/test/:nik?',
      path_to_push: '/test',
      meta: {
        public: true,
        x_event: 'nav.Home',
      },
      expected: {
        path: '/test/luffy',
        role: 'owner',
      },
    },
    {
      path: '/test/:nik?',
      path_to_push: '/test',
      meta: {
        public: true,
        x_event: 'nav.Home',
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
        x_event: 'nav.Home',
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
        x_event: 'nav.Home',
      },
      expected: {
        path: '/test',
        role: 'owner',
      },
    },
  ] as const satisfies ({
    meta: RouteMeta
  } & Record<string, any>)[])(
    'PROCESSING: \t{ navigate_to: $path_to_push, path: $path, public: $meta.public, user: $user } \n     SHOULD PRODUCE:    { path: $expected.path, role: $expected.role }\n\n',
    async ({
      meta,
      path,
      path_to_push,
      expected,
      user,
    }) => {
      const router =
        createRouter({
          history:
            createMemoryHistory(),
          routes: [
            {
              path,
              meta,
              component: {
                template:
                  '<div>Test</div>',
              },
            },
          ],
        })
      const before_each_router_mock =
        vi.fn(async to => {
          const xslugger_actor =
            createActor(
              xslugger.machine,
              {
                input: {
                  to,
                  user,
                },
              },
            )
          xslugger_actor.start()
          await waitFor(
            xslugger_actor,
            s =>
              s.status ===
              'done',
          )
          const snapshot =
            xslugger_actor.getSnapshot()
          expect(
            snapshot.output,
          ).toMatchObject(
            expected,
          )
        })
      router.beforeEach(
        before_each_router_mock,
      )
      await router.push(
        path_to_push,
      )
      expect(
        before_each_router_mock,
      ).toHaveBeenCalledTimes(
        1,
      )
    },
  )
})
