import {req} from './req'

export const api_user_update_nik = (nik: string) =>
  req.put<'/user/nik/{nik}'>('/user/nik/' + nik, {})
