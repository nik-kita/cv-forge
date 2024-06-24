const api_url = import.meta.env.VITE_API_URL

const api_request = async <
  M extends api.Method,
  E extends api.Endpoint,
>(
  endpoint: string,
  method: 'get' | 'post' | 'put' | 'delete',
  access_token?: string,
  body?: api.Req<M, E>,
  init?: OmitStrict<RequestInit, 'body'>,
  is_json = true,
) => {
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
    access_token: string,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'get', E>(
      endpoint,
      'get',
      access_token,
      undefined,
      init,
    ),

  post: async <E extends api.Endpoint>(
    endpoint: string,
    body: api.Req<'post', E>,
    access_token: string,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'post', E>(
      endpoint,
      'post',
      access_token,
      body,
      init,
    ),

  put: async <E extends api.Endpoint>(
    endpoint: string,
    body: api.Req<'put', E>,
    access_token: string,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'put', E>(
      endpoint,
      'put',
      access_token,
      body,
      init,
    ),

  delete: async <E extends api.Endpoint>(
    endpoint: string,
    access_token: string,
    init?: OmitStrict<RequestInit, 'body'>,
  ) =>
    api_request<'delete', E>(
      endpoint,
      'delete',
      access_token,
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
      undefined,
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
      undefined,
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
      undefined,
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
      undefined,
      undefined,
      init,
      false,
    ),
}
