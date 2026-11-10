"use client";

import { useState } from "react";
import { Brain, Plus, Trash2, X, Sparkles, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { sounds } from "@/lib/sound-effects";

interface MemoryPanelProps {
  characterId: string;
  characterName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemoryPanel({
  characterId,
  characterName,
  isOpen,
  onClose,
}: MemoryPanelProps) {
  const { getMemories, addMemory, removeMemory } = useAppStore();
  const memories = getMemories(characterId);

  const [newFact, setNewFact] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"personal" | "preference" | "history">("preference");

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;
    addMemory(characterId, newFact.trim(), selectedCategory);
    setNewFact("");
    sounds.playClick();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-background/95 backdrop-blur-2xl shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-300">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Long-term Memory
            </h3>
            <p className="text-xs text-white/50">
              Facts {characterName} remembers about you
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Memory facts list */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-3 text-xs text-brand-200/80">
          <span className="flex items-center gap-1.5 font-semibold text-brand-300 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Neural Context Recall
          </span>
          These memories are dynamically retrieved during your conversations to keep {characterName}'s context consistent over weeks of chatting.
        </div>

        <div className="space-y-2 pt-2">
          {memories.length === 0 ? (
            <p className="py-8 text-center text-xs text-white/40">
              No memories logged yet. Add a fact below!
            </p>
          ) : (
            memories.map((mem) => (
              <div
                key={mem.id}
                className="group flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5 transition-colors hover:border-white/15 hover:bg-white/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-medium text-brand-300 capitalize">
                      {mem.category}
                    </span>
                    <span className="text-[10px] text-white/40">
                      {mem.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {mem.fact}
                  </p>
                </div>
                <button
                  onClick={() => {
                    removeMemory(characterId, mem.id);
                    sounds.playClick();
                  }}
                  title="Forget this memory"
                  className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add new memory fact */}
      <div className="border-t border-white/10 p-5 bg-white/[0.02]">
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex items-center gap-2">
            {(["preference", "personal", "history"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? "bg-brand-600 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Teach ${characterName} a fact (e.g. "I love coffee")...`}
              value={newFact}
              onChange={(e) => setNewFact(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-brand-500 focus:bg-white/10"
            />
            <button
              type="submit"
              className="flex items-center gap-1 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-500"
            >
              <Plus className="h-3.5 w-3.5" />
              Pin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
