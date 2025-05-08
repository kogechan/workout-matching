import { BottomNavigation, Box, Typography } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
  return (
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
          gap: { xs: 2, sm: 3, md: 4 },
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
  );
};

export default Footer;
