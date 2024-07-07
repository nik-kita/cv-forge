import { url_param_replacer } from '@/utils/url-params-replacer.util'
import {
  createActor,
  fromPromise,
  waitFor,
} from 'xstate'
import type { api } from './api.namespace'
import { xfetch } from './xfetch'

export function xapi<
  M extends api.Method,
  P extends api.Path,
>(
  {
    method,
    path,
  }: api.Req<M, P> extends {
    ERROR: string
  }
    ? api.Req<
        M,
        P
      >['ERROR'] & {
        method: M
        path: P
      }
    : {
        method: M
        path: P
      },
  {
    is_private,
    exception_in_body,
    res_as,
  }: (api.Req<M, P> extends {
    headers?:
      | {
          authorization?: never
        }
      | never
  }
    ? { is_private: false }
    : api.Req<M, P> extends {
          headers: {
            authorization: string
          }
        }
      ? {
          headers: OmitStrict<
            api.Req<
              M,
              P
            >['headers'],
            'authorization'
          >
          is_private?: true
        }
      : {
          is_private?: true
        }) & {
    res_as?: null | 'json'
  } & {
    exception_in_body?: boolean
  },
) {
  return fromPromise<
    api.Res<M, P>,
    OmitStrict<
      api.Req<M, P>,
      'method' | 'path'
    > &
      (api.Req<
        M,
        P
      >['headers'] extends {
        headers: {
          authorization: string
        }
      }
        ? Omit<
            Pick<
              api.Req<M, P>,
              'headers'
            >,
            'authorization'
          >
        : Pick<
            api.Req<M, P>,
            'headers'
          >)
  >(async ({ input }) => {
    const {
      headers,
      params,
      body,
      qs,
    } = input

    if (!path || !method) {
      throw new Error(
        'Missing path or method',
      )
    }

    const actor = createActor(
      xfetch.machine,
      {
        input: {
          is_private:
            is_private ??
            undefined,
          res_as,
          exception_in_body,
          payload: {
            body,
            method,
            headers,
            params,
            qs,
            path: (params
              ? url_param_replacer(
                  path,
                  params as any,
                )
              : path) as any,
          } as any,
        },
      },
    )
    actor.start()
    const snapshot =
      await waitFor(
        actor,
        s =>
          s.status === 'done',
      )

    const output =
      snapshot.output
    if (
      output?._ === 'success'
    ) {
      return output.success as api.Res.Success<
        M,
        P
      >
    } else if (
      output?._ ===
      'exception'
    ) {
      throw output.exception as api.Res.Fail<
        M,
        P
      >
    } else {
      throw output?.error
    }
  })
}
