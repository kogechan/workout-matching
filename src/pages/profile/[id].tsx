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
import {
  chatRoomAtom,
  currentUserAtom,
  isLoadingAtom,
  postAtom,
} from '@/jotai/Jotai';
import { useRouter } from 'next/router';

const ProfileCard = () => {
  const [posts] = useAtom(postAtom);
  const [currentUserId, setCurrentUserId] = useAtom(currentUserAtom);
  const [room, setRoom] = useAtom(chatRoomAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndChatRoom = async () => {
      try {
        // 現在のログインユーザーを取得
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;

        if (!userData?.user) {
          setIsLoading(false);
          return;
        }

        const currentUser = userData.user;
        setCurrentUserId(currentUser.id);

        // 他のユーザー（プロフィールページのユーザー）を特定
        const otherUser = posts.find((post) => post.user_id !== currentUser.id);

        if (!otherUser) {
          setIsLoading(false);
          return;
        }

        // 既存のチャットルームを検索
        const { data: roomData, error: roomError } = await supabase
          .from('chat_rooms')
          .select('*')
          .or(
            `and(user1_id.eq.${currentUser.id},user2_id.eq.${otherUser.user_id})`
          )
          .or(
            `and(user1_id.eq.${otherUser.user_id},user2_id.eq.${currentUser.id})`
          )
          .maybeSingle();

        if (roomError) throw roomError;

        if (roomData) {
          setRoom(roomData);
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndChatRoom();
  }, [posts, setCurrentUserId, setIsLoading, setRoom]);

  const createChatRoom = async () => {
    try {
      if (!currentUserId || isCreatingRoom) return;

      setIsCreatingRoom(true);

      const otherUser = posts.find((post) => post.user_id !== currentUserId);
      if (!otherUser) return;

      // ユーザー名を取得
      const currentUserName =
        posts.find((post) => post.user_id === currentUserId)?.profiles
          ?.username || 'User';

      const otherUserName = otherUser.profiles?.username || 'User';

      // チャットルーム名を生成
      const roomName = `${currentUserName} & ${otherUserName}`;

      // より小さいIDを user1_id に、大きいIDを user2_id に設定
      let user1Id, user2Id;
      if (currentUserId < otherUser.user_id) {
        user1Id = currentUserId;
        user2Id = otherUser.user_id;
      } else {
        user1Id = otherUser.user_id;
        user2Id = currentUserId;
      }

      // チャットルームを作成
      const { data: newRoom, error } = await supabase
        .from('chat_rooms')
        .insert({
          name: roomName,
          user1_id: user1Id,
          user2_id: user2Id,
        })
        .select()
        .single();

      if (error) throw error;

      setRoom(newRoom);

      // 作成したチャットルームに遷移
      router.push(`/chat/${newRoom.id}`);
    } catch (error) {
      console.error('チャットルーム作成エラー:', error);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleChatButtonClick = () => {
    if (room) {
      router.push(`/chat/${room.id}`);
    } else {
      createChatRoom();
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

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
            {/* プロフィール情報表示部分は変更なし */}
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
                  {otherProfile.profiles?.location}
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
          <CardActions sx={{ justifyContent: 'center', px: 2, pb: 2 }}>
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
      )}
    </>
  );
};

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
