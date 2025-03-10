import { useAtom } from 'jotai';
import { menuAtom } from '@/jotai/Jotai';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { Avatar } from '@mui/material';
import { useAvatar } from '@/hooks/useAvatar';

export const MenuList = () => {
  const [menuOpen, setMenuOpen] = useAtom(menuAtom);
  const { profile } = useAvatar();

  // メニュー項目をクリックしたときにメニューを閉じる
  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <div>
      <Drawer open={menuOpen} onClick={closeMenu}>
        {/* メニューリスト */}
        {menuOpen && (
          <Box
            sx={{
              width: 250,
            }}
            role="presentation"
            onClick={closeMenu}
          >
            <Box display="flex" justifyContent="center" my={2}>
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={profile.avatar_url}
              />
            </Box>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/profile">
                <ListItemText primary="プロフィール" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/posts">
                <ListItemText primary="掲示板" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/search">
                <ListItemText primary="探す" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/like">
                <ListItemText primary="いいね" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/chat">
                <ListItemText primary="メッセージ" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/setting">
                <ListItemText primary="設定" />
              </ListItemButton>
            </ListItem>
          </Box>
        )}
        <Link href="/contactForm">お問い合わせ</Link>
      </Drawer>
    </div>
  );
};
