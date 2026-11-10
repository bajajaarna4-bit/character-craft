export interface StoryScene {
  id: string;
  title: string;
  directive: string;
  location: string;
  characterIds: string[];
  turns: StoryTurn[];
  isGenerating?: boolean;
}

export interface StoryTurn {
  id: string;
  characterId: string;
  characterName: string;
  characterAvatar: string;
  actionText?: string;
  dialogue: string;
  timestamp: string;
}

