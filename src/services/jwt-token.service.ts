export const get_access_token = () => {
  return localStorage.getItem('access_token')
}

export const get_refresh_token = () => {
  return localStorage.getItem('refresh_token')
}

export const update_tokens = (
  payload?: Pick<
    api_deprecated.Res<'post', '/auth/sign-in'>,
    'access_token' | 'refresh_token'
  >,
) => {
  if (payload) {
    localStorage.setItem(
      'access_token',
      payload.access_token,
    )
    localStorage.setItem(
      'refresh_token',
      payload.refresh_token,
    )
  } else {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
}
