import {req} from './req'

export const api_user_update_nik = ({
  access_token,
  nik,
}: {
  nik: string
  access_token: string
}) =>
  req.put<'/user/nik/{nik}'>(
    '/user/nik/' + nik,
    {},
    access_token,
  )
