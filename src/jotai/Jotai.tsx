import { atom } from 'jotai';
import Memo from '@/types/WorkOut';

// メモのリストを保持する状態を管理
export const memosAtom = atom<Memo[]>([]);

// メニューの表示状態を管理
export const menuAtom = atom(false);

// ダイアログの状態を保持
export const dialogAtom = atom(false);

// メモを編集する関数を管理
export const editMemoAtom = atom(
  null,
  (
    get,
    set,
    id: number,
    key: 'date' | 'value' | 'weight' | 'rep' | 'memo' | 'category',
    value: string
  ) => {
    set(
      memosAtom,
      get(memosAtom).map((m) => (m.id === id ? { ...m, [key]: value } : m))
    );
  }
);

// メモを削除する関数を管理
export const deleteMemoAtom = atom(null, (get, set, id: number) => {
  set(
    memosAtom,
    get(memosAtom).filter((m) => m.id !== id)
  );
});
