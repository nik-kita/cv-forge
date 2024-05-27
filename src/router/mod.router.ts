import ProfilesPage from '@/page/profiles/ProfilesPage.vue'
import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/profiles',
    },
    {
      path: '/profiles',
      component: ProfilesPage,
    },
    {
      path: '/settings',
      component: () =>
        import('@/page/settings/SettingsPage.vue'),
    },
  ],
})

export default router
