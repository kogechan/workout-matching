import { useAtom } from 'jotai';
import { emailAtom, passwordAtom } from '@/jotai/Jotai';
import supabase from '@/lib/supabase';

export const SignUp = () => {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`, // 認証後のリダイレクト先
        },
      });
      if (signUpError) {
        throw signUpError;
      }
      alert('メールを確認してください');
    } catch (error) {
      console.log(error);
      alert('エラーが発生しました');
    }
  };

  return (
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
      <button type="submit">新規登録</button>
    </form>
  );
};
