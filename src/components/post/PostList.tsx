import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { currentUserAtom, postAtom } from '@/jotai/Jotai';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Container,
  Divider,
  Snackbar,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import supabase from '@/lib/supabase';
import { useAvatar } from '@/hooks/useAvatar';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getPost, addPost, deletePost } from '../../pages/api/posts/post';
import styles from '@/styles/postDialog.module.css';
import { MoreHoriz } from './MoreHoriz';
import dayjs from '@/hooks/dayjs';
import { useAlert } from '@/hooks/useAlert';

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('データ取得エラー:', error);
    return { props: { initialPosts: [] } };
  }

  return { props: { initialPosts: posts } };
};

const MAX_CHARS = 280;

export const PostList = ({ initialPosts = [] }) => {
  const [posts, setPosts] = useAtom(postAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);
  const { profile } = useAvatar();
  const { deleteAlert, DeleteAlert } = useAlert();
  const router = useRouter();

  const remainingChars = MAX_CHARS - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20 && remainingChars >= 0;
  const isEmpty = content.trim() === '';

  useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
    }
    setLoading(false);
  }, [setPosts, initialPosts]);

  // 投稿を削除する関数
  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
      DeleteAlert();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content === '') return;
    try {
      await addPost(content);
      setContent('');
      setPosts(await getPost());
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 3000);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          <Snackbar
            open={deleteAlert}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              sx={{ borderRadius: '8px', fontWeight: 'medium' }}
            >
              投稿を削除しました
            </Alert>
          </Snackbar>
          <Snackbar
            open={postSuccess}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              sx={{ borderRadius: '8px', fontWeight: 'medium' }}
            >
              投稿に成功しました
            </Alert>
          </Snackbar>

          <form onSubmit={handleSubmit}>
            <Card sx={{ mb: 0, borderRadius: 0 }}>
              <CardContent className={styles.dialogContent}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar
                    src={profile.avatar_url}
                    alt={profile.username}
                    sx={{ width: 48, height: 48, mt: 1 }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      minRows={4}
                      multiline
                      fullWidth
                      placeholder="合トレを募集してみよう"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      variant="standard"
                      slotProps={{
                        input: {
                          disableUnderline: true,
                          className: styles.textField,
                        },
                      }}
                      className={styles.textFieldWrapper}
                    />

                    <Divider className={styles.divider} />

                    <Box className={styles.toolbar}>
                      <Box>
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          accept="image/*"
                          multiple
                        />
                      </Box>
                      <Box className={styles.postControls}>
                        {(isNearLimit || isOverLimit) && (
                          <>
                            <CircularProgress
                              variant="determinate"
                              value={(remainingChars / MAX_CHARS) * 100}
                              size={24}
                              thickness={5}
                              className={
                                isOverLimit
                                  ? styles.negativeProgress
                                  : styles.progress
                              }
                            />
                            <Typography
                              variant="body2"
                              className={
                                isOverLimit
                                  ? styles.negativeCounter
                                  : styles.counter
                              }
                            >
                              {remainingChars}
                            </Typography>
                          </>
                        )}

                        <Button
                          type="submit"
                          variant="contained"
                          className={styles.postButton}
                          disabled={isEmpty || isOverLimit}
                        >
                          投稿する
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Divider />
          </form>

          {posts.length === 0 && !loading ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
              <Typography variant="h6" color="text.secondary">
                投稿がありません
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ mb: 2 }}>
              {posts.map((post, idx) => (
                <Box key={post.id}>
                  <Card sx={{ mb: 0, position: 'relative', borderRadius: 0 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* 自分のアイコンをクリックしてもプロフィールが表示されないようにする三項演算子 */}
                        <Avatar
                          src={
                            post.user_id === currentUserId
                              ? profile.avatar_url ||
                                '/Avatar/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg'
                              : post.profiles?.avatar_url ||
                                '/Avatar/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg'
                          }
                          sx={{
                            width: 48,
                            height: 48,
                            cursor:
                              post.user_id === currentUserId
                                ? 'default'
                                : 'pointer',
                          }}
                          onClick={() => {
                            if (post.user_id !== currentUserId) {
                              router.push(
                                `/profile/${
                                  post.profiles?.username || post.user_id
                                }`
                              );
                            }
                          }}
                        ></Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {post.profiles?.username}
                            </Typography>
                            <Chip
                              label={dayjs(post.created_at).format(
                                'YYYY/MM/DD'
                              )}
                              size="small"
                              sx={{
                                height: '20px',
                                fontSize: '0.7rem',
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontStyle: 'italic' }}
                            >
                              {dayjs(post.created_at).fromNow()}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body1"
                            sx={{
                              mb: 2,
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {post.content}
                          </Typography>
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                            }}
                          >
                            <MoreHoriz
                              post={post}
                              onDeletePost={handleDelete}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  {idx !== posts.length - 1 && (
                    <Divider
                      sx={{
                        borderBottomWidth: '0.1px',
                        borderColor: '#636B74',
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default PostList;
