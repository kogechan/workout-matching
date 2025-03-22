import { NextPage } from 'next';
import { SendEmail } from './SendEmail';

const Home: NextPage = () => {
  return (
    <div>
      <SendEmail />
    </div>
  );
};

export default Home;
