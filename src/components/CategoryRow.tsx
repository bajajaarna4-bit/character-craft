"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Character } from "@/types/character";
import CharacterCard from "./CharacterCard";
import { sounds } from "@/lib/sound-effects";

interface CategoryRowProps {
  title: string;
  subtitle?: string;
  characters: Character[];
}

export default function CategoryRow({ title, subtitle, characters }: CategoryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    sounds.playSwipe();
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.75;
    const target = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
    
    rowRef.current.scrollTo({
      left: target,
      behavior: "smooth"
    });
  };

  const onScrollCheck = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  if (!characters || characters.length === 0) return null;

  return (
    <section className="relative my-6 space-y-3 px-4 sm:px-6 lg:px-8">
      {/* Row Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-white/50 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="group relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="absolute -left-3 top-1/2 z-20 hidden -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-brand-600 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Characters Horizontal Container */}
        <div
          ref={rowRef}
          onScroll={onScrollCheck}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-brand-600 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  );
}
