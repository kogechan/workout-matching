import { atom } from 'jotai';
import { Post } from '@/type/post';

// メニューの表示状態を管理
export const menuAtom = atom(false);
// ログインモーダルの開閉状態を管理する Atom
export const loginModalAtom = atom(false);
// アカウント登録モーダルの開閉状態を管理する Atom
export const SignUpModalAtom = atom(false);
// 投稿モーダルの開閉状態を管理する
export const PostModalAtom = atom(false);
// ログアウトアラートモーダルの開閉状態を管理
export const LogoutModalAtom = atom(false);
// メールアドレスの管理
export const emailAtom = atom('');
// パスワードの管理
export const passwordAtom = atom('');
// 投稿を保持
export const postAtom = atom<Post[]>([]);
