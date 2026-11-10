"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Flame, Heart, Sparkles, Volume2 } from "lucide-react";
import { Character } from "@/types/character";
import { formatNumber } from "@/lib/utils";
import { sounds } from "@/lib/sound-effects";

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        sounds.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-none w-[200px] sm:w-[240px] md:w-[260px] cursor-pointer transition-all duration-300"
    >
      <Link href={`/chat/${character.id}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-card transition-all duration-300 group-hover:scale-[1.03] group-hover:border-brand-500/50 group-hover:shadow-2xl group-hover:shadow-brand-500/20">
          {/* Card Portrait Art */}
          <img
            src={character.avatar}
            alt={character.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Mood Tint & Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

          {/* Top Badges */}
          <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between">
            {character.isOriginal ? (
              <span className="flex items-center gap-1 rounded-full bg-brand-500/30 px-2 py-0.5 text-[10px] font-semibold text-brand-300 border border-brand-500/40 backdrop-blur-md">
                <Sparkles className="h-2.5 w-2.5" />
                Original
              </span>
            ) : <div />}
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
              <Flame className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
              {formatNumber(character.chatCount)}
            </span>
          </div>

          {/* Bottom Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5 space-y-1.5">
            <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-brand-300 drop-shadow-sm">
              {character.name}
            </h3>
            <p className="line-clamp-2 text-xs text-white/70">
              {character.tagline}
            </p>

            {/* Tags preview */}
            <div className="flex flex-wrap gap-1 pt-1">
              {character.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quick-chat button visible on card hover */}
            <div className="pt-1.5 transition-all duration-200">
              <div className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all group-hover:bg-brand-600 group-hover:text-white">
                <MessageSquare className="h-3.5 w-3.5" />
                Chat Now
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

