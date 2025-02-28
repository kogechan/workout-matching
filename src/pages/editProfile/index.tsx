import { CreateAcount } from '@/pages/editProfile/EditAcount';
import { ProfileImg } from '@/pages/editProfile/ProfileImg';
import { Card, CardContent, Container } from '@mui/material';

const Home = () => {
  return (
    <>
      <Container maxWidth="sm">
        <Card sx={{ mt: 4, p: 3 }}>
          <CardContent>
            <ProfileImg />
            <CreateAcount />
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Home;
