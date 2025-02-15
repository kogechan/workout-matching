import { useAtom } from 'jotai';
import { postAtom } from '@/jotai/Jotai';
import { deletePost } from '../api/posts/post';

export const PostList = () => {
  const [posts, setPosts] = useAtom(postAtom);

  const handleDelete = async (id: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    await deletePost(id);
  };
  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <p>{post.content}</p>
            <button onClick={() => handleDelete(post.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
