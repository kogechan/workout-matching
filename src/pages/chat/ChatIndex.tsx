import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  AppBar,
  Toolbar,
  CircularProgress,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  ListItemButton,
} from '@mui/material';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { currentUserAtom, isLoadingAtom } from '@/jotai/Jotai';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MoreHoriz } from './MoreHoriz';

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  user1_id: string;
  user2_id: string;
}

interface ChatRoomWithUser extends ChatRoom {
  otherUser: UserProfile | null;
}

const ChatRoomsList = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoomWithUser[]>([]);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // チャットルーム一覧を取得
  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUserId) return;

      try {
        setIsLoading(true);

        // ユーザーが参加しているチャットルームを取得
        const { data: roomsData, error: roomsError } = await supabase
          .from('chat_rooms')
          .select('*')
          .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
          .order('updated_at', { ascending: false });

        if (roomsError) throw roomsError;
        if (!roomsData) return;

        // 各ルームの相手ユーザー情報を取得
        const roomsWithUsers = await Promise.all(
          roomsData.map(async (room) => {
            const otherUserId =
              room.user1_id === currentUserId ? room.user2_id : room.user1_id;

            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', otherUserId)
              .single();

            return {
              ...room,
              otherUser: userError ? null : userData,
            };
          })
        );

        setRooms(roomsWithUsers);
      } catch (error) {
        console.error('チャットルーム取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [currentUserId, setIsLoading]);

  const handleRoomClick = (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  const formatUpdatedTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ja });
  };

  // メッセージの一部を表示（長すぎる場合は切り詰める）
  const truncateMessage = (message?: string) => {
    if (!message) return 'メッセージはまだありません';
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => router.back()}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            メッセージ一覧
          </Typography>
        </Toolbar>
      </AppBar>

      <List
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: 'background.paper',
          p: 0,
        }}
      >
        {rooms.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight="70vh"
            gap={2}
          >
            <Typography color="textSecondary" variant="body1">
              チャットルームはまだありません
            </Typography>
          </Box>
        ) : (
          rooms.map((room, index) => (
            <React.Fragment key={room.id}>
              <ListItem alignItems="flex-start" disablePadding>
                <ListItemButton
                  onClick={() => handleRoomClick(room.id)}
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    px: 2,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        room.otherUser?.avatar_url ||
                        '/Avatar/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg'
                      }
                      alt={room.otherUser?.username || ''}
                      sx={{
                        width: isMobile ? 70 : 80,
                        height: isMobile ? 70 : 80,
                        mr: 2,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {room.otherUser?.username || '不明なユーザー'}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mb: 0.5,
                            lineHeight: 1.4,
                          }}
                        >
                          {truncateMessage(room.last_message)}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {formatUpdatedTime(room.updated_at)}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                >
                  <MoreHoriz roomId={room.id} />
                </Box>
              </ListItem>
              {index < rooms.length - 1 && (
                <Divider sx={{ ml: isMobile ? 9 : 10 }} />
              )}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};

export default ChatRoomsList;
