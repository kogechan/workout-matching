import { atom } from 'jotai';
import { Post } from '@/type/post';
import { User } from '@/type/user';
import { ChatRoom, Message, ProfileData } from '@/type/chat';

// メニューの表示状態を管理
export const menuAtom = atom(false);
// ログインモーダルの開閉状態を管理する
export const loginModalAtom = atom(false);
// 投稿モーダルの開閉状態を管理する
export const postModalAtom = atom(false);
// ログアウトアラートモーダルの開閉状態を管理
export const logoutModalAtom = atom(false);
// 検索フィルターをフルダイアログにしてその開閉状態を管理
export const filterModalAtom = atom(false);
// メールアドレスの管理
export const emailAtom = atom('');
// パスワードの管理
export const passwordAtom = atom('');
// 投稿を保持
export const postAtom = atom<Post[]>([]);
// ログインユーザーのプロフィール情報の値を保持
export const profileAtom = atom<User>({
  username: '',
  gender: '',
  age: '',
  location: '',
  training_experience: '',
  bio: '',
  avatar_url: '',
});
// 現在のユーザーの情報を保持
export const currentUserAtom = atom<string | null>(null);
// ローディング状態を管理
export const isLoadingAtom = atom(true);
// メッセージ情報を保持
export const messageAtom = atom<Message[]>([]);
// 他ユーザーの情報を保持
export const otherUserAtom = atom<ProfileData | null>(null);
// チャットルーム情報を保持
export const chatRoomAtom = atom<ChatRoom | null>(null);
