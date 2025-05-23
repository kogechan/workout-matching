import {
  blockModalAtom,
  blockTargetAtom,
  currentUserAtom,
} from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react';
import useSWR from 'swr';

export const UserBlock = () => {
  const [loading, setLoading] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useAtom(blockModalAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [blockTarget] = useAtom(blockTargetAtom);

  const fetcher = async () => {
    const { data, error } = await supabase
      .from('user_blocks')
      .select('blocked_user_id')
      .is('unblocked_at', null);
    if (error) throw error;
    return data.map((d) => d.blocked_user_id as string);
  };

  const { mutate } = useSWR('myBlocked', fetcher, {
    revalidateOnFocus: false,
  });

  // ユーザーブロック関数
  const handleBlock = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_blocks')
        .insert({ user_id: currentUserId, blocked_user_id: blockTarget?.id })
        .throwOnError();
      mutate();

      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Dialog>
    </>
  );
};
