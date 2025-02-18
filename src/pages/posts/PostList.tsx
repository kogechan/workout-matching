import { useState } from 'react';
import { useAtom } from 'jotai';
import { postAtom } from '@/jotai/Jotai';
import { deletePost } from '../api/posts/post';
import {
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  Menu,
  Typography,
  MenuItem,
  Stack,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export const PostList = () => {
  const [posts, setPosts] = useAtom(postAtom);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{
    [key: number]: HTMLElement | null;
  }>({});

  // メニューを開く
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  // メニューを閉じる
  const handleMenuClose = (id: number) => {
    setMenuAnchorEl((prev) => ({ ...prev, [id]: null }));
  };

  // 投稿を削除する関数
  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <List>
      {posts.map((post) => (
        <div key={post.id}>
          <ListItem sx={{ width: '100%' }}>
            <Card sx={{ width: '100%' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Avatar />
                </Stack>
                <Typography variant="body1">{post.content}</Typography>
                <IconButton onClick={(e) => handleMenuOpen(e, post.id)}>
                  <MoreHorizIcon />
                </IconButton>
              </CardContent>
            </Card>
          </ListItem>

          {/* メニュー */}
          <Menu
            id={`menu-${post.id}`}
            anchorEl={menuAnchorEl[post.id]}
            open={Boolean(menuAnchorEl[post.id])}
            onClose={() => handleMenuClose(post.id)}
            MenuListProps={{ 'aria-labelledby': `menu-button-${post.id}` }}
          >
            <MenuItem
              onClick={() => {
                handleDelete(post.id);
                handleMenuClose(post.id);
              }}
            >
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
              削除
            </MenuItem>
          </Menu>
        </div>
      ))}
    </List>
  );
};
