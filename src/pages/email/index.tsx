import { NextPage } from 'next';
import { SendEmail } from './SendEmail';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>メールアドレス確認</title>
        <meta name="description" content="メールアドレス確認" />
      </Head>
      <SendEmail />
    </>
  );
};

export default Home;
