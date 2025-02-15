import { useAtom } from 'jotai';
import {
  loginModalAtom,
  emailAtom,
  passwordAtom,
  signUpModalAtom,
} from '@/jotai/Jotai';
import { Dialog } from '@mui/material';

import supabase from '@/lib/supabase';

export const Login = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [loginModalOpen, setLoginModalOpen] = useAtom(loginModalAtom);
  const [SignUpOpen, setSignUpOpen] = useAtom(signUpModalAtom);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (signInError) {
        throw signInError;
      }
    } catch {
      alert('エラーが発生しました');
    }
    setLoginModalOpen(false);
  };
  return (
    <Dialog open={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
      <form onSubmit={onLogin}>
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
        <button type="submit">ログイン</button>
      </form>
      <button onClick={() => setSignUpOpen(!SignUpOpen)}>
        まだアカウントをお持ちでない方はこちら
      </button>
    </Dialog>
  );
};
