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
  IconButton,
} from '@mui/material';
import { useAvatar } from '@/hooks/useAvatar';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const CreateAcount = () => {
  const { profile, loading, setProfile } = useAvatar();
  const router = useRouter();

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
      .upsert({ ...profile, id: user.user.id }, { onConflict: 'id' });

    if (error) {
      console.error('プロフィール更新エラー:', error);
    } else {
      alert('プロフィールを更新しました！');
    }
  };

  return (
    <Box>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="back"
        sx={{ mr: 2 }}
        onClick={() => router.push('/profile')}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        ユーザー名
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        name="username"
        value={profile.username || ''}
        onChange={handleChange}
      />

      {/* 性別選択 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        性別
      </Typography>
      <RadioGroup
        row
        name="gender"
        value={profile.gender || ''}
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
        value={profile.age || ''}
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
        <MenuItem value="千葉">千葉</MenuItem>
        <MenuItem value="埼玉">埼玉</MenuItem>
        <MenuItem value="神奈川">神奈川</MenuItem>
        <MenuItem value="栃木">栃木</MenuItem>
        <MenuItem value="茨城">茨城</MenuItem>
        <MenuItem value="群馬">群馬</MenuItem>
        <MenuItem value="大阪">大阪</MenuItem>
        <MenuItem value="京都">京都</MenuItem>
        <MenuItem value="愛知">愛知</MenuItem>
        <MenuItem value="岐阜">岐阜</MenuItem>
        <MenuItem value="三重">三重</MenuItem>
        <MenuItem value="福岡">福岡</MenuItem>
        <MenuItem value="北海道">北海道</MenuItem>
        <MenuItem value="宮城">宮城</MenuItem>
        <MenuItem value="青森">青森</MenuItem>
        <MenuItem value="岩手">岩手</MenuItem>
        <MenuItem value="秋田">秋田</MenuItem>
        <MenuItem value="山形">山形</MenuItem>
        <MenuItem value="福島">福島</MenuItem>
        <MenuItem value="新潟">新潟</MenuItem>
        <MenuItem value="山梨">山梨</MenuItem>
        <MenuItem value="長野">長野</MenuItem>
        <MenuItem value="静岡">静岡</MenuItem>
        <MenuItem value="富山">富山</MenuItem>
        <MenuItem value="石川">石川</MenuItem>
        <MenuItem value="福井">福井</MenuItem>
        <MenuItem value="滋賀">滋賀</MenuItem>
        <MenuItem value="兵庫">兵庫</MenuItem>
        <MenuItem value="奈良">奈良</MenuItem>
        <MenuItem value="和歌山">和歌山</MenuItem>
        <MenuItem value="広島">広島</MenuItem>
        <MenuItem value="岡山">岡山</MenuItem>
        <MenuItem value="鳥取">鳥取</MenuItem>
        <MenuItem value="島根">島根</MenuItem>
        <MenuItem value="山口">山口</MenuItem>
        <MenuItem value="香川">香川</MenuItem>
        <MenuItem value="徳島">徳島</MenuItem>
        <MenuItem value="愛媛">愛媛</MenuItem>
        <MenuItem value="高知">高知</MenuItem>
        <MenuItem value="佐賀">佐賀</MenuItem>
        <MenuItem value="大分">大分</MenuItem>
        <MenuItem value="熊本">熊本</MenuItem>
        <MenuItem value="宮崎">宮崎</MenuItem>
        <MenuItem value="長崎">長崎</MenuItem>
        <MenuItem value="鹿児島">鹿児島</MenuItem>
        <MenuItem value="沖縄">沖縄</MenuItem>
        <MenuItem value="海外">海外</MenuItem>
      </Select>

      {/* 得意部位 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        得意部位
      </Typography>
      <Select
        value={profile.favorite_muscle}
        name="favorite_muscle"
        onChange={(e) =>
          setProfile({ ...profile, favorite_muscle: e.target.value })
        }
      >
        <MenuItem value="胸">胸</MenuItem>
        <MenuItem value="背中">背中</MenuItem>
        <MenuItem value="肩">肩</MenuItem>
        <MenuItem value="腕">腕</MenuItem>
        <MenuItem value="脚">脚</MenuItem>
      </Select>

      {/* 苦手部位 */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        苦手部位
      </Typography>
      <Select
        value={profile.difficult_muscle}
        name="difficult_muscle"
        onChange={(e) =>
          setProfile({ ...profile, difficult_muscle: e.target.value })
        }
      >
        <MenuItem value="胸">胸</MenuItem>
        <MenuItem value="背中">背中</MenuItem>
        <MenuItem value="肩">肩</MenuItem>
        <MenuItem value="腕">腕</MenuItem>
        <MenuItem value="脚">脚</MenuItem>
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
        <MenuItem value="10年以上">10年以上</MenuItem>
      </Select>

      {/* 所属ジム */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        所属ジム
      </Typography>
      <Select
        value={profile.belong_gym}
        name="belong_gym"
        onChange={(e) => setProfile({ ...profile, belong_gym: e.target.value })}
      >
        <MenuItem value="エニタイムフィットネス">
          エニタイムフィットネス
        </MenuItem>
        <MenuItem value="ゴールドジム">ゴールドジム</MenuItem>
        <MenuItem value="FIT PLACE24">FIT PLACE24</MenuItem>
        <MenuItem value="その他フィットネスジム">
          その他フィットネスジム
        </MenuItem>
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
        value={profile.bio || ''}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => {
          handleSave();
          router.push('/profile');
        }}
        disabled={loading}
      >
        {loading ? '保存中...' : '保存'}
      </Button>
    </Box>
  );
};
