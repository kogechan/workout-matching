import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import supabase from '@/lib/supabase';
import { ChatList } from './ChatList';
import { MessageInput } from './MessageInput';
import { Message, ChatRoom } from '@/type/chat';
import { useEffect, useState } from 'react';

export const ChatRoomPage = () => {
  const router = useRouter();
  const { id: roomId } = router.query;

  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // テスト用のユーザーID（実際の実装では認証システムから取得）
  const currentUserId = 'current-user-id';

  useEffect(() => {
    if (!roomId) return;

    // チャットルーム情報の取得
    const fetchRoom = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (error) throw error;
        setRoom(data);
      } catch (error) {
        console.error('Error fetching room:', error);
        router.push('/chat');
      }
    };

    // メッセージ履歴の取得
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(
            `
            *,
            user:user_id (
              id,
              username,
              avatar_url
            )
          `
          )
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
    fetchMessages();

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
        (payload) => {
          // 新しいメッセージを取得してユーザー情報を含める
          const fetchNewMessage = async () => {
            const { data, error } = await supabase
              .from('messages')
              .select(
                `
              *,
              user:user_id (
                id,
                username,
                avatar_url
              )
            `
              )
              .eq('id', payload.new.id)
              .single();

            if (!error && data) {
              setMessages((prev) => [...prev, data]);
            }
          };

          fetchNewMessage();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, router]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            component={Link}
            href="/chat"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {room?.name || 'チャットルーム'}
          </Typography>
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
        <ChatList
          messages={messages}
          currentUserId={currentUserId}
          isLoading={isLoading}
        />
        <MessageInput roomId={roomId as string} userId={currentUserId} />
      </Paper>
    </Box>
  );
};
