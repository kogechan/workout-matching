import { menuAtom } from '@/jotai/Jotai';
import { useAtom } from 'jotai';
import { MenuList } from '@/components/MenuList';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export const Header = () => {
  // メニューの表示状態を管理
  const [menuOpen, setMenuOpen] = useAtom(menuAtom);

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
          <Button color="inherit">ログイン</Button>
        </Toolbar>
      </AppBar>
      <MenuList />
    </Box>
  );
};
