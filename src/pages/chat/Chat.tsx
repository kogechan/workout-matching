import { useEffect, useState } from 'react';
import { getMessage, sendMessage } from '../api/message/messages';
import { useChat } from '@/hooks/useChat';
import { TextField, Button, List, ListItem, Typography } from '@mui/material';

export const Chat = () => {
  const { messages, setMessages } = useChat();
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getMessage();
      if (data.length > 0) {
        setMessages(data);
      }
    };
    fetchPosts();
  }, [setMessages]);

  const handleSend = async () => {
    if (content === '') return;
    await sendMessage(content);
    setContent('');
    setMessages(await getMessage());
  };

  return (
    <div>
      <Typography variant="h5">チャット</Typography>

      {/* メッセージ入力 */}
      <TextField
        label="メッセージを入力"
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSend} variant="contained">
        送信
      </Button>

      {/* メッセージ一覧 */}
      <List>
        {messages.map((msg) => (
          <ListItem key={msg.id}>
            <Typography>{msg.content}</Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
