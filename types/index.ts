export type PageData = {
  title?: string
  content: string
  number: number
  timestamp?: string
}

export type Scope = 'public' | 'login' | 'list' | 'password'

export type Story = {
  id: string
  title?: string
  description?: string
  timestamp?: string
  scope: Scope
  restriction: Boolean
  userId: string
}

export type User = {
  uid: string
  photoURL?: string
  displayName?: string | null
  reloadUserInfo?: {
    screenName?: string | null
  }
}