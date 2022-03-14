import { useAuthUser } from 'next-firebase-auth'
import Router from 'next/router'
import { useEffect } from 'react'

type Props = {
  redirectTo?: string
  redirectIfFound?: boolean
}

export default function useUser({
  redirectTo = '',
  redirectIfFound = false,
}: Props = {}) {
  const user = useAuthUser()

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    if (!redirectTo) {
      return
    }

    if (
      // If redirectTo is set, redirect if the user was not found.
      (!redirectIfFound && !user.id) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user.id)
    ) {
      Router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo])

  return user
}
