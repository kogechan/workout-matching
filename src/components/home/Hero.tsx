import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <Box sx={{ width: 1 }}>
      <Box
        sx={{
          position: 'relative',
          mb: 10,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', height: { xs: 300, md: 500 } }}>
          <Image
            src="/home/23209639_l.jpg"
            alt="合トレマッチングサービスKINTAのヘッド画像"
            fill
            style={{ objectFit: 'cover' }}
            priority
            quality={85}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
              p: { xs: 3, md: 6 },
            }}
          >
            <Typography
              variant="h2"
              color="white"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}
            >
              合トレマッチング
            </Typography>
            <Typography
              variant="h1"
              color="white"
              fontWeight="bold"
              sx={{ fontSize: { xs: '3rem', md: '5rem' }, mb: 3 }}
            >
              KINTA
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: '#ff6b00',
                '&:hover': {
                  backgroundColor: '#e56000',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={onGetStarted}
            >
              今すぐ始める
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
