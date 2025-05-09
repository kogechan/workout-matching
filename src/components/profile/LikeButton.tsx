import { currentUserAtom, isLoadingAtom } from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';

export const LikeButton = ({ profileId }: { profileId: string }) => {
  // いいね状態を管理
  const [isLiked, setIsLiked] = useState(false);
  // いいね数を管理
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [likeAlert, setLikeAlert] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      // 対象プロフィールの総いいね数を取得
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('liked_user_id', profileId);

      if (countError) {
        console.error('いいね数取得エラー:', countError);
      } else if (count !== null) {
        setLikeCount(count);
      }
      // 現在のユーザーがいいねしているか確認
      const { data: likeData, error: likeError } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', currentUserId || '')
        .eq('liked_user_id', profileId)
        .maybeSingle();

      if (likeError && likeError.code !== 'PGRST116') {
        // PGRST116 は「結果が見つからない」エラーコード
        console.error('いいね状態取得エラー:', likeError);
      } else {
        setIsLiked(!!likeData);
      }

      setIsLoading(false);
    };
    fetchCurrentUser();
  }, [profileId, setIsLoading, currentUserId, setLikeCount]);

  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!currentUserId) {
      console.error('ユーザーがログインしていません');
      return;
    }
    try {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ user_id: currentUserId, liked_user_id: profileId });

        if (error) {
          console.error('いいね解除エラー:', error);
        } else {
          setIsLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: currentUserId, liked_user_id: profileId });

        if (error) {
          console.error('いいねエラー:', error);
        } else {
          setIsLiked(true);
          setLikeCount((prev) => prev + 1);
        }
      }
      setLikeAlert(true);
      setTimeout(() => setLikeAlert(false), 3000);
    } catch (error) {
      console.error('いいね処理中のエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Snackbar
        open={likeAlert}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert
          severity="success"
          icon={<CheckIcon fontSize="inherit" />}
          sx={{ mb: 2 }}
        >
          いいね！を送りました
        </Alert>
      </Snackbar>
      <Button
        variant="contained"
        size="large"
        sx={{
          borderRadius: 20,
          backgroundColor: '#f26a63',
          width: { md: 1130, xs: 370, sm: 700 },
        }}
        onClick={handleLike}
        disabled={isLoading || !currentUserId || isLiked}
        aria-label={isLiked ? 'いいね解除' : 'いいね'}
      >
        {isLiked ? 'いいね！済み' : 'いいね！'}
        <Typography variant="caption" fontSize={16} sx={{ ml: 1 }}>
          {likeCount}
        </Typography>
      </Button>
    </Box>
  );
};
