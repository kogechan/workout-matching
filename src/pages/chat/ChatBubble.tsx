import { Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Message } from '@/type/chat';

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const BubbleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCurrentUser',
})<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  backgroundColor: isCurrentUser
    ? theme.palette.primary.main
    : theme.palette.grey[200],
  color: isCurrentUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  marginLeft: isCurrentUser ? 'auto' : 0,
  marginRight: isCurrentUser ? 0 : 'auto',
}));

export const ChatBubble = ({ message, isCurrentUser }: ChatBubbleProps) => {
  return (
    <BubbleContainer
      sx={{ flexDirection: isCurrentUser ? 'row-reverse' : 'row' }}
    >
      {!isCurrentUser && (
        <Avatar
          src={message.User?.avatar_url}
          alt={message.User?.username || ''}
          sx={{ mr: 1 }}
        >
          {message.User?.username?.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <Box>
        {!isCurrentUser && (
          <Typography variant="caption" color="textSecondary">
            {message.User?.username}
          </Typography>
        )}
        <MessageBubble isCurrentUser={isCurrentUser}>
          <Typography variant="body1">{message.content}</Typography>
        </MessageBubble>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            display: 'block',
            textAlign: isCurrentUser ? 'right' : 'left',
            mt: 0.5,
          }}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </Box>
    </BubbleContainer>
  );
};
