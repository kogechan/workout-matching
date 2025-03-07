import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { postAtom } from '@/jotai/Jotai';
import { deletePost } from '../api/posts/post';
import {
  Card,
  CardContent,
  IconButton,
  Menu,
  Typography,
  MenuItem,
  Stack,
  Avatar,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';
import supabase from '@/lib/supabase';
import { useAvatar } from '@/hooks/useAvatar';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
// import { Post } from '@/type/post';
// import { GetServerSideProps } from 'next';

// サーバーサイドで最新の投稿を取得
export const getServerSideProps: GetServerSideProps = async () => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('データ取得エラー:', error);
    return { props: { posts: [] } };
  }

  return { props: { posts } };
};

export const PostList = () => {
  const [posts, setPosts] = useAtom(postAtom);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{
    [key: number]: HTMLElement | null;
  }>({});
  // 現在のログインユーザーを判別するためのステート
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { profile } = useAvatar();
  const router = useRouter();

  // ユーザーを取得
  useEffect(() => {
    const fetchUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        setCurrentUserId(user.user.id);
      }
    };
    fetchUser();
  }, []);

  // メニューを開く
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  // メニューを閉じる
  const handleMenuClose = (id: number) => {
    setMenuAnchorEl((prev) => ({ ...prev, [id]: null }));
  };

  // 投稿を削除する関数
  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {posts.map((post) => (
        <div key={post.id}>
          <Card
            sx={{
              maxWidth: 600,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2}>
                {/* 自分のアイコンをクリックしてもプロフィールが表示されないようにする三項演算子 */}
                {post.user_id === currentUserId ? (
                  <Avatar
                    src={profile.avatar_url || ''}
                    sx={{ width: 48, height: 48 }}
                  >
                    {/* アイコンがない場合ユーザーの頭文字を表示する */}
                    {post.profiles?.username?.charAt(0) || 'U'}{' '}
                  </Avatar>
                ) : (
                  <Avatar
                    src={post.profiles?.avatar_url || ''}
                    sx={{ width: 48, height: 48 }}
                    onClick={() =>
                      router.push(
                        `/profile/${post.profiles?.username || post.user_id}`
                      )
                    }
                  >
                    {/* アイコンがない場合ユーザーの頭文字を表示する */}
                    {post.profiles?.username?.charAt(0) || 'U'}{' '}
                  </Avatar>
                )}

                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {post.profiles?.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      · 2h
                    </Typography>
                    {/* メニュー */}
                    <Menu
                      id={`menu-${post.id}`}
                      anchorEl={menuAnchorEl[post.id]}
                      open={Boolean(menuAnchorEl[post.id])}
                      onClose={() => handleMenuClose(post.id)}
                      MenuListProps={{
                        'aria-labelledby': `menu-button-${post.id}`,
                      }}
                    >
                      {/* メニューの内容をログインユーザーと投稿者で切り替える処理 */}
                      {post.user_id === currentUserId ? (
                        <MenuItem
                          onClick={() => {
                            handleDelete(post.id);
                            handleMenuClose(post.id);
                          }}
                        >
                          <DeleteIcon />
                          削除
                        </MenuItem>
                      ) : (
                        <Menu
                          id={`menu-${post.id}`}
                          anchorEl={menuAnchorEl[post.id]}
                          open={Boolean(menuAnchorEl[post.id])}
                          onClose={() => handleMenuClose(post.id)}
                          MenuListProps={{
                            'aria-labelledby': `menu-button-${post.id}`,
                          }}
                        >
                          <MenuItem onClick={() => alert('ブロックしました')}>
                            <BlockIcon sx={{ marginRight: 1 }} />
                            ブロック
                          </MenuItem>
                          <MenuItem onClick={() => alert('ミュートしました')}>
                            <BlockIcon sx={{ marginRight: 1 }} />
                            ミュート
                          </MenuItem>
                          <MenuItem onClick={() => alert('報告しました')}>
                            <ReportIcon sx={{ marginRight: 1 }} />
                            報告
                          </MenuItem>
                        </Menu>
                      )}
                    </Menu>
                  </Stack>
                  <Box sx={{ ml: 'auto' }}>
                    <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                      {post.content}
                    </Typography>
                    <IconButton
                      aria-label="more"
                      onClick={(e) => handleMenuOpen(e, post.id)}
                      sx={{ padding: 1 }}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </div>
      ))}
    </>
  );
};

export default PostList;

// リアルタイム
/* useEffect(() => {
    // Supabase Realtime で新しい投稿を監視
    const subscription = supabase
      .channel('realtime-posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          const newPost = payload.new as Post;
          setPosts((prevPosts) => [newPost, ...prevPosts]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [setPosts]);
 */
