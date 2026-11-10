export interface ServerMember {
  id: string;
  name: string;
  avatar: string;
  role: "owner" | "admin" | "moderator" | "member";
  roleColor?: string;
  isBot?: boolean;
  status: "online" | "idle" | "dnd" | "offline";
  customStatus?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  topic?: string;
  unreadCount?: number;
}

export interface CommunityServer {
  id: string;
  name: string;
  icon: string;
  backdrop?: string;
  description: string;
  channels: Channel[];
  members: ServerMember[];
  botCharacters: string[]; // character IDs of AI NPCs in this server
}

export interface ChannelMessage {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isBot?: boolean;
  botTag?: string;
  content: string;
  timestamp: string;
  reactions?: Record<string, number>; // emoji -> count
  attachments?: string[];
  mentions?: string[];
}
