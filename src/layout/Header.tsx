import { menuAtom, loginModalAtom, logoutModalAtom } from '@/jotai/Jotai';
import { useAtom } from 'jotai';
import { MenuList } from '@/components/MenuList';
import { Login } from '@/components/Login';
import { LogoutAlert } from '@/components/LogoutAlert';
import { useUser } from '@/hooks/useUser';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { Avatar } from '@mui/material';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useAtom(menuAtom);
  const [loginModalOpen, setLoginModalOpen] = useAtom(loginModalAtom);
  const [logoutModalOpen, setLogoutModalOpen] = useAtom(logoutModalAtom);
  const { user, loading } = useUser(); // ログイン状態を取得
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          {user && (
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2, cursor: 'pointer' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MenuIcon sx={{ color: '#ffffff' }} />
            </IconButton>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mx: 'auto',
              cursor: 'pointer',
              gap: 1,
            }}
            onClick={() => router.push('/')}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
              }}
              src="/ServiceIcon/B3023787-242E-40F0-983C-2596861E7695.webp"
            />
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              KINTA
            </Typography>
          </Box>

          {/* ログイン状態に応じてボタンを切り替える */}
          {loading ? null : user ? (
            <Button
              color="inherit"
              onClick={() => setLogoutModalOpen(!logoutModalOpen)}
            >
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
      <Toolbar />
      <MenuList />
      <Login />
      <LogoutAlert />
    </Box>
  );
};
