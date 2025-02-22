import supabase from '@/lib/supabase';

// メッセージの取得・送信
export const getMessage = async () => {
  const user = await supabase.auth.getUser();
  if (!user?.data?.user) {
    console.error('認証されていません');
    return [];
  }

  // メッセージの取得 (最新順)
  const { data, error } = await supabase
    .from('messages')
    .select('id, user_id, content, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('エラー:', error);
    return [];
  }
  return data;
};

export const sendMessage = async (content: string) => {
  const user = await supabase.auth.getUser();
  if (!user?.data?.user) {
    console.error('認証されていません');
    return;
  }
  // メッセージを送信
  const { data } = await supabase.from('messages').insert([
    {
      user_id: user.data.user.id,
      content,
    },
  ]);
  return data;
};
