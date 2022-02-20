import { getAuth } from 'firebase/auth';
import Router from "next/router";
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '../firebase/clientApp';

type Props = {
  redirectTo?: string,
  redirectIfFound?: boolean
}
export default function useUser({
  redirectTo ="",
  redirectIfFound =false,
}: Props = {}) {
  const [user, loading, error] = useAuthState(getAuth(firebase))

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || loading) {
      return
    }
 
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user)
    ) {
      Router.push(redirectTo);
    }
  }, [user, loading, redirectIfFound, redirectTo]);

  return [user, loading, error]
}
