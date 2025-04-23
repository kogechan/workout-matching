import Head from 'next/head';
import { ProfileCard } from '../../components/profile/ProfileCard';
import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>プロフィール情報</title>
        <meta name="description" content="プロフィール情報" />
      </Head>
      <ProfileCard />
    </>
  );
};

export default Home;
