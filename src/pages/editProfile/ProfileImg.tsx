import supabase from '@/lib/supabase';
import { Box, Avatar, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useAtom } from 'jotai';
import { profileAtom } from '@/jotai/Jotai';
import { useAvatar } from '@/hooks/useAvatar';
import { useState } from 'react';

export const ProfileImg = () => {
  const [, setProfile] = useAtom(profileAtom);
  const [preview, setPreview] = useState<string | null>(null);
  const { profile } = useAvatar();

  // 画像アップロード処理
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const filePath = `avatars/${user.user.id}-${file.name}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (error) {
      console.error(' 画像アップロードエラー:', error);
      return;
    }

    // 画像の公開 URL を取得
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    setProfile({ ...profile, avatar_url: data.publicUrl });

    // データベースに画像の URL を保存
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(
        { id: user.user.id, avatar_url: data.publicUrl },
        { onConflict: 'id' }
      );

    if (updateError) console.error('画像 URL 更新エラー:', updateError);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="center" my={2}>
        <label htmlFor="avatar-upload">
          <input
            type="file"
            id="avatar-upload"
            style={{ display: 'none' }}
            accept="image/png, image/jpeg"
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
        {preview && <img src={preview} alt="preview" width="200%" />}
      </Box>
    </>
  );
};
