import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import supabase from '@/lib/supabase';
import { useState } from 'react';

interface MessageInputProps {
  roomId: string;
  userId: string;
}

export const MessageInput = ({ roomId, userId }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.from('messages').insert({
        content: message.trim(),
        room_id: roomId,
        user_id: userId,
      });

      if (error) throw error;

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSendMessage}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="メッセージを入力..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
        size="small"
        sx={{ mr: 1 }}
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={!message.trim() || isLoading}
        size="large"
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};
