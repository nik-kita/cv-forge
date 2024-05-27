import type {Router} from 'vue-router'

declare global {
  namespace x {
    type xrouter = {
      input: {
        router: Router
      }
      context: {
        router: Router
        allow_navigation: boolean
      }
    }
    type xapp = {
      input: {
        for_router: xrouter['input']
      }
      context: {}
      children: {
        xrouter: 'xrouter'
      }
    }
  }
}

export {}
