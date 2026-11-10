export interface StrangerProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  interests: string[];
  isAiFallback: boolean;
  aiCharacterId?: string;
}

export interface MatchMessage {
  id: string;
  sender: "you" | "stranger" | "system";
  content: string;
  timestamp: string;
}

export interface WingmanSuggestion {
  id: string;
  text: string;
  vibe: "playful" | "thoughtful" | "direct" | "funny";
}
