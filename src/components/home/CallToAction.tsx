import { Box, Typography, Button } from '@mui/material';

interface CallToActionProps {
  onRegister: () => void;
}

const CalltoAction = ({ onRegister }: CallToActionProps) => {
  return (
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
      <Typography variant="h6" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
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
        onClick={onRegister}
      >
        無料で登録する
      </Button>
    </Box>
  );
};

export default CalltoAction;
