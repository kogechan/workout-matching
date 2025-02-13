import { useState } from 'react';
import { passwordAtom } from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';

export const PasswordReset = () => {
  const router = useRouter();
  const [password, setPassword] = useAtom(passwordAtom);
  const [passwordConf, setPasswordConf] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      alert('エラーが発生しました');
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        type="password"
        placeholder="パスワード"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワードを確認"
        required
        value={passwordConf}
        onChange={(e) => setPasswordConf(e.target.value)}
      />
      <button type="submit">パスワードを変更</button>
    </form>
  );
};
