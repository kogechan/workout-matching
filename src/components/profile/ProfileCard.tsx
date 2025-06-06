import {
  Avatar,
  Box,
  Button,
  CardActions,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import { useAvatar } from '@/hooks/useAvatar';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import HomeIcon from '@mui/icons-material/Home';
import { useAtom } from 'jotai';
import { currentUserAtom, subImgeAtom } from '@/jotai/Jotai';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { ProfileImageType } from '@/type/user';

type InfoItemProps = {
  icon: ReactElement;
  label: string;
  value: string | number | null | undefined;
};

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {React.cloneElement(icon as React.ReactElement<{ sx?: object }>, {
      sx: { color: 'text.secondary', mr: 2, fontSize: 28 },
    })}
    <Box>
      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '1rem', fontWeight: 'medium' }}>
        {value || '-'}
      </Typography>
    </Box>
  </Box>
);

export const ProfileCard = () => {
  const [currentUserId] = useAtom(currentUserAtom);
  const { profile } = useAvatar();
  const router = useRouter();
  const [subImages, setSubImages] = useAtom(subImgeAtom);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubImages = async () => {
      if (!currentUserId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('sub_images')
          .eq('id', currentUserId)
          .single();

        if (error) throw error;
        if (data.sub_images && Array.isArray(data.sub_images)) {
          const formattedImages: ProfileImageType[] = data.sub_images.map(
            (url, index) => ({
              id: `sub-${index}-${Date.now()}`,
              url,
            })
          );

          setSubImages(formattedImages);
        }
      } catch (error) {
        console.error('サブ画像取得エラー:', error);
      }
      setLoading(false);
    };
    fetchSubImages();
  }, [currentUserId, setSubImages]);

  // 画像プレビュー
  const handlePreview = useCallback((url: string) => {
    setPreviewImage(url);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 6,
        }}
      >
        <CircularProgress />
        <Typography mt={2} color="text.secondary">
          プロフィールを読み込み中...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        pb: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: { xs: 120, sm: 150, md: 180 },
          position: 'relative',
          mb: 2,
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

      <Container maxWidth="lg">
        <Avatar
          src={
            profile.avatar_url ||
            '/Avatar/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg'
          }
          alt={profile.username}
          sx={{
            width: { xs: 200, sm: 180, md: 250 },
            height: { xs: 200, sm: 180, md: 250 },
            border: '4px solid white',
            boxShadow: 3,
            backgroundColor: 'white',
            zIndex: 1,
            cursor: 'pointer',
            position: 'relative',
            top: { xs: -50, sm: -60, md: -70 },
            mx: 'auto',
          }}
          onClick={() => handlePreview(profile.avatar_url || '')}
        />

        {/* サブ写真 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 10,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {subImages &&
            subImages.length > 0 &&
            subImages.map((image, index) => (
              <Avatar
                key={image.id}
                src={image.url}
                alt={`サブ画像 ${index + 1}`}
                sx={{
                  width: { xs: 60, sm: 70, md: 80 },
                  height: { xs: 60, sm: 70, md: 80 },
                  border: '3px solid white',
                  boxShadow: 2,
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
                onClick={() => handlePreview(image.url)}
              />
            ))}
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mt: { xs: -4, sm: -5 },
            mb: 2,
          }}
        >
          {profile.username}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {profile.location || '未設定'}
          </Typography>
        </Box>

        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              mb: 3,
              borderBottom: '1px solid #f0f0f0',
              pb: 1,
            }}
          >
            基本情報
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            <InfoItem icon={<WcIcon />} label="性別" value={profile.gender} />

            <InfoItem
              icon={<CalendarTodayIcon />}
              label="年齢"
              value={profile.age}
            />

            <InfoItem
              icon={<HomeIcon />}
              label="居住地"
              value={profile.location}
            />

            <InfoItem
              icon={<FitnessCenterIcon />}
              label="得意部位"
              value={profile.favorite_muscle}
            />

            <InfoItem
              icon={<FitnessCenterIcon />}
              label="苦手部位"
              value={profile.difficult_muscle}
            />

            <InfoItem
              icon={<FitnessCenterIcon />}
              label="トレーニング歴"
              value={profile.training_experience}
            />

            <InfoItem
              icon={<FitnessCenterIcon />}
              label="所属ジム"
              value={profile.belong_gym}
            />
          </Box>
        </Paper>

        <Divider sx={{ my: 4 }} />

        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              mb: 3,
              borderBottom: '1px solid #f0f0f0',
              pb: 1,
            }}
          >
            自己紹介
          </Typography>
          <Typography
            sx={{
              lineHeight: 1.8,
              color: 'text.secondary',
              whiteSpace: 'pre-line',
            }}
          >
            {profile.bio || '自己紹介はまだ設定されていません'}
          </Typography>
        </Paper>

        <CardActions
          sx={{
            justifyContent: 'center',
            px: 2,
            pb: 2,
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<EditIcon />}
            onClick={() => router.push('/editProfile')}
            sx={{
              borderRadius: 20,
              width: { md: 1200, xs: 400, sm: 700 },
            }}
          >
            プロフィールを編集
          </Button>
        </CardActions>
      </Container>
      {/* プレビューダイアログ */}
      <Modal open={!!previewImage} onClose={() => setPreviewImage(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setPreviewImage(null)}
            aria-label="close"
            sx={{ position: 'absolute', top: 0, left: 0 }}
          >
            <CloseIcon />
          </IconButton>
          {previewImage && (
            <Avatar
              src={previewImage}
              alt="画像プレビュー"
              sx={{
                width: { xs: 350, sm: 160, md: 350 },
                height: { xs: 350, sm: 160, md: 350 },
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};
