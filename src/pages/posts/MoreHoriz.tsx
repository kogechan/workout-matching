import {
  currentUserAtom,
  reportPostModalAtom,
  reportPostTargetAtom,
} from '@/jotai/Jotai';
import { useAtom } from 'jotai';
import { useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';
import { Post } from '@/type/post';
import { useAlert } from '@/hooks/useAlert';

interface MoreHorizProps {
  post: Post;
  onDeletePost: (postId: number) => Promise<void>;
}

export const MoreHoriz = ({ post, onDeletePost }: MoreHorizProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentUserId] = useAtom(currentUserAtom);
  const [reportModalOpen, setReportModalOpen] = useAtom(reportPostModalAtom);
  const [, setReportTarget] = useAtom(reportPostTargetAtom);
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
  const { blockAlert, BlockAlert } = useAlert();

  // メニューを開く
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // メニューを閉じる
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = () => {
    onDeletePost(post.id);
    handleMenuClose();
  };

  return (
    <>
      <Snackbar
        open={blockAlert}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert severity="error">この操作は現在行えません</Alert>
      </Snackbar>

      <IconButton
        aria-label="more"
        onClick={handleMenuOpen}
        sx={{ padding: 1 }}
      >
        <MoreHorizIcon />
      </IconButton>

      <Menu
        id={`menu-${post.id}`}
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': `menu-button-${post.id}`,
        }}
        slotProps={{
          paper: {
            style: { borderRadius: 8 },
          },
        }}
      >
        {post.user_id === currentUserId ? (
          <MenuItem
            onClick={() => {
              setDeletePostDialogOpen(!deletePostDialogOpen);
            }}
          >
            <DeleteIcon sx={{ marginRight: 1 }} />
            削除
          </MenuItem>
        ) : (
          [
            <MenuItem
              key="block"
              onClick={() => {
                BlockAlert();
                handleMenuClose();
              }}
            >
              <BlockIcon sx={{ marginRight: 1 }} />
              ブロック
            </MenuItem>,
            <MenuItem
              key="report"
              onClick={() => {
                setReportTarget(post);
                setReportModalOpen(!reportModalOpen);
                handleMenuClose();
              }}
            >
              <ReportIcon sx={{ marginRight: 1 }} />
              報告
            </MenuItem>,
          ]
        )}
      </Menu>
      <Dialog
        open={deletePostDialogOpen}
        onClose={() => setDeletePostDialogOpen(false)}
        slotProps={{
          paper: {
            style: {
              borderRadius: 16,
            },
          },
        }}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">投稿の削除</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            本当に削除しますか？この操作は元に戻すことができません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePostDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            color="error"
            autoFocus
            onClick={() => {
              handleDelete();
            }}
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
