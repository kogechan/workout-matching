// LikesTabView.tsx
import { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Typography,
  Avatar,
  CircularProgress,
  Box,
} from '@mui/material';
import styles from '@/styles/likes.module.css';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/router';

interface User {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

const LikeList = () => {
  const [tabValue, setTabValue] = useState(0);
  const [likedByUsers, setLikedByUsers] = useState<User[]>([]);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchLikes(session.user.id);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const fetchLikes = async (userId: string) => {
    // 自分にいいねしたユーザーを取得
    const { data: likedByMe } = await supabase
      .from('likes')
      .select('user_id')
      .eq('liked_user_id', userId);

    // 自分がいいねしたユーザーを取得
    const { data: iLiked } = await supabase
      .from('likes')
      .select('liked_user_id')
      .eq('user_id', userId);

    // ユーザー情報を取得
    if (likedByMe?.length) {
      const userIds = likedByMe.map((like) => like.user_id);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      setLikedByUsers((data as User[]) || []);
    }

    if (iLiked?.length) {
      const userIds = iLiked.map((like) => like.liked_user_id);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      setLikedUsers((data as User[]) || []);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={styles.container}>
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        variant="fullWidth"
        className={styles.tabs}
      >
        <Tab label="相手からのいいね" />
        <Tab label="自分からのいいね" />
      </Tabs>

      <div className={styles.tabPanel} hidden={tabValue !== 0}>
        {likedByUsers.length === 0 ? (
          <Typography className={styles.emptyMessage}>
            まだ誰もあなたにいいねしていません
          </Typography>
        ) : (
          likedByUsers.map((user) => (
            <div
              key={user.id}
              className={styles.userCard}
              onClick={() => router.push(`/profile/${user.username}`)}
            >
              <Avatar
                src={user.avatar_url || ''}
                alt={user.username}
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <Typography variant="subtitle1">{user.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(user.created_at).toLocaleDateString()}
                  にアカウント作成
                </Typography>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.tabPanel} hidden={tabValue !== 1}>
        {likedUsers.length === 0 ? (
          <Typography className={styles.emptyMessage}>
            まだ誰にもいいねしていません
          </Typography>
        ) : (
          likedUsers.map((user) => (
            <div
              key={user.id}
              className={styles.userCard}
              onClick={() => router.push(`/profile/${user.username}`)}
            >
              <Avatar
                src={user.avatar_url || ''}
                alt={user.username}
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <Typography variant="subtitle1">{user.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(user.created_at).toLocaleDateString()}
                  にアカウント作成
                </Typography>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LikeList;
