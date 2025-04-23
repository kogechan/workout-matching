import { NextPage } from 'next';
import LikeList from '../../components/like/LikeList';
import Head from 'next/head';
import { Box, Container } from '@mui/material';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>いいね一覧</title>
        <meta name="description" content="いいねの一覧を表示します" />
      </Head>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <LikeList />
        </Box>
      </Container>
    </>
  );
};

export default Home;
