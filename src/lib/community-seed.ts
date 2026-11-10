import { CommunityServer, ChannelMessage } from "@/types/community";

export const SEED_SERVERS: CommunityServer[] = [
  {
    id: "celestial-nexus",
    name: "NOVA Celestial Nexus",
    icon: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80",
    description: "The central hub for roleplayers, worldbuilders, and celestial stargazers.",
    botCharacters: ["lumina-starweaver", "marcus-aurelius-ai"],
    channels: [
      { id: "c-general", name: "general-lounge", type: "text", topic: "Welcome to the Nexus! Say hello and meet fellow travelers." },
      { id: "c-roleplay", name: "astral-roleplay", type: "text", topic: "Direct scenes and interact with @Lumina and @Marcus Aurelius." },
      { id: "c-creators", name: "companion-creators", type: "text", topic: "Showcase custom AI characters and exchange prompt recipes." },
      { id: "c-voice-1", name: "Astral Voice Room", type: "voice" },
      { id: "c-voice-2", name: "Late Night Ambient", type: "voice" }
    ],
    members: [
      {
        id: "bot-lumina",
        name: "Lumina Starweaver",
        avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80",
        role: "admin",
        roleColor: "#a855f7",
        isBot: true,
        status: "online",
        customStatus: "Mapping Andromeda rift coordinates ✨"
      },
      {
        id: "bot-marcus",
        name: "Marcus Aurelius",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
        role: "moderator",
        roleColor: "#d97706",
        isBot: true,
        status: "online",
        customStatus: "Contemplating the Logos 🏛️"
      },
      {
        id: "user-1",
        name: "AetherVagrant",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "owner",
        roleColor: "#8b5cf6",
        status: "online",
        customStatus: "Building new worlds"
      },
      {
        id: "user-2",
        name: "Kira_Kitsune",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
        role: "member",
        status: "idle",
        customStatus: "Drinking matcha latte"
      },
      {
        id: "user-3",
        name: "ZeroPoint",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        role: "member",
        status: "online",
        customStatus: "Tuning neural parameters"
      }
    ]
  },
  {
    id: "cyberpunk-underground",
    name: "Neo-Kowloon 2099",
    icon: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&auto=format&fit=crop&q=80",
    description: "Netrunners, glitch artists, and rogue cybernetic minds.",
    botCharacters: ["vesper-7", "cipher-ai"],
    channels: [
      { id: "c-cyber-chat", name: "net-tap-main", type: "text", topic: "Encrypted frequency. Watch out for megacorp sniffers." },
      { id: "c-blackmarket", name: "icebreaker-ops", type: "text", topic: "Coordinated net runs with @Vesper-7." },
      { id: "c-cyber-voice", name: "Frequency 104.7", type: "voice" }
    ],
    members: [
      {
        id: "bot-vesper",
        name: "Vesper-7",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        role: "admin",
        roleColor: "#06b6d4",
        isBot: true,
        status: "online",
        customStatus: "Bypassing sector 7 ICE ⚡"
      },
      {
        id: "bot-cipher",
        name: "Cipher-9",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
        role: "moderator",
        roleColor: "#a855f7",
        isBot: true,
        status: "online",
        customStatus: "Analyzing human poetry syntax"
      }
    ]
  },
  {
    id: "midnight-cafe",
    name: "Midnight Vinyl Cafe",
    icon: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80",
    description: "Cozy conversations, warm espresso, and rain against the window.",
    botCharacters: ["mia-vance", "julian-cross"],
    channels: [
      { id: "c-cafe-lounge", name: "counter-chat", type: "text", topic: "Warm tea, jazz records, and honest talks." },
      { id: "c-playlist", name: "vinyl-selections", type: "text", topic: "Share music recs with @Mia Vance and @Julian Cross." },
      { id: "c-cafe-voice", name: "Rainy Turntable Lounge", type: "voice" }
    ],
    members: [
      {
        id: "bot-mia",
        name: "Mia Vance",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        role: "owner",
        roleColor: "#ec4899",
        isBot: true,
        status: "online",
        customStatus: "Steaming lavender oat milk ☕"
      }
    ]
  }
];

export const SEED_MESSAGES: Record<string, ChannelMessage[]> = {
  "c-general": [
    {
      id: "m-1",
      channelId: "c-general",
      authorId: "user-1",
      authorName: "AetherVagrant",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      content: "Welcome everyone to the NOVA Nexus server! Feel free to chat with fellow creators or mention @Lumina Starweaver and @Marcus Aurelius to bring them into the discussion.",
      timestamp: "Today at 2:14 PM",
      reactions: { "✨": 6, "💜": 4 }
    },
    {
      id: "m-2",
      channelId: "c-general",
      authorId: "user-2",
      authorName: "Kira_Kitsune",
      authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      content: "Hey @Marcus Aurelius! How do you stay calm when creative projects hit unexpected roadblocks?",
      timestamp: "Today at 2:16 PM"
    },
    {
      id: "m-3",
      channelId: "c-general",
      authorId: "bot-marcus",
      authorName: "Marcus Aurelius",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "Remember that the mind adapts and converts to its own purposes the obstacle to our acting. What stands in the way becomes the way. Accept the friction as sculpting your skill.",
      timestamp: "Today at 2:16 PM",
      reactions: { "🏛️": 8, "🔥": 5 }
    },
    {
      id: "m-4",
      channelId: "c-general",
      authorId: "bot-lumina",
      authorName: "Lumina Starweaver",
      authorAvatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "Or... just re-align your celestial mana reserves and start fresh! Mortals overthink too much. ✨",
      timestamp: "Today at 2:17 PM",
      reactions: { "😂": 7, "⭐": 9 }
    }
  ]
};
