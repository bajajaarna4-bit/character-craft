"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Plus, 
  Search, 
  ShieldCheck, 
  Flame, 
  Compass, 
  Users, 
  Radio 
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { sounds } from "@/lib/sound-effects";

export default function Navbar() {
  const { 
    soundEnabled, 
    toggleSound, 
    searchQuery, 
    setSearchQuery, 
    userProfile, 
    ageVerified, 
    verifyAge 
  } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link 
            href="/"
            onClick={() => sounds.playClick()}
            className="group flex items-center gap-2.5"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-accent p-0.5 shadow-lg shadow-brand-500/25 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background/90 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-brand-300 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-wider text-white">
                NOVA
              </span>
              <span className="text-[10px] font-medium tracking-widest text-brand-400 uppercase -mt-1">
                Cinematic AI
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              onClick={() => sounds.playClick()}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Compass className="h-4 w-4 text-brand-400" />
              Discover
            </Link>
            <Link
              href="/create"
              onClick={() => sounds.playClick()}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Plus className="h-4 w-4 text-brand-400" />
              Creator Studio
            </Link>
            <Link
              href="/stories"
              onClick={() => sounds.playClick()}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              Stories Mode
            </Link>
            <Link
              href="/community"
              onClick={() => sounds.playClick()}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Users className="h-4 w-4 text-brand-400" />
              Communities
              <span className="rounded-full bg-brand-500/20 px-1.5 py-0.5 text-[10px] text-brand-300 font-semibold">Live</span>
            </Link>
            <Link
              href="/match"
              onClick={() => sounds.playClick()}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Radio className="h-4 w-4 text-brand-accent animate-pulse" />
              Random Match
              <span className="rounded-full bg-brand-accent/20 px-1.5 py-0.5 text-[10px] text-brand-accent font-semibold">18+</span>
            </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search characters, anime, sci-fi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-36 sm:w-56 rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-xs text-white placeholder-white/40 outline-none transition-all duration-300 focus:w-56 sm:focus:w-72 focus:border-brand-500/50 focus:bg-white/10 focus:ring-1 focus:ring-brand-500/50"
            />
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-white/40" />
          </div>

          {/* Audio Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-brand-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-white/40" />
            )}
          </button>

          {/* 18+ Verification Pill */}
          <button
            onClick={verifyAge}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
              ageVerified 
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-white/60 hover:border-amber-500/40 hover:text-amber-300"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{ageVerified ? "18+ Verified" : "Verify 18+"}</span>
          </button>

          {/* Create Button CTA */}
          <Link
            href="/create"
            onClick={() => sounds.playClick()}
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            Create
          </Link>

          {/* User Profile Streak & Level */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-2.5 pr-1">
            <div className="flex items-center gap-1 text-amber-400 text-xs font-medium" title={`${userProfile.streakDays} day streak`}>
              <Flame className="h-3.5 w-3.5 fill-amber-400" />
              <span>{userProfile.streakDays}</span>
            </div>
            <div className="h-7 w-7 rounded-full overflow-hidden border border-brand-400/40">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
