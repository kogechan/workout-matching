export interface User {
  username: string;
  gender: string | null;
  age: number | null;
  location: string | null;
  training_experience: string | null;
  bio: string | null;
  avatar_url: string;
  favorite_muscle?: string | null;
  difficult_muscle?: string | null;
  belong_gym?: string | null;
}

// サブ写真の型定義
export interface ProfileImageType {
  id: string;
  url: string;
  file?: string;
}
