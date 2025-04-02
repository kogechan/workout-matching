export interface User {
  username: string;
  gender: string;
  age: string;
  location: string;
  training_experience: string;
  bio: string;
  avatar_url: string;
  favorite_muscle?: string;
  difficult_muscle?: string;
  belong_gym?: string;
}

// サブ写真の型定義
export interface ProfileImageType {
  id: string;
  url: string;
  file?: string;
}
