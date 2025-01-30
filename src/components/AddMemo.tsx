import { useState } from 'react';
import { useAtom } from 'jotai';
import { memosAtom } from '@/jotai/Jotai';
import { menuAtom } from '@/jotai/Jotai';
import Memo from '@/types/WorkOut';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';

export const AddMemo = () => {
  const [, setMemos ] = useAtom(memosAtom);
  // メモの入力内容を保持
  const [ newMemo, setNewMemo ] = useState<string>('')

  // ダイアログの状態を保持
  const [dialogOpen, setDialogOpen] = useState(false);

   // メニューの表示状態を保持
   const [, setMenuOpen] = useAtom(menuAtom);

  // メモを追加する関数
  const addMemo = (memo: string) => {
    if (memo.trim() === '') return;
    const newMemoObj: Memo = {
      id: Date.now(),
      value: memo,
      weight: 0,
      rep: 0,
      date: new Date().toLocaleDateString('ja-JP'),
      memo: '',
      category: '',
    };
    setMemos((prevMemos) => [...prevMemos, newMemoObj]);
    setNewMemo('');
    setDialogOpen((dialogOpen) => !dialogOpen);
  };

  // 入力フィールドの変更を処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMemo(e.target.value);
  };

  // フォーム送信(エンターキー)にメモを追加
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMemo(newMemo); // メモを追加
  };

  // ダイアログを表示する関数
  const handleDialog = () => {
    setDialogOpen((dialogOpen) => !dialogOpen);
    setNewMemo('');
  };

   const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <Dialog fullWidth open={dialogOpen} onClose={handleDialog}>
        <form onSubmit={handleSubmit} className="add-form" autoComplete="on">
          <div style={{ margin: '1em' }}>
            <TextField
              aria-label="memo-input"
              variant="standard"
              style={{
                width: '100%',
                fontSize: '16px',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, Roboto, sans-serif',
              }}
              id="name"
              autoComplete="name"
              value={newMemo}
              onChange={handleInputChange}
              label="種目を入力..."
            />
            <DialogActions>
              <Button aria-label="memo-add" color="secondary" type="submit">
                追加
              </Button>
            </DialogActions>
          </div>
        </form>
      </Dialog>
      <div>
        <Fab color="primary" aria-label="add" onClick={handleDialog}>
          <AddIcon onClick={closeMenu}></AddIcon>
        </Fab>
      </div>
    </>
  );
};
