import { AuthSession, AuthUser } from "@supabase/supabase-js";
import { ReactNode, createContext, useEffect, useState } from "react";

import { supabase } from "@/src/lib/supabase";

export const AuthContext = createContext<{
  session: AuthSession | null;
  user: AuthUser | null;
  isSignedIn: boolean;
  signIn: ({
    session,
    user,
  }: {
    session: AuthSession | null;
    user: AuthUser | null;
  }) => void;
  signOut: () => void;
}>({
  isSignedIn: false,
  session: null,
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  async function signIn({
    session,
    user,
  }: {
    session: AuthSession | null;
    user: AuthUser | null;
  }) {
    setSession(session);
    setUser(user);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setSession(null);
    setUser(null);

    if (error) {
      console.error(error);
    }
  }

  async function getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error(error);
      signOut();
    } else {
      setSession(data.session);
    }
  }

  async function getUser() {
    if (session) {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        signOut();
      } else {
        setUser(data.user);
      }
    }
  }

  useEffect(() => {
    if (!session) getSession();
    if (session && !user) getUser();
    if (session && user) setIsSignedIn(true);
    if (!session || !user) setIsSignedIn(false);
  }, [session, user]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isSignedIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
