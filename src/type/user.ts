export interface User {
  username: string;
  gender: string;
  age: string;
  location: string;
  training_experience: string;
  bio: string;
  avatar_url: string;
}

export interface OtherUser {
  username: string;
  avatar_url: string | null;
  gender: string;
  age: string;
  location: string;
  training_experience: string;
  bio: string;
}
