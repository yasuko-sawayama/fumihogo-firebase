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
  restriction: Boolean
  timestamp?: string
  totalPages: number
}

export type Author = {
  uid: string
  photoURL?: string | null
  displayName?: string | null
  twitterScreenName?: string
}

export type User = {
  uid: string
  photoURL?: string | null
  displayName?: string | null
  reloadUserInfo?: {
    screenName?: string | null
  }
}
