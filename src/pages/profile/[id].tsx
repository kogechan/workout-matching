import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import {
  Person as PersonIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  FitnessCenter as FitnessCenterIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { postAtom } from '@/jotai/Jotai';

const ProfileCard = ({ profile }) => {
  const [posts] = useAtom(postAtom);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ユーザーを取得
  useEffect(() => {
    const fetchUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        setCurrentUserId(user.user.id);
      }
    };
    fetchUser();
  }, []);

  const otherProfile = posts.find((post) => post.user_id !== currentUserId);

  return (
    <>
      {otherProfile && (
        <Card sx={{ maxWidth: 500, mx: 'auto', boxShadow: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 4,
              pb: 2,
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <Avatar
              src={otherProfile.profiles?.avatar_url || ''}
              alt={otherProfile.profiles?.username}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                boxShadow: 2,
              }}
            />
            <Typography
              variant="h5"
              component="h1"
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              {otherProfile.profiles?.username}
            </Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ fontWeight: 'medium' }}
                >
                  性別:
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {otherProfile.profiles?.gender}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CakeIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ fontWeight: 'medium' }}
                >
                  年齢:
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {otherProfile.profiles?.age}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ fontWeight: 'medium' }}
                >
                  居住地:
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {profile.location}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FitnessCenterIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ fontWeight: 'medium' }}
                >
                  トレーニング歴:
                </Typography>
                <Chip
                  label={otherProfile.profiles?.training_experience}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ fontWeight: 'medium' }}
                >
                  自己紹介
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                {otherProfile.profiles?.bio}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

// SSR: ユーザーのプロフィール情報を取得
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('プロフィール取得エラー:', error);
    return { props: { profile: null } };
  }

  return { props: { profile } };
};

export default ProfileCard;

/* import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import {
  Person as PersonIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  FitnessCenter as FitnessCenterIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import supabase from '@/lib/supabase';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { otherProfileAtom } from '@/jotai/Jotai';

const ProfileCard = ({ profile }) => {
  const [, setOtherProfile] = useAtom(otherProfileAtom);

  useEffect(() => {
    if (profile) {
      setOtherProfile(profile);
    }
  }, [profile, setOtherProfile]);

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', boxShadow: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 4,
          pb: 2,
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
        }}
      >
        <Avatar
          src={profile.avatar_url || ''}
          alt={profile.username}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid white',
            boxShadow: 2,
          }}
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{ mt: 2, fontWeight: 'bold' }}
        >
          {profile.username}
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: 'medium' }}
            >
              性別:
            </Typography>
            <Typography variant="body1" sx={{ ml: 1 }}>
              {profile.gender}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CakeIcon color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: 'medium' }}
            >
              年齢:
            </Typography>
            <Typography variant="body1" sx={{ ml: 1 }}>
              {profile.age}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: 'medium' }}
            >
              居住地:
            </Typography>
            <Typography variant="body1" sx={{ ml: 1 }}>
              {profile.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FitnessCenterIcon color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: 'medium' }}
            >
              トレーニング歴:
            </Typography>
            <Chip
              label={profile.training_experience}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <InfoIcon color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: 'medium' }}
            >
              自己紹介
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
            {profile.bio}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// SSR: ユーザーのプロフィール情報を取得
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('プロフィール取得エラー:', error);
    return { props: { profile: null } };
  }

  return { props: { profile } };
};

export default ProfileCard;
 */
