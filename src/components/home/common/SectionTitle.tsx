import { Typography } from '@mui/material';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <>
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
        {title}
      </Typography>

      {subtitle && (
        <Typography
          align="center"
          variant="h4"
          fontWeight="bold"
          color="primary"
          gutterBottom
          sx={{ mb: 6 }}
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
};

export default SectionTitle;
