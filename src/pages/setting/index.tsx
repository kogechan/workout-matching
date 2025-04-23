import { NextPage } from 'next';
import Head from 'next/head';
import { Setting } from '../../components/other/Setting';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>各種設定</title>
        <meta name="description" content="各種設定" />
      </Head>
      <Setting />
    </>
  );
};

export default Home;
