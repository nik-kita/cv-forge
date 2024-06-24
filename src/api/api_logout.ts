import {req} from './req'

export const api_logout = () =>
  req.public_post<'/auth/logout'>('/auth/logout', {})
