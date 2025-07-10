import { ProfileData } from '@/type/chat';
import {
  Box,
  Card,
  CardContent,
  Container,
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
  Grid2,
  CardMedia,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useState } from 'react';
import { SearchFilters } from '@/type/search';
import { useRouter } from 'next/router';
import Filters from './Filters';
import { useAtom } from 'jotai';
import { currentUserAtom, filterModalAtom } from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import useSWR from 'swr';

interface SearchPageProps {
  initialProfiles: ProfileData[];
}

// ブロックユーザーを取得する関数
const getBlockedUserIds = async (
  currentUserId: string
): Promise<Set<string>> => {
  const blockedUserIds = new Set<string>();

  try {
    const { data: blockData, error } = await supabase
      .from('user_blocks')
      .select('user_id, blocked_user_id')
      .eq('is_deleted', false)
      .or(`user_id.eq.${currentUserId},blocked_user_id.eq.${currentUserId}`);

    if (error) {
      console.error('Error fetching blocked users:', error);
      return blockedUserIds;
    }

    blockData?.forEach((block) => {
      if (block.user_id === currentUserId) {
        blockedUserIds.add(block.blocked_user_id);
      } else if (block.blocked_user_id === currentUserId) {
        blockedUserIds.add(block.user_id);
      }
    });
  } catch (error) {
    console.error('Error in getBlockedUserIds:', error);
  }

  return blockedUserIds;
};

// プロフィールを検索・フィルタリングする関数
const searchAndFilterProfiles = async (
  currentUserId: string | null,
  filters: SearchFilters,
  hasFilters: boolean,
  initialProfiles: ProfileData[]
): Promise<ProfileData[]> => {
  try {
    let profiles: ProfileData[] = [];

    if (hasFilters) {
      // フィルターがある場合はSupabaseから検索
      let query = supabase.from('profiles').select('*');

      // 現在のユーザーを除外
      if (currentUserId) {
        query = query.neq('id', currentUserId);
      }

      // フィルター適用
      if (filters.age) {
        const ageRange = filters.age.match(/\d+/g);
        if (ageRange) {
          if (ageRange.length === 2) {
            const minAge = parseInt(ageRange[0]);
            const maxAge = parseInt(ageRange[1]);
            query = query.gte('age', minAge).lte('age', maxAge);
          } else if (ageRange.length === 1 && filters.age.includes('以上')) {
            const minAge = parseInt(ageRange[0]);
            query = query.gte('age', minAge);
          } else {
            const exactAge = parseInt(ageRange[0]);
            query = query.eq('age', exactAge);
          }
        }
      }

      if (filters.location) query = query.eq('location', filters.location);
      if (filters.gender) query = query.eq('gender', filters.gender);
      if (filters.training_experience) {
        query = query.eq('training_experience', filters.training_experience);
      }
      if (filters.favorite_muscle) {
        query = query.eq('favorite_muscle', filters.favorite_muscle);
      }
      if (filters.difficult_muscle) {
        query = query.eq('difficult_muscle', filters.difficult_muscle);
      }
      if (filters.belong_gym) {
        query = query.eq('belong_gym', filters.belong_gym);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching profiles:', error);
        return [];
      }

      profiles = data || [];
    } else {
      // フィルターがない場合は初期プロフィールを使用
      profiles = initialProfiles;
    }

    // currentUserIdがない場合はそのまま返す
    if (!currentUserId) {
      return profiles;
    }

    // 自分のプロフィールを除外
    profiles = profiles.filter((profile) => profile.id !== currentUserId);

    // ブロックユーザーを取得して除外
    const blockedUserIds = await getBlockedUserIds(currentUserId);

    return profiles.filter((profile) => !blockedUserIds.has(profile.id));
  } catch (error) {
    console.error('Error in searchAndFilterProfiles:', error);
    return [];
  }
};

export const SearchPage = ({ initialProfiles }: SearchPageProps) => {
  const [, setFilterModalOpen] = useAtom(filterModalAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [filters, setFilters] = useState<SearchFilters>({
    age: null,
    location: null,
    gender: null,
    training_experience: null,
    favorite_muscle: null,
    difficult_muscle: null,
    belong_gym: null,
  });
  const router = useRouter();
  const theme = useTheme();

  // フィルターが適用されているかチェック
  const hasFilters = Object.values(filters).some((value) => value !== null);

  // SWRでプロフィールデータを管理
  const {
    data: profiles,
    error,
    mutate,
  } = useSWR(
    // currentUserIdが存在する場合のみフェッチ
    currentUserId ? ['profiles', currentUserId, filters] : null,
    async ([, userId, currentFilters]) => {
      return searchAndFilterProfiles(
        userId,
        currentFilters,
        hasFilters,
        initialProfiles
      );
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // フィルター変更時の処理
  const handleFilterChange = async (newfilters: SearchFilters) => {
    setFilters(newfilters);
    // フィルター変更時に明示的にデータを再取得
    await mutate();
  };

  // 適用されているフィルターの数を計算
  const appliedFiltersCount = Object.values(filters).filter(
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

  // エラーハンドリング
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          エラーが発生しました
        </Typography>
        <Typography variant="body2" color="text.secondary">
          データの取得に失敗しました。ページを再読み込みしてください。
        </Typography>
      </Box>
    );
  }

  // データが存在することを保証
  const displayProfiles = profiles || [];

  return (
    <>
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
            sx={{
              display: 'flex',
              alignItems: 'center',
              mx: 'auto',
            }}
          >
            合トレする仲間を見つけよう！
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
          <Typography>ユーザーを絞り込む</Typography>
        </Box>

        {/* 適用中のフィルター表示 */}
        {appliedFiltersCount > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {filters.age && (
              <Chip
                icon={<PersonIcon fontSize="small" />}
                label={getFilterDisplayName('age', filters.age)}
                onDelete={() => handleFilterChange({ ...filters, age: null })}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.location && (
              <Chip
                icon={<LocationOnIcon fontSize="small" />}
                label={filters.location}
                onDelete={() =>
                  handleFilterChange({ ...filters, location: null })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.gender && (
              <Chip
                icon={<PersonIcon fontSize="small" />}
                label={filters.gender}
                onDelete={() =>
                  handleFilterChange({ ...filters, gender: null })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.training_experience && (
              <Chip
                icon={<FitnessCenterIcon fontSize="small" />}
                label={getFilterDisplayName(
                  'training_experience',
                  filters.training_experience
                )}
                onDelete={() =>
                  handleFilterChange({
                    ...filters,
                    training_experience: null,
                  })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.belong_gym && (
              <Chip
                icon={<FitnessCenterIcon fontSize="small" />}
                label={filters.belong_gym}
                onDelete={() =>
                  handleFilterChange({ ...filters, belong_gym: null })
                }
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {/* フィルターコンポーネント */}
        <Filters filters={filters} onFiltersChange={handleFilterChange} />

        {/* 検索結果表示 */}
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
              {displayProfiles.length > 0
                ? `${displayProfiles.length}人のトレーニーが見つかりました`
                : '該当するトレーニーが見つかりませんでした'}
            </Typography>
          </Box>

          {/* プロフィールグリッド */}
          <Grid2 container spacing={2}>
            {displayProfiles.map((profile) => (
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
                        <CardMedia
                          component="img"
                          className="styles.profileImage"
                          src="/Avatar/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg"
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
          {displayProfiles.length === 0 && (
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
                該当するトレーニーが見つかりませんでした
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
      </Container>
    </>
  );
};

export default SearchPage;
