import { filterModalAtom } from '@/jotai/Jotai';
import { SearchFilters } from '@/type/search';
import {
  AppBar,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));
const FilterSection = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));
const FilterItem = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

const Filters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [filterModalOpen, setFilterModalOpen] = useAtom(filterModalAtom);
  const [filters, setFilters] = useState<SearchFilters>({
    age: null,
    location: null,
    gender: null,
    training_experience: null,
  });

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

  return (
    <>
      <Dialog
        fullScreen
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setFilterModalOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              条件を絞り込む
            </Typography>
          </Toolbar>
        </AppBar>
        <FilterContainer elevation={1}>
          {/* <FilterSection>
        <Typography variant="h6" gutterBottom>
          エリア
        </Typography>
        <FilterItem>
          <Typography>距離で検索</Typography>
          <Switch
            checked={filters.useLocationDistance}
            onChange={handleSwitchChange}
            color="primary"
          />
        </FilterItem>
        <FilterItem>
          <Typography>現在地から</Typography>
          <Typography>{filters.distance}km</Typography>
        </FilterItem>
        <Box sx={{ px: 1 }}>
          <Slider
            value={filters.distance}
            onChange={handleSliderChange}
            min={1}
            max={100}
            step={1}
            marks={[
              { value: 1, label: '1km' },
              { value: 50, label: '50km' },
              { value: 100, label: '100km' },
            ]}
            disabled={!filters.useLocationDistance}
          />
        </Box>
      </FilterSection>

      <Divider sx={{ my: 2 }} /> */}

          <FilterSection>
            <Typography variant="h6" gutterBottom>
              プロフィール
            </Typography>
            <FilterItem>
              <Typography>年齢</Typography>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={filters.age ?? ''}
                  onChange={handleSelectChange('age')}
                  displayEmpty
                  renderValue={
                    filters.age !== null
                      ? undefined
                      : () => (
                          <Typography color="text.secondary">
                            こだわらない
                          </Typography>
                        )
                  }
                >
                  <MenuItem value="">こだわらない</MenuItem>
                  <MenuItem value="18-25">18〜25歳</MenuItem>
                  <MenuItem value="26-30">26〜30歳</MenuItem>
                  <MenuItem value="31-40">31〜40歳</MenuItem>
                  <MenuItem value="41-50">41〜50歳</MenuItem>
                  <MenuItem value="51+">51歳以上</MenuItem>
                </Select>
              </FormControl>
            </FilterItem>

            <FilterItem>
              <Typography>居住地</Typography>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={filters.location ?? ''}
                  onChange={handleSelectChange('location')}
                  displayEmpty
                  renderValue={
                    filters.location !== null
                      ? undefined
                      : () => (
                          <Typography color="text.secondary">
                            こだわらない
                          </Typography>
                        )
                  }
                >
                  <MenuItem value="">こだわらない</MenuItem>
                  <MenuItem value="東京">東京</MenuItem>
                  <MenuItem value="大阪">大阪</MenuItem>
                  <MenuItem value="神奈川">神奈川</MenuItem>
                  <MenuItem value="千葉">千葉</MenuItem>
                </Select>
              </FormControl>
            </FilterItem>

            <FilterItem>
              <Typography>性別</Typography>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={filters.gender ?? ''}
                  onChange={handleSelectChange('gender')}
                  displayEmpty
                  renderValue={
                    filters.gender !== null
                      ? undefined
                      : () => (
                          <Typography color="text.secondary">
                            こだわらない
                          </Typography>
                        )
                  }
                >
                  <MenuItem value="">こだわらない</MenuItem>
                  <MenuItem value="男性">男性</MenuItem>
                  <MenuItem value="女性">女性</MenuItem>
                  <MenuItem value="その他">その他</MenuItem>
                </Select>
              </FormControl>
            </FilterItem>

            <FilterItem>
              <Typography>トレーニング歴</Typography>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={filters.training_experience ?? ''}
                  onChange={handleSelectChange('training_experience')}
                  displayEmpty
                  renderValue={
                    filters.training_experience !== null
                      ? undefined
                      : () => (
                          <Typography color="text.secondary">
                            こだわらない
                          </Typography>
                        )
                  }
                >
                  <MenuItem value="">こだわらない</MenuItem>
                  <MenuItem value="1年未満">一年未満</MenuItem>
                  <MenuItem value="1~3年">1~3年</MenuItem>
                  <MenuItem value="3~5年">3=5年</MenuItem>
                  <MenuItem value="5年以上">5年以上</MenuItem>
                  <MenuItem value="10年以上">10年以上</MenuItem>
                </Select>
              </FormControl>
            </FilterItem>
          </FilterSection>
        </FilterContainer>
      </Dialog>
    </>
  );
};

export default Filters;
