import {
  Avatar,
  Box,
  CardActions,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Alert,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from 'next';
import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { chatRoomAtom, currentUserAtom } from '@/jotai/Jotai';
import { useRouter } from 'next/router';
import { LikeButton } from './LikeButton';
import { ProfileData } from '@/type/chat';
import { createServerSupabaseClient } from '@/lib/server';
import { MoreVert } from './MoreVert';
import { UserReport } from '@/components/UserReport';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface SubImage {
  id: string;
  url: string;
  profile_id: string;
}

interface ProfileCardProps {
  profile: ProfileData;
  subImages: SubImage[];
}

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
    formattedSubImages = profile.sub_images.map((url, index) => ({
      id: `sub-${index}`,
      url: url,
      profile_id: profile.id,
    }));
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
  const router = useRouter();

  // コンポーネントマウント時に既存のチャットルームを検索
  useEffect(() => {
    const checkExistingRoom = async () => {
      if (!currentUserId || !profile?.id) {
        setIsCheckingRoom(false);
        return;
      }

      setIsCheckingRoom(true);
      try {
        console.log('既存ルーム検索:', {
          currentUserId,
          profileId: profile.id,
        });

        // 既存のチャットルームを検索
        const { data: roomData, error: roomError } = await supabase
          .from('chat_rooms')
          .select('*')
          .or(
            `and(user1_id.eq.${currentUserId},user2_id.eq.${profile.id}),and(user1_id.eq.${profile.id},user2_id.eq.${currentUserId})`
          )
          .maybeSingle();

        console.log('ルーム検索結果:', { roomData, roomError });

        if (roomError) {
          console.error('既存ルーム検索エラー:', roomError);
          setRoom(null);
        } else if (roomData) {
          console.log('既存ルームを発見:', roomData);
          setRoom(roomData);
        } else {
          console.log('既存ルームなし、roomにnullをセット');
          setRoom(null);
        }
      } catch (err) {
        console.error('ルーム検索エラー:', err);
        setRoom(null);
      } finally {
        setIsCheckingRoom(false);
      }
    };

    checkExistingRoom();
  }, [currentUserId, profile?.id, setRoom]);

  // 新規チャットルーム作成 - 条件チェックを慎重に
  const createNewChatRoom = async () => {
    console.log('createNewChatRoom開始', {
      currentUserId,
      profileId: profile?.id,
    });

    // 条件チェックを厳密に
    if (!currentUserId) {
      setError('ログインしていないか、ユーザー情報が取得できません');
      console.error('ユーザーIDなし');
      return;
    }

    if (!profile?.id) {
      setError('プロフィール情報が取得できません');
      console.error('プロフィールIDなし');
      return;
    }

    if (isCreatingRoom) {
      console.log('既に作成中');
      return;
    }

    try {
      setIsCreatingRoom(true);
      setError(null);

      console.log('新規ルーム作成開始:', {
        currentUserId,
        profileId: profile.id,
      });

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

      console.log('ルーム作成応答:', { newRoom, error });

      if (error) {
        console.error('ルーム作成エラー:', error);
        throw error;
      }

      console.log('新規ルーム作成成功:', newRoom);
      setRoom(newRoom);

      // 作成したチャットルームに遷移
      router.push(`/chat/${newRoom.id}`);
    } catch (error) {
      console.error('チャットルーム作成エラー:', error);
      setError('チャットルームの作成に失敗しました');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // ボタンクリックハンドラの強化
  const handleChatButtonClick = () => {
    console.log('チャットボタンクリック', {
      room,
      isCheckingRoom,
      currentUserId,
      profileId: profile?.id,
    });

    if (isCheckingRoom) {
      console.log('ルーム確認中...');
      return; // ルーム確認中は何もしない
    }

    if (room) {
      // 既存のルームが見つかった場合
      console.log('既存ルームへ移動:', room.id);
      router.push(`/chat/${room.id}`);
    } else {
      // 新規ルーム作成
      console.log('新規ルーム作成開始');
      createNewChatRoom();
    }
  };

  if (!profile) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Alert severity="error">プロフィールが見つかりませんでした</Alert>
      </Box>
    );
  }

  // 画像プレビュー
  const handlePreview = (url: string) => {
    setPreviewImage(url);
  };

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
          edge="start"
          color="inherit"
          aria-label="back"
          sx={{ mr: 2 }}
          onClick={() => router.back()}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box
          color="inherit"
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <MoreVert profile={profile} />
        </Box>

        <Box sx={{ position: 'absolute', right: 15, top: 65 }}>
          <IconButton onClick={handleChatButtonClick} disabled={isCreatingRoom}>
            {isCreatingRoom ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <ChatBubbleIcon />
            )}
          </IconButton>
        </Box>
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
            src={
              profile?.avatar_url ||
              '/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399_801/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg'
            }
            alt={profile?.username}
            sx={{
              width: { xs: 200, sm: 160, md: 250 },
              height: { xs: 200, sm: 160, md: 250 },
              border: '4px',
              boxShadow: 3,
              backgroundColor: 'white',
              zIndex: 1,
              cursor: 'pointer',
            }}
            onClick={() => handlePreview(profile?.avatar_url || '')}
          />
        </Box>

        {/* サブ写真 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
          {Array.isArray(subImages) &&
            subImages.length > 0 &&
            subImages.map((image, index) => (
              <Avatar
                key={`${image.id || index}`}
                src={image.url}
                sx={{
                  width: { xs: 50, sm: 60, md: 70 },
                  height: { xs: 50, sm: 60, md: 70 },
                  border: '4px',
                  boxShadow: 3,
                  backgroundColor: 'white',
                  zIndex: 1,
                  cursor: 'pointer',
                }}
                onClick={() => handlePreview(image.url)}
              />
            ))}
        </Box>
        <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold">
            {profile?.username}
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
            <Typography variant="body1" sx={{ ml: 1 }}>
              {profile?.location}
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
                    {profile?.gender}
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
                    {profile?.age}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon
                  sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    居住地
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile?.location}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FitnessCenterIcon
                  sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    得意部位
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile?.favorite_muscle}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FitnessCenterIcon
                  sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    苦手部位
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile?.difficult_muscle}
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
                    {profile?.training_experience}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FitnessCenterIcon
                  sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    所属ジム
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile?.belong_gym}
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

        <CardActions sx={{ justifyContent: 'center', px: 2, pb: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <LikeButton profileId={profile.id} />
        </CardActions>
        <UserReport />
      </Box>
      {/* プレビューダイアログ */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
      >
        <DialogContent sx={{ p: 0, height: { md: 600, xs: 270 } }}>
          {previewImage && (
            <img
              src={previewImage}
              alt="画像プレビュー"
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProfileCard;
