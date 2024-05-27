import type {Router} from 'vue-router'

declare global {
  namespace x {
    type xrouter = {
      input: {
        router: Router
      }
      context: {
        router: Router
      }
    }
    type xapp = {
      input: {
        for_router: xrouter['input']
      }
      children: {
        xrouter: 'xrouter'
      }
    }
  }
}

export {}
