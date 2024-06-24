import {req} from './req'

export const api_delete_nik = ({
  access_token,
}: {
  access_token: string
}) => req.delete<'/user/nik'>('/user/nik', access_token)
