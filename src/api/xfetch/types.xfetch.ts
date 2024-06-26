import type {
  get_access_token,
  get_refresh_token,
} from '@/services/jwt-token.service'
import type {api} from '../api.types'

export namespace xfetch {
  export type Input = {
    api: (
      payload: api.Req<any, any>,
    ) => Promise<api_deprecated.Res<any, any>>
    payload: api.Req<any, any>
    _get_access_token?: () => string | null
    _get_refresh_token?: () => string | null
  }
  export type Output =
    | {
        ok: true
        success: api_deprecated.Res<
          api_deprecated.Method,
          api_deprecated.Endpoint
        >
      }
    | {
        ok: false
        error?:
          | api_deprecated.Err<
              api_deprecated.Method,
              api_deprecated.Endpoint,
              number
            >
          | unknown
      }
  export type Context = Pick<Input, 'api' | 'payload'> & {
    get_refresh_token: typeof get_refresh_token
    get_access_token: typeof get_access_token
  } & {
    output?: Output
  }
}
