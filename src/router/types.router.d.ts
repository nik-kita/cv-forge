import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    x_event: string
    public: boolean
  }
}

export {}
