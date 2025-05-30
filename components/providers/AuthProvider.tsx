'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      const setNewSession = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token,
          });

          if (error) {
            console.error('Error setting session from token:', error.message);
          } else if (data.session) {
            setSession(data.session);
            setUser(data.session.user ?? null);
          } else {
            console.warn('No session returned after setting token, token might be invalid.');
          }
        } catch (e: any) {
          console.error('Exception during setSession with token:', e.message);
        } finally {
          router.replace(pathname, { scroll: false });
        }
      };
      setNewSession();
    }
  }, [searchParams, router, pathname]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
        return;
    }

    const getSession = async () => {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [searchParams]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 