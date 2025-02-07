import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

export function useUser() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(
        data?.user ? { id: data.user.id, email: data.user.email ?? '' } : null
      );
    };
    fetchUser();
  }, []);

  return user;
}
