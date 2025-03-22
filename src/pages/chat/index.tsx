import { NextPage } from 'next';
import ChatRoomsList from './ChatIndex';

const Home: NextPage = () => {
  return (
    <div>
      <ChatRoomsList />
    </div>
  );
};

export default Home;
