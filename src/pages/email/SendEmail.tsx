import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { emailAtom } from '@/jotai/Jotai';
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

export const SendEmail = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: sendEmailError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:3000/passwordReset/',
        });
      if (sendEmailError) {
        throw sendEmailError;
      }
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          パスワードリセット
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          登録したメールアドレスにパスワードリセットのリンクを送信します。
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            パスワード設定メールを送信しました。メールを確認してください。
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate>
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
            type="email"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<EmailIcon />}
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !email}
          >
            {isLoading ? <CircularProgress size={24} /> : 'メールを送信'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
