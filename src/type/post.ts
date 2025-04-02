export interface Post {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
    gender: string;
    age: string;
    location: string;
    training_experience: string;
    bio: string;
    favorite_muscle: string;
    difficult_muscle: string;
    belong_gym: string;
  };
}
