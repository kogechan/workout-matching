import { atom } from 'jotai';
import { Post } from '@prisma/client';

// メニューの表示状態を管理
export const menuAtom = atom(false);
// ログインモーダルの開閉状態を管理する Atom
export const loginModalAtom = atom(false);
// アカウント登録モーダルの開閉状態を管理する Atom
export const SignUpModalAtom = atom(false);
// 申請メールモーダルの開閉状態を管理する
export const SendEmailModalAtom = atom(false);
// 投稿の一覧を管理
export const postsAtom = atom<Post[]>([]);
// メールアドレスの管理
export const emailAtom = atom('');
// パスワードの管理
export const passwordAtom = atom('');
