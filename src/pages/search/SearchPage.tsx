import { ProfileData } from '@/type/chat';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Typography,
  Grid2,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import styles from '@/styles/search.module.css';
import { SearchFilters } from '@/type/search';
import { useRouter } from 'next/router';
import Filters from './Filters';
import { useAtom } from 'jotai';
import { currentUserAtom, filterModalAtom } from '@/jotai/Jotai';

interface SearchPageProps {
  initialProfiles: ProfileData[];
}

export const SearchPage = ({ initialProfiles }: SearchPageProps) => {
  const [profiles, setProfiles] = useState<ProfileData[]>(initialProfiles);
  const [loading, setLoading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useAtom(filterModalAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  // const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const router = useRouter();

  // ユーザーの位置情報を取得
  /*  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);
 */

  // フィルター変更時の検索処理
  const handleFilterChange = useCallback(
    async (filters: SearchFilters) => {
      setLoading(true);
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
    [currentUserId]
  );

  return (
    <>
      <Head>
        <title>ユーザー検索 | プロフィール検索</title>
      </Head>
      <Typography>
        さがす
        <SearchIcon onClick={() => setFilterModalOpen(!filterModalOpen)} />
      </Typography>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Filters onFiltersChange={handleFilterChange} />
      </Container>

      {/* 検索結果表示 */}
      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid2 container spacing={3} className={styles.profileGrid}>
          {profiles.map((profile) => (
            <Grid2 key={profile.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Card
                className={styles.profileCard}
                onClick={() => router.push(`/profile/${profile.username}`)}
              >
                <CardContent className={styles.cardContent}>
                  <Avatar
                    src={profile.avatar_url || ''}
                    alt={`${profile.username}のアイコン`}
                    className={styles.avatar}
                  >
                    {!profile.avatar_url &&
                      profile.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle1" className={styles.username}>
                    {profile.username}
                  </Typography>
                  {profile.username && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className={styles.fullName}
                    >
                      {profile.username}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
      {profiles.length === 0 && (
        <Typography
          variant="body1"
          color="textSecondary"
          className={styles.noResults}
        >
          該当するユーザーが見つかりませんでした。検索条件を変更してお試しください。
        </Typography>
      )}
    </>
  );
};

export default SearchPage;
