import { atom } from 'jotai';
import Memo from '@/types/WorkOut';

// メモのリストを保持する状態を管理
export const memosAtom = atom<Memo[]>([]);

// メニューの表示状態を管理
export const menuAtom = atom(false)