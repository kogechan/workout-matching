import { Box, CircularProgress, Typography } from '@mui/material';
import { Message } from '@/type/chat';
import { ChatBubble } from './ChatBubble';
import { useEffect, useRef } from 'react';

interface ChatListProps {
  messages: Message[];
  currentUserId: string | null;
  isLoading: boolean;
}

export const ChatList = ({
  messages,
  currentUserId,
  isLoading,
}: ChatListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 新しいメッセージが来たら一番下にスクロール
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Typography color="textSecondary">
          メッセージはまだありません
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, overflowY: 'auto', height: 'calc(100vh - 140px)' }}>
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message}
          isCurrentUser={message.user_id === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};
