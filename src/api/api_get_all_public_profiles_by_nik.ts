import {req} from './req'

export const api_get_all_public_profiles_by_nik = ({
  nik,
}: {
  nik: string
}) => {
  return req.public_get<'/profiles/public/{nik}'>(
    '/profiles/public/' + nik,
  )
}
