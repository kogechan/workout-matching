import { useAtom } from 'jotai';
import { logoutModalAtom } from '@/jotai/Jotai';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ThemeProvider,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import { useState } from 'react';
import { darkTheme } from '@/pages/_app';

export const LogoutAlert = () => {
  const [logoutModalOpen, setLogoutModalOpen] = useAtom(logoutModalAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleClose = () => {
    setLogoutModalOpen(false);
    setError('');
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        throw logoutError;
      }
      handleClose();
      router.push('/');
    } catch (error) {
      console.error(error);
      setError('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={logoutModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            style: {
              borderRadius: 16,
            },
          },
        }}
      >
        <DialogTitle>ログアウトの確認</DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body1">
            ログアウトしますか？いつでもログインし直すことができます。
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="primary" disabled={isLoading}>
            キャンセル
          </Button>
          <Button
            onClick={handleLogout}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <LogoutIcon />
              )
            }
            disabled={isLoading}
          >
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
