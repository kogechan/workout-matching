import { useAtom } from 'jotai';
import { PostModalAtom } from '@/jotai/Jotai';

export const AddPost = () => {
  const [postModalOpen, setPostModalOpen] = useAtom(PostModalAtom);
  return (
    <>
      <button onClick={() => setPostModalOpen(!postModalOpen)}>投稿</button>
    </>
  );
};
