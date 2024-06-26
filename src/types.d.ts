import type {paths} from '@/api/openapi'
import type {ComputedRef, WritableComputedRef} from 'vue'
import type {DoneActorEvent, ErrorActorEvent} from 'xstate'

declare global {
  namespace api_deprecated {
    type Method = 'get' | 'post' | 'put' | 'delete'
    type Endpoint = keyof paths
    type Res<
      M extends Method,
      T extends keyof paths,
      N extends number = 200,
    > = paths[T][M]['responses'][N]['content']['application/json']
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
      nik?: string
    }
  }

  namespace x {
    type XStore = {
      nik_slug: Ref<string | null | undefined>
      is_user: ComputedRef<boolean>
      user: Ref<
        | {
            nik?: string | null
          }
        | undefined
      >
      nik: WritableComputedRef<string | null | undefined>
      viewer_role: Ref<
        'guest::viewer' | 'user::viewer' | 'owner'
      >
      clean_auth(): void
      update_auth(
        payload: api_deprecated.Res<
          'post',
          '/auth/sign-in'
        >,
      ): void
    }
    type SuccessDoneActorEv<
      Id extends string,
      T,
    > = OmitReplace<
      DoneActorEvent<T>,
      {
        type: `xstate.done.actor.${Id}`
      }
    >
    type FailDoneActorEv<
      Id extends string,
      T,
    > = OmitReplace<
      ErrorActorEvent<T>,
      {
        type: `xstate.error.actor.${Id}`
      }
    >
    type DoneActorEv<Id extends string, T> =
      | SuccessDoneActorEv<Id, T>
      | FailDoneActorEv<Id, T>

    type InitEv = {type: 'xstate.init'}
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
  type Prettify<T> = {
    [K in keyof T]: T[K]
  } & {}
}

export {}
