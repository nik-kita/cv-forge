import 'vue-router'
import type { NavEvent } from './nav-event.type'

declare module 'vue-router' {
  interface RouteMeta {
    x_event: NavEvent['type']
    public: boolean
  }
}

export {}
