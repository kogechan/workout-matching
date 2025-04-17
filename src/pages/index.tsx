import {
  Avatar,
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid2,
} from '@mui/material';
import Image from 'next/image';
import { Person } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Head from 'next/head';
import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <title>KINTA | 合トレ仲間を探すなら</title>
        <meta name="description" content="筋トレ仲間を見つけよう！" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box
        component="main"
        sx={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <Container
          sx={{ width: { md: 1200, sm: 700, xs: 420 } }}
          disableGutters
        >
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              mb: 10,
              borderRadius: 2,
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
                  合トレマッチングサービス
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
                >
                  今すぐ始める
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>

        <Container maxWidth="lg">
          {/* サービス紹介セクション */}
          <Typography
            component="h2"
            align="center"
            fontWeight="bold"
            sx={{
              mb: { xs: 6, md: 10 },
              typography: { md: 'h3', xs: 'h4' },
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                backgroundColor: 'primary.main',
                borderRadius: '2px',
              },
            }}
          >
            叶える、筋トレ仲間作り
          </Typography>

          <Typography
            align="center"
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
            sx={{ mb: 6 }}
          >
            KINTAについて
          </Typography>

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
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
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
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
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

          {/* メリット紹介 */}
          <Typography
            variant="h4"
            component="h2"
            align="center"
            fontWeight="bold"
            sx={{
              mt: 10,
              mb: 6,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                backgroundColor: 'primary.main',
                borderRadius: '2px',
              },
            }}
          >
            KINTAのメリット
          </Typography>

          <Grid2 container spacing={4} sx={{ mb: 10 }}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    簡単マッチング
                  </Typography>
                </Box>
                <Typography variant="body1">
                  KINTAのコンセプトはマッチングサービスですが、多くの方々に誰でも平等にマッチできるようなシステムを提供しています。つまり、合トレしたい気になるユーザーがいれば簡単にメッセージを送ることができます。
                </Typography>
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <PsychologyIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    体とマインドの成長
                  </Typography>
                </Box>
                <Typography variant="body1">
                  合トレをすることによって一人で筋トレしている時では得られない知識や経験、刺激を得ることができます。体だけなくマインドも共に成長させることが可能です。
                </Typography>
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <PeopleIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    新しい出会い
                  </Typography>
                </Box>
                <Typography variant="body1">
                  筋トレや合トレのコミュニティなどは至る所に存在しています。KINTAを利用すればより多くのトレーニーや仲間と繋がることができ、新しい出会いや新たなコミュニティを築くことも可能です。
                </Typography>
              </Paper>
            </Grid2>
          </Grid2>

          {/* 使用方法 */}
          <Typography
            variant="h4"
            component="h2"
            align="center"
            fontWeight="bold"
            sx={{
              mb: 6,
              mt: 15,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                backgroundColor: 'primary.main',
                borderRadius: '2px',
              },
            }}
          >
            使い方
          </Typography>

          <Grid2 container spacing={3} sx={{ mb: 10 }}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingBottom: '66.67%', // 3:2のアスペクト比
                    marginBottom: 2,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/images/team-1.jpg"
                    alt="使い方1"
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                    quality={75}
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  合トレ募集機能
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  掲示板に合トレを募集することができます。いつでも募集をかけたり、募集を閲覧することが可能なので気軽に最短で合トレをすることも可能です。
                </Typography>
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingBottom: '66.67%', // 3:2のアスペクト比
                    marginBottom: 2,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/images/team-2.jpg"
                    alt="使い方2"
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                    quality={75}
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  ユーザー検索機能
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  合トレしたい仲間を見つけたい時などに最も有効です。マッチしたい、合トレしたいユーザーを特定の条件でフィルタリングして探すことが可能です。
                </Typography>
              </Paper>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingBottom: '66.67%', // 3:2のアスペクト比
                    marginBottom: 2,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/images/team-3.jpg"
                    alt="使い方3"
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                    quality={75}
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  メッセージ機能
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  気になるユーザーや合トレしたいと思うユーザーに自由にメッセージを送ることができます。いきなり会うのが不安という方もメッセージで仲を深めてから合トレすることが可能です。
                </Typography>
              </Paper>
            </Grid2>
          </Grid2>

          <Paper
            sx={{
              p: { xs: 4, md: 8 },
              position: 'relative',
              textAlign: 'center',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)',
              color: 'white',
              mt: 6,
              mb: 4,
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
            >
              さあ、始めよう
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '700px', mx: 'auto' }}>
              理想の合トレがあなたの成長へと導きます。
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}
            >
              今すぐKINTAで合トレ仲間を見つけましょう。
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#f0f0f0',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              無料で登録する
            </Button>
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
              }}
            >
              <Typography
                sx={{ typography: { md: 'body2', xs: 'caption' } }}
                color="rgba(255,255,255,0.8)"
                align="center"
              >
                <Link href="/terms">利用規約</Link> |{' '}
                <Link href="/privacy">プライバシーポリシー</Link> |{' '}
                <Link href="/contactForm">お問い合わせ</Link>
              </Typography>{' '}
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Home;
