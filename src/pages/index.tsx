import {
  Avatar,
  Box,
  Container,
  Typography,
  Button,
  Grid2,
  BottomNavigation,
} from '@mui/material';
import Image from 'next/image';
import { Person } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Head from 'next/head';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Home: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

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
                  onClick={() => router.push('/acount')}
                >
                  今すぐ始める
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

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
            広がる、筋トレの絆
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
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
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
                  KINTAのコンセプトはマッチングサービスですが、多くの方々に誰でも平等に合トレができるようなシステムを提供しています。つまり、合トレしたい気になるユーザーがいれば簡単にメッセージを送ることができます。
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
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
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
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
                  筋トレや合トレのコミュニティなどは至る所に存在しています。KINTAを利用すればより多くのトレーニーや仲間と繋がることができ、新しい出会いや新たなコミュニティを築くことが可能です。
                </Typography>
              </Box>
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
                    paddingBottom: '66.67%', // 3:2のアスペクト比
                    marginBottom: 2,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/home/2025-04-22 20.18の画像.jpg"
                    alt="使い方1"
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                    quality={75}
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  掲示板機能
                </Typography>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  タイムラインに合トレを募集したり、筋トレに関することを呟くことができます。投稿をすることで合トレを最短で行えたり、多くのユーザーと交流をすることが可能です。
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
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
                    paddingBottom: '66.67%', // 3:2のアスペクト比
                    marginBottom: 2,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/home/2025-04-22 20.19の画像.jpg"
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
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
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
                    paddingBottom: '66.67%', // 3:2のアスペクト比
                    marginBottom: 2,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/home/2025-04-22 21.48の画像.jpg"
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
              </Box>
            </Grid2>
          </Grid2>

          {/* 安心安全 */}
          <Box component="section" sx={{ py: 5 }}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              fontWeight="bold"
              sx={{
                mb: 6,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  backgroundColor: 'primary.main',
                  borderRadius: '4px',
                },
              }}
            >
              安心・安全について
            </Typography>

            <Grid2 container spacing={5} sx={{ mb: 5 }}>
              {[
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
              ].map((item, index) => (
                <Grid2 size={{ xs: 12, md: 4 }} key={index}>
                  <Box sx={{ height: '100%' }}>
                    {/* 画像部分 */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 0,
                        paddingBottom: '66.67%',
                        overflow: 'hidden',
                        borderRadius: 2, // 画像だけ角丸に
                        mb: 2, // 画像と文字の間にマージン
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

                    {/* テキスト部分 - 影や背景色なし */}
                    <Typography
                      variant="h6"
                      component="h3"
                      fontWeight="bold"
                      align="center" // 中央揃え
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center" // 中央揃え
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Box>

          <Box
            sx={{
              p: { xs: 4, md: 8 },
              position: 'relative',
              textAlign: 'center',
              borderRadius: 2,
              color: 'white',
              mt: 6,
              mb: 4,
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
              onClick={() => router.push('/acount')}
            >
              無料で登録する
            </Button>
          </Box>
        </Container>
        <Box
          component="footer"
          sx={{
            bottom: 0,
            left: 0,
            width: '100%',
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: (theme) => theme.zIndex.appBar,
          }}
        >
          <BottomNavigation
            showLabels
            sx={{
              justifyContent: 'center',
              gap: { xs: 2, sm: 3, md: 4 }, // 画面幅に応じてリンク間隔
              py: { xs: 1, sm: 1.5 },

              '& a': {
                px: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                color: 'text.secondary',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s ease',

                '&:hover, &:focus-visible': {
                  color: 'primary.main',
                  outline: 'none',
                },
              },
            }}
          >
            <Link href="/terms" passHref legacyBehavior>
              <Typography component="a">利用規約</Typography>
            </Link>

            <Link href="/privacy" passHref legacyBehavior>
              <Typography component="a">プライバシーポリシー</Typography>
            </Link>

            <Typography
              component="a"
              href="https://docs.google.com/forms/d/e/1FAIpQLSeN-5vgeAYsh6cc2hvL8IJiz0jQfCR6F4RWS3E9S0X_ZPrN-A/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
            >
              お問い合わせ
            </Typography>
          </BottomNavigation>
        </Box>
      </Box>
    </>
  );
};

export default Home;
