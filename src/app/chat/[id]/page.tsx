"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import ChatWindow from "@/components/ChatWindow";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { getCharacter } = useAppStore();
  const character = characterId ? getCharacter(characterId) : undefined;

  if (!character) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">
          Character Not Found
        </h2>
        <p className="text-sm text-white/50 max-w-sm">
          This companion may have returned to the celestial matrix or the link is invalid.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Discovery
        </Link>
      </div>
    );
  }

  return <ChatWindow character={character} />;
}

