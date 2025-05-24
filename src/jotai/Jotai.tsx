import { atom } from 'jotai';
import { Post } from '@/type/post';
import { ProfileImageType, User } from '@/type/user';
import { ChatRoom, Message, ProfileData } from '@/type/chat';
import { SearchFilters } from '@/type/search';

// メニューの表示状態を管理
export const menuAtom = atom(false);
// ログインモーダルの開閉状態を管理する
export const loginModalAtom = atom(false);
// 投稿モーダルの開閉状態を管理する
export const postModalAtom = atom(false);
// ログアウトアラートモーダルの開閉状態を管理
export const logoutModalAtom = atom(false);
// ブロックモーダルの開閉状態を管理
export const blockModalAtom = atom(false);
// ブロック解除モーダルの開閉状態を管理
export const unblockModalAtom = atom(false);
// 報告モーダルの開閉状態を管理(投稿)
export const reportPostModalAtom = atom(false);
// 報告モーダルの開閉状態を管理(ユーザー)
export const reportUserModalAtom = atom(false);
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
  age: 0,
  location: '',
  training_experience: '',
  bio: '',
  avatar_url: '',
  favorite_muscle: '',
  difficult_muscle: '',
  belong_gym: '',
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
// 報告対象の管理（投稿）
export const reportPostTargetAtom = atom<Post | null>(null);
// 報告対象の管理(ユーザー)
export const reportUserTargetAtom = atom<ProfileData | null>(null);
// ブロック対象の管理
export const blockTargetAtom = atom<ProfileData | null>(null);
// サブ写真の情報を保持
export const subImgeAtom = atom<ProfileImageType[]>([]);
// フィルターしている値を保持
export const filterAtom = atom<SearchFilters>({
  age: null,
  location: null,
  gender: null,
  training_experience: null,
  favorite_muscle: null,
  difficult_muscle: null,
  belong_gym: null,
});
// ブロックしたユーザーの情報を保持
export const blockedUserAtom = atom<ProfileData[]>([]);
