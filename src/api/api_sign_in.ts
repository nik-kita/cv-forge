import {req} from './req'

export const api_sign_in = (
  payload: api.Req<'post', '/auth/sign-in'>,
) =>
  req.public_post<'/auth/sign-in'>('/auth/sign-in', payload)
