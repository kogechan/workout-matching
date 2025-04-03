import { filterAtom, filterModalAtom } from '@/jotai/Jotai';
import { SearchFilters } from '@/type/search';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

const Filters = ({ onFiltersChange }: SearchFiltersProps) => {
  const theme = useTheme();
  const [filterModalOpen, setFilterModalOpen] = useAtom(filterModalAtom);
  const [filters, setFilters] = useAtom(filterAtom);

  // フィルター変更時の処理
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleSelectChange =
    (field: keyof SearchFilters) => (event: SelectChangeEvent) => {
      setFilters({
        ...filters,
        [field]: event.target.value,
      });
    };

  // フィルターをリセット
  const handleReset = () => {
    setFilters({
      age: null,
      location: null,
      gender: null,
      training_experience: null,
      favorite_muscle: null,
      difficult_muscle: null,
      belong_gym: null,
    });
  };

  // 適用されたフィルターの数をカウント
  const appliedFiltersCount = Object.values(filters).filter(
    (value) => value !== null
  ).length;

  return (
    <>
      <Dialog
        fullScreen
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#f5f7fa',
          },
        }}
      >
        <AppBar sx={{ position: 'relative' }} color="primary">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setFilterModalOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <FilterAltIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                条件を絞り込む
              </Typography>
              {appliedFiltersCount > 0 && (
                <Chip
                  label={appliedFiltersCount}
                  color="secondary"
                  size="small"
                  sx={{ ml: 1, height: 24 }}
                />
              )}
            </Box>
            <Button
              color="inherit"
              startIcon={<CheckIcon />}
              onClick={() => setFilterModalOpen(false)}
            >
              適用
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              フィルター
            </Typography>
            <Button
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              size="small"
              color="primary"
            >
              リセット
            </Button>
          </Box>

          <Paper elevation={1} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 2 }}
            >
              基本情報
            </Typography>

            <FilterItem
              label="年齢"
              value={filters.age}
              onChange={handleSelectChange('age')}
              options={[
                { value: '18-25', label: '18〜25歳' },
                { value: '26-30', label: '26〜30歳' },
                { value: '31-40', label: '31〜40歳' },
                { value: '41-50', label: '41〜50歳' },
                { value: '51+', label: '51歳以上' },
              ]}
            />

            <FilterItem
              label="居住地"
              value={filters.location}
              onChange={handleSelectChange('location')}
              options={[
                { value: '東京', label: '東京' },
                { value: '千葉', label: '千葉' },
                { value: '埼玉', label: '埼玉' },
                { value: '神奈川', label: '神奈川' },
                { value: '栃木', label: '栃木' },
                { value: '茨城', label: '茨城' },
                { value: '群馬', label: '群馬' },
                { value: '大阪', label: '大阪' },
                { value: '京都', label: '京都' },
                { value: '愛知', label: '愛知' },
                { value: '岐阜', label: '岐阜' },
                { value: '三重', label: '三重' },
                { value: '福岡', label: '福岡' },
                { value: '北海道', label: '北海道' },
                { value: '宮城', label: '宮城' },
                { value: '青森', label: '青森' },
                { value: '岩手', label: '岩手' },
                { value: '秋田', label: '秋田' },
                { value: '山形', label: '山形' },
                { value: '福島', label: '福島' },
                { value: '新潟', label: '新潟' },
                { value: '山梨', label: '山梨' },
                { value: '長野', label: '長野' },
                { value: '静岡', label: '静岡' },
                { value: '富山', label: '富山' },
                { value: '石川', label: '石川' },
                { value: '福井', label: '福井' },
                { value: '滋賀', label: '滋賀' },
                { value: '兵庫', label: '兵庫' },
                { value: '奈良', label: '奈良' },
                { value: '和歌山', label: '和歌山' },
                { value: '広島', label: '広島' },
                { value: '岡山', label: '岡山' },
                { value: '鳥取', label: '鳥取' },
                { value: '島根', label: '島根' },
                { value: '山口', label: '山口' },
                { value: '香川', label: '香川' },
                { value: '徳島', label: '徳島' },
                { value: '愛媛', label: '愛媛' },
                { value: '高知', label: '高知' },
                { value: '佐賀', label: '佐賀' },
                { value: '大分', label: '大分' },
                { value: '熊本', label: '熊本' },
                { value: '宮崎', label: '宮崎' },
                { value: '長島', label: '長島' },
                { value: '鹿児島', label: '鹿児島' },
                { value: '沖縄', label: '沖縄' },
                { value: '海外', label: '海外' },
              ]}
            />

            <FilterItem
              label="性別"
              value={filters.gender}
              onChange={handleSelectChange('gender')}
              options={[
                { value: '男性', label: '男性' },
                { value: '女性', label: '女性' },
                { value: 'その他', label: 'その他' },
              ]}
            />
          </Paper>

          <Paper elevation={1} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 2 }}
            >
              トレーニング情報
            </Typography>

            <FilterItem
              label="トレーニング歴"
              value={filters.training_experience}
              onChange={handleSelectChange('training_experience')}
              options={[
                { value: '1年未満', label: '1年未満' },
                { value: '1~3年', label: '1~3年' },
                { value: '3~5年', label: '3~5年' },
                { value: '5年以上', label: '5年以上' },
                { value: '10年以上', label: '10年以上' },
              ]}
            />

            <FilterItem
              label="得意部位"
              value={filters.favorite_muscle ?? null}
              onChange={handleSelectChange('favorite_muscle')}
              options={[
                { value: '胸', label: '胸' },
                { value: '背中', label: '背中' },
                { value: '肩', label: '肩' },
                { value: '腕', label: '腕' },
                { value: '脚', label: '脚' },
              ]}
            />

            <FilterItem
              label="苦手部位"
              value={filters.difficult_muscle ?? null}
              onChange={handleSelectChange('difficult_muscle')}
              options={[
                { value: '胸', label: '胸' },
                { value: '背中', label: '背中' },
                { value: '肩', label: '肩' },
                { value: '腕', label: '腕' },
                { value: '脚', label: '脚' },
              ]}
            />
          </Paper>

          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 2 }}
            >
              ジム情報
            </Typography>

            <FilterItem
              label="所属ジム"
              value={filters.belong_gym ?? null}
              onChange={handleSelectChange('belong_gym')}
              options={[
                {
                  value: 'エニタイムフィットネス',
                  label: 'エニタイムフィットネス',
                },
                { value: 'ゴールドジム', label: 'ゴールドジム' },
                { value: 'FIT PLACE24', label: 'FIT PLACE24' },
                {
                  value: 'その他フィットネスジム',
                  label: 'その他フィットネスジム',
                },
              ]}
            />
          </Paper>
        </Box>

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            p: 2,
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={() => setFilterModalOpen(false)}
            startIcon={<CheckIcon />}
          >
            フィルターを適用する
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

// フィルター項目コンポーネント
interface FilterItemProps {
  label: string;
  value: string | null;
  onChange: (event: SelectChangeEvent) => void;
  options: { value: string; label: string }[];
}

const FilterItem = ({ label, value, onChange, options }: FilterItemProps) => {
  return (
    <Box sx={{ py: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" fontWeight="medium">
          {label}
        </Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <Select
            value={value ?? ''}
            onChange={onChange}
            displayEmpty
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 300 },
              },
            }}
            sx={{
              borderRadius: 2,
              '& .MuiSelect-select': {
                py: 1,
              },
            }}
            renderValue={
              value !== null
                ? undefined
                : () => (
                    <Typography color="text.secondary" variant="body2">
                      こだわらない
                    </Typography>
                  )
            }
          >
            <MenuItem value="">こだわらない</MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};

export default Filters;
