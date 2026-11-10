"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { 
  MessageSquare, 
  Volume2, 
  Sparkles, 
  Flame, 
  Heart, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert,
  Compass
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import { sounds } from "@/lib/sound-effects";
import CategoryRow from "@/components/CategoryRow";

export default function CharacterTitlePage() {
  const params = useParams();
  const characterId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { getCharacter, characters } = useAppStore();
  const character = characterId ? getCharacter(characterId) : undefined;

  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!character) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">Character Not Found</h2>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discovery
        </Link>
      </div>
    );
  }

  const similarCharacters = characters
    .filter((c) => c.category === character.category && c.id !== character.id)
    .slice(0, 6);

  const handlePlayVoice = (text: string) => {
    sounds.playClick();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPlayingVoice(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = character.voice.pitch || 1;
      utterance.rate = character.voice.rate || 1;
      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);
      setIsPlayingVoice(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = () => {
    sounds.playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen pb-24 bg-background">
      {/* Cinematic Hero Backdrop */}
      <div className="relative h-[480px] sm:h-[580px] w-full overflow-hidden border-b border-white/5">
        <img
          src={character.backdrop}
          alt={character.name}
          className="h-full w-full object-cover object-center opacity-40"
        />
        {/* Soft Ambient Mood Glow */}
        <div
          className="absolute -top-32 left-1/3 h-96 w-96 rounded-full blur-[140px] opacity-40 transition-colors duration-1000"
          style={{ backgroundColor: character.themeColor || "#8b5cf6" }}
        />
        {/* Netflix Vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <Link
            href="/"
            onClick={() => sounds.playClick()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        {/* Title Content */}
        <div className="absolute bottom-8 left-0 right-0 z-10 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Avatar Portrait */}
            <div className="h-32 w-32 sm:h-44 sm:w-44 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl">
              <img
                src={character.avatar}
                alt={character.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title & Metadata */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/30">
                  {character.category}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 border border-amber-500/20">
                  <Flame className="h-3 w-3 fill-amber-400" />
                  {formatNumber(character.chatCount)} chats
                </span>
                <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                  <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                  {formatNumber(character.likesCount)} favorites
                </span>
              </div>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">
                {character.name}
              </h1>

              <p className="text-base text-brand-200/90 sm:text-lg max-w-2xl font-medium">
                {character.tagline}
              </p>

              {/* Creator Pill */}
              <div className="flex items-center gap-2 pt-1">
                <div className="h-6 w-6 overflow-hidden rounded-full border border-white/20">
                  <img
                    src={character.creator.avatar}
                    alt={character.creator.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xs text-white/70">
                  Created by <strong className="text-white">{character.creator.name}</strong>
                </span>
                {character.creator.verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-8">
          <Link
            href={`/chat/${character.id}`}
            onClick={() => sounds.playClick()}
            className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-brand-500/25 transition-transform hover:scale-105 active:scale-95"
          >
            <MessageSquare className="h-4 w-4" />
            Start Chat
          </Link>

          <button
            onClick={() => handlePlayVoice(character.greeting)}
            className={`flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold transition-all ${
              isPlayingVoice
                ? "bg-brand-500 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Volume2 className="h-4 w-4" />
            {isPlayingVoice ? "Playing Voice..." : `Voice: ${character.voice.name}`}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Share2 className="h-4 w-4" />
            {copiedLink ? "Link Copied!" : "Share"}
          </button>
        </div>

        {/* 2-Column Lore & Dialogue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* Left Column (2 cols): Backstory, Personality, Greeting */}
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" />
                Greeting
              </h3>
              <p className="rounded-xl border border-white/5 bg-white/5 p-4 text-sm italic text-white/90 leading-relaxed border-l-4 border-l-brand-500">
                "{character.greeting}"
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">
                Backstory & Lore
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {character.backstory}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-white">
                Personality & Behavioral Matrix
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {character.personality}
              </p>
            </section>

            {/* Example Dialogue */}
            {character.exampleDialogue && character.exampleDialogue.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                <h3 className="font-display text-lg font-bold text-white">
                  Sample Interactions
                </h3>
                <div className="space-y-3">
                  {character.exampleDialogue.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/5 bg-black/40 p-4 space-y-2 text-xs"
                    >
                      <div className="text-brand-300 font-semibold">
                        User: <span className="text-white/80 font-normal">"{ex.user}"</span>
                      </div>
                      <div className="text-brand-400 font-semibold">
                        {character.name}: <span className="text-white/90 font-normal">{ex.character}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Character Specs & Safety Card */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-white">
                Character Attributes
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Voice Synthesis</span>
                  <span className="text-white font-medium">{character.voice.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Category</span>
                  <span className="text-white font-medium">{character.category}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Type</span>
                  <span className="text-white font-medium">NOVA Original NPC</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/50">Safety Gating</span>
                  <span className="text-emerald-400 font-medium">Compliant & Moderated</span>
                </div>
              </div>

              {/* Tags */}
              <div className="pt-2">
                <span className="text-xs text-white/50 block mb-2">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {character.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Fictional Entity Safety Notice */}
            <div className="rounded-2xl border border-white/10 bg-amber-500/5 p-5 text-xs text-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <ShieldAlert className="h-4 w-4" />
                AI Entity Notice
              </div>
              <p className="leading-relaxed">
                {character.name} is a fictional, generative AI companion. It does not possess consciousness and cannot replace real-world human relationships or professional medical advice.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Characters Category Row */}
        {similarCharacters.length > 0 && (
          <div className="pt-8 border-t border-white/10">
            <CategoryRow
              title={`More Like ${character.name}`}
              characters={similarCharacters}
            />
          </div>
        )}
      </div>
    </div>
  );
}

