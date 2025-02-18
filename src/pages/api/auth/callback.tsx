import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error('認証に失敗しました', error);
        router.replace('/'); // 認証失敗時はログインページへ
        return;
      }

      console.log('認証成功:', data.user);
      router.replace('/profile'); // 認証成功時はプロフィール作成ページへ
    };

    checkUser();
  }, [router]);

  return <p>認証中...</p>;
}
