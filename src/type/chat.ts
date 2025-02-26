export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  roome_id: string;
  User?: {
    username?: string;
    gender?: string;
    age?: string;
    location?: string;
    training_experience?: string;
    bio?: string;
    avatar_url?: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
}
