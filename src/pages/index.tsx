// pages/index.tsx
import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';

// Import components
import Hero from '@/components/home/Hero';
import Introduction from '@/components/home/Introduction';
import Benefits from '@/components/home/Benefits';
import HowToUse from '@/components/home/HowToUse';
import Safety from '@/components/home/Safety';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/home/Footer';

const Home: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <title>KINTA（キンタ） 合トレ・筋トレマッチングサイト</title>
        <meta name="description" content="合トレ・筋トレマッチングサイト" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box
        component="main"
        sx={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <Hero onGetStarted={() => router.push('/acount')} />

        <Container maxWidth="lg">
          <Introduction />
          <Benefits />
          <HowToUse />
          <Safety />
          <CallToAction onRegister={() => router.push('/acount')} />
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default Home;
