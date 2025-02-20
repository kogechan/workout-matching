import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

export function useUser() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      setUser(
        session?.session?.user
          ? {
              id: session.session.user.id,
              email: session.session.user.email ?? '',
            }
          : null
      );
      setLoading(false);
    };
    fetchUser();

    // Supabase の認証状態が変更されたときにユーザー情報を更新
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('ログアウトしました');
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
