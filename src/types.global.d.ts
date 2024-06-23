import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    x_event: string
    public: boolean
  }
}

declare global {
  type User = {
    username?: string
  }
}

export {}
