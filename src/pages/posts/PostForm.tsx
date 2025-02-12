import { useState } from 'react';
import { useAtom } from 'jotai';
import { postsAtom } from '@/jotai/Jotai';
import { useUser } from '@/hooks/user';

export const PostForm = () => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useAtom(postsAtom);
  const { user, loading } = useUser(); // ログインユーザー取得

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('ログインしてください');

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, userId: user.id }),
    });

    const newPost = await res.json();
    setPosts([newPost, ...posts]); // 投稿一覧を更新
    setContent('');
  };

  if (loading) return <p>loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">投稿</button>
    </form>
  );
};
