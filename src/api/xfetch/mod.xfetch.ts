import {
  type ActorRefFrom,
  type PromiseActorLogic,
} from 'xstate'
import type {api} from '../api.types'

export function xfetch<
  T extends [method: api.Method, endpoint: api.Endpoint],
>(
  payload: T extends (
    infer Pub extends api.Req<T[0], T[1]> & {
      headers?:
        | {
            authorization?: never
          }
        | never
    }
  ) ?
    Pub & {is_public: true}
  : T extends (
    infer Priv extends api.Req<T[0], T[1]> & {
      headers: {
        authorization: string
      }
    }
  ) ?
    OmitStrict<Priv, 'headers'> & {
      headers: OmitStrict<Priv['headers'], 'authorization'>
    }
  : never,
): ActorRefFrom<
  PromiseActorLogic<
    api_deprecated.Res<T[0], T[1]>,
    typeof payload
  >
>
export function xfetch<
  T extends [method: api.Method, endpoint: api.Endpoint],
>(
  payload?: Partial<
    api.Req<T[0], T[1]> & {
      is_public: true
    }
  >,
): ActorRefFrom<
  PromiseActorLogic<
    api_deprecated.Res<T[0], T[1]>,
    typeof payload
  >
> {
  return '// TODO' as any
}
