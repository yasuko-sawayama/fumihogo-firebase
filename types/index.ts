export type Page = {
  title?: string
  content: string
  number: number
  timestamp?: string
}

export type Scope = 'public' | 'login' | 'list' | 'password'

export type Story = {
  id?: string
  title: string
  userId: string
  author: Author
  scope: Scope
  description?: string
  restriction: boolean
  timestamp?: string
  totalPages: number
}

export type Author = User

export type User = {
  uid: string
  photoURL?: string | null
  displayName?: string | null
  twitterScreenName?: string | null
}

// 強引にキャストする用
export type TwitterAuthUser = {
  uid: string
  photoURL?: string | null
  displayName?: string | null
  reloadUserInfo?: {
    screenName: string
  }
}
