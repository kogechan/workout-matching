import { atom } from 'jotai';
import { Post } from '@/type/post';
import { User } from '@/type/user';

// メニューの表示状態を管理
export const menuAtom = atom(false);
// ログインモーダルの開閉状態を管理する Atom
export const loginModalAtom = atom(false);
// 投稿モーダルの開閉状態を管理する
export const postModalAtom = atom(false);
// ログアウトアラートモーダルの開閉状態を管理
export const logoutModalAtom = atom(false);
// メールアドレスの管理
export const emailAtom = atom('');
// パスワードの管理
export const passwordAtom = atom('');
// 投稿を保持
export const postAtom = atom<Post[]>([]);
// プロフィール情報を保持
export const profileAtom = atom<User>({
  username: '',
  gender: '',
  age: '',
  location: '',
  training_experience: '',
  bio: '',
  avatar_url: '',
});
