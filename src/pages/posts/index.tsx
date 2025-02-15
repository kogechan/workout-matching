import { PostForm } from './PostForm';
import { PostList } from './PostList';
import { AddPost } from './AddPost';

const Home = () => {
  return (
    <div>
      <h1>掲示板</h1>
      <PostForm />
      <PostList />
      <AddPost />
    </div>
  );
};

export default Home;
