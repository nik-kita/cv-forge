import {fromPromise} from 'xstate'

export const fn_to_promise_logic = <
  T extends (...arg: any[]) => any | Promise<any>,
>(
  fn: T,
) => {
  return fromPromise<Awaited<ReturnType<T>>, Parameters<T>>(
    async ({input}) => {
      const result = await fn(...input)

      return result
    },
  )
}
