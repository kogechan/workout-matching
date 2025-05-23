import {
  blockModalAtom,
  blockTargetAtom,
  currentUserAtom,
} from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useAtom } from 'jotai';

const UserBlock = () => {
  const [blockModalOpen, setBlockModalOpen] = useAtom(blockModalAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [blockTarget] = useAtom(blockTargetAtom);

  const handleBlock = async () => {
    const { error } = await supabase
      .from('user_blocks')
      .insert({ user_id: currentUserId, blocked_user_id: blockTarget?.id })
      .throwOnError();

    if (error) {
      console.error(error);
    }

    // 楽観的 UI 更新などはここで
  };

  return (
    <>
      <Dialog
        open={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        slotProps={{
          paper: {
            style: {
              borderRadius: 16,
            },
          },
        }}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">
          ユーザーをブロック
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            ユーザーをブロックしますか？ブロックすると互いのプロフィールとメッセージが表示されなくなりますが、後で設定画面から解除することができます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockModalOpen(false)}>キャンセル</Button>
          <Button color="error" onClick={handleBlock}>
            ブロックする
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserBlock;
