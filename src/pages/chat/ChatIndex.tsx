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
} from '@mui/material';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { currentUserAtom, isLoadingAtom } from '@/jotai/Jotai';

interface ChatRoomWithUser {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  otherUser: {
    id: string;
    username: string;
    avatar_url?: string;
  } | null;
}

const ChatRoomsList = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoomWithUser[]>([]);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [currentUserId] = useAtom(currentUserAtom);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        /*  // 現在のユーザーを取得
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;

        if (!userData?.user) {
          return;
        } */

        const userId = currentUserId;

        // ユーザーが参加しているチャットルームを取得
        const { data: roomsData, error: roomsError } = await supabase
          .from('chat_rooms')
          .select('*')
          .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
          .order('updated_at', { ascending: false });

        if (roomsError) throw roomsError;

        // 各ルームの相手ユーザー情報を取得
        const roomsWithUsers = await Promise.all(
          (roomsData || []).map(async (room) => {
            const otherUserId =
              room.user1_id === userId ? room.user2_id : room.user1_id;

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
  }, [router, setIsLoading, currentUserId]);

  const handleRoomClick = (roomId: string) => {
    router.push(`/chat/${roomId}`);
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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            チャット一覧
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
            minHeight="50vh"
          >
            <Typography color="textSecondary">
              チャットルームはまだありません
            </Typography>
          </Box>
        ) : (
          rooms.map((room, index) => (
            <React.Fragment key={room.id}>
              <ListItem
                onClick={() => handleRoomClick(room.id)}
                alignItems="flex-start"
                sx={{ py: 2 }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={room.otherUser?.avatar_url}
                    alt={room.otherUser?.username || ''}
                  >
                    {room.otherUser?.username?.charAt(0).toUpperCase() || '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {room.otherUser?.username || '不明なユーザー'}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {room.last_message || 'メッセージはまだありません'}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {new Date(room.updated_at).toLocaleDateString()}{' '}
                        {new Date(room.updated_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < rooms.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
};

export default ChatRoomsList;
