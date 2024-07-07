import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

export const init_router =
  () =>
    createRouter({
      history:
        createWebHistory(
          import.meta.env
            .BASE_URL,
        ),
      routes: [
        {
          path: '/',
          redirect: '/home',
        },
        {
          path: '/:pathMatch(.*)*',
          redirect: '/home',
        },
        {
          path: '/home/:nik?',
          component: HomePage,
          meta: {
            public: true,
            x_event:
              'nav.Home',
          },
        },
        {
          path: '/profiles/:nik?',
          component: () =>
            import(
              '@/pages/ProfilesListPage.vue'
            ),
          meta: {
            public: true,
            x_event:
              'nav.ProfilesList',
          },
        },
        {
          path: '/profile/:name/:nik?',
          component: () =>
            import(
              '@/pages/SingleProfilePage.vue'
            ),
          meta: {
            public: true,
            x_event:
              'nav.SingleProfile',
          },
        },

        {
          path: '/about',
          name: 'about',
          component: () =>
            import(
              '@/pages/AboutPage.vue'
            ),
        },
      ],
    })
