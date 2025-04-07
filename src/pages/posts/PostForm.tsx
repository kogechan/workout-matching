import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { postAtom, postModalAtom } from '@/jotai/Jotai';
import { getPost, addPost } from '@/pages/api/posts/post';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useAvatar } from '@/hooks/useAvatar';
import styles from '@/styles/postDialog.module.css';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import CheckIcon from '@mui/icons-material/Check';
import { useAlert } from '@/hooks/useAlert';

const MAX_CHARS = 280;

export const PostForm = () => {
  const [, setPosts] = useAtom(postAtom);
  const [content, setContent] = useState('');
  const [postModalOpen, setPostModalOpen] = useAtom(postModalAtom);
  const { profile } = useAvatar();
  const { postAlert, PostAlert } = useAlert();

  const remainingChars = MAX_CHARS - content.length;

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPost();
      if (data.length > 0) {
        setPosts(data);
      }
    };
    fetchPosts();
  }, [setPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content === '') return;
    await addPost(content);
    setContent('');
    setPosts(await getPost());
    PostAlert();
  };

  return (
    <>
      <Snackbar
        open={postAlert}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          投稿に成功しました
        </Alert>
      </Snackbar>
      <Dialog
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            style: { borderRadius: 16 },
          },
        }}
      >
        <DialogTitle className={styles.dialogTitle}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setPostModalOpen(false)}
            aria-label="close"
            className={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className={styles.dialogContent}>
          <form onSubmit={handleSubmit}>
            <Box className={styles.postContainer}>
              <Avatar
                src={profile.avatar_url}
                alt={profile.username}
                sx={{ width: 48, height: 48 }}
              />

              <Box className={styles.inputContainer}>
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

                {/* アイコンツールバー */}
                <Box className={styles.toolbar}>
                  <Box className={styles.toolbarIcons}>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      accept="image/*"
                      multiple
                    />
                    {/* <IconButton className={styles.toolbarIcon} size="small">
                      <ImageIcon className={styles.icon} />
                    </IconButton> */}
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
                      onClick={() => setPostModalOpen(false)}
                      className={styles.postButton}
                    >
                      投稿する
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
