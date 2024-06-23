import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/home/:username?',
      component: {
        template: '<h1>Home</h1>',
      },
      meta: {
        public: true,
        x_event: 'nav.Home',
      },
    },
    {
      path: '/profiles/:username?',
      component: {
        template: '<h1>Profiles list</h1>',
      },
      meta: {
        public: true,
        x_event: 'nav.ProfilesList',
      },
    },
    {
      path: '/profile/:name/:username?',
      component: {
        template: '<h1>Single profile</h1>',
      },
      meta: {
        public: true,
        x_event: 'nav.SingleProfile',
      },
    },
  ],
})

export default router
