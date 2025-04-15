import Head from 'next/head';
import { PasswordReset } from './PasswordReset';
import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>パスワード再設定</title>
        <meta name="description" content="パスワード再設定" />
      </Head>
      <PasswordReset />
    </div>
  );
};

export default Home;
