import { Card, CardContent, Container, Typography } from '@mui/material';
import { CreateAcount } from './CreateAcount';
import { ProfileImg } from './ProfileImg';

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center">
            プロフィール
          </Typography>
          <ProfileImg />
          <CreateAcount />
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
