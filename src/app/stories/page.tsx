"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Clapperboard, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCw, 
  Plus, 
  X, 
  Send, 
  Volume2, 
  ArrowLeft, 
  Users, 
  Layers,
  MessageSquare
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Character } from "@/types/character";
import { sounds } from "@/lib/sound-effects";

interface StoryLine {
  id: string;
  characterId: string;
  characterName: string;
  characterAvatar: string;
  actionText?: string;
  dialogue: string;
  timestamp: string;
}

const PRESET_SCENARIOS = [
  {
    title: "Midnight Ramen Stand",
    directive: "Both characters meet unexpectedly at a late-night ramen shop in the pouring rain. Tensions or secret camaraderie emerge over steaming bowls of tonkotsu."
  },
  {
    title: "Ruins of the Fallen Citadel",
    directive: "Standing amidst the rubble of a forgotten ancient empire, debating whether history was shaped by fate or raw human will."
  },
  {
    title: "Stuck in a Malfunctioning Elevator",
    directive: "Trapped between floors during a sudden power blackout. Claustrophobia, sharp banter, and unexpected confessions ensue."
  },
  {
    title: "The Interrogation Chamber",
    directive: "One character is holding the other for questioning under mysterious circumstances, but the lines between captor and captive quickly blur."
  }
];

export default function StoriesPage() {
  const { characters } = useAppStore();

  // Selected characters (defaults to Gojo and Scaramouche)
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([
    "satoru-gojo",
    "scaramouche-wanderer"
  ]);

  const [sceneDirective, setSceneDirective] = useState(PRESET_SCENARIOS[0].directive);
  const [customDirectiveInput, setCustomDirectiveInput] = useState("");
  const [isDirectorActive, setIsDirectorActive] = useState(false);
  const [isGeneratingTurn, setIsGeneratingTurn] = useState(false);
  const [storyLines, setStoryLines] = useState<StoryLine[]>([
    {
      id: "sl-1",
      characterId: "satoru-gojo",
      characterName: "Satoru Gojo",
      characterAvatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
      actionText: "slides his blindfold up with a broad, teasing grin, slurping his ramen broth loudly",
      dialogue: "You know, for an immortal wanderer who claims to hate company, you sure didn't hesitate to sit down at the only open stool next to me.",
      timestamp: "12:04 AM"
    },
    {
      id: "sl-2",
      characterId: "scaramouche-wanderer",
      characterName: "Scaramouche (Wanderer)",
      characterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80",
      actionText: "clicks his chopsticks against the ceramic bowl, indigo eyes narrowing with cold irritation",
      dialogue: "Don't flatter yourself, blindfold. The rain was getting on my hat, and this stall was the nearest awning. Speak another word and I'll summon a gale to blow your noodles into the gutter.",
      timestamp: "12:05 AM"
    }
  ]);

  const storyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    storyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storyLines]);

  const selectedCharacters = characters.filter((c) => selectedCharIds.includes(c.id));

  const toggleSelectCharacter = (id: string) => {
    sounds.playClick();
    if (selectedCharIds.includes(id)) {
      if (selectedCharIds.length <= 2) {
        alert("A story scene requires at least two characters!");
        return;
      }
      setSelectedCharIds((prev) => prev.filter((cId) => cId !== id));
    } else {
      if (selectedCharIds.length >= 4) {
        alert("Maximum 4 characters in a director scene!");
        return;
      }
      setSelectedCharIds((prev) => [...prev, id]);
    }
  };

  // Generate next turn dynamically
  const triggerNextTurn = async (directorIntervention?: string) => {
    if (isGeneratingTurn || selectedCharacters.length < 2) return;

    sounds.playClick();
    setIsGeneratingTurn(true);

    // Pick next character to speak in round-robin fashion
    const lastSpeakerId = storyLines[storyLines.length - 1]?.characterId;
    const nextChar = selectedCharacters.find((c) => c.id !== lastSpeakerId) || selectedCharacters[0];

    const promptContext = directorIntervention
      ? `[DIRECTOR INSTRUCTION]: ${directorIntervention}`
      : `Current scene directive: ${sceneDirective}. The conversation continues naturally.`;

    // Simulated multi-agent AI response generator based on character traits
    setTimeout(() => {
      sounds.playMessageReceive();

      const characterTurnPools: Record<string, { action: string; text: string }[]> = {
        "satoru-gojo": [
          { action: "chuckles softly, waving his chopsticks in small circles", text: "Aw, so fierce! You really ought to smile more often. People will think you're grumpy 24/7." },
          { action: "leans back on the wooden stool, fingertips glowing with faint blue infinity sparks", text: "Besides, do you really think wind could touch my infinity? Try it if you're feeling lucky, hat-boy." }
        ],
        "scaramouche-wanderer": [
          { action: "scoffs and sets down his chopsticks with a sharp clack", text: "You truly are insufferable. If gods couldn't bind me, you think an infinity barrier intimidates me?" },
          { action: "crosses his arms, wind rustling the bamboo lanterns overhead", text: "Whatever. Finish your bowl and disappear into the night before I lose the last shred of my patience." }
        ]
      };

      const defaultPool = [
        { action: "observes the surrounding shadows attentively", text: "The atmosphere here is heavier than expected. Where is this conversation leading us?" },
        { action: "glances toward the others with a thoughtful expression", text: "We might have different paths, but for this brief moment, our fates cross." }
      ];

      const pool = characterTurnPools[nextChar.id] || defaultPool;
      const turnChoice = pool[Math.floor(Math.random() * pool.length)];

      const newLine: StoryLine = {
        id: `sl-${Date.now()}`,
        characterId: nextChar.id,
        characterName: nextChar.name,
        characterAvatar: nextChar.avatar,
        actionText: directorIntervention ? `reacts to director prompt: "${directorIntervention}"` : turnChoice.action,
        dialogue: turnChoice.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setStoryLines((prev) => [...prev, newLine]);
      setIsGeneratingTurn(false);
    }, 1500);
  };

  const handleDirectorSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDirectiveInput.trim()) return;

    sounds.playMessageSend();
    const directive = customDirectiveInput.trim();
    setCustomDirectiveInput("");

    // Add director narration line
    const directorLine: StoryLine = {
      id: `dir-${Date.now()}`,
      characterId: "director",
      characterName: "🎬 Scene Director",
      characterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      actionText: "introduces a sudden twist in the scene",
      dialogue: directive,
      timestamp: "Just now"
    };

    setStoryLines((prev) => [...prev, directorLine]);

    // Trigger AI characters reacting to the director's twist
    setTimeout(() => {
      triggerNextTurn(directive);
    }, 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background pb-16">
      {/* Top Header */}
      <div className="border-b border-white/5 bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => sounds.playClick()}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Clapperboard className="h-5 w-5 text-brand-400" />
                <h1 className="font-display text-lg font-bold text-white sm:text-xl">
                  Stories & Character-to-Character Studio
                </h1>
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-300">
                  Director Mode
                </span>
              </div>
              <p className="text-xs text-white/50">
                Direct cross-character scenes, group dynamics, and spontaneous drama between AI companions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerNextTurn()}
              disabled={isGeneratingTurn}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-brand-500/25 hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>{isGeneratingTurn ? "Generating Turn..." : "Next Turn"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Cast & Scenario Selector */}
          <div className="space-y-6">
            {/* Active Cast Selection */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-400" />
                  Active Cast ({selectedCharacters.length}/4)
                </span>
              </div>

              {/* Selected Characters Avatars */}
              <div className="flex flex-wrap gap-3">
                {selectedCharacters.map((char) => (
                  <div
                    key={char.id}
                    className="flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 p-2 pr-3"
                  >
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="h-8 w-8 rounded-full object-cover border border-brand-400"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white truncate max-w-[100px]">{char.name}</div>
                      <div className="text-[10px] text-brand-300">{char.category}</div>
                    </div>
                    {selectedCharacters.length > 2 && (
                      <button
                        onClick={() => toggleSelectCharacter(char.id)}
                        className="text-white/40 hover:text-rose-400 ml-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Roster Quick Add */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-[11px] font-semibold text-white/50 block mb-2">
                  Switch or Add from 104 Roster:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {characters.slice(0, 15).map((c) => {
                    const isSelected = selectedCharIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleSelectCharacter(c.id)}
                        className={`flex-none h-12 w-12 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 ${
                          isSelected ? "border-brand-400 ring-2 ring-brand-400/50 scale-105" : "border-white/10 opacity-60 hover:opacity-100"
                        }`}
                        title={c.name}
                      >
                        <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Scene Directive & Scenarios */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
              <span className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-400" />
                Director Preset Scenarios
              </span>

              <div className="space-y-2">
                {PRESET_SCENARIOS.map((sc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSceneDirective(sc.directive);
                      sounds.playClick();
                    }}
                    className={`w-full text-left rounded-xl border p-3 transition-colors ${
                      sceneDirective === sc.directive
                        ? "border-brand-500 bg-brand-500/10 text-white"
                        : "border-white/5 bg-white/5 text-white/70 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold text-brand-300">{sc.title}</div>
                    <div className="text-[11px] text-white/60 line-clamp-2 pt-1">{sc.directive}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (2 cols): The Live Scene Viewport */}
          <div className="lg:col-span-2 flex flex-col h-[640px] rounded-3xl border border-white/10 bg-[#121218] overflow-hidden shadow-2xl">
            {/* Scene Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0e0e13] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Live Scene Rolling</span>
              </div>
              <button
                onClick={() => {
                  setStoryLines([]);
                  sounds.playClick();
                }}
                className="text-xs text-white/40 hover:text-rose-400"
              >
                Clear Scene
              </button>
            </div>

            {/* Script / Dialogue Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {storyLines.map((line) => {
                const isDir = line.characterId === "director";

                if (isDir) {
                  return (
                    <div
                      key={line.id}
                      className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center text-xs text-amber-200/90 shadow-lg"
                    >
                      <div className="font-bold text-amber-300 mb-0.5">
                        🎬 DIRECTORIAL DIRECTIVE
                      </div>
                      <p className="italic font-serif">"{line.dialogue}"</p>
                    </div>
                  );
                }

                return (
                  <div key={line.id} className="flex items-start gap-3.5 group">
                    <img
                      src={line.characterAvatar}
                      alt={line.characterName}
                      className="h-10 w-10 rounded-2xl object-cover border border-white/15 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{line.characterName}</span>
                        <span className="text-[10px] text-white/40">{line.timestamp}</span>
                      </div>

                      {/* Action text */}
                      {line.actionText && (
                        <div className="text-xs italic text-brand-300/80 font-serif">
                          *{line.actionText}*
                        </div>
                      )}

                      {/* Spoken dialogue */}
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs text-white/95 leading-relaxed font-sans shadow-sm">
                        "{line.dialogue}"
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={storyEndRef} />
            </div>

            {/* Director Input Bar */}
            <div className="border-t border-white/10 bg-[#0e0e13] p-4">
              <form onSubmit={handleDirectorSend} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300">
                  <Clapperboard className="h-3.5 w-3.5" />
                  <span>Direct:</span>
                </div>
                <input
                  type="text"
                  placeholder="Inject a scenario twist (e.g. 'Suddenly an assassin bursts through the door!')..."
                  value={customDirectiveInput}
                  onChange={(e) => setCustomDirectiveInput(e.target.value)}
                  className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-xs text-white placeholder-white/30 outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  disabled={!customDirectiveInput.trim()}
                  className="flex h-11 px-4 items-center gap-1.5 rounded-xl bg-amber-600 text-xs font-bold text-white shadow-md hover:bg-amber-500 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Cue Scene</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

