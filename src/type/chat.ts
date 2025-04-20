export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string | null;
  room_id: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  user_id1?: string | null;
  user_id2?: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_message?: string | null;
}

export interface ProfileData {
  id: string;
  username: string;
  avatar_url: string | null;
  age?: number | null;
  location?: string | null;
  gender?: string | null;
  training_experience?: string | null;
  bio?: string | null;
  favorite_muscle?: string | null;
  difficult_muscle?: string | null;
  belong_gym?: string | null;
}
