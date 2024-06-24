import {req} from './req'

export const api_get_all_profiles = ({
  access_token,
}: {
  access_token: string
}) => req.get<'/profiles/'>('/profiles', access_token)
