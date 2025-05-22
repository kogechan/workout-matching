import {
  Avatar,
  Box,
  CardActions,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  IconButton,
  Container,
  Modal,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from 'next';
import supabase from '@/lib/supabase';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { chatRoomAtom, currentUserAtom } from '@/jotai/Jotai';
import { useRouter } from 'next/router';
import { LikeButton } from '../../components/profile/LikeButton';
import { ProfileData } from '@/type/chat';
import { createServerSupabaseClient } from '@/lib/server';
import { MoreVert } from '../../components/profile/MoreVert';
import { UserReport } from '@/components/Report/UserReport';
import Head from 'next/head';
import UserBlock from '@/components/block/UserBlock';

// インターフェース
interface SubImage {
  id: string;
  url: string;
  profile_id: string;
}

interface ProfileCardProps {
  profile: ProfileData;
  subImages: SubImage[];
}

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, params } = context;
  const username = params?.username as string;

  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('データ取得エラー:', error);
    return { props: { profile: null, subImages: [] } };
  }

  let formattedSubImages = [];
  if (profile.sub_images && Array.isArray(profile.sub_images)) {
    formattedSubImages = profile.sub_images.map(
      (url: string, index: string) => ({
        id: `sub-${index}`,
        url: url,
        profile_id: profile.id,
      })
    );
  }

  return { props: { profile, subImages: formattedSubImages } };
};

const ProfileCard: NextPage<ProfileCardProps> = ({ profile, subImages }) => {
  const [currentUserId] = useAtom(currentUserAtom);
  const [room, setRoom] = useAtom(chatRoomAtom);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingRoom, setIsCheckingRoom] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 既存のチャットルームを検索
  useEffect(() => {
    const checkExistingRoom = async () => {
      if (!currentUserId || !profile?.id) {
        setIsCheckingRoom(false);
        return;
      }

      setIsCheckingRoom(true);
      try {
        // 既存のチャットルームを検索
        const { data: roomData, error: roomError } = await supabase
          .from('chat_rooms')
          .select('*')
          .or(
            `and(user1_id.eq.${currentUserId},user2_id.eq.${profile.id}),and(user1_id.eq.${profile.id},user2_id.eq.${currentUserId})`
          )
          .maybeSingle();

        if (roomError) {
          setRoom(null);
        } else if (roomData) {
          setRoom(roomData);
        } else {
          setRoom(null);
        }
      } catch (err) {
        console.error(err);
        setRoom(null);
      } finally {
        setIsCheckingRoom(false);
      }
      setLoading(false);
    };

    checkExistingRoom();
  }, [currentUserId, profile?.id, setRoom]);

  // 新規チャットルーム作成
  const createNewChatRoom = async () => {
    if (!currentUserId) {
      setError('ログインしていないか、ユーザー情報が取得できません');

      return;
    }

    if (!profile?.id) {
      setError('プロフィール情報が取得できません');

      return;
    }

    if (isCreatingRoom) {
      console.log('既に作成中');
      return;
    }

    try {
      setIsCreatingRoom(true);
      setError(null);

      // チャットルーム名を生成
      const roomName = `${currentUserId} & ${profile.username || 'User'}`;

      // チャットルームを作成
      const { data: newRoom, error } = await supabase
        .from('chat_rooms')
        .insert({
          name: roomName,
          user1_id: currentUserId,
          user2_id: profile.id,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        throw error;
      }

      setRoom(newRoom);

      // 作成したチャットルームに遷移
      router.push(`/chat/${newRoom.id}`);
    } catch (error) {
      console.error(error);
      setError('チャットルームの作成に失敗しました');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // チャットボタンのクリックイベント
  const handleChatButtonClick = () => {
    if (isCheckingRoom) {
      console.log('ルーム確認中');
      return;
    }

    if (room) {
      router.push(`/chat/${room.id}`);
    } else {
      createNewChatRoom();
    }
  };

  // 画像プレビュー
  const handlePreview = useCallback((url: string) => {
    setPreviewImage(url);
  }, []);

  if (!profile) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Alert severity="error">プロフィールが見つかりませんでした</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          プロフィールを読み込み中...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>プロフィール情報</title>
        <meta name="description" content="プロフィール情報" />
      </Head>
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
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 2,
            }}
            onClick={() => router.back()}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          >
            <MoreVert profile={profile} />
          </Box>

          <IconButton
            sx={{
              position: 'absolute',
              top: 64,
              right: 16,
              zIndex: 2,
            }}
            onClick={handleChatButtonClick}
            disabled={isCreatingRoom}
          >
            {isCreatingRoom ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <MarkunreadIcon />
            )}
          </IconButton>
        </Box>

        <Container maxWidth="lg">
          {/* プロフィール画像 */}
          <Avatar
            src={
              profile?.avatar_url ||
              '/Avatar/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg'
            }
            alt={profile?.username}
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
            onClick={() => handlePreview(profile?.avatar_url || '')}
          />

          {/* サブ写真 */}
          {Array.isArray(subImages) && subImages.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 10,
                flexWrap: 'wrap',
              }}
            >
              {subImages.map((image, index) => (
                <Avatar
                  key={`${image.id || index}`}
                  src={image.url}
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
          )}

          {/* ユーザー名と場所 */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mt: { xs: -4, sm: -5 },
              mb: 2,
            }}
          >
            {profile?.username}
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
              {profile?.location || '未設定'}
            </Typography>
          </Box>

          {/* 基本情報セクション */}
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
              <InfoItem
                icon={<WcIcon />}
                label="性別"
                value={profile?.gender}
              />

              <InfoItem
                icon={<CalendarTodayIcon />}
                label="年齢"
                value={profile?.age}
              />

              <InfoItem
                icon={<HomeIcon />}
                label="居住地"
                value={profile?.location}
              />

              <InfoItem
                icon={<FitnessCenterIcon />}
                label="得意部位"
                value={profile?.favorite_muscle}
              />

              <InfoItem
                icon={<FitnessCenterIcon />}
                label="苦手部位"
                value={profile?.difficult_muscle}
              />

              <InfoItem
                icon={<FitnessCenterIcon />}
                label="トレーニング歴"
                value={profile?.training_experience}
              />

              <InfoItem
                icon={<FitnessCenterIcon />}
                label="所属ジム"
                value={profile?.belong_gym}
              />
            </Box>
          </Paper>

          {/* 自己紹介セクション */}
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

          {/* エラー表示 */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* アクションボタン */}
          <CardActions
            sx={{
              justifyContent: 'center',
              px: 2,
              pb: 2,
              mt: 2,
            }}
          >
            <LikeButton profileId={profile.id} />
          </CardActions>

          <UserBlock />
          <UserReport />
        </Container>

        {/* 画像プレビューダイアログ */}
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
    </>
  );
};

export default ProfileCard;
