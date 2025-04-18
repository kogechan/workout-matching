import { reportUserModalAtom, reportUserTargetAtom } from '@/jotai/Jotai';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Alert, IconButton, Menu, MenuItem, Snackbar } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ProfileData } from '@/type/chat';
import { useAlert } from '@/hooks/useAlert';

interface MoreVertProps {
  profile: ProfileData;
}

export const MoreVert = ({ profile }: MoreVertProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [reportModalOpen, setReportModalOpen] = useAtom(reportUserModalAtom);
  const [, setReportTarget] = useAtom(reportUserTargetAtom);
  const { blockAlert, BlockAlert } = useAlert();

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
        <MoreVertIcon />
      </IconButton>

      <Menu
        id={`menu-${profile.id}`}
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': `menu-button-${profile.id}`,
        }}
        slotProps={{
          paper: {
            style: { borderRadius: 8 },
          },
        }}
      >
        <MenuItem
          key="block"
          onClick={() => {
            BlockAlert();
            handleMenuClose();
          }}
        >
          <BlockIcon sx={{ marginRight: 1 }} />
          ブロック
        </MenuItem>
        <MenuItem
          key="report"
          onClick={() => {
            setReportTarget(profile);
            setReportModalOpen(!reportModalOpen);
            handleMenuClose();
          }}
        >
          <ReportIcon sx={{ marginRight: 1 }} />
          報告
        </MenuItem>
      </Menu>
    </>
  );
};
