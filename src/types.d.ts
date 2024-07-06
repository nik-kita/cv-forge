declare global {
  type something =
    | null
    | undefined
    | string
    | number
    | boolean
    | object

  type Tail<T extends any[]> =
    T extends [
      infer _first,
      ...infer Rest,
    ]
      ? Rest
      : never
  type OmitStrict<
    T extends Record<
      string,
      any
    >,
    K extends keyof T,
  > = Omit<T, K> &
    Partial<Record<K, never>>
  type OmitReplace<
    T extends Record<
      string,
      any
    >,
    U extends Partial<
      Record<keyof T, any>
    >,
  > = Omit<T, keyof U> & U

  type AddOrReplace<
    T extends Record<
      string,
      any
    >,
    U extends Record<
      string,
      any
    >,
  > = Omit<T, keyof U> & U
  type Prettify<T> = {
    [K in keyof T]: T[K]
  } & {}
  type ResolveCb<T = any> =
    Parameters<
      ConstructorParameters<
        typeof Promise<T>
      >[0]
    >[0]
  type RejectCb = Parameters<
    ConstructorParameters<
      typeof Promise
    >[0]
  >[1]
}

export {}
