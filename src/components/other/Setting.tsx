import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Info as InfoIcon,
  Gavel as GavelIcon,
  PrivacyTip as PrivacyTipIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useAtom } from 'jotai';
import { logoutModalAtom } from '@/jotai/Jotai';
import { useAlert } from '@/hooks/useAlert';

export const Setting = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [, setLogoutModalOpen] = useAtom(logoutModalAtom);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const { accountDeleteAlert, AccountDeleteAlert } = useAlert();

  const handleNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNotificationsEnabled(event.target.checked);
  };

  return (
    <Container maxWidth="md">
      <Snackbar
        open={accountDeleteAlert}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert severity="error">この操作は現在行えません</Alert>
      </Snackbar>

      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          各種設定
        </Typography>

        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <List>
            {/* サービスについて */}
            <ListItem
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push('/')}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="サービスについて" />
            </ListItem>

            <Divider />

            {/* 利用規約 */}
            <ListItem
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push('/terms')}
            >
              <ListItemIcon>
                <GavelIcon />
              </ListItemIcon>
              <ListItemText primary="利用規約" />
            </ListItem>

            <Divider />

            {/* プライバシーポリシー */}
            <ListItem
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push('/privacy')}
            >
              <ListItemIcon>
                <PrivacyTipIcon />
              </ListItemIcon>
              <ListItemText primary="プライバシーポリシー" />
            </ListItem>

            <Divider />

            {/* 通知設定 */}
            <ListItem sx={{ cursor: 'pointer' }}>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="通知設定" />
              <Switch
                edge="end"
                checked={notificationsEnabled}
                onChange={handleNotificationChange}
                inputProps={{
                  'aria-labelledby': 'switch-notifications',
                }}
              />
            </ListItem>

            <Divider />

            {/* ブロック管理 */}
            <ListItem
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push('/block')}
            >
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              <ListItemText primary="ブロックしたユーザー" />
            </ListItem>

            <Divider />

            {/* ログアウト */}
            <ListItem
              sx={{ cursor: 'pointer' }}
              onClick={() => setLogoutModalOpen(true)}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="アカウントからログアウト" />
            </ListItem>

            <Divider />

            {/* 退会 */}
            <ListItem
              sx={{ cursor: 'pointer' }}
              onClick={() => setDeleteAccountDialogOpen(true)}
            >
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="退会" />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* 退会確認ダイアログ */}
      <Dialog
        open={deleteAccountDialogOpen}
        onClose={() => setDeleteAccountDialogOpen(false)}
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
        <DialogTitle id="delete-account-dialog-title">退会の確認</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            退会するとすべてのデータが削除され、元に戻すことはできません。本当に退会しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            color="error"
            autoFocus
            onClick={() => {
              AccountDeleteAlert();
              setDeleteAccountDialogOpen(false);
            }}
          >
            退会する
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
