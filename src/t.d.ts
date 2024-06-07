import type {
  RouteLocationNormalized,
  Router,
} from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    x_nav_ev_name: x.xrouter.events['type']
    username_slug?: {
      required: boolean
    }
    is_public: boolean
  }
}

declare global {
  namespace x.xrouter.username_slugger {
    type types = {
      input: input
      context: context
    }
    type input = {
      is_user: boolean
      own_username?: string
      route: {
        to: RouteLocationNormalized
      }
    }
    type context = input
  }
  namespace x.xrouter {
    type types = {
      input: input
      context: context
      events: events
      children: {
        username_slugger: 'username_slugger'
      }
    }
    type input = {
      router: Router
      is_user: () => boolean
      get_username: () => string | undefined
    }
    type context = input & {
      navigation: {
        allow: boolean
      }
    }
    type events =
      | {
          type: '_.nav.to'
          payload: {
            to: RouteLocationNormalized
            from?: RouteLocationNormalized
          }
        }
      | {
          type: 'nav.to.Home'
          payload: {
            path: string
          }
        }
      | {
          type: 'nav.to.Profiles[username]'
          payload: {
            path: string
          }
        }
      | {
          type: 'nav.to.Profile[name]'
          payload: {
            path: string
          }
        }
      | {
          type: 'nav.to.Profile[name][username]'
          payload: {
            path: string
          }
        }
      | {
          type: 'nav.to.Settings'
          payload: {
            path: string
          }
        }
  }
  namespace x.xapp {
    type types = {
      input: input
      context: context
      children: children
    }
    type input = {
      for_router: xrouter['input']
    }
    type context = {}
    type children = {
      xrouter: 'xrouter'
    }
  }
}

export {}
