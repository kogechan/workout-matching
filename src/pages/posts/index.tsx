import { PostForm } from '../../components/post/PostForm';
import { PostList } from '../../components/post/PostList';
import { AddPost } from '../../components/post/AddPost';
import { NextPage } from 'next';
import { PostReport } from '@/components/Report/PostReport';
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
