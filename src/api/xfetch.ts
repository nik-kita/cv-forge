import {
  get_access_token,
  get_refresh_token,
} from '@/services/jwt-token.service'
import {fn_to_promise_logic} from '@/utils/x.fn-to-promise-logic.util'
import {createActor, fromPromise, setup} from 'xstate'
import {api_refresh} from './api_refresh'

const _xfetch_config = {
  refresh_token_status: 'none' as
    | 'none'
    | 'ready'
    | 'processing'
    | 'fail',
  refresh_waiters: new Map<string, any>(),
  get_refresh_token,
  get_access_token,
}

type Input = {
  api: <T extends api.Method, U extends api.Endpoint>(
    payload: api.Req<T, U>,
  ) => Promise<api.Res<T, U>>
  payload: api.Req<api.Method, api.Endpoint>
  _get_access_token?: () => string | null
  _get_refresh_token?: () => string | null
}
type Output =
  | {
      ok: true
      success: api.Res<api.Method, api.Endpoint>
    }
  | {
      ok: false
      error?:
        | api.Err<api.Method, api.Endpoint, number>
        | unknown
    }
type Context = Pick<Input, 'api' | 'payload'> & {
  get_refresh_token: typeof get_refresh_token
  get_access_token: typeof get_access_token
} & {
  output?: Output
}
const machine = setup({
  types: {
    input: {} as Input,
    context: {} as Context,
    output: {} as Output,
  },
  actors: {
    refresh: fn_to_promise_logic(api_refresh),
  },
}).createMachine({
  id: 'xfetch',
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
