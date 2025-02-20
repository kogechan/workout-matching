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

export const Header = () => {
  const [menuOpen, setMenuOpen] = useAtom(menuAtom);
  const [loginModalOpen, setLoginModalOpen] = useAtom(loginModalAtom);
  const [logoutModalOpen, setLogoutModalOpen] = useAtom(logoutModalAtom);
  const { user, loading } = useUser(); // ログイン状態を取得
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, cursor: 'pointer' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            align="center"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => {
              router.push('/');
            }}
          >
            キンター
          </Typography>

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
      <MenuList />
      <Login />
      <LogoutAlert />
    </Box>
  );
};
