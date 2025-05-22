import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const UserBlock = () => {
  return (
    <>
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

export default UserBlock;
