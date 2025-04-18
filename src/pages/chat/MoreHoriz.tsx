import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useAlert } from '@/hooks/useAlert';

interface ChatProps {
  roomId: string;
}

export const MoreHoriz = ({ roomId }: ChatProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [chatDeleteModalOpen, setChatDeleteModalOpen] = useState(false);
  const { messageDeleteAlert, MessageDeleteAlert } = useAlert();

  // メニューを開く
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // メニューを閉じる
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  return (
    <>
      <Snackbar
        open={messageDeleteAlert}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert severity="error">この操作は現在行えません</Alert>
      </Snackbar>
      {/*  チャットルーム削除ボタン */}
      <IconButton
        aria-label="more"
        onClick={(e) => {
          e.stopPropagation();
          handleMenuOpen(e);
        }}
        sx={{ padding: 1 }}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id={`menu-${roomId}`}
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': `menu-button-${roomId}`,
        }}
        slotProps={{
          paper: {
            style: { borderRadius: 8 },
          },
        }}
      >
        <MenuItem
          key="block"
          onClick={(e) => {
            e.stopPropagation();
            setChatDeleteModalOpen(!chatDeleteModalOpen);
            handleMenuClose();
          }}
        >
          <DeleteIcon sx={{ marginRight: 1 }} />
          削除
        </MenuItem>
      </Menu>
      <Dialog
        open={chatDeleteModalOpen}
        onClose={() => setChatDeleteModalOpen(false)}
        slotProps={{
          paper: {
            style: {
              borderRadius: 24,
            },
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">メッセージを削除</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            本当にメッセージを削除しますか？この操作は取り消すことができません。あなたのメッセージ一覧から削除されますが他のユーザーは引き続きあなたにメッセージをすることができます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDeleteModalOpen(false)}>
            キャンセル
          </Button>
          <Button
            color="error"
            onClick={() => {
              MessageDeleteAlert();
              setChatDeleteModalOpen(false);
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
