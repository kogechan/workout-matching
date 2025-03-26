import { PostForm } from './PostForm';
import { PostList } from './PostList';
import { AddPost } from './AddPost';
import { NextPage } from 'next';
import { Report } from '@/components/Report';

const Home: NextPage = () => {
  return (
    <>
      <PostForm />
      <PostList />
      <AddPost />
      <Report />
    </>
  );
};

export default Home;
