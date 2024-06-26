import type {
  get_access_token,
  get_refresh_token,
} from '@/services/jwt-token.service'

export namespace xfetch {
  export type Input = {
    api: <T extends api.Method, U extends api.Endpoint>(
      payload: api.Req<T, U>,
    ) => Promise<api.Res<T, U>>
    payload: api.Req<api.Method, api.Endpoint>
    _get_access_token?: () => string | null
    _get_refresh_token?: () => string | null
  }
  export type Output =
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
  export type Context = Pick<Input, 'api' | 'payload'> & {
    get_refresh_token: typeof get_refresh_token
    get_access_token: typeof get_access_token
  } & {
    output?: Output
  }
}
