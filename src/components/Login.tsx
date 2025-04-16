import { useAtom } from 'jotai';
import { loginModalAtom, emailAtom, passwordAtom } from '@/jotai/Jotai';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import { useState } from 'react';
import { darkTheme } from '@/pages/_app';

export const Login = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [loginModalOpen, setLoginModalOpen] = useAtom(loginModalAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setLoginModalOpen(false);
    setError('');
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }
      handleClose();
    } catch {
      setError('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={loginModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            style: {
              borderRadius: 16,
            },
          },
        }}
      >
        <DialogTitle>
          ログイン
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'ログイン'}
            </Button>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Link
              href="email"
              onClick={handleClose}
              style={{ marginBottom: '8px', textDecoration: 'none' }}
            >
              <Typography color="primary" variant="body2">
                パスワードをお忘れですか？
              </Typography>
            </Link>
            <Link
              href="acount"
              onClick={handleClose}
              style={{ textDecoration: 'none' }}
            >
              <Typography color="primary" variant="body2">
                まだアカウントをお持ちでない方はこちら
              </Typography>
            </Link>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};
