import {
  get_refresh_token,
  update_tokens,
} from '@/services/jwt-token.service'
import {
  get_user_info,
  update_user_info,
} from '@/services/user-info.service'
import {computed, ref} from 'vue'

const prev_session = get_refresh_token()
const user = ref<{nik?: string | null}>()
const nik = computed({
  get() {
    return user.value?.nik
  },
  set(nik?: string | undefined | null) {
    if (user.value) {
      user.value = {
        ...user.value,
        nik,
      }
    }
  },
})

if (prev_session) {
  user.value =
    get_user_info() ??
    (get_refresh_token() ? {} : undefined)
}

const is_user = computed(() => {
  if (user.value && get_refresh_token()) {
    return true
  }

  return false
})
const viewer_role = ref<
  'guest::viewer' | 'user::viewer' | 'owner'
>('guest::viewer')
const nik_slug = ref(nik.value)

export const use_xstore = (): x.XStore => {
  return {
    nik_slug,
    is_user,
    user,
    nik,
    viewer_role,
    clean_auth() {
      update_tokens()
      user.value = undefined
    },
    update_auth(
      payload: api_deprecated.Res<'post', '/auth/sign-in'>,
    ) {
      update_tokens(payload)
      const user_info = {nik: payload.nik}
      update_user_info(user_info)
      user.value = user_info
    },
  }
}
