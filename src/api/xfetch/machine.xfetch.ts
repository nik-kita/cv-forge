import {assign, fromPromise, setup} from 'xstate'
import {xfetch_config} from './globals.xfetch'
import type {xfetch} from './types.xfetch'
import {fn_to_promise_logic} from '@/utils/x.fn-to-promise-logic.util'

export const machine = setup({
  types: {
    input: {} as xfetch.Input,
    context: {} as xfetch.Context,
    output: {} as xfetch.Output,
  },
  actors: {
    fetch: fn_to_promise_logic(
      async (context: xfetch.Context) => {
        const res = await fetch(
          `${context.url}${context.payload.endpoint}`,
          {
            method: context.payload.method,
            body:
              context.payload.body &&
              JSON.stringify(context.payload.body),
            headers: {
              'Content-Type': 'application/json',
              ...(context.payload.headers || {}),
              ...(context.is_public && {
                Authorization: `Bearer ${context.get_access_token()}`,
              }),
            },
          },
        )

        if (res.ok) {
          if (
            res.headers
              .get('content-type')
              ?.includes('application/json')
          ) {
            return res.json()
          } else {
            return res.text()
          }
        }

        throw res
      },
    ),
  },
}).createMachine({
  id: 'xfetch',
  output({context: {output}}) {
    if (!output) throw {ok: false, error: 'no output'}
    return output
  },
  initial: 'Init',
  states: {
    Init: {
      always: [
        {
          guard: ({context: {is_public}}) => is_public,
          target: 'Public',
        },
        {
          target: 'Private',
        },
      ],
    },
    Private: {},
    Public: {
      invoke: {
        src: 'fetch',
        input: ({context}) => context,

        onDone: {
          target: 'Done',
          actions: assign({
            output: ({event}) => ({
              ok: true,
              success: event.output,
            }),
          }),
        },
        onError: {
          target: 'Done',
        },
      },
    },
    Done: {
      type: 'final',
    },
  },
  context({input}) {
    return {
      payload: input.payload,
      url: input.__override__?._url || xfetch_config.url,
      is_public: input.is_public || false,
      get_refresh_token:
        input.__override__?._get_refresh_token ||
        xfetch_config.get_refresh_token,
      get_access_token:
        input.__override__?._get_access_token ||
        xfetch_config.get_access_token,
    }
  },
})
