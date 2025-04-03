import { ProfileData } from '@/type/chat';
import {
  Box,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Typography,
  IconButton,
  Badge,
  Chip,
  AppBar,
  Toolbar,
  Fab,
  Zoom,
  useTheme,
  useScrollTrigger,
  useMediaQuery,
  Grid2,
  CardMedia,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import styles from '@/styles/search.module.css';
import { SearchFilters } from '@/type/search';
import { useRouter } from 'next/router';
import Filters from './Filters';
import { useAtom } from 'jotai';
import { currentUserAtom, filterAtom, filterModalAtom } from '@/jotai/Jotai';
import Image from 'next/image';

interface SearchPageProps {
  initialProfiles: ProfileData[];
}

export const SearchPage = ({ initialProfiles }: SearchPageProps) => {
  const [profiles, setProfiles] = useState<ProfileData[]>(initialProfiles);
  const [loading, setLoading] = useState(false);
  const [, setFilterModalOpen] = useAtom(filterModalAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [currentFilters, setCurrentFilters] = useAtom(filterAtom);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // スクロールトリガー
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  // スクロールトップボタンの処理
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // フィルター変更時の検索処理
  const handleFilterChange = useCallback(
    async (filters: SearchFilters) => {
      setLoading(true);
      setCurrentFilters(filters);
      try {
        const response = await fetch('/api/search/search', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            ...filters,
            currentUserId,
          }),
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setProfiles(data);
      } catch (error) {
        console.error('Error searching profiles:', error);
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, setCurrentFilters]
  );

  // 適用されているフィルターの数を計算
  const appliedFiltersCount = Object.values(currentFilters).filter(
    (value) => value !== null
  ).length;

  // フィルターの表示名を取得
  const getFilterDisplayName = (
    key: keyof SearchFilters,
    value: string | null
  ): string => {
    if (!value) return '';

    const filterDisplayMap: Record<string, Record<string, string>> = {
      age: {
        '18-25': '18〜25歳',
        '26-30': '26〜30歳',
        '31-40': '31〜40歳',
        '41-50': '41〜50歳',
        '51+': '51歳以上',
      },
      training_experience: {
        '1年未満': '初心者',
        '1~3年': '1〜3年',
        '3~5年': '3〜5年',
        '5年以上': '5年以上',
        '10年以上': '10年以上',
      },
    };

    return filterDisplayMap[key]?.[value] || value;
  };

  return (
    <>
      <Head>
        <title>ユーザー検索 | トレーニングパートナー</title>
      </Head>

      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
          >
            合トレ仲間を見つけよう
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 2, pb: 10 }}>
        <Box
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            borderRadius: 2,
          }}
        >
          <IconButton
            sx={{ p: '10px' }}
            aria-label="filters"
            onClick={() => setFilterModalOpen(true)}
          >
            <Badge badgeContent={appliedFiltersCount} color="primary">
              <FilterListIcon />
            </Badge>
          </IconButton>
          <Typography>ユーザーを条件検索</Typography>
        </Box>

        {/* 適用中のフィルター表示 */}
        {appliedFiltersCount > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {currentFilters.age && (
              <Chip
                icon={<PersonIcon fontSize="small" />}
                label={getFilterDisplayName('age', currentFilters.age)}
                onDelete={() =>
                  handleFilterChange({ ...currentFilters, age: null })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {currentFilters.location && (
              <Chip
                icon={<LocationOnIcon fontSize="small" />}
                label={currentFilters.location}
                onDelete={() =>
                  handleFilterChange({ ...currentFilters, location: null })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {currentFilters.gender && (
              <Chip
                icon={<PersonIcon fontSize="small" />}
                label={currentFilters.gender}
                onDelete={() =>
                  handleFilterChange({ ...currentFilters, gender: null })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {currentFilters.training_experience && (
              <Chip
                icon={<FitnessCenterIcon fontSize="small" />}
                label={getFilterDisplayName(
                  'training_experience',
                  currentFilters.training_experience
                )}
                onDelete={() =>
                  handleFilterChange({
                    ...currentFilters,
                    training_experience: null,
                  })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {currentFilters.belong_gym && (
              <Chip
                icon={<FitnessCenterIcon fontSize="small" />}
                label={currentFilters.belong_gym}
                onDelete={() =>
                  handleFilterChange({ ...currentFilters, belong_gym: null })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {/* フィルターコンポーネント */}
        <Filters onFiltersChange={handleFilterChange} />

        {/* 検索結果表示 */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* 検索結果のサマリー */}
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                {profiles.length > 0
                  ? `${profiles.length}人のパートナーが見つかりました`
                  : '該当するパートナーが見つかりませんでした'}
              </Typography>
            </Box>

            {/* プロフィールグリッド */}
            <Grid2 container spacing={2}>
              {profiles.map((profile) => (
                <Grid2 key={profile.id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                    }}
                    onClick={() => router.push(`/profile/${profile.username}`)}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '100%',
                        bgcolor: 'grey.100',
                      }}
                    >
                      {profile.avatar_url ? (
                        <CardMedia
                          component="img"
                          className="styles.profileImage"
                          src={profile.avatar_url}
                          alt={profile.username}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                          }}
                        >
                          <Image
                            alt="Default Profile"
                            layout="fill"
                            objectFit="cover"
                            src="/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399_801/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg"
                          />
                        </Box>
                      )}
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {profile.username}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                          mt: 1,
                        }}
                      >
                        {profile.location && (
                          <Chip
                            label={profile.location}
                            size="small"
                            icon={<LocationOnIcon fontSize="small" />}
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                        )}
                        {profile.training_experience && (
                          <Chip
                            label={profile.training_experience}
                            size="small"
                            icon={<FitnessCenterIcon fontSize="small" />}
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid2>
              ))}
            </Grid2>

            {/* 検索結果が0件の場合 */}
            {profiles.length === 0 && !loading && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50vh',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <SearchIcon
                  sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  該当するパートナーが見つかりませんでした
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  検索条件を変更して再度お試しください
                </Typography>
              </Box>
            )}

            {/* スクロールトップボタン */}
            <Zoom in={trigger}>
              <Fab
                color="primary"
                size="small"
                onClick={scrollToTop}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                aria-label="scroll back to top"
              >
                <ArrowUpwardIcon />
              </Fab>
            </Zoom>
          </>
        )}
      </Container>
    </>
  );
};

export default SearchPage;
