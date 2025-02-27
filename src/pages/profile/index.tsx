import { Card, CardContent, Container } from '@mui/material';
import { CreateAcount } from './EditAcount';
import { ProfileImg } from './ProfileImg';

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 4, p: 3 }}>
        <CardContent>
          <ProfileImg />
          <CreateAcount />
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
