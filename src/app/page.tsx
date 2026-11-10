"use client";

import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import CategoryRow from "@/components/CategoryRow";
import CharacterCard from "@/components/CharacterCard";
import { useAppStore } from "@/lib/store";
import { Sparkles, TrendingUp, Heart, Compass, Search } from "lucide-react";
import { sounds } from "@/lib/sound-effects";

export default function HomePage() {
  const { characters, searchQuery } = useAppStore();
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("All");

  const categories = [
    "All",
    "Anime & Manga",
    "Romance & Companions",
    "Mentors & Philosophy",
    "Sci-Fi & Cyberpunk",
    "Fantasy & Gaming",
    "Horror & Mystery",
    "Study Buddies"
  ];

  // Search filtering
  const filteredCharacters = characters.filter((c) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategoryTab === "All" || c.category === activeCategoryTab;

    return matchesSearch && matchesCategory;
  });

  // Grouped rows for Netflix discovery presentation
  const trendingCharacters = [...characters].sort((a, b) => b.chatCount - a.chatCount).slice(0, 10);
  const animeCharacters = characters.filter((c) => c.category === "Anime & Manga");
  const romanceCharacters = characters.filter((c) => c.category === "Romance & Companions");
  const mentorsCharacters = characters.filter((c) => c.category === "Mentors & Philosophy");
  const sciFiCharacters = characters.filter((c) => c.category === "Sci-Fi & Cyberpunk");
  const fantasyCharacters = characters.filter((c) => c.category === "Fantasy & Gaming");
  const studyCharacters = characters.filter((c) => c.category === "Study Buddies");
  const horrorCharacters = characters.filter((c) => c.category === "Horror & Mystery");

  return (
    <div className="relative min-h-screen pb-24">
      {/* 1. Netflix Spotlight Hero Banner (only when not searching) */}
      {!searchQuery && <HeroBanner characters={characters} />}

      {/* 2. Category Quick Switcher Tabs */}
      <div className="sticky top-16 z-30 border-b border-white/5 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setActiveCategoryTab(cat);
              }}
              className={`flex-none rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategoryTab === cat
                  ? "bg-white text-black shadow-md shadow-white/10"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Discovery Feed */}
      <div className="mx-auto max-w-7xl pt-4">
        {searchQuery || activeCategoryTab !== "All" ? (
          /* Grid View for Search & Filter Results */
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                {searchQuery ? `Search results for "${searchQuery}"` : activeCategoryTab}
              </h2>
              <span className="text-xs text-white/50">
                {filteredCharacters.length} companions found
              </span>
            </div>

            {filteredCharacters.length === 0 ? (
              <div className="py-24 text-center space-y-3">
                <Search className="mx-auto h-12 w-12 text-white/20" />
                <h3 className="text-lg font-bold text-white">No companions found</h3>
                <p className="text-sm text-white/50">
                  Try adjusting your search terms or create a brand new character.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredCharacters.map((char) => (
                  <div key={char.id} className="w-full">
                    <CharacterCard character={char} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Netflix-style Horizontally Scrolling Category Rows */
          <div className="space-y-6">
            <CategoryRow
              title="🔥 Trending Now"
              subtitle="The most active conversations across the NOVA network today"
              characters={trendingCharacters}
            />

            <CategoryRow
              title="✨ Because You Chatted With Mia Vance"
              subtitle="Recommended companions who match your conversational intimacy"
              characters={[...romanceCharacters, ...animeCharacters].slice(0, 7)}
            />

            <CategoryRow
              title="🌸 Anime & Manga Originals"
              subtitle="Celestial sorceresses, time wanderers, and spirit guardians"
              characters={animeCharacters}
            />

            <CategoryRow
              title="☕ Romance & Late Night Confidantes"
              subtitle="Wholesome coffee baristas, gentle botanists, and brooding artists"
              characters={romanceCharacters}
            />

            <CategoryRow
              title="🏛️ Mentors, Stoicism & Philosophy"
              subtitle="Timeless guidance from emperors, scholars, and temple monks"
              characters={mentorsCharacters}
            />

            <CategoryRow
              title="⚡ Sci-Fi, Cyberpunk & AI Minds"
              subtitle="Netrunners, rogue superintelligences, and warp pilots"
              characters={sciFiCharacters}
            />

            <CategoryRow
              title="⚔️ Fantasy & Tabletop RPG"
              subtitle="Elven spell-thieves, dwarven master smiths, and valkyrie commanders"
              characters={fantasyCharacters}
            />

            <CategoryRow
              title="📚 Study Buddies & STEM Mentors"
              subtitle="Break through quantum equations and creative writing roadblocks"
              characters={studyCharacters}
            />

            <CategoryRow
              title="🕯️ Gothic Mystery & The Supernatural"
              subtitle="Victorian occult detectives and radio entity anomalies"
              characters={horrorCharacters}
            />
          </div>
        )}
      </div>
    </div>
  );
}

