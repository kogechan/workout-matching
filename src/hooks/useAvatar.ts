import { profileAtom } from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

export const useAvatar = () => {
  const [profile, setProfile] = useAtom(profileAtom);
  const [loading, setLoading] = useState(true);

  // リロードしてもアイコン画像が反映されるようフックで管理
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) console.error('プロフィール取得エラー:', error);
      if (data) setProfile(data);

      setLoading(false);
    };

    fetchProfile();
  }, [setProfile]);

  return { profile, loading, setProfile };
};
