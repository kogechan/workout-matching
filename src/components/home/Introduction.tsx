import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import SectionTitle from '@/components/home/common/SectionTitle';

const Introduction = () => {
  return (
    <>
      <SectionTitle title="広がる、筋トレの絆" subtitle="KINTAについて" />

      {/* 特徴説明１ */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 3, md: 6 },
          mb: 8,
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            position: 'relative',
          }}
        >
          <Image
            src="/home/3A9D89B3-FE6A-4EC3-8FE2-076D79B8CA47_1_105_c.jpeg"
            alt="合トレ画像１"
            width={500}
            height={350}
            style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            quality={80}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            筋トレをする仲間、友達を作る
          </Typography>
          <Typography variant="body1" component="p" sx={{ mb: 2 }}>
            一緒に気軽に筋トレができる仲間,友達が欲しいと思ったことはありませんか？
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            KINTAは合トレのみにフォーカスを当てたマッチングサービスです。
          </Typography>
          <Typography variant="body1">
            今以上に筋肉を大きくしたい、これから大会に出たい、これから筋トレを頑張っていきたい、合トレであればどのような目的でも構いません。同じような志を持った仲間と繋がることができます。
          </Typography>
        </Box>
      </Box>

      {/* 特徴説明２ */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          alignItems: 'center',
          gap: { xs: 3, md: 6 },
          mb: 8,
        }}
      >
        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            誰ともマッチ可能
          </Typography>
          <Typography variant="body1" component="p" sx={{ mb: 2 }}>
            KINTAでは男性同士、女性同士、異性とのマッチングが可能となっております。
          </Typography>
          <Typography variant="body1">
            異性とのマッチングは不安、同性のみでガッツリと合トレをしていきたいという方もご安心してお使いいただけます。
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            position: 'relative',
          }}
        >
          <Image
            src="/home/C232BCF6-4B00-415B-A601-7973E28DBC5C_1_105_c.jpeg"
            alt="合トレ画像2"
            width={500}
            height={350}
            style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            quality={80}
          />
        </Box>
      </Box>
    </>
  );
};

export default Introduction;
