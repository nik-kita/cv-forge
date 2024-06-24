import type {DoneActorEvent, ErrorActorEvent} from 'xstate'

declare global {
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
