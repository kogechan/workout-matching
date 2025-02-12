import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { postsAtom } from '@/jotai/Jotai';

export const PostList = () => {
  const [posts, setPosts] = useAtom(postsAtom);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, [setPosts]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};
