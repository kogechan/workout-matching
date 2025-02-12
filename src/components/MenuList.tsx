import { useAtom } from 'jotai';
import { menuAtom } from '@/jotai/Jotai';

import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

export const MenuList = () => {
  // メニューの表示状態を管理
  const [menuOpen, setMenuOpen] = useAtom(menuAtom);

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
            <List onClick={closeMenu}>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/posts">
                  <ListItemText primary="掲示板" />
                </ListItemButton>
              </ListItem>

              <List onClick={closeMenu}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/like">
                    <ListItemText primary="いいね" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/message">
                    <ListItemText primary="メッセージ" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/">
                    <ListItemText primary="探す" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/setting">
                    <ListItemText primary="設定" />
                  </ListItemButton>
                </ListItem>
              </List>
            </List>
          </Box>
        )}
      </Drawer>
    </div>
  );
};
