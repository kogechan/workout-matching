import { useState, useEffect } from 'react';
import { passwordAtom } from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { z } from 'zod';

// バリデーションスキーマの定義
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[a-z]/, '小文字を含める必要があります')
    .regex(/[0-9]/, '数字を含める必要があります'),
  passwordConf: z.string(),
});

// パスワードの一致確認
const passwordValidationSchema = passwordSchema.refine(
  (data) => data.password === data.passwordConf,
  {
    message: 'パスワードが一致しません',
    path: ['passwordConf'],
  }
);

export const PasswordReset = () => {
  const router = useRouter();
  const theme = useTheme();
  const [password, setPassword] = useAtom(passwordAtom);
  const [passwordConf, setPasswordConf] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // リアルタイムバリデーション
  useEffect(() => {
    if (password || passwordConf) {
      try {
        passwordValidationSchema.parse({ password, passwordConf });
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
  }, [password, passwordConf]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // フォーム送信時の最終バリデーション
      passwordValidationSchema.parse({ password, passwordConf });

      setIsLoading(true);
      setGeneralError('');

      const { error: passwordResetError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordResetError) {
        throw passwordResetError;
      }

      await router.push('/');
      alert('パスワード変更が完了しました');
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
        setGeneralError('パスワードの更新中にエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          bgcolor:
            theme.palette.mode === 'dark' ? 'background.paper' : undefined,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          パスワードのリセット
        </Typography>

        {generalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="新しいパスワード"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordConfirmation"
            label="パスワードを確認"
            type="password"
            id="passwordConfirmation"
            autoComplete="new-password"
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            error={!!errors.passwordConf}
            helperText={errors.passwordConf}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? <CircularProgress size={24} /> : 'パスワードを変更'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
