import {fn_to_promise_logic} from '@/utils/x.fn-to-promise-logic.util'
import {assign, setup} from 'xstate'
import {_xfetch_config} from './globals.xfetch'
import type {xfetch} from './types.xfetch'

export const machine = setup({
  types: {
    input: {} as xfetch.Input,
    context: {} as xfetch.Context,
    output: {} as xfetch.Output,
  },
  actors: {
    api: fn_to_promise_logic<
      (
        ctx: xfetch.Context,
      ) => ReturnType<xfetch.Context['api']>
    >(async ctx => {
      return ctx.api(ctx.payload)
    }),
  },
}).createMachine({
  id: 'xfetch',
  initial: 'Start',
  output({context: {output}}) {
    if (!output) return {ok: false, error: 'no output'}
    return output
  },
  states: {
    Start: {
      invoke: {
        src: 'api',
        input({context}) {
          return context
        },
        onDone: {
          target: 'Finish',
          actions: assign({
            output: ({event}) => {
              return {ok: true, success: event.output}
            },
          }),
        },
      },
    },
    Finish: {
      type: 'final',
    },
  },
  context({input}) {
    return {
      api: input.api,
      payload: input.payload,
      get_refresh_token:
        input._get_refresh_token ||
        _xfetch_config.get_refresh_token,
      get_access_token:
        input._get_access_token ||
        _xfetch_config.get_access_token,
    }
  },
})
