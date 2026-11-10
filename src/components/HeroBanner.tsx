"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Info, Sparkles, Volume2, Flame, ChevronRight, ChevronLeft } from "lucide-react";
import { Character } from "@/types/character";
import { formatNumber } from "@/lib/utils";
import { sounds } from "@/lib/sound-effects";

interface HeroBannerProps {
  characters: Character[];
}

export default function HeroBanner({ characters }: HeroBannerProps) {
  const featured = characters.slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const activeChar = featured[currentIndex] || characters[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const handlePlayVoice = (text: string) => {
    sounds.playClick();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPlayingVoice(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = activeChar.voice.pitch || 1;
      utterance.rate = activeChar.voice.rate || 1;
      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);
      setIsPlayingVoice(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!activeChar) return null;

  return (
    <div className="relative min-h-[520px] md:min-h-[640px] w-full overflow-hidden border-b border-white/5 bg-background">
      {/* Background Backdrop Image with Netflix Vignette Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          key={activeChar.id}
          src={activeChar.backdrop}
          alt={activeChar.name}
          className="h-full w-full object-cover object-top opacity-40 transition-opacity duration-1000 md:opacity-50"
        />
        {/* Soft Ambient Mood Glow */}
        <div 
          className="absolute -top-32 left-1/4 h-96 w-96 rounded-full blur-[140px] opacity-40 transition-colors duration-1000"
          style={{ backgroundColor: activeChar.themeColor || "#8b5cf6" }}
        />
        {/* Multi-layered Netflix-style Vignette Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          {/* Spotlight Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/30 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              NOVA ORIGINAL SPOTLIGHT
            </span>
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 border border-amber-500/20">
              <Flame className="h-3 w-3 fill-amber-400" />
              {formatNumber(activeChar.chatCount)} chats
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
              {activeChar.category}
            </span>
          </div>

          {/* Character Name & Tagline */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-md">
            {activeChar.name}
          </h1>
          <p className="text-lg font-medium text-brand-200/90 sm:text-xl">
            {activeChar.tagline}
          </p>

          {/* Personality Preview Quote */}
          <p className="line-clamp-2 text-sm text-white/70 italic sm:text-base border-l-2 border-brand-500/60 pl-3">
            "{activeChar.greeting}"
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href={`/chat/${activeChar.id}`}
              onClick={() => sounds.playClick()}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-2.5 rounded-full bg-white px-7 py-3 text-sm font-bold text-black shadow-xl shadow-white/10 transition-all duration-300 hover:scale-105 hover:bg-white/90 active:scale-95"
            >
              <MessageSquare className="h-4 w-4 fill-black" />
              Start Chat
            </Link>

            <Link
              href={`/c/${activeChar.id}`}
              onClick={() => sounds.playClick()}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <Info className="h-4 w-4" />
              Character Lore
            </Link>

            <button
              onClick={() => handlePlayVoice(activeChar.greeting)}
              title="Listen to character voice sample"
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                isPlayingVoice 
                  ? "bg-brand-500 text-white animate-pulse" 
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel pagination indicators & navigation */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {featured.map((char, idx) => (
              <button
                key={char.id}
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? "w-8 bg-brand-400" 
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Jump to spotlight ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentIndex((prev) => (prev + 1) % featured.length);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
