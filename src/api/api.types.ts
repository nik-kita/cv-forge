import type {paths} from './openapi'

export namespace api {
  export type Endpoint = keyof paths
  export type Method = 'get' | 'post' | 'put' | 'delete'
  export type Req<
    T extends Method,
    U extends Endpoint,
  > = (paths[U][T] extends (
    infer B extends {
      requestBody: {
        content: {
          'application/json': unknown
        }
      }
    }
  ) ?
    {body: B['requestBody']['content']['application/json']}
  : {}) &
    (paths[U][T] extends (
      infer H extends {
        parameters: {
          header: object
        }
      }
    ) ?
      {headers: H['parameters']['header']}
    : {}) &
    (paths[U][T] extends (
      infer P extends {
        parameters: {
          path: object
        }
      }
    ) ?
      {params: P['parameters']['path']}
    : {}) &
    (paths[U][T] extends (
      infer Q extends {
        parameters: {
          query: object
        }
      }
    ) ?
      {qs: Q['parameters']['query']}
    : {}) & {
      method: T
      endpoint: U
    }
}
