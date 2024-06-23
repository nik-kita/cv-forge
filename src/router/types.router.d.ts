import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    x_event:
      | 'nav.Home'
      | 'nav.ProfilesList'
      | 'nav.SingleProfile'
    public: boolean
  }
}

export {}
