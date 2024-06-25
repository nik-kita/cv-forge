import {req} from './req'

export const api_get_all_profiles = () =>
  req.get<'/profiles/'>('/profiles')
