import { PostForm } from './PostForm';
import { PostList } from './PostList';
import { AddPost } from './AddPost';
import { NextPage } from 'next';
import { PostReport } from '@/components/PostReport';

const Home: NextPage = () => {
  return (
    <>
      <PostForm />
      <PostList />
      <AddPost />
      <PostReport />
    </>
  );
};

export default Home;
