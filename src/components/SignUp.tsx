import { useAtom } from 'jotai';
import { emailAtom, passwordAtom, SignUpModalAtom } from '@/jotai/Jotai';
import { Dialog } from '@mui/material';
import supabase from '@/lib/supabase';
import Link from 'next/link';

export const SignUp = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [SignUpOpen, setSignUpOpen] = useAtom(SignUpModalAtom);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (signUpError) {
        throw signUpError;
      }
      alert('登録完了メールを確認してください');
    } catch (error) {
      console.log(error);
      alert('エラーが発生しました');
    }
    setSignUpOpen(false);
  };

  return (
    <Dialog open={SignUpOpen} onClose={() => setSignUpOpen(false)}>
      <form onSubmit={onSubmit}>
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
        <button type="submit">サインアップ</button>
      </form>
      <Link href="email">パスワードをお忘れですか？</Link>
    </Dialog>
  );
};
