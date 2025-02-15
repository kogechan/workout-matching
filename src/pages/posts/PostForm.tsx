import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { postAtom, PostModalAtom } from '@/jotai/Jotai';
import { getPost, addPost } from '@/pages/api/posts/post';
import { Dialog } from '@mui/material';

export const PostForm = () => {
  const [, setPosts] = useAtom(postAtom);
  // 投稿のcontentを保持
  const [content, setContent] = useState('');
  const [postModalOpen, setPostModalOpen] = useAtom(PostModalAtom);

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
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="内容"
        />
        <button type="submit" onClick={() => setPostModalOpen(false)}>
          投稿
        </button>
      </form>
    </Dialog>
  );
};
