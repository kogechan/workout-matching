import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useAvatar } from '@/hooks/useAvatar';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';

export const ProfileCard = () => {
  const { profile } = useAvatar();
  const router = useRouter();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: { xs: 120, sm: 150, md: 180 },
          position: 'relative',
        }}
      >
        <IconButton
          color="inherit"
          onClick={() => router.push('/editProfile')}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: -10 }}>
          <Avatar
            src={profile.avatar_url}
            alt={profile.username}
            sx={{
              width: { xs: 120, sm: 160, md: 180 },
              height: { xs: 120, sm: 160, md: 180 },
              border: '4px',
              boxShadow: 3,
              backgroundColor: 'white',
              zIndex: 1,
            }}
          />
        </Box>

        <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold">
            {profile.username}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body1" color="text.secondary">
              {profile.location}
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight="medium">
              基本情報
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr',
                },
                gap: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WcIcon sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    性別
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile.gender}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon
                  sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    年齢
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile.age}歳
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FitnessCenterIcon
                  sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    トレーニング歴
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile.training_experience}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
            自己紹介
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.7 }}
          >
            {profile.bio}
          </Typography>
        </Paper>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            my: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<EditIcon />}
            onClick={() => router.push('/editProfile')}
            sx={{
              borderRadius: 8,
              px: 5,
              py: 1.5,
              boxShadow: 2,
            }}
          >
            プロフィールを編集
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
