import type { User } from './auth/user.type'

const APP_STUFF = {
  restore_user() {
    try {
      const data =
        localStorage.getItem(
          'user',
        )
      if (!data) return null

      const candidate =
        new Object(
          JSON.parse(data),
        ) as object
      const user_attributes =
        [] satisfies (keyof User)[]

      if (
        is_obj_with_keys(
          candidate,
          user_attributes,
        )
      ) {
        return candidate as User
      } else {
        throw new Error(
          'Invalid user data => it was cleaned up!',
        )
      }
    } catch (err) {
      console.error(err)
      localStorage.removeItem(
        'user',
      )
      return null
    }
  },
  upsert_user(
    data: Partial<User> | null,
  ) {
    if (!data) {
      localStorage.removeItem(
        'user',
      )
    } else {
      const user =
        this.restore_user() ??
        {}
      const fresh = {
        ...user,
        ...data,
      }
      localStorage.setItem(
        'user',
        JSON.stringify(fresh),
      )
    }
  },
  get_access_token() {
    return localStorage.getItem(
      'access_token',
    )
  },
  get_refresh_token() {
    return localStorage.getItem(
      'refresh_token',
    )
  },
  set_access_token(
    token: string | null,
  ) {
    token
      ? localStorage.setItem(
          'access_token',
          token,
        )
      : localStorage.removeItem(
          'access_token',
        )
  },
  set_refresh_token(
    token: string | null,
  ) {
    token
      ? localStorage.setItem(
          'refresh_token',
          token,
        )
      : localStorage.removeItem(
          'refresh_token',
        )
  },
}

export function use_app_stuff() {
  return APP_STUFF
}

export function _override_app_stuff(
  override: Partial<
    typeof APP_STUFF
  >,
) {
  Object.assign(
    APP_STUFF,
    override,
  )
}
