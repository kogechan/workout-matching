import {
  blockedUserAtom,
  blockTargetAtom,
  currentUserAtom,
  unblockModalAtom,
} from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';

export const UserUnblock = () => {
  const [unblockModalOpen, setUnblockModalOpen] = useAtom(unblockModalAtom);
  const [blockedTarget] = useAtom(blockTargetAtom);
  const [, setBlockedUsers] = useAtom(blockedUserAtom);
  const [currentUserId] = useAtom(currentUserAtom);

  // ユーザーブロック解除関数
  const unBlockUser = async (userId: string) => {
    const { error } = await supabase
      .from('user_blocks')
      .update({ unblocked_at: new Date().toISOString() })
      .eq('user_id', currentUserId)
      .eq('blocked_user_id', userId)
      .throwOnError();
    if (error) {
      console.error(error);
    } else {
      setBlockedUsers((user) => user.filter((u) => u.id !== userId));
      setUnblockModalOpen(false);
    }
  };
  return (
    <>
      {/* ブロック解除確認ダイアログ */}
      <Dialog
        open={unblockModalOpen}
        onClose={() => setUnblockModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 320,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            ブロックを解除しますか？
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            {blockedTarget?.username}のブロックを解除すると、
            お互いの投稿やプロフィールが再び表示されるようになります。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setUnblockModalOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium',
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={() => unBlockUser(blockedTarget?.id || '')}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium',
              ml: 1,
            }}
          >
            解除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
