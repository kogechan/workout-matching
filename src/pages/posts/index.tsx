import { PostForm } from './PostForm';
import { PostList } from './PostList';
import { AddPost } from './AddPost';
import { NextPage } from 'next';
import { PostReport } from '@/components/PostReport';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>掲示板</title>
        <meta name="description" content="掲示板" />
      </Head>
      <PostForm />
      <PostList />
      <AddPost />
      <PostReport />
    </>
  );
};

export default Home;
