import { Box } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>お問い合わせ</title>
        <meta name="description" content="お問い合わせ" />
      </Head>
      <Box sx={{ p: 4 }}>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeN-5vgeAYsh6cc2hvL8IJiz0jQfCR6F4RWS3E9S0X_ZPrN-A/viewform?usp=dialog"
          width="100%"
          height="1600"
          title="お問い合わせフォーム"
        >
          読み込んでいます…
        </iframe>
      </Box>
    </>
  );
};

export default Home;
