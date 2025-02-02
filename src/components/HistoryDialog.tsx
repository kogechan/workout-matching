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
  const [memos, setMemos] = useAtom(memosAtom);
  const [dialogOpen, setDialogOpen] = useAtom(dialogAtom);

  // 入力変更ハンドラー
  const handleChange =
    (id: string, key: 'value' | 'weight' | 'rep' | 'memo') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMemos((prevMemos) =>
        prevMemos.map((memo) =>
          memo.id === Number(id) ? { ...memo, [key]: e.target.value } : memo
        )
      );
    };
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>記録の詳細</DialogTitle>
      <DialogContent>
        <ul>
          {memos.map((memo) => (
            <li key={memo.id}>
              <TextField
                label="種目"
                name="value"
                fullWidth
                margin="dense"
                value={memo.value}
                onChange={handleChange(memo.id.toString(), 'value')}
              />
              <TextField
                label="重量 (kg)"
                name="weight"
                type="number"
                fullWidth
                margin="dense"
                value={memo.weight}
                onChange={handleChange(memo.id.toString(), 'weight')}
              />
              <TextField
                label="回数"
                name="rep"
                type="number"
                fullWidth
                margin="dense"
                value={memo.rep}
                onChange={handleChange(memo.id.toString(), 'rep')}
              />
              <TextField
                label="メモ"
                name="memo"
                fullWidth
                margin="dense"
                value={memo.memo}
                onChange={handleChange(memo.id.toString(), 'memo')}
              />
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => deleteMemo(memos[0].id)} color="error">
          削除
        </Button>
        <Button
          onClick={() => editMemo(memos[0].id, 'value', memos[0].value)}
          color="primary"
        >
          更新
        </Button>
        <Button onClick={() => setDialogOpen(false)}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};
