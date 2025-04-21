import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { loginModalAtom, emailAtom, passwordAtom } from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  ThemeProvider,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import CheckIcon from '@mui/icons-material/Check';
import { darkTheme } from '@/pages/_app';
import { z } from 'zod';
import { useRouter } from 'next/router';

// メールアドレスとパスワードのバリデーションスキーマ
const loginSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
  password: z.string().min(1, 'パスワードは必須です'),
});

export const Login = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [loginModalOpen, setLoginModalOpen] = useAtom(loginModalAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAlert, setLoginAlert] = useState(false);
  const router = useRouter();

  // 入力変更時のバリデーション
  useEffect(() => {
    if (email || password) {
      try {
        loginSchema.parse({ email, password });
        setErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const path = err.path[0] as string;
            newErrors[path] = err.message;
          });
          setErrors(newErrors);
        }
      }
    }
  }, [email, password]);

  const handleClose = () => {
    setLoginModalOpen(false);
    setGeneralError('');
    setErrors({});
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* setLoginAlert(true);
    setTimeout(() => setLoginAlert(false), 3000);
    router.push('/search');
 */
    try {
      // フォーム送信時の最終バリデーション
      loginSchema.parse({ email, password });

      setIsLoading(true);
      setGeneralError('');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }

      setLoginAlert(true);
      setTimeout(() => setLoginAlert(false), 3000);

      handleClose();
      router.push('/search');
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setGeneralError(
          'ログインに失敗しました。メールアドレスとパスワードを確認してください。'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Snackbar
        open={loginAlert}
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
          ログインに成功しました
        </Alert>
      </Snackbar>
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
          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
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
              error={!!errors.email}
              helperText={errors.email}
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
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || Object.keys(errors).length > 0}
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
