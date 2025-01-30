import { useAtom } from 'jotai';
import { menuAtom } from '@/jotai/Jotai';

import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export const MenuList = () => {
  // メニューの表示状態を管理
  const [menuOpen, setMenuOpen] = useAtom(menuAtom);

  // メニューの開閉を切り替える関数
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // メニュー項目をクリックしたときにメニューを閉じる
  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <div>
      <MenuIcon onClick={toggleMenu}></MenuIcon>
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
                <ListItemButton>
                  <ListItemText primary="登録" />
                </ListItemButton>
              </ListItem>

              <List onClick={closeMenu}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="記録" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="いいねとマッチング" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="掲示板" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="メッセージ" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton>
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
