import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { emailAtom } from '@/jotai/Jotai';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CheckIcon from '@mui/icons-material/Check';
import { z } from 'zod';

// メールアドレスのバリデーションスキーマ
const emailSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
});

export const SendEmail = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  // メールアドレス入力のバリデーション
  useEffect(() => {
    if (email) {
      try {
        emailSchema.parse({ email });
        setEmailError('');
      } catch (error) {
        if (error instanceof z.ZodError) {
          setEmailError(error.errors[0].message);
        }
      }
    }
  }, [email]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // フォーム送信時の最終バリデーション
      emailSchema.parse({ email });

      setIsLoading(true);
      setError('');
      setSuccess(false);

      const { error: sendEmailError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `https://workout-matching.vercel.app/passwordReset/`,
        });
      if (sendEmailError) {
        throw sendEmailError;
      }
      setSuccess(true);
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      } else {
        setError('メール送信中にエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // http://localhost:3000/passwordReset/

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
        }}
      >
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
          <Alert
            severity="success"
            icon={<CheckIcon fontSize="inherit" />}
            sx={{ mb: 2 }}
          >
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
            error={!!emailError}
            helperText={emailError}
            type="email"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<EmailIcon />}
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !!emailError || !email}
          >
            {isLoading ? <CircularProgress size={24} /> : 'メールを送信'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
