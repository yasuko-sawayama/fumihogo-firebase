export type PageData = {
  content: string
  number: number
}

export type Scope = 'public' | 'login' | 'list' | 'password'

export type Story = {
  id: string
  title: string
  description?: string
  timestamp?: Date
  scope: Scope
  restriction: Boolean
}
