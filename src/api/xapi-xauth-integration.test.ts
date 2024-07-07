import { xauth } from '@/auth/xauth'
import {
  expect,
  it,
} from 'vitest'
import { ref } from 'vue'
import {
  assign,
  createActor,
  setup,
  waitFor,
} from 'xstate'
import type { api } from './api.namespace'
import { xapi } from './xapi'

it('xapi-xauth-integration::simple api_hello-world', async () => {
  const machine = setup({
    types: {
      context: {} as Record<
        string,
        something
      >,
      output: {} as something,
    },
    actors: {
      xauth: xauth.machine,
      'api_hello-world': xapi(
        {
          method: 'get',
          path: '/hello-world',
        },
        {
          is_private: false,
        },
      ),
    },
  }).createMachine({
    context: ({
      input,
      spawn,
    }) => {
      spawn('xauth', {
        input: {
          is_user: ref(false),
          username: ref(null),
        },
      })

      return {}
    },
    id: 'root',
    initial: 'Idle',
    output: ({ context }) =>
      context.output,
    states: {
      Done: {
        type: 'final',
      },
      Idle: {
        invoke: {
          src: 'api_hello-world',
          id: 'api_hello-world',
          input: () => {
            return {}
          },
          onDone: {
            target:
              '#root.Done',
            actions: assign(
              ({ event }) => {
                return {
                  output:
                    event.output as api.Res.Success<
                      'get',
                      '/hello-world'
                    >,
                }
              },
            ),
          },
          onError: {
            target:
              '#root.Done',
            actions: assign(
              ({ event }) => {
                return {
                  output:
                    event.error as api.Res.Fail<
                      'get',
                      '/hello-world'
                    >,
                }
              },
            ),
          },
        },
      },
    },
  })

  const root =
    createActor(machine)
  root.start()
  const last_root_snapshot =
    await waitFor(
      root,
      s =>
        s.status !== 'active',
    )

  expect(
    last_root_snapshot.output,
  ).toMatchObject({
    _: 'success',
    success: {
      message: 'Hello World!',
    },
  })
})
