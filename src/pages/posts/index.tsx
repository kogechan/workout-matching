import { PostForm } from './PostForm';
import { PostList } from './PostList';

const Home = () => {
  return (
    <div>
      <h1>掲示板</h1>
      <PostForm />
      <PostList />
    </div>
  );
};

export default Home;
