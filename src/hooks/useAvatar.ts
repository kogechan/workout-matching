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
        .eq('id', user.user.id)
        .maybeSingle();

      if (error) console.error('プロフィール取得エラー:', error);
      if (data) setProfile(data);

      setProfile(() => ({
        username: data?.username || '',
        bio: data?.bio || '',
        gender: data?.gender || '',
        age: data?.age || '',
        location: data?.location || '',
        training_experience: data?.training_experience || '',
        avatar_url: data?.avatar_url || '',
        favorite_muscle: data?.favorite_muscle || '',
        difficult_muscle: data?.difficult_muscle || '',
        belong_gym: data?.belong_gym || '',
      }));

      setLoading(false);
    };

    fetchProfile();
  }, [setProfile]);

  return { profile, loading, setProfile };
};
