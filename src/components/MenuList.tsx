import { useAtom } from 'jotai';
import { menuAtom } from '@/jotai/Jotai';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { Avatar, ListItemIcon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

export const MenuList = () => {
  const [menuOpen, setMenuOpen] = useAtom(menuAtom);

  // メニュー項目をクリックしたときにメニューを閉じる
  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <div>
      <Drawer
        open={menuOpen}
        onClick={closeMenu}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(10px)',
            color: '#ffffff',
            width: 250,
          },
        }}
      >
        {/* メニューリスト */}
        {menuOpen && (
          <Box
            sx={{
              width: 250,
            }}
            role="presentation"
            onClick={closeMenu}
          >
            {/* ここはアプリの画像に変える予定 */}
            <Box display="flex" justifyContent="center" my={2}>
              <Avatar
                sx={{ width: 100, height: 100 }}
                src="/ServiceIcon/B3023787-242E-40F0-983C-2596861E7695.webp"
              />
            </Box>

            <ListItem
              disablePadding
              sx={{
                height: { md: 70, xs: 60 },
                '&:hover': {
                  backgroundColor: '#222',
                },
              }}
            >
              <ListItemButton component={Link} href="/profile">
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="プロフィール" />
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              sx={{
                height: { md: 70, xs: 60 },
                '&:hover': {
                  backgroundColor: '#222',
                },
              }}
            >
              <ListItemButton component={Link} href="/posts">
                <ListItemIcon>
                  <PostAddIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="掲示板" />
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              sx={{
                height: { md: 70, xs: 60 },
                '&:hover': {
                  backgroundColor: '#222',
                },
              }}
            >
              <ListItemButton component={Link} href="/search">
                <ListItemIcon>
                  <SearchIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="合トレ仲間を探す" />
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              sx={{
                height: { md: 70, xs: 60 },
                '&:hover': {
                  backgroundColor: '#222',
                },
              }}
            >
              <ListItemButton component={Link} href="/like">
                <ListItemIcon>
                  <FavoriteIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="いいね" />
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              sx={{
                height: { md: 70, xs: 60 },
                '&:hover': {
                  backgroundColor: '#222',
                },
              }}
            >
              <ListItemButton component={Link} href="/chat">
                <ListItemIcon>
                  <MarkunreadIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="メッセージ" />
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              sx={{
                height: { md: 70, xs: 60 },
                '&:hover': {
                  backgroundColor: '#222',
                },
              }}
            >
              <ListItemButton component={Link} href="/setting">
                <ListItemIcon>
                  <SettingsIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="各種設定" />
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              sx={{
                height: { md: 70, xs: 60 },
                '&:hover': {
                  backgroundColor: '#222',
                },
              }}
            >
              <ListItemButton component={Link} href="/setting">
                <ListItemIcon>
                  <ContactSupportIcon sx={{ color: '#ffffff' }} />
                </ListItemIcon>
                <ListItemText primary="お問い合わせ" />
              </ListItemButton>
            </ListItem>
          </Box>
        )}
      </Drawer>
    </div>
  );
};
