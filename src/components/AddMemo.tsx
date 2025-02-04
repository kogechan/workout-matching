import { useState } from 'react';
import { useAtom } from 'jotai';
import { memosAtom, menuAtom, dialogAtom } from '@/jotai/Jotai';
import Memo from '@/types/WorkOut';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';

export const AddMemo = () => {
  const [, setMemos] = useAtom(memosAtom);
  const [dialogOpen, setDialogOpen] = useAtom(dialogAtom);
  const [, setMenuOpen] = useAtom(menuAtom);

  // `newMemo` の型を `Memo` に統一（ただし `id` は除外）
  const [newMemo, setNewMemo] = useState<Omit<Memo, 'id'>>({
    value: '',
    weight: 0,
    rep: 0,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD形式
    memo: '',
    category: '',
  });

  // typeがnumberの場合にvalueを数値型に変換し、weightやrepにも対応できるようにする関数
  const handleChange =
    <K extends keyof Omit<Memo, 'id'>>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewMemo((prev) => ({
        ...prev,
        [key]:
          e.target.type === 'number'
            ? Number(e.target.value) || 0
            : e.target.value,
      }));
    };

  // メモを追加する関数
  const addMemo = async () => {
    if (newMemo.value.trim() === '') return;

    console.log('📡 APIに送信するデータ:', newMemo);

    try {
      const response = await fetch('/api/memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemo),
      });

      console.log('🔄 APIレスポンス:', response);

      if (response.ok) {
        const savedMemo = await response.json();
        console.log('✅ API成功レスポンス:', savedMemo);
        setMemos((prevMemos) => [...prevMemos, savedMemo]);
      } else {
        alert('データの保存に失敗しました');
      }
    } catch (error) {
      console.error('❌ APIエラー:', error);
    }

    // フォームのリセット
    setNewMemo({
      value: '',
      weight: 0,
      rep: 0,
      date: new Date().toISOString().split('T')[0],
      memo: '',
      category: '',
    });

    setDialogOpen(false);
  };

  return (
    <>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addMemo();
          }}
          autoComplete="on"
        >
          <DialogContent>
            <TextField
              label="種目"
              name="value"
              fullWidth
              margin="dense"
              value={newMemo.value}
              onChange={handleChange('value')}
            />
            <TextField
              label="重量 (kg)"
              name="weight"
              type="number"
              fullWidth
              margin="dense"
              value={newMemo.weight}
              onChange={handleChange('weight')}
            />
            <TextField
              label="回数"
              name="rep"
              type="number"
              fullWidth
              margin="dense"
              value={newMemo.rep}
              onChange={handleChange('rep')}
            />
            <TextField
              label="メモ"
              name="memo"
              fullWidth
              margin="dense"
              value={newMemo.memo}
              onChange={handleChange('memo')}
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" type="submit">
              追加
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <div>
        <Fab
          color="primary"
          onClick={() => {
            setDialogOpen(true);
            setMenuOpen(false);
          }}
        >
          <AddIcon />
        </Fab>
      </div>
    </>
  );
};
