import type {
  Router,
  RouteLocationNormalized,
} from 'vue-router'

declare global {
  namespace x.xrouter {
    type types = {
      input: input
      context: context
      event: event
    }
    type input = {
      router: Router
    }
    type context = {
      router: Router
      allow_navigation: boolean
    }
    type event =
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
