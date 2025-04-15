import { NextPage } from 'next';
import ChatRoomsList from './ChatIndex';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>メッセージ一覧</title>
        <meta name="description" content="メッセージ一覧" />
      </Head>
      <ChatRoomsList />
    </>
  );
};

export default Home;
