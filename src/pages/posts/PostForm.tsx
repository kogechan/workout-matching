import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { postAtom, postModalAtom, profileAtom } from '@/jotai/Jotai';
import { getPost, addPost } from '@/pages/api/posts/post';
import { Avatar, Box, Button, Dialog, Stack, TextField } from '@mui/material';

export const PostForm = () => {
  const [, setPosts] = useAtom(postAtom);
  const [profile] = useAtom(profileAtom);
  const [content, setContent] = useState('');
  const [postModalOpen, setPostModalOpen] = useAtom(postModalAtom);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPost();
      if (data.length > 0) {
        setPosts(data);
      }
    };
    fetchPosts();
  }, [setPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content === '') return;
    await addPost(content);
    setContent('');
    setPosts(await getPost());
  };
  return (
    <Dialog open={postModalOpen} onClose={() => setPostModalOpen(false)}>
      <Box sx={{ p: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2}>
            <Avatar src={profile.avatar_url} />
          </Stack>
          <TextField
            label="いまどうしてる？"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            sx={{ m: 1, width: '50ch' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Box
            my={1}
            flexDirection="row"
            justifyContent="flex-end"
            display="flex"
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => setPostModalOpen(false)}
            >
              投稿
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};
