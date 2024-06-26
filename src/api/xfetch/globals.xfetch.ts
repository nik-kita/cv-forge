import {
  get_access_token,
  get_refresh_token,
} from '@/services/jwt-token.service'

export const _xfetch_config = {
  refresh_token_status: 'none' as
    | 'none'
    | 'ready'
    | 'processing'
    | 'fail',
  refresh_waiters: new Map<string, any>(),
  get_refresh_token,
  get_access_token,
}
