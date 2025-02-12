import { useAtom } from 'jotai';
import {
  loginModalAtom,
  emailAtom,
  passwordAtom,
  SignUpModalAtom,
} from '@/jotai/Jotai';
import { Dialog } from '@mui/material';

import supabase from '@/lib/supabase';

export const Login = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [loginModalOpen, setLoginModalOpen] = useAtom(loginModalAtom);
  const [SignUpOpen, setSignUpOpen] = useAtom(SignUpModalAtom);

  const handleSignIn = async () => {
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    // supabaseの認証情報を再取得して、useUser()の状態を更新
    await supabase.auth.getSession();

    alert('ログイン成功');
    setLoginModalOpen(false);
  };
  return (
    <Dialog open={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
      <input
        name="email"
        type="email"
        placeholder="メールアドレスを入力してください"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワードを入力してください"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>ログイン</button>
      <button onClick={() => setSignUpOpen(!SignUpOpen)}>新規登録</button>
    </Dialog>
  );
};
