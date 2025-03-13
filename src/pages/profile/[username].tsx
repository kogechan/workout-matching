import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  FitnessCenter as FitnessCenterIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { currentUserAtom } from '@/jotai/Jotai';
import { useRouter } from 'next/router';
import { LikeButton } from './LikeButton';
import { ProfileData, ChatRoom } from '@/type/chat';
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

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [currentUserId] = useAtom(currentUserAtom);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkExistingRoom = async () => {
      if (!currentUserId || !profile?.id) return;

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
            `user1_id.eq.${currentUserId},user2_id.eq.${profile.id},user1_id.eq.${profile.id},user2_id.eq.${currentUserId}`
          )
          .maybeSingle();

        if (roomError) {
          console.error('既存ルーム検索エラー:', roomError);
          return;
        }

        if (roomData) {
          console.log('既存ルームを発見:', roomData);
          setRoom(roomData);
        } else {
          console.log('既存ルームなし');
        }
      } catch (err) {
        console.error('ルーム検索エラー:', err);
      }
    };
    checkExistingRoom();
  }, [currentUserId, profile?.id]);

  // 新規チャットルームを作成
  const createNewChatRoom = async () => {
    try {
      if (!currentUserId || !profile?.id || isCreatingRoom) {
        console.error('必要な情報が不足:', {
          currentUserId,
          profileId: profile?.id,
        });
        return;
      }
      setIsCreatingRoom(true);
      setError(null);

      // ユーザー名を取得
      const { data: userData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUserId)
        .single();

      const currentUserName = userData?.username || 'User';
      const otherUserName = profile.username || 'User';

      const roomName = `${currentUserName} & ${otherUserName}`;

      console.log('新規ルーム作成:', {
        name: roomName,
        user1_id: currentUserId,
        user2_id: profile.id,
      });

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

  const handleChatButtonClick = () => {
    console.log('現在のルーム状態:', room);

    if (room) {
      console.log('既存のルームへ移動:', room.id);
      router.push(`/chat/${room.id}`);
    } else {
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
    <>
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
            src={profile?.avatar_url || ''}
            alt={profile?.username}
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
            {profile?.username}
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
                {profile?.gender}
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
                {profile?.age}
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
                {profile?.location}
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
                label={profile?.training_experience}
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
      </Card>
    </>
  );
};

export default ProfileCard;
