import { useState } from 'react';
import supabase from '@/lib/supabase';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useAtom } from 'jotai';
import { profileAtom } from '@/jotai/Jotai';

export const ProfileImg = () => {
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useAtom(profileAtom);

  // 画像アップロード処理
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setUploading(true);
    const file = event.target.files[0];
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const filePath = `avatars/${user.user.id}-${file.name}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { cacheControl: '0', upsert: true });

    if (error) {
      console.error(' 画像アップロードエラー:', error);
      setUploading(false);
      return;
    }

    // 画像の公開 URL を取得
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    setProfile({ ...profile, avatar_url: data.publicUrl });

    // データベースに画像の URL を保存
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('user_id', user.user.id);

    if (updateError) console.error('画像 URL 更新エラー:', updateError);

    setUploading(false);
  };

  return (
    <>
      <Typography variant="h5" align="center">
        プロフィール
      </Typography>

      {/* アバター画像のアップロード */}
      <Box display="flex" justifyContent="center" my={2}>
        <label htmlFor="avatar-upload">
          <input
            type="file"
            id="avatar-upload"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleAvatarUpload}
          />
          <IconButton component="span">
            <Avatar
              sx={{ width: 100, height: 100, cursor: 'pointer' }}
              src={profile.avatar_url}
            >
              <CameraAltIcon />
            </Avatar>
          </IconButton>
        </label>
      </Box>
    </>
  );
};
