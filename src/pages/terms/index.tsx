import { NextPage } from 'next';
import Head from 'next/head';
import { TermsPage } from '../../components/other/Terms';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>利用規約 | KINTA</title>
        <meta name="description" content="利用規約" />
      </Head>
      <TermsPage />
    </>
  );
};

export default Home;
