import { useAtom } from 'jotai';
import { profileAtom } from '@/jotai/Jotai';
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
} from '@mui/material';
import { useAvatar } from '@/hooks/useAvatar';

export const CreateAcount = () => {
  const [, setProfile] = useAtom(profileAtom);
  const { profile, loading } = useAvatar();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, gender: e.target.value });
  };

  const handleSave = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ ...profile, user_id: user.user.id }, { onConflict: 'user_id' });

    if (error) {
      console.error('プロフィール更新エラー:', error);
    } else {
      alert('プロフィールを更新しました！');
    }
  };

  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        ユーザー名
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        name="username"
        value={profile.username}
        onChange={handleChange}
      />

      {/* 性別選択 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        性別
      </Typography>
      <RadioGroup
        row
        name="gender"
        value={profile.gender}
        onChange={handleGenderChange}
      >
        <FormControlLabel value="男性" control={<Radio />} label="男性" />
        <FormControlLabel value="女性" control={<Radio />} label="女性" />
        <FormControlLabel value="その他" control={<Radio />} label="その他" />
      </RadioGroup>

      {/* 年齢選択 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        年齢
      </Typography>
      <TextField
        margin="normal"
        name="age"
        type="number"
        value={profile.age}
        onChange={handleChange}
      />

      {/* 居住地選択 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        居住地
      </Typography>
      <Select
        value={profile.location}
        name="location"
        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
      >
        <MenuItem value="東京">東京</MenuItem>
        <MenuItem value="大阪">大阪</MenuItem>
        <MenuItem value="福岡">福岡</MenuItem>
        <MenuItem value="その他">その他</MenuItem>
      </Select>

      {/* トレーニング歴 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        トレーニング歴 (年)
      </Typography>
      <Select
        value={profile.training_experience}
        name="training_experience"
        onChange={(e) =>
          setProfile({
            ...profile,
            training_experience: e.target.value,
          })
        }
      >
        <MenuItem value="1年未満">1年未満</MenuItem>
        <MenuItem value="1~3年">1~3年</MenuItem>
        <MenuItem value="3~5年">3~5年</MenuItem>
        <MenuItem value="5年以上">5年以上</MenuItem>
      </Select>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        自己紹介 (任意)
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        name="bio"
        multiline
        rows={3}
        value={profile.bio}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? '保存中...' : '保存'}
      </Button>
    </>
  );
};
