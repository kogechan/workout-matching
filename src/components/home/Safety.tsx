import { Box, Typography, Grid2 } from '@mui/material';
import Image from 'next/image';
import SectionTitle from './common/SectionTitle';

interface SafetyItem {
  image: string;
  title: string;
  description: string;
}

const safetyItems: SafetyItem[] = [
  {
    image: '/home/image2.png',
    title: 'サイト内の監視',
    description:
      'サイト内を監視し、不適切な投稿や悪質なユーザーを迅速に対応します。',
  },
  {
    image: '/home/image.png',
    title: 'サポート体制',
    description:
      '報告機能や問い合わせ機能で、あらゆる問題に迅速に対応いたします。',
  },
  {
    image: '/home/image3.png',
    title: '実名は非公開',
    description:
      'ニックネームでの登録が可能なため、安心してご利用いただけます。',
  },
];

const Safety = () => {
  return (
    <Box component="section" sx={{ py: 5 }}>
      <SectionTitle title="安心・安全について" />

      {/* デスクトップ表示 */}
      <Grid2
        container
        spacing={5}
        sx={{ mb: 5, display: { xs: 'none', md: 'flex' } }}
      >
        {safetyItems.map((item, index) => (
          <Grid2 size={{ xs: 12, md: 4 }} key={index}>
            <Box sx={{ height: '100%' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  paddingBottom: '66.67%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  quality={90}
                />
              </Box>

              <Typography
                variant="h6"
                component="h3"
                fontWeight="bold"
                align="center"
                gutterBottom
              >
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
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
          mb: 5,
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
          {safetyItems.map((item, index) => (
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
    </Box>
  );
};

export default Safety;
