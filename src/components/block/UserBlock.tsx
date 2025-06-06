import {
  blockedUserAtom,
  blockModalAtom,
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
  const [blockedUsers, setBlockedUsers] = useAtom(blockedUserAtom);

  const fetcher = async () => {
    const { data, error } = await supabase
      .from('user_blocks')
      .select('blocked_user_id')
      .eq('user_id', currentUserId || '')
      .eq('is_deleted', false);
    if (error) throw error;
    return data.map((d) => d.blocked_user_id as string);
  };

  const { mutate } = useSWR('myBlocked', fetcher, {
    revalidateOnFocus: false,
  });

  // ユーザーブロック関数
  const handleBlock = async () => {
    const blockedTarget = blockedUsers[0].id;
    try {
      setLoading(true);
      // 既存のブロックを確認
      const { data, error } = await supabase
        .from('user_blocks')
        .select('blocked_user_id, is_deleted')
        .eq('user_id', currentUserId || '')
        .eq('blocked_user_id', blockedTarget)
        .maybeSingle();
      mutate();

      if (error) throw error;

      if (data) {
        if (data.is_deleted) {
          // もし論理削除されている場合は復活
          const { error } = await supabase
            .from('user_blocks')
            .update({ is_deleted: false, created_at: new Date().toISOString() })
            .eq('user_id', currentUserId || '')
            .eq('blocked_user_id', blockedTarget);

          if (error) throw error;
        }
      } else {
        // 新規ブロック作成
        const { error } = await supabase.from('user_blocks').insert({
          user_id: currentUserId || '',
          blocked_user_id: blockedTarget,
          is_deleted: false,
        });

        if (error) throw error;
      }

      setBlockedUsers([]);

      mutate();

      if (error) {
        console.error(error);
      } else {
        setBlockModalOpen(false);
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
