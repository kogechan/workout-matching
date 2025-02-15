import { PostForm } from './PostForm';
import { PostList } from './PostList';
import { AddPost } from './AddPost';
import { Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" sx={{ my: 2 }}>
        掲示板
      </Typography>
      <PostForm />
      <PostList />
      <AddPost />
    </Container>
  );
};

export default Home;
