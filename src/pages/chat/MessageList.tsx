import { Box, CircularProgress, Typography } from '@mui/material';
import { ChatBubble } from './ChatBubble';
import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { currentUserAtom, isLoadingAtom, messageAtom } from '@/jotai/Jotai';

export const MessageList = () => {
  const [messages] = useAtom(messageAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
