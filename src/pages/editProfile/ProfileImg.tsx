import supabase from '@/lib/supabase';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Button,
  Grid2,
  Dialog,
  DialogContent,
  CardActions,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { useAvatar } from '@/hooks/useAvatar';
import { useAtom } from 'jotai';
import { currentUserAtom, subImgeAtom } from '@/jotai/Jotai';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProfileImageType } from '@/type/user';

export const ProfileImg = () => {
  const [currentUserId] = useAtom(currentUserAtom);
  const { profile, setProfile } = useAvatar();
  const [subImages, setSubImages] = useAtom(subImgeAtom);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /* const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null); */

  // 既存のサブ画像を取得
  useEffect(() => {
    // サブ画像の取得
    const fetchSubImages = async () => {
      if (!currentUserId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('sub_images')
          .eq('id', currentUserId)
          .single();

        if (error) throw error;
        if (data.sub_images && Array.isArray(data.sub_images)) {
          const formattedImages: ProfileImageType[] = data.sub_images.map(
            (url, index) => ({
              id: `sub-${index}-${Date.now()}`,
              url,
            })
          );

          setSubImages(formattedImages);
        }
      } catch (error) {
        console.error('サブ画像取得エラー:', error);
      }
    };
    fetchSubImages();
  }, [currentUserId, profile.avatar_url, setSubImages]);

  // メイン画像アップロード処理
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];

    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }

    // 画像ファイル形式チェック
    if (!file.type.match('image/(jpeg|jpg|png|webp)')) {
      alert('JPEG、PNG、WEBPファイルのみアップロードできます');
      return;
    }

    setIsLoading(true);

    try {
      const filePath = `avatars/${currentUserId}-${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) throw error;

      // 画像の公開 URL を取得
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: data.publicUrl });

      // データベースに画像の URL を保存
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(
          { id: currentUserId, avatar_url: data.publicUrl },
          { onConflict: 'id' }
        );

      if (updateError) console.error('画像 URL 更新エラー:', updateError);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      alert('画像のアップロードに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // サブ画像アップロード処理
  const handleSubImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);

    setIsLoading(true);

    try {
      const newImages: ProfileImageType[] = [];

      for (const file of files) {
        // ファイルサイズチェック
        /*  if (file.size > 4 * 1024 * 1024) {
          alert('ファイルサイズは5MB以下にしてください');
          continue;
        } */

        // 画像ファイル形式チェック
        if (!file.type.match('image/(jpeg|jpg|png|webp)')) {
          alert('JPEG、PNG、WEBPファイルのみアップロードできます');
          continue;
        }

        const filePath = `sub-images/${currentUserId}-${uuidv4()}-${file.name}`;

        const { error } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (error) throw error;

        // 画像の公開 URL を取得
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        newImages.push({
          id: `sub-${Date.now()}-${uuidv4()}`,
          url: data.publicUrl,
        });
      }

      // 既存の画像と新しい画像を結合
      const updatedSubImages = [...subImages, ...newImages];
      setSubImages(updatedSubImages);

      // データベースにサブ画像の URL を保存
      const { error: updateError } = await supabase.from('profiles').upsert(
        {
          id: currentUserId,
          sub_images: updatedSubImages.map((img) => img.url),
        },
        { onConflict: 'id' }
      );

      if (updateError) throw updateError;
    } catch (error) {
      console.error('サブ画像アップロードエラー:', error);
      alert('画像のアップロードに失敗しました');
    } finally {
      setIsLoading(false);
      // 入力フィールドをリセット
      event.target.value = '';
    }
  };

  // サブ画像をメイン画像に設定
  const setAsMainImage = async (imageUrl: string) => {
    setIsLoading(true);

    try {
      // 現在のメイン画像をサブ画像に移動（メイン画像が存在する場合）
      const updatedSubImages = [...subImages];

      if (profile.avatar_url) {
        updatedSubImages.push({
          id: `prev-main-${Date.now()}`,
          url: profile.avatar_url,
        });
      }

      // 選択した画像をサブ画像から削除
      const filteredSubImages = updatedSubImages.filter(
        (img) => img.url !== imageUrl
      );
      setSubImages(filteredSubImages);

      // プロフィールのアバターを更新
      setProfile({ ...profile, avatar_url: imageUrl });

      // データベースを更新
      const { error } = await supabase.from('profiles').upsert(
        {
          id: currentUserId,
          avatar_url: imageUrl,
          sub_images: filteredSubImages.map((img) => img.url),
        },
        { onConflict: 'id' }
      );

      if (error) throw error;
    } catch (error) {
      console.error('メイン画像設定エラー:', error);
      alert('メイン画像の設定に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // サブ画像の削除
  const deleteSubImage = async (imageUrl: string) => {
    setIsLoading(true);

    try {
      // 画像をリストから削除
      const updatedSubImages = subImages.filter((img) => img.url !== imageUrl);
      setSubImages(updatedSubImages);

      // データベースを更新
      const { error } = await supabase.from('profiles').upsert(
        {
          id: currentUserId,
          sub_images: updatedSubImages.map((img) => img.url),
        },
        { onConflict: 'id' }
      );

      if (error) throw error;

      // ストレージからファイルを削除 (オプション)
      // 注: URLからファイルパスを取得する処理が必要
      const filePath = imageUrl.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('avatars')
          .remove([`sub-images/${filePath}`]);
      }
    } catch (error) {
      console.error('サブ画像削除エラー:', error);
      alert('画像の削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 画像プレビュー
  const handlePreview = (url: string) => {
    setPreviewImage(url);
  };

  // メニューを開く
  /*  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }; */

  // メニューを閉じる
  /*  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  }; */

  return (
    <>
      <Box sx={{ p: 3 }}>
        {isLoading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 9999,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
        {/* メインアバター */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label htmlFor="avatar-upload">
            <input
              type="file"
              id="avatar-upload"
              style={{ display: 'none' }}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAvatarUpload}
              disabled={isLoading}
            />
            <IconButton component="span">
              <Avatar
                sx={{
                  width: { xs: 200, sm: 160, md: 250 },
                  height: { xs: 200, sm: 160, md: 250 },
                }}
                src={profile.avatar_url || ''}
              >
                <CameraAltIcon />
              </Avatar>
            </IconButton>
          </label>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            メイン写真
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            クリックして変更
          </Typography>

          {profile.avatar_url && (
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => handlePreview(profile.avatar_url || '')}
              sx={{ mt: 1 }}
            >
              プレビュー
            </Button>
          )}
        </Box>

        {/* 追加画像セクション */}
        <Box sx={{ mt: 4 }}>
          <Typography pl={{ md: 15, xs: 5 }} variant="h6" gutterBottom>
            追加の写真（最大3枚）
            {subImages.length < 3 && (
              <label htmlFor="sub-image-upload">
                <input
                  type="file"
                  id="sub-image-upload"
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleSubImageUpload}
                  multiple
                  disabled={isLoading}
                />
                <AddAPhotoIcon sx={{ cursor: 'pointer' }} />
              </label>
            )}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* 既存のサブ画像 */}
            {subImages.map((image) => (
              <Grid2 size={{ xs: 6, sm: 4, md: 4 }} key={image.id}>
                <label htmlFor="sub-image-upload">
                  <input
                    type="file"
                    id="sub-image-upload"
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleSubImageUpload}
                    multiple
                    disabled={isLoading}
                  />
                  <IconButton component="span">
                    <Avatar
                      sx={{
                        width: { xs: 80, sm: 110, md: 130 },
                        height: { xs: 80, sm: 110, md: 130 },
                        objectFit: 'cover',
                      }}
                      src={image.url || ''}
                      alt="サブ画像"
                    >
                      <CameraAltIcon />
                    </Avatar>
                  </IconButton>
                </label>
                {/* サイズ変更するかも */}
                <Box>
                  <CardActions
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <IconButton
                      onClick={() => setAsMainImage(image.url)}
                      disabled={isLoading}
                    >
                      <ChangeCircleIcon />
                    </IconButton>
                    {/* <IconButton onClick={() => handlePreview(image.url)}>
                      <VisibilityIcon />
                    </IconButton> */}
                    <IconButton
                      onClick={() => deleteSubImage(image.url)}
                      disabled={isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Box>

                {/*  <Menu
                  id={`menu-${image.id}`}
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    'aria-labelledby': `menu-button-${image.id}`,
                  }}
                >
                  <MenuItem onClick={() => handleSubImageUpload}>
                    <label htmlFor="sub-image-upload">
                      <input
                        type="file"
                        id="sub-image-upload"
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleSubImageUpload}
                        disabled={isLoading}
                      />
                    </label>
                    写真を変更
                  </MenuItem>
                  <MenuItem
                    onClick={() => setAsMainImage(image.url)}
                    disabled={isLoading}
                  >
                    メインに設定
                  </MenuItem>

                  <MenuItem onClick={() => handlePreview(image.url)}>
                    プレビュー
                  </MenuItem>

                  <MenuItem
                    onClick={() => deleteSubImage(image.url)}
                    disabled={isLoading}
                  >
                    削除
                  </MenuItem>
                </Menu> */}
              </Grid2>
            ))}
          </Box>
        </Box>
        {/* プレビューダイアログ */}
        <Dialog
          open={!!previewImage}
          onClose={() => setPreviewImage(null)}
          maxWidth="md"
        >
          <DialogContent sx={{ p: 0, height: { md: 600, xs: 270 } }}>
            {previewImage && (
              <img
                src={previewImage}
                alt="画像プレビュー"
                style={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};
