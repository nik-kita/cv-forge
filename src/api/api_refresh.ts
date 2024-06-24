import {req} from './req'

export const api_refresh = (refresh_token: string) => {
  return req.public_post<'/auth/refresh'>('/auth/refresh', {
    refresh_token,
  })
}
