import { useAtom } from 'jotai';
import {
  memosAtom,
  editMemoAtom,
  deleteMemoAtom,
  dialogAtom,
} from '@/jotai/Jotai';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

export const HistoryDialog = () => {
  const [, editMemo] = useAtom(editMemoAtom);
  const [, deleteMemo] = useAtom(deleteMemoAtom);
  const [memos] = useAtom(memosAtom);
  const [dialogOpen, setDialogOpen] = useAtom(dialogAtom);

  // メモの編集
  const handleEdit =
    (id: number, key: 'value' | 'weight' | 'rep' | 'memo') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        editMemo(id, key, e.target.value);
    };
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>記録の詳細</DialogTitle>
      <DialogContent>
        <ol>
          {memos.map((memo) => (
            <li key={memo.id}>
              <TextField
                label="種目"
                name="value"
                fullWidth
                margin="dense"
                value={memo.value}
                onChange={handleEdit(memo.id, 'value')}
              />
              <TextField
                label="重量 (kg)"
                name="weight"
                type="number"
                fullWidth
                margin="dense"
                value={memo.weight}
                onChange={handleEdit(memo.id, 'weight')}
              />
              <TextField
                label="回数"
                name="rep"
                type="number"
                fullWidth
                margin="dense"
                value={memo.rep}
                onChange={handleEdit(memo.id, 'rep')}
              />
              <TextField
                label="メモ"
                name="memo"
                fullWidth
                margin="dense"
                value={memo.memo}
                onChange={handleEdit(memo.id, 'memo')}
              />
            </li>
          ))}
        </ol>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => deleteMemo(memos[0].id)} color="error">
          削除
        </Button>
        <Button onClick={() => setDialogOpen(false)}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};
