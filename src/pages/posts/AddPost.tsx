import { useAtom } from 'jotai';
import { postModalAtom } from '@/jotai/Jotai';
import { IconButton } from '@mui/material';
import ModeIcon from '@mui/icons-material/Mode';

export const AddPost = () => {
  const [postModalOpen, setPostModalOpen] = useAtom(postModalAtom);

  return (
    <>
      <IconButton
        onClick={() => setPostModalOpen(!postModalOpen)}
        sx={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        <ModeIcon sx={{ fontSize: 50 }} />
      </IconButton>
    </>
  );
};
