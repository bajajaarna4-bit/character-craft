"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Volume2, 
  Check, 
  HelpCircle,
  Eye,
  Lock
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Character, CharacterCategory } from "@/types/character";
import { sounds } from "@/lib/sound-effects";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
];

const BACKDROP_PRESETS = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80"
];

export default function CreateCharacterPage() {
  const router = useRouter();
  const { addCharacter, userProfile } = useAppStore();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<CharacterCategory>("Anime & Manga");
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [customAvatar, setCustomAvatar] = useState("");
  const [backdrop, setBackdrop] = useState(BACKDROP_PRESETS[0]);
  const [themeColor, setThemeColor] = useState("#8b5cf6");
  const [greeting, setGreeting] = useState("");
  const [personality, setPersonality] = useState("");
  const [backstory, setBackstory] = useState("");
  const [tagsInput, setTagsInput] = useState("Anime, Original, Mystic");
  const [voiceTone, setVoiceTone] = useState<"female" | "male" | "neutral">("female");
  const [voicePitch, setVoicePitch] = useState(1.1);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [isPublic, setIsPublic] = useState(true);

  // Example Dialogues
  const [examples, setExamples] = useState([
    { user: "What do you do in your free time?", character: "I watch the stars drift across the edge of the galaxy." }
  ]);

  const handleAddExample = () => {
    setExamples([...examples, { user: "", character: "" }]);
    sounds.playClick();
  };

  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
    sounds.playClick();
  };

  const handleExampleChange = (index: number, field: "user" | "character", val: string) => {
    const updated = [...examples];
    updated[index][field] = val;
    setExamples(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !greeting.trim()) {
      alert("Please provide at least a character name and greeting!");
      return;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substr(2, 4);

    const newChar: Character = {
      id,
      name: name.trim(),
      tagline: tagline.trim() || "An enigmatic presence across the cosmos",
      avatar: customAvatar.trim() || avatar,
      backdrop,
      category,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      greeting: greeting.trim(),
      personality: personality.trim() || "Kind, observant, and engaging conversationalist.",
      backstory: backstory.trim() || "Origin shrouded in mystery, drawn to meaningful dialogue.",
      exampleDialogue: examples.filter((ex) => ex.user.trim() && ex.character.trim()),
      voice: {
        id: `voice-${id}`,
        name: `${name} Voice`,
        pitch: voicePitch,
        rate: voiceRate,
        gender: voiceTone
      },
      chatCount: 1,
      likesCount: 1,
      creator: {
        name: userProfile.name,
        avatar: userProfile.avatar,
        verified: true,
      },
      isOriginal: true,
      themeColor
    };

    addCharacter(newChar);
    sounds.playMessageSend();
    router.push(`/chat/${id}`);
  };

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => sounds.playClick()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-400" />
              Character Creator Studio
            </h1>
            <p className="text-xs text-white/50">
              Design, customize, and publish your original AI companion
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Identity & Visuals */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
          <h2 className="font-display text-base font-bold text-white">
            1. Identity & Visual Avatar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/80">
                Character Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cynthia the Arcane Scholar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500 focus:bg-white/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/80">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CharacterCategory)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500"
              >
                <option value="Anime & Manga">Anime & Manga</option>
                <option value="Romance & Companions">Romance & Companions</option>
                <option value="Mentors & Philosophy">Mentors & Philosophy</option>
                <option value="Sci-Fi & Cyberpunk">Sci-Fi & Cyberpunk</option>
                <option value="Fantasy & Gaming">Fantasy & Gaming</option>
                <option value="Study Buddies">Study Buddies</option>
                <option value="Horror & Mystery">Horror & Mystery</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80">
              Tagline (Short Summary)
            </label>
            <input
              type="text"
              placeholder="e.g. Master elementalist researching lost constellations"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500 focus:bg-white/10"
            />
          </div>

          {/* Avatar Preset Grid */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/80 block">
              Choose an Avatar Portrait
            </label>
            <div className="flex flex-wrap gap-3">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAvatar(preset);
                    setCustomAvatar("");
                    sounds.playClick();
                  }}
                  className={`relative h-16 w-16 overflow-hidden rounded-2xl border-2 transition-transform hover:scale-105 ${
                    avatar === preset && !customAvatar
                      ? "border-brand-400 ring-2 ring-brand-400/50 scale-105"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={preset} alt="preset" className="h-full w-full object-cover" />
                  {avatar === preset && !customAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-600/40">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Avatar URL option */}
            <div className="pt-2">
              <input
                type="url"
                placeholder="Or paste a custom image URL (https://...)"
                value={customAvatar}
                onChange={(e) => setCustomAvatar(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Theme Color Ambient Glow */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80">
              Ambient Aura Color
            </label>
            <div className="flex items-center gap-3">
              {["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setThemeColor(color);
                    sounds.playClick();
                  }}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    themeColor === color ? "border-white scale-110 ring-2 ring-white/40" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 2. Personality & Greeting */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
          <h2 className="font-display text-base font-bold text-white">
            2. Personality & First Greeting
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80">
              Opening Greeting (What the character says first in chat) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. *Adjusts spectacles and glances up from an ancient grimoire.* 'You must be the apprentice the guild sent. Mind the runes on the floor...'"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500 focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80">
              Personality & Behavioral Prompt
            </label>
            <textarea
              rows={3}
              placeholder="Describe their traits, attitude, speech quirks, secrets, how they respond to teasing..."
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500 focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80">
              Backstory & World Lore
            </label>
            <textarea
              rows={3}
              placeholder="Where do they come from? What drives them? What hardships or history shaped them?"
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500 focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="Anime, Tsundere, Magic, Fantasy, Student"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500 focus:bg-white/10"
            />
          </div>
        </section>

        {/* 3. Example Dialogue */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-white">
                3. Example Dialogue & Few-Shot Samples
              </h2>
              <p className="text-xs text-white/50">
                Helps the AI match the character's exact tone and roleplay style
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddExample}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Sample
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {examples.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-300">
                    Sample {idx + 1}
                  </span>
                  {examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExample(idx)}
                      className="text-white/40 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="User says..."
                  value={ex.user}
                  onChange={(e) => handleExampleChange(idx, "user", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-brand-500"
                />

                <textarea
                  rows={2}
                  placeholder="Character replies (including *actions*)..."
                  value={ex.character}
                  onChange={(e) => handleExampleChange(idx, "character", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-white/30 outline-none focus:border-brand-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Voice & Visibility Settings */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
          <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-brand-400" />
            4. Voice Tone & Visibility
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["female", "male", "neutral"] as const).map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => {
                  setVoiceTone(gender);
                  sounds.playClick();
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-semibold capitalize transition-all ${
                  voiceTone === gender
                    ? "border-brand-500 bg-brand-500/20 text-brand-300"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {gender} Tone
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setIsPublic(true);
                sounds.playClick();
              }}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                isPublic
                  ? "border-brand-500 bg-brand-500/10 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <Eye className="h-5 w-5 text-brand-400" />
              <div>
                <div className="text-xs font-bold">Public Character</div>
                <div className="text-[11px] text-white/50">Appears in discovery feed for all users</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPublic(false);
                sounds.playClick();
              }}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                !isPublic
                  ? "border-brand-500 bg-brand-500/10 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <Lock className="h-5 w-5 text-brand-400" />
              <div>
                <div className="text-xs font-bold">Private / Unlisted</div>
                <div className="text-[11px] text-white/50">Only accessible via direct link by you</div>
              </div>
            </button>
          </div>
        </section>

        {/* Submit CTA */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Link
            href="/"
            className="rounded-full px-6 py-3 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            Cancel
          </Link>

          <button
            type="submit"
            onClick={() => sounds.playClick()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-brand-500/25 transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            Publish & Start Chatting
          </button>
        </div>
      </form>
    </div>
  );
}

