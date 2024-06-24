import type {paths} from '@/api/openapi'
import type {DoneActorEvent, ErrorActorEvent} from 'xstate'

declare global {
  namespace api {
    type Method = 'get' | 'post' | 'put' | 'delete'
    type Endpoint = keyof paths
    type Req<
      M extends Method,
      T extends keyof paths,
    > = paths[T][M]['requestBody']['content']['application/json']
    type Res<
      M extends Method,
      T extends keyof paths,
    > = paths[T][M]['responses']['200']['content']['application/json']
    type Err<
      M extends Method,
      T extends keyof paths,
      S extends number,
    > = {
      json: () => Promise<
        paths[T][M]['responses'][`${S}`]['content']['application/json']
      >
    }
  }
  namespace app {
    type User = {
      username?: string
    }
  }

  namespace x {
    export type SuccessDoneActorEv<
      Id extends string,
      T,
    > = OmitReplace<
      DoneActorEvent<T>,
      {
        type: `xstate.done.actor.${Id}`
      }
    >
    export type FailDoneActorEv<
      Id extends string,
      T,
    > = OmitReplace<
      ErrorActorEvent<T>,
      {
        type: `xstate.error.actor.${Id}`
      }
    >
    export type DoneActorEv<Id extends string, T> =
      | SuccessDoneActorEv<Id, T>
      | FailDoneActorEv<Id, T>

    export type InitEv = {type: 'xstate.init'}
  }

  type Tail<T extends any[]> =
    T extends [infer _first, ...infer Rest] ? Rest : never
  type OmitStrict<
    T extends Record<string, any>,
    K extends keyof T,
  > = Omit<T, K> & Partial<Record<K, never>>
  type OmitReplace<
    T extends Record<string, any>,
    U extends Partial<Record<keyof T, any>>,
  > = Omit<T, keyof U> & U

  type AddOrReplace<
    T extends Record<string, any>,
    U extends Record<string, any>,
  > = Omit<T, keyof U> & U
}

export {}
