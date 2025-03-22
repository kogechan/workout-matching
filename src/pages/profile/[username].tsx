import {
  Avatar,
  Box,
  Button,
  CardActions,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Alert,
  Paper,
  IconButton,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

interface ProfileCardProps {
  profile: ProfileData;
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
    return { props: { profile: null } };
  }

  return { props: { profile: profile } };
};

const ProfileCard: NextPage<ProfileCardProps> = ({ profile }) => {
  const [currentUserId] = useAtom(currentUserAtom);
  const [room, setRoom] = useAtom(chatRoomAtom);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingRoom, setIsCheckingRoom] = useState(true);
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
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <MoreVertIcon />
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
            src={profile?.avatar_url || ''}
            alt={profile?.username}
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
                    性別:
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
                    年齢:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile?.age}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FitnessCenterIcon
                  sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    トレーニング歴:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {profile?.training_experience}
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleChatButtonClick}
            disabled={isCreatingRoom}
          >
            {isCreatingRoom ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'メッセージ'
            )}
          </Button>
        </CardActions>
      </Box>
    </Box>
  );
};

export default ProfileCard;
