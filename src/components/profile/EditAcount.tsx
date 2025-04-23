import supabase from '@/lib/supabase';
import {
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  Box,
  Alert,
  Grid2,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  InputLabel,
  Snackbar,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useAvatar } from '@/hooks/useAvatar';
import { useState } from 'react';

export const CreateAcount = () => {
  const { profile, loading, setProfile } = useAvatar();
  const [errors, setErrors] = useState({
    username: false,
    age: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    // エラー状態をリセット
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, gender: e.target.value });
  };

  const validateProfile = () => {
    const newErrors = {
      username: !profile.username,
      age:
        profile.age !== undefined &&
        (Number(profile.age) < 18 || Number(profile.age) > 100),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSave = async () => {
    if (!validateProfile()) {
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ ...profile, id: user.user.id }, { onConflict: 'id' });

    if (error) {
      console.error('プロフィール更新エラー:', error);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <>
      <Snackbar
        open={saveSuccess}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert
          severity="success"
          icon={<CheckIcon fontSize="inherit" />}
          sx={{ mb: 2 }}
        >
          プロフィールを更新しました！
        </Alert>
      </Snackbar>

      <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="medium"
                color="primary"
              >
                基本情報
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="ユーザー名"
                    margin="normal"
                    name="username"
                    value={profile.username || ''}
                    onChange={handleChange}
                    error={errors.username}
                    helperText={
                      errors.username ? 'ユーザー名を入力してください' : ''
                    }
                    required
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth margin="normal">
                    <FormLabel component="legend">性別</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={profile.gender || ''}
                      onChange={handleGenderChange}
                    >
                      <FormControlLabel
                        value="男性"
                        control={<Radio />}
                        label="男性"
                      />
                      <FormControlLabel
                        value="女性"
                        control={<Radio />}
                        label="女性"
                      />
                      <FormControlLabel
                        value="その他"
                        control={<Radio />}
                        label="その他"
                      />
                      <FormControlLabel
                        value="回答しない"
                        control={<Radio />}
                        label="回答しない"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="年齢"
                    margin="normal"
                    name="age"
                    type="number"
                    value={profile.age || ''}
                    onChange={handleChange}
                    error={errors.age}
                    helperText={
                      errors.age
                        ? '18歳から100歳までの有効な年齢を入力してください'
                        : ''
                    }
                    slotProps={{ htmlInput: { min: 13, max: 100 } }}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="location-label">居住地</InputLabel>
                    <Select
                      labelId="location-label"
                      label="居住地"
                      value={profile.location || ''}
                      name="location"
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    >
                      {[
                        '東京',
                        '千葉',
                        '埼玉',
                        '神奈川',
                        '栃木',
                        '茨城',
                        '群馬',
                        '大阪',
                        '京都',
                        '愛知',
                        '岐阜',
                        '三重',
                        '福岡',
                        '北海道',
                        '宮城',
                        '青森',
                        '岩手',
                        '秋田',
                        '山形',
                        '福島',
                        '新潟',
                        '山梨',
                        '長野',
                        '静岡',
                        '富山',
                        '石川',
                        '福井',
                        '滋賀',
                        '兵庫',
                        '奈良',
                        '和歌山',
                        '広島',
                        '岡山',
                        '鳥取',
                        '島根',
                        '山口',
                        '香川',
                        '徳島',
                        '愛媛',
                        '高知',
                        '佐賀',
                        '大分',
                        '熊本',
                        '宮崎',
                        '長崎',
                        '鹿児島',
                        '沖縄',
                        '海外',
                      ].map((prefecture) => (
                        <MenuItem key={prefecture} value={prefecture}>
                          {prefecture}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="medium"
                color="primary"
              >
                トレーニング情報
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="favorite-muscle-label">得意部位</InputLabel>
                    <Select
                      labelId="favorite-muscle-label"
                      label="得意部位"
                      value={profile.favorite_muscle || ''}
                      name="favorite_muscle"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          favorite_muscle: e.target.value,
                        })
                      }
                    >
                      {['胸', '背中', '肩', '腕', '脚', '腹筋', '特になし'].map(
                        (muscle) => (
                          <MenuItem key={muscle} value={muscle}>
                            {muscle}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="difficult-muscle-label">
                      苦手部位
                    </InputLabel>
                    <Select
                      labelId="difficult-muscle-label"
                      label="苦手部位"
                      value={profile.difficult_muscle || ''}
                      name="difficult_muscle"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          difficult_muscle: e.target.value,
                        })
                      }
                    >
                      {['胸', '背中', '肩', '腕', '脚', '腹筋', '特になし'].map(
                        (muscle) => (
                          <MenuItem key={muscle} value={muscle}>
                            {muscle}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="training-experience-label">
                      トレーニング歴
                    </InputLabel>
                    <Select
                      labelId="training-experience-label"
                      label="トレーニング歴"
                      value={profile.training_experience || ''}
                      name="training_experience"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          training_experience: e.target.value,
                        })
                      }
                    >
                      {[
                        '初心者',
                        '1年未満',
                        '1~3年',
                        '3~5年',
                        '5年以上',
                        '10年以上',
                      ].map((exp) => (
                        <MenuItem key={exp} value={exp}>
                          {exp}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="belong-gym-label">所属ジム</InputLabel>
                    <Select
                      labelId="belong-gym-label"
                      label="所属ジム"
                      value={profile.belong_gym || ''}
                      name="belong_gym"
                      onChange={(e) =>
                        setProfile({ ...profile, belong_gym: e.target.value })
                      }
                    >
                      <MenuItem value="エニタイムフィットネス">
                        エニタイムフィットネス
                      </MenuItem>
                      <MenuItem value="ゴールドジム">ゴールドジム</MenuItem>
                      <MenuItem value="FIT PLACE24">FIT PLACE24</MenuItem>
                      <MenuItem value="その他フィットネスジム">
                        その他フィットネスジム
                      </MenuItem>
                      <MenuItem value="所属していない">所属していない</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="medium"
                color="primary"
              >
                自己紹介
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="自己紹介文"
                margin="normal"
                name="bio"
                multiline
                rows={4}
                value={profile.bio || ''}
                onChange={handleChange}
                placeholder="あなたのトレーニング目標や好きな種目、モチベーションなどを共有しましょう"
                helperText="300文字以内で入力してください"
                slotProps={{
                  htmlInput: { maxLength: 300 },
                }}
              />
              <Typography variant="caption" align="right" display="block">
                {profile.bio?.length || 0}/300
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
            disabled={loading}
            sx={{ px: 5, py: 1 }}
          >
            {loading ? '保存中...' : 'プロフィールを保存'}
          </Button>
        </Box>
      </Box>
    </>
  );
};
