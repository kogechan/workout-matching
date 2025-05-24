import { NextPage } from 'next';
import { BlockList } from '@/components/block/BlockList';
import { UserUnblock } from '@/components/block/UserUnblock';

const Home: NextPage = () => {
  return (
    <>
      <BlockList />
      <UserUnblock />
    </>
  );
};

export default Home;
