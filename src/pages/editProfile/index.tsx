import { CreateAcount } from '@/components/profile/EditAcount';
import { ProfileImg } from '@/components/profile/ProfileImg';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const steps = ['プロフィール写真', '基本情報', '完了'];

const Home: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [, setCompleted] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = () => {
    setCompleted(true);
  };
  return (
    <>
      <Head>
        <title>プロフィール編集</title>
        <meta name="description" content="プロフィール編集" />
      </Head>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            プロフィール編集
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card sx={{ p: { xs: 2, md: 3 }, boxShadow: 3 }}>
            <CardContent>
              {activeStep === 0 && <ProfileImg />}
              {activeStep === 1 && <CreateAcount />}
              {activeStep === 2 && (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="h5" gutterBottom>
                    内容を確認してください
                  </Typography>
                  <Typography variant="body1" component="p">
                    すべての情報が正しければ「完了」をクリックしてください。
                  </Typography>
                </Box>
              )}

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}
              >
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  戻る
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleComplete();
                        router.push('/profile');
                      }}
                    >
                      完了
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      次へ
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Home;
