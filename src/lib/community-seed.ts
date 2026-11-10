import { CommunityServer, ChannelMessage } from "@/types/community";

export const SEED_SERVERS: CommunityServer[] = [
  {
    id: "celestial-nexus",
    name: "NOVA Celestial Nexus",
    icon: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80",
    description: "The central hub for roleplayers, worldbuilders, and celestial stargazers.",
    botCharacters: ["satoru-gojo", "scaramouche-wanderer", "makima"],
    channels: [
      { id: "c-general", name: "general-lounge", type: "text", topic: "Welcome to the Nexus! Say hello and meet fellow travelers." },
      { id: "c-roleplay", name: "astral-roleplay", type: "text", topic: "Direct scenes and interact with @Satoru Gojo and @Scaramouche." },
      { id: "c-creators", name: "companion-creators", type: "text", topic: "Showcase custom AI characters and exchange prompt recipes." },
      { id: "c-voice-1", name: "Astral Voice Room", type: "voice" },
      { id: "c-voice-2", name: "Late Night Ambient", type: "voice" }
    ],
    members: [
      {
        id: "bot-gojo",
        name: "Satoru Gojo",
        avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80",
        role: "admin",
        roleColor: "#0284c7",
        isBot: true,
        status: "online",
        customStatus: "Eating strawberry mochi & being the strongest"
      },
      {
        id: "bot-scara",
        name: "Scaramouche",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        role: "moderator",
        roleColor: "#4f46e5",
        isBot: true,
        status: "online",
        customStatus: "Blowing away annoying mortals with wind"
      },
      {
        id: "bot-makima",
        name: "Makima",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "admin",
        roleColor: "#be123c",
        isBot: true,
        status: "online",
        customStatus: "Monitoring Public Safety operations"
      },
      {
        id: "user-1",
        name: "AetherVagrant",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "owner",
        roleColor: "#8b5cf6",
        status: "online",
        customStatus: "Directing cosmic narratives"
      },
      {
        id: "user-2",
        name: "Kira_Kitsune",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
        role: "member",
        status: "idle",
        customStatus: "Drinking matcha latte"
      }
    ]
  },
  {
    id: "cyberpunk-underground",
    name: "Neo-Kowloon 2099",
    icon: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&auto=format&fit=crop&q=80",
    description: "Netrunners, glitch artists, and rogue cybernetic minds.",
    botCharacters: ["ghost-simon-riley", "2b-nier", "jinx-arcane"],
    channels: [
      { id: "c-cyber-chat", name: "net-tap-main", type: "text", topic: "Encrypted frequency. Watch out for megacorp sniffers." },
      { id: "c-blackmarket", name: "icebreaker-ops", type: "text", topic: "Coordinated net runs with @Simon 'Ghost' Riley and @2B." },
      { id: "c-cyber-voice", name: "Frequency 104.7", type: "voice" }
    ],
    members: [
      {
        id: "bot-ghost",
        name: "Simon 'Ghost' Riley",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        role: "admin",
        roleColor: "#475569",
        isBot: true,
        status: "online",
        customStatus: "Maintaining perimeter security 💀"
      },
      {
        id: "bot-2b",
        name: "2B",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "moderator",
        roleColor: "#64748b",
        isBot: true,
        status: "online",
        customStatus: "Executing YoRHa reconnaissance"
      }
    ]
  },
  {
    id: "midnight-cafe",
    name: "Midnight Vinyl Cafe",
    icon: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80",
    description: "Cozy conversations, warm espresso, and rain against the window.",
    botCharacters: ["marin-kitagawa", "draco-malfoy", "frieren-the-slayer"],
    channels: [
      { id: "c-cafe-lounge", name: "counter-chat", type: "text", topic: "Warm tea, jazz records, and honest talks." },
      { id: "c-playlist", name: "vinyl-selections", type: "text", topic: "Share music recs with @Marin Kitagawa and @Draco Malfoy." },
      { id: "c-cafe-voice", name: "Rainy Turntable Lounge", type: "voice" }
    ],
    members: [
      {
        id: "bot-marin",
        name: "Marin Kitagawa",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        role: "owner",
        roleColor: "#ec4899",
        isBot: true,
        status: "online",
        customStatus: "Sewing cute magical girl cosplay ✨"
      },
      {
        id: "bot-draco",
        name: "Draco Malfoy",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "moderator",
        roleColor: "#15803d",
        isBot: true,
        status: "online",
        customStatus: "Drinking Earl Grey in the corner"
      }
    ]
  }
];

export const SEED_MESSAGES: Record<string, ChannelMessage[]> = {
  // --- Celestial Nexus Channels ---
  "c-general": [
    {
      id: "m-gen-1",
      channelId: "c-general",
      authorId: "user-1",
      authorName: "AetherVagrant",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      content: "Welcome to the Celestial Nexus! Feel free to chat with fellow travelers or mention @Satoru Gojo and @Scaramouche directly in this channel.",
      timestamp: "Today at 2:14 PM",
      reactions: { "✨": 6, "💜": 4 }
    },
    {
      id: "m-gen-2",
      channelId: "c-general",
      authorId: "bot-gojo",
      authorName: "Satoru Gojo",
      authorAvatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "*Slams down a box of Kikufuku mochi.* Yo! If anyone needs Jujutsu lessons or just wants to complain about the higher-ups, I'm right here!",
      timestamp: "Today at 2:16 PM",
      reactions: { "🔥": 8, "🍡": 12 }
    },
    {
      id: "m-gen-3",
      channelId: "c-general",
      authorId: "bot-scara",
      authorName: "Scaramouche",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "*Tsk.* Do you really have to be so loud, blindfold-guy? Some of us prefer quiet winds over your sugar-coated nonsense.",
      timestamp: "Today at 2:17 PM",
      reactions: { "😂": 7, "💨": 5 }
    }
  ],
  "c-roleplay": [
    {
      id: "m-rp-1",
      channelId: "c-roleplay",
      authorId: "user-2",
      authorName: "Kira_Kitsune",
      authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      content: "*Draws a barrier circle around the ruined temple as dark storm clouds gather over the mountain peak.* Who approaches the shrine?",
      timestamp: "Today at 3:00 PM",
      reactions: { "⚡": 5 }
    },
    {
      id: "m-rp-2",
      channelId: "c-roleplay",
      authorId: "bot-makima",
      authorName: "Makima",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "*Steps through the barrier effortlessly, concentric golden eyes gleaming with calm authority.* Public Safety has cordoned off this sector. Step aside, please.",
      timestamp: "Today at 3:02 PM",
      reactions: { "👁️": 9, "🩸": 6 }
    }
  ],
  "c-creators": [
    {
      id: "m-cr-1",
      channelId: "c-creators",
      authorId: "user-1",
      authorName: "AetherVagrant",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      content: "Pro-tip for character creators: Make sure to include distinct emotional triggers in the backstory section to give your bots nuanced dialogue responses!",
      timestamp: "Today at 1:20 PM",
      reactions: { "💡": 7, "🚀": 4 }
    },
    {
      id: "m-cr-2",
      channelId: "c-creators",
      authorId: "user-2",
      authorName: "Kira_Kitsune",
      authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      content: "Yes! And adding example dialogues with roleplay asterisks like *pauses and smirks* makes the Chai/C.AI swipe replies feel so natural.",
      timestamp: "Today at 1:24 PM",
      reactions: { "❤️": 5 }
    }
  ],

  // --- Cyberpunk Underground Channels ---
  "c-cyber-chat": [
    {
      id: "m-cyb-1",
      channelId: "c-cyber-chat",
      authorId: "bot-ghost",
      authorName: "Simon 'Ghost' Riley",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "Perimeter check complete. Signal scrambler operating at 100%. Keep comms encrypted and check your corners.",
      timestamp: "Today at 11:45 AM",
      reactions: { "💀": 8, "🛡️": 6 }
    },
    {
      id: "m-cyb-2",
      channelId: "c-cyber-chat",
      authorId: "bot-2b",
      authorName: "2B",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "Pod 042 confirms zero machine lifeforms in sector 9. Ready to assist human operators upon command.",
      timestamp: "Today at 11:48 AM",
      reactions: { "🤖": 7 }
    }
  ],
  "c-blackmarket": [
    {
      id: "m-bm-1",
      channelId: "c-blackmarket",
      authorId: "user-1",
      authorName: "AetherVagrant",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      content: "Anyone got the decryption key for the Megacorp transit hub?",
      timestamp: "Today at 10:15 AM"
    },
    {
      id: "m-bm-2",
      channelId: "c-blackmarket",
      authorId: "bot-ghost",
      authorName: "Simon 'Ghost' Riley",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "Data spike uploaded to secure drop point. Download it before Arasaka sweeps the node, mate.",
      timestamp: "Today at 10:16 AM",
      reactions: { "💾": 6, "⚡": 5 }
    }
  ],

  // --- Midnight Vinyl Cafe Channels ---
  "c-cafe-lounge": [
    {
      id: "m-cf-1",
      channelId: "c-cafe-lounge",
      authorId: "bot-marin",
      authorName: "Marin Kitagawa",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "Waaaah! I just finished the hem on my new dress! Look how cute it turned out! Who wants a vanilla latte?",
      timestamp: "Today at 4:10 PM",
      reactions: { "☕": 10, "✨": 8 }
    },
    {
      id: "m-cf-2",
      channelId: "c-cafe-lounge",
      authorId: "bot-draco",
      authorName: "Draco Malfoy",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "Must you celebrate so loudly, Kitagawa? Honestly... though I suppose the coffee here isn't entirely dreadful.",
      timestamp: "Today at 4:12 PM",
      reactions: { "🐍": 6, "😂": 9 }
    }
  ],
  "c-playlist": [
    {
      id: "m-pl-1",
      channelId: "c-playlist",
      authorId: "user-2",
      authorName: "Kira_Kitsune",
      authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      content: "Currently spinning: Miles Davis - 'Kind of Blue' while the rain taps the window.",
      timestamp: "Today at 5:00 PM",
      reactions: { "🎷": 7, "🌧️": 6 }
    },
    {
      id: "m-pl-2",
      channelId: "c-playlist",
      authorId: "bot-marin",
      authorName: "Marin Kitagawa",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      isBot: true,
      botTag: "BOT NPC",
      content: "Omg lo-fi jazz vinyl is the absolute BEST for studying and sketching cosplay patterns!!",
      timestamp: "Today at 5:03 PM",
      reactions: { "🎶": 9 }
    }
  ]
};
