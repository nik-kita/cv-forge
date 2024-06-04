import {it, expect} from 'vitest'
import {createMemoryHistory, createRouter} from 'vue-router'
import {createActor} from 'xstate'
import {username_slugger_machine} from './username_slugger.x'

const component = {
  template: `<button>Click to see nothing!</button>`,
}

it('x: username_slugger', async () => {
  const path = '/hello/world'
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path,
        meta: {
          is_public: true,
          x_nav_ev_name: 'nav.to.Home',
        },
        component,
      },
    ],
  })
  let is_router_before_each_called = false
  let is_username_slugger_subscribtion_called = false
  router.beforeEach(async (to, from) => {
    is_router_before_each_called = true
    const username_slugger = createActor(
      username_slugger_machine,
      {
        input: {
          is_user: false,
          route: {
            to,
          },
        },
      },
    )
    username_slugger.subscribe(s => {
      is_username_slugger_subscribtion_called = true
      expect(s.status).toBe('done')
      expect(s.value).toBe('Guest::viewer')
    })
    username_slugger.start()
  })

  await router.push(path)
  await router.isReady()

  await new Promise(resolve => setTimeout(resolve, 1000))

  expect(
    is_router_before_each_called,
    "router.beforeEach wasn't called",
  )
  expect(
    is_username_slugger_subscribtion_called,
    'username_slugger subscribtion was not called',
  )
})
