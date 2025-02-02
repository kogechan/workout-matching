import { useState } from 'react';
import { useAtom } from 'jotai';
import { memosAtom, menuAtom, dialogAtom} from '@/jotai/Jotai';
import Memo from '@/types/WorkOut';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';

export const AddMemo = () => {
  const [, setMemos] = useAtom(memosAtom);
  // メモの入力内容を保持
  const [newMemo, setNewMemo] = useState<string>('');

  // ダイアログの状態を保持
  const [dialogOpen, setDialogOpen] = useAtom(dialogAtom);

  // メニューの表示状態を保持
  const [, setMenuOpen] = useAtom(menuAtom);

  // メモを追加する関数
  const addMemo = async (memo: string) => {
    if (memo.trim() === '') return;
    const newMemoObj: Omit<Memo, 'id'> = {
      value: memo,
      weight: 0,
      rep: 0,
      date: new Date().toLocaleDateString('ja-JP'),
      memo: '',
      category: '',
    };

    console.log(" APIに送信するデータ:", newMemoObj); 
    
    try {
      // APIを呼び出してデータを保存
      const response = await fetch('/api/memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemoObj),
      });

      console.log("APIレスポンス:", response); 

      if (response.ok) {
        const savedMemo = await response.json();
        console.log("API成功レスポンス:", savedMemo);
        setMemos((prevMemos) => [...prevMemos, savedMemo]);
      } else {
        alert('データの保存に失敗しました');
      }
    } catch (error) {
      console.error('APIエラー:', error);
    }

    setNewMemo('');
    setDialogOpen(false);
  };

  // フォーム送信(エンターキー)にメモを追加
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMemo(newMemo); // メモを追加
  };

  return (
    <>
      <Dialog fullWidth open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <form onSubmit={handleSubmit} autoComplete="on">
          <div style={{ margin: '1em' }}>
            <TextField
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
              onChange={(e) => setNewMemo(e.target.value)}
              label="種目を入力..."
            />
            <DialogActions>
              <Button color="secondary" type="submit">
                追加
              </Button>
            </DialogActions>
          </div>
        </form>
      </Dialog>
      <div>
        <Fab color="primary" onClick={() => {setDialogOpen(true); setMenuOpen(false)}}>
          <AddIcon />
        </Fab>
      </div>
    </>
  );
};
