export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  roome_id: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  user_id1?: string;
  user_id2?: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
}

export interface ProfileData {
  id: string;
  username: string;
  avatar_url: string;
  age?: string;
  location?: string;
  gender?: string;
  training_experience?: string;
  bio?: string;
  favorite_muscle?: string;
  difficult_muscle?: string;
  belong_gym?: string;
}
