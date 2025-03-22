import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ProfileCard } from './ProfileCard';
import { NextPage } from 'next';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Home: NextPage = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 3 }}>
          <ProfileCard />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Home;
