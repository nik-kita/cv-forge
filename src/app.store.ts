import { defineStore } from 'pinia'
import {
  computed,
  ref,
} from 'vue'
import { use_app_stuff } from './app.stuff'
import type { User } from './auth/user.type'
import type { ViewerRole } from './auth/user-role.type'

const app_stuff =
  use_app_stuff()
let restored_user =
  app_stuff.restore_user()
if (
  !app_stuff.get_refresh_token()
) {
  restored_user = null
  app_stuff.upsert_user(null)
}
export const use_app_store =
  defineStore('app', () => {
    const user =
      ref<User | null>(
        restored_user,
      )
    const nik = computed({
      get() {
        return user.value?.nik
      },
      set(
        nik:
          | string
          | null
          | undefined,
      ) {
        if (user.value) {
          user.value = {
            ...user.value,
            nik,
          }
          app_stuff.upsert_user(
            { nik },
          )
        }
      },
    })
    const nik_slug = ref(
      nik.value,
    )
    const viewer_role =
      ref<ViewerRole>('guest')
    return {
      user,
      nik,
      nik_slug,
      viewer_role,
    }
  })
