import { NextPage } from 'next';
import { SignUp } from '../../components/auth/SignUp';

const Home: NextPage = () => {
  return (
    <div>
      <SignUp />
    </div>
  );
};

export default Home;
