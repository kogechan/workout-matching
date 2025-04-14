import { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Grid2,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface User {
  id: string;
  username: string;
  avatar_url: string;
  location: string;
  training_experience: string;
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

  const MotionGridItem = motion.create(Grid2);

  // タブパネルの内容を表示するコンポーネント
  const UserList = ({ users }: { users: User[] }) => {
    return users.length === 0 ? (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          minHeight: '200px',
        }}
      >
        <PersonIcon
          sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }}
        />
        <Typography variant="body1" color="text.secondary">
          {tabValue === 0
            ? 'まだ誰もあなたにいいねしていません'
            : 'まだ誰にもいいねしていません'}
        </Typography>
      </Box>
    ) : (
      <>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, px: 2 }}
        >
          {users.length}人のユーザーが見つかりました
        </Typography>

        <Grid2 container spacing={2}>
          {users.map((user, index) => (
            <MotionGridItem
              key={user.id}
              size={{ xs: 6, sm: 4, md: 3 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => router.push(`/profile/${user.username}`)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '100%',
                    bgcolor: 'grey.100',
                  }}
                >
                  {user.avatar_url ? (
                    <CardMedia
                      component="img"
                      className="styles.profileImage"
                      src={user.avatar_url}
                      alt={user.username}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                      }}
                    >
                      <CardMedia
                        component="img"
                        className="styles.profileImage"
                        src="/Avatar/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg"
                        alt={user.username}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {user.username}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    {user.location && (
                      <Chip
                        label={user.location}
                        size="small"
                        icon={<LocationOnIcon fontSize="small" />}
                        sx={{ height: 24, fontSize: '0.75rem' }}
                      />
                    )}
                    {user.training_experience && (
                      <Chip
                        label={user.training_experience}
                        size="small"
                        icon={<FitnessCenterIcon fontSize="small" />}
                        sx={{ height: 24, fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </MotionGridItem>
          ))}
        </Grid2>
      </>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          いいね情報を読み込み中...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontWeight: 'medium',
              textTransform: 'none',
            },
          }}
          TabIndicatorProps={{
            sx: {
              height: 3,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span>相手からのいいね</span>
                {likedByUsers.length > 0 && (
                  <Chip
                    label={likedByUsers.length}
                    size="small"
                    color="secondary"
                    sx={{ ml: 1, height: 20, minWidth: 20 }}
                  />
                )}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span>自分からのいいね</span>
                {likedUsers.length > 0 && (
                  <Chip
                    label={likedUsers.length}
                    size="small"
                    color="primary"
                    sx={{ ml: 1, height: 20, minWidth: 20 }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      <Box sx={{ py: 2 }}>
        {tabValue === 0 ? (
          <UserList users={likedByUsers} />
        ) : (
          <UserList users={likedUsers} />
        )}
      </Box>
    </>
  );
};

export default LikeList;
