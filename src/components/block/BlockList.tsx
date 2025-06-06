import {
  blockedUserAtom,
  blockTargetAtom,
  currentUserAtom,
  unblockModalAtom,
} from '@/jotai/Jotai';
import supabase from '@/lib/supabase';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Block as BlockIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

export const BlockList = () => {
  const [blockedUsers, setBlockedUsers] = useAtom(blockedUserAtom);
  const [unblockModalOpen, setUnblockModalOpen] = useAtom(unblockModalAtom);
  const [, setBlockedTarget] = useAtom(blockTargetAtom);
  const [currentUserId] = useAtom(currentUserAtom);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    // ブロックしたユーザーを取得
    const fetchBlockedUsers = async () => {
      if (!currentUserId) return;
      try {
        // 認証状態を確認
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          throw new Error('認証されていません');
        }

        // 専用ファンクションを使用（RLSをバイパス）
        const { data, error } = await supabase.rpc('get_my_blocked_list');

        if (error) throw error;

        // データはすでに適切な形式
        const transformedData = (data || []).map((item) => ({
          id: item.id,
          username: item.username,
          avatar_url: item.avatar_url,
          created_at: item.blocked_at,
          mutual_block: item.mutual_block, // 相互ブロック情報
        }));
        console.log('Fetched blocked users:', transformedData);
        setBlockedUsers(transformedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlockedUsers();
  }, [setBlockedUsers, currentUserId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          ブロック一覧を読み込み中...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* ヘッダー */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
            }}
          >
            <BlockIcon color="action" />
            ブロックしたユーザー
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            相手のプロフィールからいつでもブロックできます
          </Typography>
        </Box>

        {blockedUsers.length === 0 ? (
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <PersonIcon
                  sx={{
                    fontSize: 40,
                    color: alpha(theme.palette.text.secondary, 0.6),
                  }}
                />
              </Box>
              <Typography variant="h6" color="text.primary" fontWeight="medium">
                ブロックしたユーザーはいません
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ maxWidth: 280 }}
              >
                ブロックしたユーザーがいる場合、ここに表示されます
              </Typography>
            </Box>
          </Box>
        ) : (
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <List sx={{ p: 0 }}>
              {blockedUsers.map((user, index) => (
                <Box key={user.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': {
                        backgroundColor: alpha(
                          theme.palette.action.hover,
                          0.04
                        ),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={
                          user.avatar_url ||
                          '/Avatar/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399.jpg'
                        }
                        alt={user.username}
                        sx={{
                          width: 48,
                          height: 48,
                          border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          color="text.primary"
                        >
                          {user.username}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          ブロック中
                        </Typography>
                      }
                      sx={{ ml: 2 }}
                    />

                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setUnblockModalOpen(!unblockModalOpen);
                            setBlockedTarget(user);
                          }}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'medium',
                            minWidth: 90,
                            height: 32,
                            fontSize: '0.875rem',
                            borderColor: alpha(theme.palette.divider, 0.3),
                            '&:hover': {
                              borderColor: theme.palette.primary.main,
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.04
                              ),
                            },
                          }}
                        >
                          ブロックを解除
                        </Button>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {index < blockedUsers.length - 1 && (
                    <Divider
                      sx={{
                        ml: 9,
                        borderColor: alpha(theme.palette.divider, 0.06),
                      }}
                    />
                  )}
                </Box>
              ))}
            </List>
          </Card>
        )}
      </Container>
    </>
  );
};
