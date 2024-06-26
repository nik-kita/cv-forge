import type {
  get_access_token,
  get_refresh_token,
} from '@/services/jwt-token.service'

export namespace xfetch {
  export type Input = {
    api: <
      T extends api_deprecated.Method,
      U extends api_deprecated.Endpoint,
    >(
      payload: api_deprecated.Req<T, U>,
    ) => Promise<api_deprecated.Res<T, U>>
    payload: api_deprecated.Req<
      api_deprecated.Method,
      api_deprecated.Endpoint
    >
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
