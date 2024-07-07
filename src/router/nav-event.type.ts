export type NavEvent =
  | {
      type: 'nav.Home'
      path: string
    }
  | {
      type: 'nav.ProfilesList'
      path: string
    }
  | {
      type: 'nav.SingleProfile'
      path: string
    }
  | {
      type: 'nav.About'
      path: string
    }
