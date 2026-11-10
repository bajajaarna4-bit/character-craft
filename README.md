# NOVA — Cinematic AI Social Companion Platform

> A next-generation social AI companion platform combining **Character.AI** (character creation & streaming chat), **Chai** (swipeable alternate replies & mobile-first immersion), **Discord** (communities, channels, voice rooms & AI NPC bots), and **Omegle** (safe random matchmaking with video/voice & AI wingman).

---

## 🌟 Full Suite of Features

### 1. Netflix-Grade Cinematic UI / UX
- **Deep Obsidian Palette**: Refined dark canvas (`#09090b`), signature violet/magenta/cyan glowing accents, and glassmorphism panels.
- **Hero Spotlight Banner**: Autoplaying ambient trailers with mood-adaptive atmospheric glows, quick voice samples, and direct "Start Chat" CTA.
- **Horizontal Category Carousels**: Smooth scrolling rows ("🔥 Trending Now", "🌸 Anime & Manga Originals", "☕ Romance & Companions", "🏛️ Mentors & Stoic Philosophy", "⚡ Sci-Fi & Cyberpunk", "⚔️ Fantasy & Tabletop", "📚 Study Buddies", "🕯️ Gothic Mystery").
- **Hover Micro-Interactions**: Zooming cards with ambient glow borders and instant quick-chat actions.
- **Procedural Sound Design**: Built-in Web Audio API synthesizers for subtle tactile hover pops, clicks, chat chimes, and swipe sounds with a global mute toggle.

### 2. Character Chat Studio (Character.AI + Chai Experience)
- **Streaming AI Pipeline**: Chunked edge streaming with realistic human typing cadence.
- **Swipeable Alternate Replies**: Chai-style swiper (`< 1 / 3 >`) with regeneration support.
- **Long-Term Memory Drawer**: Context recall panel where users can view, pin, categorize, and delete persistent facts.
- **Dynamic Mood Aura**: Background ambient atmospheric glow adapts to the character's theme.
- **Integrated Voice Suite**:
  - **Speech-to-Text (STT)**: Hands-free mic dictation.
  - **Text-to-Speech (TTS)**: Voice read aloud for messages with customized pitch and rate.

### 3. Communities (Discord-Style Hub) — `/community`
- **Server Rail**: Multi-server switcher with unread notifications and "Create Server" modal.
- **Channels**: Text channels (`# general-lounge`, `# astral-roleplay`, `# companion-creators`) and Voice rooms.
- **AI Bots as Channel NPCs**: AI characters live inside channels as verified `[BOT NPC]` participants (e.g., Lumina Starweaver, Marcus Aurelius, Vesper-7) who actively respond when mentioned (`@Lumina`, etc.).
- **Interactive Voice Stage**: Multi-speaker grid with green talking indicators, mute/unmute, and deafen controls.
- **Emoji Reactions**: Real-time reaction counters (`🔥`, `✨`, `❤️`, `😂`, `👍`).
- **Member Directory**: Categorized by AI Bot NPCs, Council & Admins, and Online members.

### 4. Safe Random Match (Omegle-Style) — `/match`
- **18+ Age Gate & Safety Guard**: Verified age barrier ensuring no minors are paired.
- **Interest Tag Matching**: Instant matchmaking paired by shared tags (Anime, Gaming, Late Night Talks, Cyberpunk, Philosophy).
- **Mode Switcher**: Text Chat vs. WebRTC Video/Voice with mutual camera opt-in.
- **10-Second Countdown & AI Fallback**: If no human peer is available within 10s, offers instant fallback to match with an AI companion.
- **AI Wingman Assistant**: Live floating panel analyzing conversation and generating 3 instant witty/insightful replies.
- **AI Icebreaker Generator**: Instantly drops fun questions or creative dilemmas into the chat to kill awkward pauses.
- **Session Controls**: Instant "Next" skip, "Add Friend", and "Make Room Private" buttons.

### 5. Character Creator Studio — `/create`
- Full creation suite: Name, category, avatar picker, custom image URL, ambient aura selector, opening greeting, personality prompts, backstory, few-shot example dialogue, and voice configuration.
- Instantly saves and launches direct chat with your new character.

### 6. Safety & Crisis Guardrails
- **Crisis Helpline Intervention**: Automated detection of crisis/self-harm keywords in the API route, returning 988 Lifeline and Crisis Text Line resources.
- **Safety Center & Reporting Modal**: Flagging queue for non-consensual content, impersonation, and policy violations.
- **AI Persona Disclaimer**: Strict labelling distinguishing AI entities from real living people.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- `pnpm` (or `npm`)

### Installation & Launch

```bash
# Clone the repository
git clone <repo-url>
cd roleplaywebiste

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Discovery & Chat**: [http://localhost:3000/](http://localhost:3000/)
- **Creator Studio**: [http://localhost:3000/create](http://localhost:3000/create)
- **Communities**: [http://localhost:3000/community](http://localhost:3000/community)
- **Random Match**: [http://localhost:3000/match](http://localhost:3000/match)
