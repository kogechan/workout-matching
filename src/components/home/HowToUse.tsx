import { Box, Typography, Grid2 } from '@mui/material';
import Image from 'next/image';
import SectionTitle from './common/SectionTitle';

interface UsageItem {
  image: string;
  title: string;
  description: string;
}

const usageItems: UsageItem[] = [
  {
    image: '/home/2025-04-22 20.18の画像.jpg',
    title: '掲示板機能',
    description:
      'タイムラインに合トレを募集したり、筋トレに関することを呟くことができます。投稿をすることで合トレを最短で行えたり、多くのユーザーと交流をすることが可能です。',
  },
  {
    image: '/home/2025-04-22 20.19の画像.jpg',
    title: 'ユーザー検索機能',
    description:
      '合トレしたい仲間を見つけたい時などに最も有効です。マッチしたい、合トレしたいユーザーを特定の条件でフィルタリングして探すことが可能です。',
  },
  {
    image: '/home/2025-04-22 21.48の画像.jpg',
    title: 'メッセージ機能',
    description:
      '気になるユーザーや合トレしたいと思うユーザーに自由にメッセージを送ることができます。いきなり会うのが不安という方もメッセージで仲を深めてから合トレすることが可能です。',
  },
];

const HowToUse = () => {
  return (
    <>
      <SectionTitle title="使い方" />

      {/* デスクトップ表示 */}
      <Grid2
        container
        spacing={3}
        sx={{ mb: 10, display: { xs: 'none', md: 'flex' } }}
      >
        {usageItems.map((item, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Box
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  paddingBottom: '66.67%',
                  marginBottom: 2,
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  quality={75}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {item.description}
              </Typography>
            </Box>
          </Grid2>
        ))}
      </Grid2>

      {/* モバイル表示 - 横スクロール */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          mb: 10,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '40px',
            height: '100%',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            pb: 2,
          }}
        >
          {usageItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: '0 0 85%',
                scrollSnapAlign: 'center',
                p: 3,
                mr: 2,
                minWidth: '280px',
                maxWidth: '350px',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  paddingBottom: '66.67%',
                  marginBottom: 2,
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  quality={75}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2">{item.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default HowToUse;
