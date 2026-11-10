import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Character, ChatMessage, MemoryFact } from "@/types/character";
import { SEED_CHARACTERS } from "./characters-seed";
import { sounds } from "./sound-effects";

interface AppState {
  characters: Character[];
  activeCharacterId: string | null;
  chats: Record<string, ChatMessage[]>;
  memories: Record<string, MemoryFact[]>;
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
  
  // Chat actions
  getChatMessages: (characterId: string) => ChatMessage[];
  addMessage: (characterId: string, message: Omit<ChatMessage, "id" | "timestamp">) => string;
  updateMessageContent: (characterId: string, messageId: string, content: string, isStreaming?: boolean) => void;
  addAlternateReply: (characterId: string, messageId: string, alternateContent: string) => void;
  switchAlternateReply: (characterId: string, messageId: string, direction: "prev" | "next") => void;
  clearChat: (characterId: string) => void;
  
  // Memory actions
  getMemories: (characterId: string) => MemoryFact[];
  addMemory: (characterId: string, fact: string, category?: MemoryFact["category"]) => void;
  removeMemory: (characterId: string, memoryId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      characters: SEED_CHARACTERS,
      activeCharacterId: null,
      chats: {},
      memories: {},
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

        // Seed with initial character greeting
        const initialGreeting: ChatMessage = {
          id: `greet-${characterId}`,
          sender: "character",
          content: char.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          alternates: [
            {
              id: `alt-greet-0`,
              content: char.greeting,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          currentAlternateIndex: 0
        };

        // Cache initial greeting
        set((state) => ({
          chats: {
            ...state.chats,
            [characterId]: [initialGreeting]
          }
        }));

        return [initialGreeting];
      },

      addMessage: (characterId: string, messageData) => {
        const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const newMessage: ChatMessage = {
          ...messageData,
          id: msgId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          alternates: messageData.sender === "character" ? [
            {
              id: `alt-${msgId}-0`,
              content: messageData.content,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ] : undefined,
          currentAlternateIndex: 0
        };

        set((state) => {
          const current = state.chats[characterId] || [];
          return {
            chats: {
              ...state.chats,
              [characterId]: [...current, newMessage]
            }
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
                alternates
              };
            }
            return m;
          });

          return {
            chats: {
              ...state.chats,
              [characterId]: updated
            }
          };
        });
      },

      addAlternateReply: (characterId: string, messageId: string, alternateContent: string) => {
        set((state) => {
          const current = state.chats[characterId] || [];
          const updated = current.map((m) => {
            if (m.id === messageId) {
              const prevAlternates = m.alternates || [{ id: `alt-0`, content: m.content, timestamp: m.timestamp }];
              const newAlt: { id: string; content: string; timestamp: string } = {
                id: `alt-${Date.now()}`,
                content: alternateContent,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              const newAlternates = [...prevAlternates, newAlt];
              return {
                ...m,
                content: alternateContent,
                alternates: newAlternates,
                currentAlternateIndex: newAlternates.length - 1
              };
            }
            return m;
          });

          return {
            chats: {
              ...state.chats,
              [characterId]: updated
            }
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
                currentAlternateIndex: nextIdx
              };
            }
            return m;
          });

          return {
            chats: {
              ...state.chats,
              [characterId]: updated
            }
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

        // Default seed memories for rich immersion
        const defaultMemories: MemoryFact[] = [
          {
            id: "mem-1",
            fact: "User appreciates thoughtful, detailed storytelling and engaging banter.",
            category: "preference",
            createdAt: "Yesterday"
          },
          {
            id: "mem-2",
            fact: "User visits during late evening hours seeking companionable presence.",
            category: "personal",
            createdAt: "Today"
          }
        ];

        set((state) => ({
          memories: {
            ...state.memories,
            [characterId]: defaultMemories
          }
        }));

        return defaultMemories;
      },

      addMemory: (characterId: string, fact: string, category = "personal") => {
        const newMem: MemoryFact = {
          id: `mem-${Date.now()}`,
          fact,
          category,
          createdAt: "Just now"
        };
        set((state) => ({
          memories: {
            ...state.memories,
            [characterId]: [newMem, ...(state.memories[characterId] || [])]
          }
        }));
      },

      removeMemory: (characterId: string, memoryId: string) => {
        set((state) => ({
          memories: {
            ...state.memories,
            [characterId]: (state.memories[characterId] || []).filter((m) => m.id !== memoryId)
          }
        }));
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
      }),
    }
  )
);
