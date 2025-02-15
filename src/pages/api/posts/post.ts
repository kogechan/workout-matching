import supabase from '@/lib/supabase';

// 投稿の取得
export const getPost = async () => {
  const user = await supabase.auth.getUser();
  if (!user?.data?.user) {
    console.error('認証されていません');
    return [];
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('エラー:', error);
    return [];
  }
  return data;
};

// 投稿の作成
export const addPost = async (content: string) => {
  const user = await supabase.auth.getUser();
  if (!user?.data?.user) {
    console.error('認証されていません');
    return;
  }

  const { data } = await supabase.from('posts').insert([
    {
      content,
      user_id: user.data.user.id, // 確実に `user_id` を取得する
    },
  ]);
  return data;
};

// 投稿の削除
export const deletePost = async (postId: number) => {
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    console.error('削除エラー:', error);
  }
};
