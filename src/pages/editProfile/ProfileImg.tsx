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
  Backdrop,
  Paper,
  Zoom,
  Fab,
  Tooltip,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
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
  const [hoverMain, setHoverMain] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    /*  if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    } */

    // 画像ファイル形式チェック
    if (!file.type.match('image/(jpeg|jpg|png|webp)')) {
      alert('JPEG、PNG、WEBPファイルのみアップロードできます');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

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
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploadProgress(0);
        setIsLoading(false);
      }, 500);
    }
  };

  // サブ画像アップロード処理
  const handleSubImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);

    setIsLoading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const newImages: ProfileImageType[] = [];

      for (const file of files) {
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
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsLoading(false);
        setUploadProgress(0);
      }, 500);
      // 入力フィールドをリセット
      event.target.value = '';
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

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          open={isLoading}
        >
          <CircularProgress
            color="primary"
            variant={uploadProgress > 0 ? 'determinate' : 'indeterminate'}
            value={uploadProgress}
          />
          <Typography variant="body2" color="white">
            {uploadProgress > 0
              ? `${uploadProgress}% 完了`
              : 'アップロード中...'}
          </Typography>
        </Backdrop>
        {/* メインアバター */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom color="primary">
            メイン写真
          </Typography>
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              my: 2,
              borderRadius: '50%',
              boxShadow: hoverMain ? 3 : 0,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => setHoverMain(true)}
            onMouseLeave={() => setHoverMain(false)}
          >
            <IconButton component="span">
              <Avatar
                sx={{
                  width: { xs: 200, sm: 160, md: 250 },
                  height: { xs: 200, sm: 160, md: 250 },
                  border: '4px solid white',
                  boxShadow: 2,
                }}
                src={profile.avatar_url || ''}
                alt="プロフィール画像"
              >
                <CameraAltIcon />
              </Avatar>
            </IconButton>

            <Zoom in={hoverMain}>
              <label htmlFor="avatar-upload">
                <input
                  type="file"
                  id="avatar-upload"
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleAvatarUpload}
                  disabled={isLoading}
                />
                <Fab
                  color="primary"
                  aria-label="edit"
                  size="small"
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                  }}
                >
                  <AddAPhotoIcon />
                </Fab>
              </label>
            </Zoom>
          </Box>

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
        </Paper>

        {/* 追加画像セクション */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6" color="primary">
              追加の写真
            </Typography>

            {subImages.length < 3 && (
              <Tooltip title="写真を追加（最大3枚まで）">
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
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<AddAPhotoIcon />}
                    disabled={subImages.length >= 3}
                  >
                    追加
                  </Button>
                </label>
              </Tooltip>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" mb={3}>
            トレーニングの成果や日常の写真を追加してみよう (最大3枚)
          </Typography>

          <Grid2
            container
            spacing={3}
            justifyContent={subImages.length === 0 ? 'center' : 'flex-start'}
          >
            {/* 既存のサブ画像 */}
            {subImages.length === 0 ? (
              <Grid2 size={{ xs: 12 }} textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  まだ追加写真がありません
                </Typography>

                <label htmlFor="first-sub-image">
                  <input
                    type="file"
                    id="first-sub-image"
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleSubImageUpload}
                    multiple
                    disabled={isLoading}
                  />
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<AddAPhotoIcon />}
                  >
                    写真を追加
                  </Button>
                </label>
              </Grid2>
            ) : (
              subImages.map((image) => (
                <Grid2 size={{ xs: 12, sm: 4 }} py={4} key={image.id}>
                  <Avatar
                    sx={{
                      width: { xs: 200, sm: 110, md: 110 },
                      height: { xs: 200, sm: 110, md: 110 },
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: '4px solid white',
                      boxShadow: 2,
                    }}
                    src={image.url || ''}
                    alt="サブ画像"
                    onClick={() => handlePreview(image.url || '')}
                  >
                    <CameraAltIcon />
                  </Avatar>

                  <Box>
                    <CardActions
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <IconButton
                        onClick={() => deleteSubImage(image.url)}
                        disabled={isLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Box>
                </Grid2>
              ))
            )}
          </Grid2>
        </Paper>
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
