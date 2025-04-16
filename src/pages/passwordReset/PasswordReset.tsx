import { useEffect, useState } from 'react';
import { passwordAtom } from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
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

export const PasswordReset = () => {
  const router = useRouter();
  const [password, setPassword] = useAtom(passwordAtom);
  const [passwordConf, setPasswordConf] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  useEffect(() => {
    if (passwordConf && password !== passwordConf) {
      setIsPasswordMatch(false);
    } else {
      setIsLoading(true);
    }
  }, [password, passwordConf]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordMatch || !password || !passwordConf) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
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
      setError('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          パスワードのリセット
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
            error={!isPasswordMatch}
            helperText={!isPasswordMatch ? 'パスワードが一致しません' : ''}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={
              isLoading || !isPasswordMatch || !password || !passwordConf
            }
          >
            {isLoading ? <CircularProgress size={24} /> : 'パスワードを変更'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
