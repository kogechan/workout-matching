import { useAtom } from 'jotai';
import { postModalAtom } from '@/jotai/Jotai';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { IconButton } from '@mui/material';

export const AddPost = () => {
  const [postModalOpen, setPostModalOpen] = useAtom(postModalAtom);
  return (
    <>
      <IconButton>
        <PostAddIcon onClick={() => setPostModalOpen(!postModalOpen)} />
      </IconButton>
    </>
  );
};
