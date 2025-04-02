import {
  currentUserAtom,
  reportPostModalAtom,
  reportPostTargetAtom,
} from '@/jotai/Jotai';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';
import { Post } from '@/type/post';

interface MoreHorizProps {
  post: Post;
  onDeletePost: (postId: number) => Promise<void>;
}

export const MoreHoriz = ({ post, onDeletePost }: MoreHorizProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentUserId] = useAtom(currentUserAtom);
  const [reportModalOpen, setReportModalOpen] = useAtom(reportPostModalAtom);
  const [, setReportTarget] = useAtom(reportPostTargetAtom);

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
      >
        {post.user_id === currentUserId ? (
          <MenuItem
            onClick={() => {
              handleDelete();
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
                alert('ブロックしました');
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
    </>
  );
};
