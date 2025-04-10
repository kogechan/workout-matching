import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import supabase from '@/lib/supabase';
import { MessageInput } from './MessageInput';
import { useAtom } from 'jotai';
import {
  chatRoomAtom,
  currentUserAtom,
  isLoadingAtom,
  messageAtom,
  otherUserAtom,
} from '@/jotai/Jotai';
import { MessageList } from './MessageList';
import { NextPage } from 'next';

const ChatRoomPage: NextPage = () => {
  const router = useRouter();
  const { id: roomId } = router.query;

  const [, setMessages] = useAtom(messageAtom);
  const [, setRoom] = useAtom(chatRoomAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [otherUser, setOtherUser] = useAtom(otherUserAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);

  useEffect(() => {
    if (!router.isReady || !roomId) return;

    const fetchRoom = async () => {
      try {
        // 現在のユーザーIDを取得
        const userId = currentUserId;
        if (!userId) {
          router.push('/');
          return;
        }

        // チャットルーム情報の取得
        const { data: roomData, error: roomError } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (roomError) throw roomError;
        setRoom(roomData);

        // 相手のユーザーIDを特定
        const otherUserId =
          roomData.user1_id === userId ? roomData.user2_id : roomData.user1_id;

        // 相手のプロフィール情報を取得
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .single();

        if (profileError) throw profileError;
        setOtherUser(profileData);

        // メッセージ履歴の取得
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(
            `
            *,
            user:user_id (
              id,
              email
            )
          `
          )
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

        // リアルタイム購読の設定
        const subscription = supabase
          .channel(`room:${roomId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `room_id=eq.${roomId}`,
            },
            async (payload) => {
              // 新しいメッセージを取得してユーザー情報を含める
              const { data, error } = await supabase
                .from('messages')
                .select(
                  `
                *,
                user:user_id (
                  id,
                  email
                )
              `
                )
                .eq('id', payload.new.id)
                .single();

              if (!error && data) {
                setMessages((prev) => [...prev, data]);
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('データ取得エラー:', error);
        router.push('/chat');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [
    roomId,
    router,
    router.isReady,
    setIsLoading,
    setMessages,
    setOtherUser,
    setRoom,
    currentUserId,
  ]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ mr: 2 }}
            onClick={() => router.push('/chat')}
          >
            <ArrowBackIcon />
          </IconButton>

          {otherUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Avatar
                src={otherUser.avatar_url}
                alt={otherUser.username}
                sx={{ mr: 1, width: 50, height: 50 }}
              >
                {otherUser.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" component="div">
                {otherUser.username}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
        }}
      >
        <MessageList />
        {roomId && <MessageInput roomId={roomId as string} />}
      </Paper>
    </Box>
  );
};

export default ChatRoomPage;
