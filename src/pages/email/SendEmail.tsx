import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { emailAtom } from '@/jotai/Jotai';

export const SendEmail = () => {
  const [email, setEmail] = useAtom(emailAtom);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error: sendEmailError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:3000/passwordReset/',
        });
      if (sendEmailError) {
        throw sendEmailError;
      }
      alert('パスワード設定メールを確認してください');
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
      <button type="submit">メールを送信</button>
    </form>
  );
};
