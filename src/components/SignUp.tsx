import { useAtom } from 'jotai';
import { emailAtom, passwordAtom, SignUpModalAtom } from '@/jotai/Jotai';
import { Dialog } from '@mui/material';
import supabase from '@/lib/supabase';

export const SignUp = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [SignUpOpen, setSignUpOpen] = useAtom(SignUpModalAtom);

  const handleSignUp = async () => {
    await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    // supabaseの認証情報を再取得して、useUser()の状態を更新
    await supabase.auth.getSession();

    alert('登録成功');
    setSignUpOpen(false);
  };

  return (
    <Dialog open={SignUpOpen} onClose={() => setSignUpOpen(false)}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>サインアップ</button>
    </Dialog>
  );
};
