import type { AppProps } from 'next/app';
import { Header } from '@/layout/Header';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { currentUserAtom } from '@/jotai/Jotai';

export default function App({ Component, pageProps }: AppProps) {
  const [, setCurrentUserId] = useAtom(currentUserAtom);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };

    fetchUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setCurrentUserId(session.user?.id || null);
        } else {
          setCurrentUserId(null);
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [setCurrentUserId]);

  return (
    <div>
      {/* グローバルスタイル設定 */}
      <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
