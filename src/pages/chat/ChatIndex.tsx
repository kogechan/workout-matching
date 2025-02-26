import { useState, useEffect, Fragment } from 'react';
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
import { ChatRoom } from '@/type/chat';

const ChatRoomsList = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setRooms(data || []);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
            チャットルーム
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
            <Fragment key={room.id}>
              <ListItem
                onClick={() => handleRoomClick(room.id)}
                alignItems="flex-start"
                sx={{ py: 2 }}
              >
                <ListItemAvatar>
                  <Avatar>{room.name.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">{room.name}</Typography>
                  }
                  secondary={
                    <Fragment>
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
                        {new Date(room.updated_at).toLocaleDateString()}
                      </Typography>
                    </Fragment>
                  }
                />
              </ListItem>
              {index < rooms.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Fragment>
          ))
        )}
      </List>
    </Box>
  );
};

export default ChatRoomsList;
