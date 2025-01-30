import type { AppProps } from 'next/app';
import { Header } from '@/layout/Header';
import GlobalStyles from '@mui/material/GlobalStyles';

export default function App({ Component, pageProps }: AppProps) {
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
