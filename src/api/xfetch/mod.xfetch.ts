import type {api} from '../api.types'
import type {ActorRefFrom, PromiseActorLogic} from 'xstate'

export function xfetch<
  T extends api.Method,
  U extends api.Endpoint,
>(
  fn: (arg: api.Req<T, U>) => api_deprecated.Res<T, U>,
  payload?: Parameters<typeof fn>[0] extends (
    {
      headers?:
        | {
            authorization?: never
          }
        | never
    }
  ) ?
    api.Req<T, U> & {is_public: true}
  : api.Req<T, U>,
): ActorRefFrom<
  PromiseActorLogic<
    api_deprecated.Res<T, U>,
    {
      fn: typeof fn
      payload: typeof payload
    }
  >
>
export function xfetch<
  T extends api.Method,
  U extends api.Endpoint,
>(
  fn: (arg: api.Req<T, U>) => api_deprecated.Res<T, U>,
  payload?: Partial<api.Req<T, U> & {is_public: true}>,
): ActorRefFrom<
  PromiseActorLogic<
    api_deprecated.Res<T, U>,
    {
      fn: typeof fn
      payload: typeof payload
    }
  >
> {
  return '// TODO' as any
}
