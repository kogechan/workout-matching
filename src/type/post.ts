export interface Post {
  id: number;
  content: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}
