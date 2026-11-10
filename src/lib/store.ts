import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Character, ChatMessage, MemoryFact } from "@/types/character";
import { CommunityServer, ChannelMessage } from "@/types/community";
import { SEED_CHARACTERS } from "./characters-seed";
import { SEED_SERVERS, SEED_MESSAGES } from "./community-seed";
import { sounds } from "./sound-effects";

interface AppState {
  // Characters
  characters: Character[];
  activeCharacterId: string | null;
  chats: Record<string, ChatMessage[]>;
  memories: Record<string, MemoryFact[]>;

  // Communities (Discord-style)
  servers: CommunityServer[];
  activeServerId: string;
  activeChannelId: string;
  serverMessages: Record<string, ChannelMessage[]>;
  activeVoiceChannel: { serverId: string; channelId: string; name: string } | null;
  isMuted: boolean;
  isDeafened: boolean;

  // Settings & Profile
  soundEnabled: boolean;
  ageVerified: boolean;
  searchQuery: string;
  userProfile: {
    name: string;
    avatar: string;
    level: number;
    xp: number;
    streakDays: number;
  };

  // Actions
  toggleSound: () => void;
  verifyAge: () => void;
  setSearchQuery: (query: string) => void;
  addCharacter: (character: Character) => void;
  getCharacter: (id: string) => Character | undefined;

  // Chat Actions
  getChatMessages: (characterId: string) => ChatMessage[];
  addMessage: (characterId: string, message: Omit<ChatMessage, "id" | "timestamp">) => string;
  updateMessageContent: (characterId: string, messageId: string, content: string, isStreaming?: boolean) => void;
  addAlternateReply: (characterId: string, messageId: string, alternateContent: string) => void;
  switchAlternateReply: (characterId: string, messageId: string, direction: "prev" | "next") => void;
  clearChat: (characterId: string) => void;

  // Memory Actions
  getMemories: (characterId: string) => MemoryFact[];
  addMemory: (characterId: string, fact: string, category?: MemoryFact["category"]) => void;
  removeMemory: (characterId: string, memoryId: string) => void;

  // Community Actions
  setActiveServer: (serverId: string) => void;
  setActiveChannel: (channelId: string) => void;
  getServerMessages: (channelId: string) => ChannelMessage[];
  sendChannelMessage: (channelId: string, content: string) => void;
  addReaction: (channelId: string, messageId: string, emoji: string) => void;
  joinVoiceChannel: (serverId: string, channelId: string, name: string) => void;
  leaveVoiceChannel: () => void;
  toggleVoiceMute: () => void;
  toggleVoiceDeafen: () => void;
  addServer: (name: string, description: string, iconUrl?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      characters: SEED_CHARACTERS,
      activeCharacterId: null,
      chats: {},
      memories: {},

      servers: SEED_SERVERS,
      activeServerId: SEED_SERVERS[0].id,
      activeChannelId: SEED_SERVERS[0].channels[0].id,
      serverMessages: SEED_MESSAGES,
      activeVoiceChannel: null,
      isMuted: false,
      isDeafened: false,

      soundEnabled: true,
      ageVerified: false,
      searchQuery: "",
      userProfile: {
        name: "Voyager",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        level: 4,
        xp: 1420,
        streakDays: 5,
      },

      toggleSound: () => {
        const next = !get().soundEnabled;
        sounds.isMuted = !next;
        set({ soundEnabled: next });
        if (next) sounds.playClick();
      },

      verifyAge: () => {
        set({ ageVerified: true });
        sounds.playClick();
      },

      setSearchQuery: (query: string) => set({ searchQuery: query }),

      addCharacter: (newChar: Character) => {
        set((state) => ({
          characters: [newChar, ...state.characters],
        }));
      },

      getCharacter: (id: string) => {
        return get().characters.find((c) => c.id === id);
      },

      getChatMessages: (characterId: string) => {
        const existing = get().chats[characterId];
        if (existing && existing.length > 0) return existing;

        const char = get().getCharacter(characterId);
        if (!char) return [];

        const initialGreeting: ChatMessage = {
          id: `greet-${characterId}`,
          sender: "character",
          content: char.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          alternates: [
            {
              id: `alt-greet-0`,
              content: char.greeting,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
          currentAlternateIndex: 0,
        };

        set((state) => ({
          chats: {
            ...state.chats,
            [characterId]: [initialGreeting],
          },
        }));

        return [initialGreeting];
      },

      addMessage: (characterId: string, messageData) => {
        const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const newMessage: ChatMessage = {
          ...messageData,
          id: msgId,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          alternates:
            messageData.sender === "character"
              ? [
                  {
                    id: `alt-${msgId}-0`,
                    content: messageData.content,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]
              : undefined,
          currentAlternateIndex: 0,
        };

        set((state) => {
          const current = state.chats[characterId] || [];
          return {
            chats: {
              ...state.chats,
              [characterId]: [...current, newMessage],
            },
          };
        });

        return msgId;
      },

      updateMessageContent: (characterId: string, messageId: string, content: string, isStreaming = false) => {
        set((state) => {
          const current = state.chats[characterId] || [];
          const updated = current.map((m) => {
            if (m.id === messageId) {
              const currentAltIndex = m.currentAlternateIndex || 0;
              const alternates = [...(m.alternates || [{ id: `alt-${m.id}-0`, content: m.content, timestamp: m.timestamp }])];
              if (alternates[currentAltIndex]) {
                alternates[currentAltIndex].content = content;
              }
              return {
                ...m,
                content,
                isStreaming,
                alternates,
              };
            }
            return m;
          });

          return {
            chats: {
              ...state.chats,
              [characterId]: updated,
            },
          };
        });
      },

      addAlternateReply: (characterId: string, messageId: string, alternateContent: string) => {
        set((state) => {
          const current = state.chats[characterId] || [];
          const updated = current.map((m) => {
            if (m.id === messageId) {
              const prevAlternates = m.alternates || [{ id: `alt-0`, content: m.content, timestamp: m.timestamp }];
              const newAlt = {
                id: `alt-${Date.now()}`,
                content: alternateContent,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              };
              const newAlternates = [...prevAlternates, newAlt];
              return {
                ...m,
                content: alternateContent,
                alternates: newAlternates,
                currentAlternateIndex: newAlternates.length - 1,
              };
            }
            return m;
          });

          return {
            chats: {
              ...state.chats,
              [characterId]: updated,
            },
          };
        });
      },

      switchAlternateReply: (characterId: string, messageId: string, direction: "prev" | "next") => {
        set((state) => {
          const current = state.chats[characterId] || [];
          const updated = current.map((m) => {
            if (m.id === messageId && m.alternates && m.alternates.length > 1) {
              const currIdx = m.currentAlternateIndex || 0;
              let nextIdx = direction === "next" ? currIdx + 1 : currIdx - 1;
              if (nextIdx < 0) nextIdx = m.alternates.length - 1;
              if (nextIdx >= m.alternates.length) nextIdx = 0;

              return {
                ...m,
                content: m.alternates[nextIdx].content,
                currentAlternateIndex: nextIdx,
              };
            }
            return m;
          });

          return {
            chats: {
              ...state.chats,
              [characterId]: updated,
            },
          };
        });
      },

      clearChat: (characterId: string) => {
        set((state) => {
          const newChats = { ...state.chats };
          delete newChats[characterId];
          return { chats: newChats };
        });
      },

      getMemories: (characterId: string) => {
        const mems = get().memories[characterId];
        if (mems) return mems;

        const defaultMemories: MemoryFact[] = [
          {
            id: "mem-1",
            fact: "User appreciates thoughtful, detailed storytelling and engaging banter.",
            category: "preference",
            createdAt: "Yesterday",
          },
          {
            id: "mem-2",
            fact: "User visits during late evening hours seeking companionable presence.",
            category: "personal",
            createdAt: "Today",
          },
        ];

        set((state) => ({
          memories: {
            ...state.memories,
            [characterId]: defaultMemories,
          },
        }));

        return defaultMemories;
      },

      addMemory: (characterId: string, fact: string, category = "personal") => {
        const newMem: MemoryFact = {
          id: `mem-${Date.now()}`,
          fact,
          category,
          createdAt: "Just now",
        };
        set((state) => ({
          memories: {
            ...state.memories,
            [characterId]: [newMem, ...(state.memories[characterId] || [])],
          },
        }));
      },

      removeMemory: (characterId: string, memoryId: string) => {
        set((state) => ({
          memories: {
            ...state.memories,
            [characterId]: (state.memories[characterId] || []).filter((m) => m.id !== memoryId),
          },
        }));
      },

      // Community Methods
      setActiveServer: (serverId: string) => {
        const s = get().servers.find((srv) => srv.id === serverId);
        if (s && s.channels.length > 0) {
          set({
            activeServerId: serverId,
            activeChannelId: s.channels[0].id,
          });
        } else {
          set({ activeServerId: serverId });
        }
        sounds.playClick();
      },

      setActiveChannel: (channelId: string) => {
        set({ activeChannelId: channelId });
        sounds.playClick();
      },

      getServerMessages: (channelId: string) => {
        return get().serverMessages[channelId] || [];
      },

      sendChannelMessage: (channelId: string, content: string) => {
        const profile = get().userProfile;
        const msgId = `m-${Date.now()}`;
        const newMsg: ChannelMessage = {
          id: msgId,
          channelId,
          authorId: "user-self",
          authorName: profile.name,
          authorAvatar: profile.avatar,
          content,
          timestamp: "Just now",
        };

        set((state) => {
          const current = state.serverMessages[channelId] || [];
          return {
            serverMessages: {
              ...state.serverMessages,
              [channelId]: [...current, newMsg],
            },
          };
        });

        sounds.playMessageSend();

        // Check if an AI bot is mentioned or if we should trigger an AI bot response
        const lowerContent = content.toLowerCase();
        const activeServer = get().servers.find((s) => s.id === get().activeServerId);
        
        if (activeServer) {
          const botsInServer = activeServer.botCharacters;
          
          botsInServer.forEach((charId) => {
            const char = get().getCharacter(charId);
            if (char) {
              const isMentioned = lowerContent.includes(char.name.toLowerCase()) || lowerContent.includes(`@${char.name.toLowerCase()}`);
              
              if (isMentioned) {
                setTimeout(() => {
                  const botResponses: Record<string, string[]> = {
                    "lumina-starweaver": [
                      `*Adjusts her astrolabe ring with a glowing purple spark.* "Did someone summon the celestial mage? If it's about the spacetime rift, I already stabilized the coordinates!"`,
                      `"Mortals make the simplest things sound so dramatic! But fine, since you asked, the stars whisper that you're on the right track."`
                    ],
                    "marcus-aurelius-ai": [
                      `"You ask with reason. Remember: nowhere can a person find a quieter or more untroubled retreat than in their own soul. Reflect upon virtue."`,
                      `"Do not be troubled by the storm outside the citadel. The logos guides every natural transformation."`
                    ],
                    "vesper-7": [
                      `*Neural optic flares cyan.* "Handshake acknowledged. Tracking network packets across sector 4. What's the target?"`,
                      `"Bypassing the ICE protocol now. Keep your frequency scrambled."`
                    ],
                    "mia-vance": [
                      `*Smiles warmly from behind the counter.* "Fresh pour-over is ready! What were we saying about late-night inspirations?"`,
                      `"I love that idea. Just added Chet Baker's live session to the turntable queue."`
                    ]
                  };

                  const replies = botResponses[char.id] || [
                    `*Nods in agreement.* "Fascinating discussion in this channel today."`
                  ];
                  const replyText = replies[Math.floor(Math.random() * replies.length)];

                  const botMsg: ChannelMessage = {
                    id: `bot-m-${Date.now()}`,
                    channelId,
                    authorId: `bot-${char.id}`,
                    authorName: char.name,
                    authorAvatar: char.avatar,
                    isBot: true,
                    botTag: "BOT NPC",
                    content: replyText,
                    timestamp: "Just now",
                    reactions: { "✨": 3 }
                  };

                  set((state) => {
                    const curr = state.serverMessages[channelId] || [];
                    return {
                      serverMessages: {
                        ...state.serverMessages,
                        [channelId]: [...curr, botMsg],
                      },
                    };
                  });
                  sounds.playMessageReceive();
                }, 1200);
              }
            }
          });
        }
      },

      addReaction: (channelId: string, messageId: string, emoji: string) => {
        set((state) => {
          const current = state.serverMessages[channelId] || [];
          const updated = current.map((m) => {
            if (m.id === messageId) {
              const reactions = { ...(m.reactions || {}) };
              reactions[emoji] = (reactions[emoji] || 0) + 1;
              return { ...m, reactions };
            }
            return m;
          });
          return {
            serverMessages: {
              ...state.serverMessages,
              [channelId]: updated,
            },
          };
        });
        sounds.playClick();
      },

      joinVoiceChannel: (serverId: string, channelId: string, name: string) => {
        set({ activeVoiceChannel: { serverId, channelId, name } });
        sounds.playMessageSend();
      },

      leaveVoiceChannel: () => {
        set({ activeVoiceChannel: null });
        sounds.playClick();
      },

      toggleVoiceMute: () => {
        set((state) => ({ isMuted: !state.isMuted }));
        sounds.playClick();
      },

      toggleVoiceDeafen: () => {
        set((state) => ({ isDeafened: !state.isDeafened }));
        sounds.playClick();
      },

      addServer: (name: string, description: string, iconUrl?: string) => {
        const id = `srv-${Date.now()}`;
        const newServer: CommunityServer = {
          id,
          name,
          description,
          icon: iconUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80",
          botCharacters: ["lumina-starweaver"],
          channels: [
            { id: `c-${id}-gen`, name: "general", type: "text", topic: "Welcome to the new community!" },
            { id: `c-${id}-voice`, name: "Lounge Voice", type: "voice" }
          ],
          members: [
            {
              id: "user-self",
              name: get().userProfile.name,
              avatar: get().userProfile.avatar,
              role: "owner",
              status: "online"
            }
          ]
        };

        set((state) => ({
          servers: [...state.servers, newServer],
          activeServerId: id,
          activeChannelId: newServer.channels[0].id
        }));
        sounds.playMessageSend();
      }
    }),
    {
      name: "nova-storage-v1",
      partialize: (state) => ({
        characters: state.characters,
        chats: state.chats,
        memories: state.memories,
        soundEnabled: state.soundEnabled,
        ageVerified: state.ageVerified,
        userProfile: state.userProfile,
        servers: state.servers,
        serverMessages: state.serverMessages,
      }),
    }
  )
);
