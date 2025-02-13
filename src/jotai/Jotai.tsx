import { atom } from 'jotai';

// メニューの表示状態を管理
export const menuAtom = atom(false);
// ログインモーダルの開閉状態を管理する Atom
export const loginModalAtom = atom(false);
// アカウント登録モーダルの開閉状態を管理する Atom
export const SignUpModalAtom = atom(false);
// メールアドレスの管理
export const emailAtom = atom('');
// パスワードの管理
export const passwordAtom = atom('');
