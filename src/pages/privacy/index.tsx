import { NextPage } from 'next';
import Head from 'next/head';
import { PrivacyPolicyPage } from './Privacy';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>プライバシーポリシー | KINTA</title>
        <meta name="description" content="プライバシーポリシー" />
      </Head>
      <PrivacyPolicyPage />
    </>
  );
};

export default Home;
