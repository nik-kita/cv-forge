import {expect, it, vi} from 'vitest'
import {createActor, waitFor} from 'xstate'
import {machine} from './xslugger'
import {createMemoryHistory, createRouter} from 'vue-router'

it('xslugger', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/test',
        meta: {
          public: true,
          username: 'none',
          x_event: '_',
        },
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
      },
    })
    xslugger.start()
    await waitFor(xslugger, s => s.status === 'done')
    const snapshot = xslugger.getSnapshot()
    console.log(snapshot.output)
  })
  router.beforeEach(before_each_router_mock)
  await router.push('/test')
  expect(before_each_router_mock).toHaveBeenCalledTimes(1)
})
