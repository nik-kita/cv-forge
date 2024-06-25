import {req} from './req'

export const api_delete_nik = () =>
  req.delete<'/user/nik'>('/user/nik')
