export interface Post {
  id: string;
  content: string;
  user_id: string | null;
  created_at: string | null;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
    gender: string | null;
    age: number | null;
    location: string | null;
    training_experience: string | null;
    bio: string | null;
    favorite_muscle: string | null;
    difficult_muscle: string | null;
    belong_gym: string | null;
  } | null;
}
