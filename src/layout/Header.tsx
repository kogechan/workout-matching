import { menuAtom, loginModalAtom } from '@/jotai/Jotai';
import { useAtom } from 'jotai';
import { MenuList } from '@/components/MenuList';
import { Login } from '@/components/Login';
import { useUser } from '@/hooks/user';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { SignUp } from '@/components/SignUp';

import supabase from '@/lib/supabase';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useAtom(menuAtom);
  const [loginModalOpen, setLoginModalOpen] = useAtom(loginModalAtom);
  const { user, loading, setUser } = useUser(); // ログイン状態を取得

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    if (res.ok) {
      console.log('ログアウト成功');
      await supabase.auth.getSession();
      setUser(null);
      alert('ログアウトしました');
    } else {
      alert('ログアウトに失敗しました');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          {/* ログイン状態に応じてボタンを切り替える */}
          {loading ? null : user ? (
            <Button color="inherit" onClick={handleLogout}>
              ログアウト
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => setLoginModalOpen(!loginModalOpen)}
            >
              ログイン
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <MenuList />
      <Login />
      <SignUp />
    </Box>
  );
};
