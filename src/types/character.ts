export type CharacterCategory = 
  | "Trending" 
  | "Anime & Manga" 
  | "Romance & Companions" 
  | "Mentors & Philosophy" 
  | "Sci-Fi & Cyberpunk" 
  | "Fantasy & Gaming" 
  | "Horror & Mystery" 
  | "Study Buddies";

export interface DialogueExample {
  user: string;
  character: string;
}

export interface CharacterVoice {
  id: string;
  name: string;
  pitch: number;
  rate: number;
  lang?: string;
  gender: "female" | "male" | "neutral";
}

export interface MemoryFact {
  id: string;
  fact: string;
  category: "personal" | "preference" | "history" | "relationship";
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  backdrop: string;
  category: CharacterCategory;
  tags: string[];
  greeting: string;
  personality: string;
  backstory: string;
  exampleDialogue: DialogueExample[];
  voice: CharacterVoice;
  chatCount: number;
  likesCount: number;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  isOriginal: boolean;
  isNsfw?: boolean;
  themeColor: string; // Hex for ambient mood glow
  trailerVideo?: string; // Optional trailer ambient video/animated backdrop
}

export interface AlternateReply {
  id: string;
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "character" | "system";
  content: string;
  timestamp: string;
  alternates?: AlternateReply[];
  currentAlternateIndex?: number;
  isStreaming?: boolean;
  mood?: "neutral" | "happy" | "sad" | "flirty" | "angry" | "thoughtful" | "mysterious";
}
