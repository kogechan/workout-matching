import type { AppProps } from 'next/app';
import { Header } from '@/layout/Header';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { currentUserAtom } from '@/jotai/Jotai';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121',
      paper: '#1d1d1d',
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
});

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
        <ThemeProvider theme={darkTheme}>
          <CssBaseline /> {/* MUIのリセットCSS */}
          <Component {...pageProps} />
        </ThemeProvider>
      </main>
    </div>
  );
}
