import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {
  alertAtom,
  currentUserAtom,
  isLoadingAtom,
  postAtom,
} from '@/jotai/Jotai';
import { deletePost } from '../api/posts/post';
import {
  Card,
  CardContent,
  IconButton,
  Menu,
  Typography,
  MenuItem,
  Avatar,
  Box,
  Button,
  CircularProgress,
  styled,
  TextField,
  Container,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';
import ImageIcon from '@mui/icons-material/Image';
import CheckIcon from '@mui/icons-material/Check';
import supabase from '@/lib/supabase';
import { useAvatar } from '@/hooks/useAvatar';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getPost, addPost } from '../api/posts/post';
import styles from '@/styles/postDialog.module.css';

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('データ取得エラー:', error);
    return { props: { initialPosts: [] } };
  }

  return { props: { initialPosts: posts } };
};

const StyledCard = styled(Card)(({}) => ({
  marginBottom: '16px',
  position: 'relative',
}));

const MAX_CHARS = 280;

export const PostList = ({ initialPosts = [] }) => {
  const [posts, setPosts] = useAtom(postAtom);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{
    [key: number]: HTMLElement | null;
  }>({});
  const [currentUserId, setCurrentUserId] = useAtom(currentUserAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const [open, setOpen] = useAtom(alertAtom);
  const [content, setContent] = useState('');
  const { profile } = useAvatar();
  const router = useRouter();

  const remainingChars = MAX_CHARS - content.length;

  useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
    }

    const fetchUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        setCurrentUserId(user.user.id);
      }
    };
    fetchUser();
  }, [setCurrentUserId, setPosts, initialPosts]);

  // メニューを開く
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  // メニューを閉じる
  const handleMenuClose = (id: number) => {
    setMenuAnchorEl((prev) => ({ ...prev, [id]: null }));
  };

  // 投稿を削除する関数
  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content === '') return;
    await addPost(content);
    setContent('');
    setPosts(await getPost());
  };

  const handleAlert = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  return (
    <>
      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          <Snackbar
            open={open}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              削除しました
            </Alert>
          </Snackbar>
          <form onSubmit={handleSubmit}>
            <Card sx={{ mb: 2 }}>
              <CardContent className={styles.dialogContent}>
                <Box className={styles.postContainer}>
                  <Avatar
                    src={profile.avatar_url}
                    alt={profile.username}
                    sx={{ width: 48, height: 48, mt: 1 }}
                  />

                  <Box className={styles.inputContainer}>
                    <TextField
                      minRows={4}
                      multiline
                      fullWidth
                      placeholder="合トレを募集しよう"
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

                    {/* 画像プレビュー領域 */}
                    {/* {imageUrls.length > 0 && (
              <Box className={styles.imagePreviewContainer}>
                {imageUrls.map((url, index) => (
                  <Box key={index} className={styles.imagePreview}>
                    <img src={url} alt={`Preview ${index}`} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      className={styles.removeImageButton}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )} */}

                    <Divider className={styles.divider} />

                    {/* アイコンツールバー */}
                    <Box className={styles.toolbar}>
                      <Box className={styles.toolbarIcons}>
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          accept="image/*"
                          multiple
                        />
                        <IconButton className={styles.toolbarIcon} size="small">
                          <ImageIcon className={styles.icon} />
                        </IconButton>
                      </Box>

                      <Box className={styles.postControls}>
                        {/* 文字数カウンター（残り文字数が少なくなると円形プログレス表示） */}
                        {remainingChars <= 20 ? (
                          <CircularProgress
                            variant="determinate"
                            value={(remainingChars / MAX_CHARS) * 100}
                            size={24}
                            thickness={5}
                            className={
                              remainingChars < 0
                                ? styles.negativeProgress
                                : styles.progress
                            }
                          />
                        ) : null}

                        {/* 残り文字数表示 */}
                        {remainingChars <= 20 && (
                          <Typography
                            variant="body2"
                            className={
                              remainingChars < 0
                                ? styles.negativeCounter
                                : styles.counter
                            }
                          >
                            {remainingChars}
                          </Typography>
                        )}

                        {/* 投稿ボタン */}
                        <Button
                          type="submit"
                          variant="contained"
                          className={styles.postButton}
                        >
                          投稿する
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </form>

          <Box sx={{ mb: 2 }}>
            {posts.map((post) => (
              <StyledCard key={post.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* 自分のアイコンをクリックしてもプロフィールが表示されないようにする三項演算子 */}
                    <Avatar
                      src={
                        post.user_id === currentUserId
                          ? profile.avatar_url
                          : post.profiles?.avatar_url || ''
                      }
                      sx={{ width: 48, height: 48 }}
                      onClick={() => {
                        if (post.user_id !== currentUserId) {
                          router.push(
                            `/profile/${
                              post.profiles?.username || post.user_id
                            }`
                          );
                        }
                      }}
                    >
                      {/* アイコンがない場合ユーザーの頭文字を表示する */}
                      {post.profiles?.username?.charAt(0) || 'U'}
                    </Avatar>
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
                        <Typography variant="body2" color="text.secondary">
                          · 2h
                        </Typography>
                        {/* メニュー */}
                        <Menu
                          id={`menu-${post.id}`}
                          anchorEl={menuAnchorEl[post.id]}
                          open={Boolean(menuAnchorEl[post.id])}
                          onClose={() => handleMenuClose(post.id)}
                          MenuListProps={{
                            'aria-labelledby': `menu-button-${post.id}`,
                          }}
                        >
                          {/* メニューの内容をログインユーザーと投稿者で切り替える処理 */}
                          {post.user_id === currentUserId ? (
                            <MenuItem
                              onClick={() => {
                                handleDelete(post.id);
                                handleMenuClose(post.id);
                              }}
                            >
                              <DeleteIcon onClick={handleAlert} />
                              削除
                            </MenuItem>
                          ) : (
                            <Menu
                              id={`menu-${post.id}`}
                              anchorEl={menuAnchorEl[post.id]}
                              open={Boolean(menuAnchorEl[post.id])}
                              onClose={() => handleMenuClose(post.id)}
                              MenuListProps={{
                                'aria-labelledby': `menu-button-${post.id}`,
                              }}
                            >
                              <MenuItem
                                onClick={() => alert('ブロックしました')}
                              >
                                <BlockIcon sx={{ marginRight: 1 }} />
                                ブロック
                              </MenuItem>
                              <MenuItem
                                onClick={() => alert('ミュートしました')}
                              >
                                <BlockIcon sx={{ marginRight: 1 }} />
                                ミュート
                              </MenuItem>
                              <MenuItem onClick={() => alert('報告しました')}>
                                <ReportIcon sx={{ marginRight: 1 }} />
                                報告
                              </MenuItem>
                            </Menu>
                          )}
                        </Menu>
                      </Box>

                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {post.content}
                      </Typography>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: '65%',
                          left: '95%',
                        }}
                      >
                        <IconButton
                          aria-label="more"
                          onClick={(e) => handleMenuOpen(e, post.id)}
                          sx={{ padding: 1 }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PostList;
