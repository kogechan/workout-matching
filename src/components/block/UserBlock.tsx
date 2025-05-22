import { blockModalAtom } from '@/jotai/Jotai';
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
        <DialogTitle id="delete-account-dialog-title">投稿の削除</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            ユーザーをブロックしますか？ブロックすると互いのプロフィールとメッセージが表示されなくなりますが、後で設定画面から解除することができます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockModalOpen(false)}>キャンセル</Button>
          <Button color="error" autoFocus>
            ブロックする
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserBlock;
