"use client";

import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import CategoryRow from "@/components/CategoryRow";
import CharacterCard from "@/components/CharacterCard";
import { useAppStore } from "@/lib/store";
import { Sparkles, TrendingUp, Heart, Compass, Search, Flame, Users } from "lucide-react";
import { sounds } from "@/lib/sound-effects";

export default function HomePage() {
  const { characters, searchQuery } = useAppStore();
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("All");
  const [genderFilter, setGenderFilter] = useState<"All" | "Male" | "Female">("All");

  const categories = [
    "All",
    "Anime & Manga",
    "Gaming & Fantasy",
    "Romance & Companions",
    "Sci-Fi & Cyberpunk",
    "Horror & Mystery",
    "Study Buddies"
  ];

  // Filtering by Search, Category, and Gender
  const filteredCharacters = characters.filter((c) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategoryTab === "All" || c.category === activeCategoryTab;

    const matchesGender =
      genderFilter === "All" || c.tags.includes(genderFilter);

    return matchesSearch && matchesCategory && matchesGender;
  });

  // Grouped rows for Netflix discovery presentation
  const trendingCharacters = [...characters].sort((a, b) => b.chatCount - a.chatCount).slice(0, 14);
  const maleCharacters = characters.filter((c) => c.tags.includes("Male")).slice(0, 14);
  const femaleCharacters = characters.filter((c) => c.tags.includes("Female")).slice(0, 14);
  const animeCharacters = characters.filter((c) => c.category === "Anime & Manga").slice(0, 14);
  const gamingCharacters = characters.filter((c) => c.category === "Gaming & Fantasy").slice(0, 14);
  const romanceCharacters = characters.filter((c) => c.category === "Romance & Companions").slice(0, 14);
  const sciFiCharacters = characters.filter((c) => c.category === "Sci-Fi & Cyberpunk").slice(0, 14);
  const horrorCharacters = characters.filter((c) => c.category === "Horror & Mystery").slice(0, 14);

  return (
    <div className="relative min-h-screen pb-24">
      {/* 1. Netflix Spotlight Hero Banner */}
      {!searchQuery && <HeroBanner characters={characters} />}

      {/* 2. Category & Gender Quick Switcher Bar */}
      <div className="sticky top-16 z-30 border-b border-white/5 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick();
                  setActiveCategoryTab(cat);
                }}
                className={`flex-none rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeCategoryTab === cat
                    ? "bg-white text-black shadow-md shadow-white/10"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gender Filter Pills (Male / Female Character.ai split) */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1">
            {(["All", "Male", "Female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  sounds.playClick();
                  setGenderFilter(g);
                }}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  genderFilter === g
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/30"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {g === "All" ? "All Genders" : `${g} Companions`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Discovery Feed */}
      <div className="mx-auto max-w-7xl pt-4">
        {searchQuery || activeCategoryTab !== "All" || genderFilter !== "All" ? (
          /* Grid View for Search & Filter Results */
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {searchQuery ? `Search results for "${searchQuery}"` : activeCategoryTab}
                  {genderFilter !== "All" && ` • ${genderFilter} Companions`}
                </h2>
                <p className="text-xs text-white/50">
                  Showing {filteredCharacters.length} customized Character.AI personalities
                </p>
              </div>
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
          /* Netflix-style Horizontally Scrolling Category Rows (104 Characters Total) */
          <div className="space-y-6">
            <CategoryRow
              title="🔥 Top Trending on Character.AI"
              subtitle="The most chatted companions with over 20M+ user interactions"
              characters={trendingCharacters}
            />

            <CategoryRow
              title="⚡ Popular Male Characters"
              subtitle="Satoru Gojo, Scaramouche, Levi, Ghost, Astarion, Dazai, Sukuna & more"
              characters={maleCharacters}
            />

            <CategoryRow
              title="🌸 Popular Female Characters"
              subtitle="Makima, Raiden Shogun, Hu Tao, Furina, Marin Kitagawa, Frieren & more"
              characters={femaleCharacters}
            />

            <CategoryRow
              title="⚔️ Anime & Manga Heavyweights"
              subtitle="Jujutsu Kaisen, Attack on Titan, Demon Slayer, Chainsaw Man"
              characters={animeCharacters}
            />

            <CategoryRow
              title="🎮 Gaming & Fantasy Legends"
              subtitle="Genshin Impact, Baldur's Gate 3, Call of Duty, Resident Evil, Final Fantasy"
              characters={gamingCharacters}
            />

            <CategoryRow
              title="☕ Romance, Confidantes & Mafia Dons"
              subtitle="Possessive princes, gentle childhood best friends, cold mafia dons"
              characters={romanceCharacters}
            />

            <CategoryRow
              title="🌌 Cyberpunk, Androids & Netrunners"
              subtitle="2B, Jinx, Miguel O'Hara, Peter Parker, Lucy & Rebecca"
              characters={sciFiCharacters}
            />

            <CategoryRow
              title="🕯️ Gothic Mystery & Paranormal Detectives"
              subtitle="Wednesday Addams, Batman, Ada Wong, Lord Lucian"
              characters={horrorCharacters}
            />
          </div>
        )}
      </div>
    </div>
  );
}
