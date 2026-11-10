# NOVA — Cinematic AI Social Companion Platform

> A next-generation AI companion experience combining **Character.AI** (character creation & streaming chat), **Chai** (swipeable alternate replies & mobile-first immersion), **Omegle** (safe random matchmaking with video/voice), and **Discord** (communities, channels & AI NPC bots).

---

## 🌟 Features Implemented in Phase 1

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

### 3. Character Creator Studio
- Full creation suite: Name, category, avatar picker, custom image URL, ambient aura selector, opening greeting, personality prompts, backstory, few-shot example dialogue, and voice configuration.
- Instantly saves and launches direct chat with your new character.

### 4. Safety & Content Guardrails
- **Crisis Helpline Intervention**: Automated detection of crisis/self-harm keywords with instant emergency hotline resources (988 Lifeline, Crisis Text Line).
- **18+ Age Gate Compliance**: Status verification pill in the navbar.
- **Safety Center & Reporting Modal**: Flagging queue for non-consensual content, impersonation, and policy violations.
- **AI Persona Disclaimer**: Strict labelling distinguishing AI entities from real living people.

### 5. 20 Pre-Seeded Original Characters
A diverse roster including *Lumina Starweaver*, *Mia Vance*, *Vesper-7*, *Marcus Aurelius*, *Lyra Shadowsong*, *Inspector Silas Blackwood*, *Dr. Ada Vance*, *Noah Sterling*, *Kaelen Shadowblade*, *Cipher-9*, *Suki the Fox Spirit*, and more.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- `pnpm` (or `npm`)

### Installation

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

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory for optional external integrations:

```env
# Optional external LLM API keys (if left blank, NOVA runs with built-in streaming simulation)
OPENAI_API_KEY=""
GEMINI_API_KEY=""

# Database (PostgreSQL / Supabase - for Phase 2+)
DATABASE_URL="postgresql://user:password@localhost:5432/nova?schema=public"

# Redis (for Presence & Matchmaking - Phase 3 & 4)
REDIS_URL="redis://localhost:6379"

# Stripe (Phase 5)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

---

## 🗺️ Phased Roadmap

- [x] **Phase 1: Cinematic Core (Completed)**:
  - Netflix-grade discovery home with Hero spotlight & category carousels
  - 20 seeded original characters
  - Streaming Chat Studio with Chai swipe alternate replies
  - Long-term memory panel
  - Voice TTS / STT
  - Character Creator Studio
  - Safety & crisis intervention protocols
- [ ] **Phase 2: Persistent Vector Memory & Edge Voice**:
  - PostgreSQL / Supabase integration with pgvector for semantic recall
  - ElevenLabs voice synthesis integration
- [ ] **Phase 3: Discord-Style Communities**:
  - Servers, text/voice channels, roles, and AI NPC bots
- [ ] **Phase 4: Safe Omegle-Style Matchmaking**:
  - WebRTC video/voice matchmaking with interest tags & AI wingman
- [ ] **Phase 5: Creator Economy & Stripe Subscriptions**:
  - Paywall, tiers, tips, and character monetization

