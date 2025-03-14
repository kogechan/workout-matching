import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import supabase from '@/lib/supabase';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { currentUserAtom } from '@/jotai/Jotai';

interface MessageInputProps {
  roomId: string;
}

export const MessageInput = ({ roomId }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId] = useAtom(currentUserAtom);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setSending(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: message,
          room_id: roomId,
          user_id: currentUserId,
        })
        .select('*, user:user_id(id, email)')
        .single();

      if (error) throw error;

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
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
        disabled={sending}
        size="small"
        sx={{ mr: 1 }}
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={!message.trim() || sending}
        size="large"
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};
