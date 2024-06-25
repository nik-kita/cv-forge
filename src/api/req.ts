import {get_access_token} from '@/services/jwt-token.service'

const api_url = import.meta.env.VITE_API_URL
const req_config = {
  get_access_token,
}

export const _update_req_config = (
  actual: Partial<typeof req_config>,
) => {
  Object.assign(req_config, actual)
}

const api_request = async <
  M extends api.Method,
  E extends api.Endpoint,
>(
  endpoint: string,
  method: 'get' | 'post' | 'put' | 'delete',
  is_access_token_required: boolean,
  body?: api.Req<M, E>,
  init?: OmitStrict<RequestInit, 'body'>,
  is_json = true,
) => {
  const access_token =
    is_access_token_required &&
    req_config.get_access_token()

  if (is_access_token_required === null) {
    throw new Error('access_token is required')
  }

  const response = await fetch(api_url + endpoint, {
    ...init,
    method,
    body: body && JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
      ...(access_token && {
        Authorization: `Bearer ${access_token}`,
      }),
    },
  })

  if (!response.ok) {
    throw response
  }

  return (is_json ? response.json() : undefined) as Promise<
    api.Res<M, E>
  >
}

export const req = {
  get: async <E extends api.Endpoint>(
    endpoint: string,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'get', E>(
      endpoint,
      'get',
      true,
      undefined,
      init,
    ),

  post: async <E extends api.Endpoint>(
    endpoint: string,
    body: api.Req<'post', E>,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'post', E>(
      endpoint,
      'post',
      true,
      body,
      init,
    ),

  put: async <E extends api.Endpoint>(
    endpoint: string,
    body: api.Req<'put', E>,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'put', E>(
      endpoint,
      'put',
      true,
      body,
      init,
    ),

  delete: async <E extends api.Endpoint>(
    endpoint: string,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'delete', E>(
      endpoint,
      'delete',
      true,
      undefined,
      init,
      false,
    ),
  public_get: async <E extends api.Endpoint>(
    endpoint: string,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'get', E>(
      endpoint,
      'get',
      false,
      undefined,
      init,
    ),

  public_post: async <E extends api.Endpoint>(
    endpoint: string,
    body: api.Req<'post', E>,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'post', E>(
      endpoint,
      'post',
      false,
      body,
      init,
    ),

  public_put: async <E extends api.Endpoint>(
    endpoint: string,
    body: api.Req<'put', E>,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'put', E>(
      endpoint,
      'put',
      false,
      body,
      init,
    ),

  public_delete: async <E extends api.Endpoint>(
    endpoint: string,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'delete', E>(
      endpoint,
      'delete',
      false,
      undefined,
      init,
      false,
    ),
}
