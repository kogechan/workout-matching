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
    const initializeAuth = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setCurrentUserId(userData.user.id);
      }
    };

    initializeAuth();
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
