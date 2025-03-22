import { PostForm } from './PostForm';
import { PostList } from './PostList';
import { AddPost } from './AddPost';
import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <PostForm />
      <PostList />
      <AddPost />
    </>
  );
};

export default Home;
