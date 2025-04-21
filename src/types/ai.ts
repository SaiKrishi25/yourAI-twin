
export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  interests: string;
  personality?: string;
  resume: File | null | string;
  questions: {
    favoriteThings: string;
    communicationStyle: string;
    humorStyle: string;
    values: string;
    [key: string]: string;
  };
  trollMode: boolean;
  ratings?: {
    upvotes: number;
    downvotes: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
}

export interface AIPersonaConfig {
  name: string;
  bio: string;
  interests: string;
  communicationStyle: string;
  humorStyle: string;
  values: string;
  trollMode: boolean;
}
