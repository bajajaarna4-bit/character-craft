"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Radio, 
  Video, 
  VideoOff, 
  Sparkles, 
  ArrowRight, 
  UserPlus, 
  Lock, 
  ShieldAlert, 
  Send, 
  Lightbulb, 
  Bot, 
  Check, 
  ArrowLeft,
  Globe,
  MessageSquare,
  Users
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { sounds } from "@/lib/sound-effects";
import { StrangerProfile, MatchMessage, WingmanSuggestion } from "@/types/match";

export interface MatchRoom {
  id: string;
  name: string;
  tag: string;
  description: string;
  strangers: StrangerProfile[];
}

const SAMPLE_ROOMS: MatchRoom[] = [
  {
    id: "room-anime",
    name: "Anime & Manga Haven",
    tag: "Anime & Manga",
    description: "Connect with otaku, cosplayers, and Shonen/Seinen enthusiasts.",
    strangers: [
      {
        id: "st-anime-1",
        name: "Kira_Cosplay",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        location: "Tokyo, Japan",
        interests: ["Anime & Manga", "Cosplay", "JJK"],
        isAiFallback: false
      },
      {
        id: "st-anime-2",
        name: "Ren_Kurosaki",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
        location: "Seoul, South Korea",
        interests: ["Anime & Manga", "Bleach", "Chainsaw Man"],
        isAiFallback: false
      }
    ]
  },
  {
    id: "room-gaming",
    name: "Gamer's Colosseum",
    tag: "Gaming & RPG",
    description: "Squad up for RPG lore, competitive discussions, and fantasy quests.",
    strangers: [
      {
        id: "st-game-1",
        name: "Valkyrie_Nova",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
        location: "Stockholm, Sweden",
        interests: ["Gaming & RPG", "Baldur's Gate", "Soulsborne"],
        isAiFallback: false
      },
      {
        id: "st-game-2",
        name: "Jax_Shadow",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        location: "Austin, Texas",
        interests: ["Gaming & RPG", "Cyberpunk 2077", "Elden Ring"],
        isAiFallback: false
      }
    ]
  },
  {
    id: "room-late-night",
    name: "Midnight Vinyl & Talks",
    tag: "Late Night Talks",
    description: "Cozy confidential talks, indie music, and 3 AM thoughts.",
    strangers: [
      {
        id: "st-night-1",
        name: "Elena_Vance",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        location: "London, UK",
        interests: ["Late Night Talks", "Coffee", "Lo-Fi Music"],
        isAiFallback: false
      },
      {
        id: "st-night-2",
        name: "Julian_Echo",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
        location: "Montreal, Canada",
        interests: ["Late Night Talks", "Acoustic", "Philosophy"],
        isAiFallback: false
      }
    ]
  },
  {
    id: "room-cyber",
    name: "Cyberpunk Netrunners",
    tag: "Sci-Fi & Cyberpunk",
    description: "Glitch art, AI philosophy, synthwave, and dystopian tech.",
    strangers: [
      {
        id: "st-cyber-1",
        name: "Nyx_Vesper",
        avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
        location: "Berlin, Germany",
        interests: ["Sci-Fi & Cyberpunk", "Hacking", "AI"],
        isAiFallback: false
      },
      {
        id: "st-cyber-2",
        name: "Cipher_Nine",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
        location: "Singapore",
        interests: ["Sci-Fi & Cyberpunk", "Quantum Physics", "Synthwave"],
        isAiFallback: false
      }
    ]
  }
];

export default function RandomMatchPage() {
  const { ageVerified, verifyAge, userProfile } = useAppStore();

  const [selectedRoomId, setSelectedRoomId] = useState<string>("room-anime");
  const [selectedStrangerIndex, setSelectedStrangerIndex] = useState<number>(0);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [matchState, setMatchState] = useState<"idle" | "searching" | "connected">("idle");
  const [searchCountdown, setSearchCountdown] = useState(10);
  const [showAiFallbackOffer, setShowAiFallbackOffer] = useState(false);

  const [currentStranger, setCurrentStranger] = useState<StrangerProfile | null>(null);
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [inputVal, setInputVal] = useState("");

  const [showWingman, setShowWingman] = useState(true);
  const [wingmanSuggestions, setWingmanSuggestions] = useState<WingmanSuggestion[]>([
    { id: "w-1", text: "Ask what anime series made them cry the hardest", vibe: "thoughtful" },
    { id: "w-2", text: "Ask if they'd survive a cyberpunk dystopia for 24 hours", vibe: "playful" },
    { id: "w-3", text: "Compliment their vibe and ask about their favorite soundtrack", vibe: "direct" }
  ]);

  const [cameraActive, setCameraActive] = useState(false);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentRoom = SAMPLE_ROOMS.find((r) => r.id === selectedRoomId) || SAMPLE_ROOMS[0];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (matchState === "searching") {
      if (searchCountdown > 0) {
        timer = setTimeout(() => setSearchCountdown((prev) => prev - 1), 1000);
      } else {
        setShowAiFallbackOffer(true);
      }
    }
    return () => clearTimeout(timer);
  }, [matchState, searchCountdown]);

  useEffect(() => {
    if (isVideoMode && matchState === "connected" && typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        })
        .catch(() => setCameraActive(false));
    }
    return () => {
      if (userVideoRef.current && userVideoRef.current.srcObject) {
        const stream = userVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoMode, matchState]);

  const startSearching = (strangerIdx = 0) => {
    sounds.playClick();
    setMatchState("searching");
    setSearchCountdown(10);
    setShowAiFallbackOffer(false);

    setTimeout(() => {
      const peer = currentRoom.strangers[strangerIdx % currentRoom.strangers.length];
      connectMatch(peer);
    }, 3500);
  };

  const connectWithAiFallback = () => {
    sounds.playClick();
    const aiCandidate: StrangerProfile = {
      id: "ai-fallback-gojo",
      name: "Satoru Gojo (AI Wingman Companion)",
      avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
      location: "Tokyo Jujutsu High",
      interests: ["Anime & Manga", "JJK", "Sweets"],
      isAiFallback: true,
      aiCharacterId: "satoru-gojo"
    };
    connectMatch(aiCandidate);
  };

  const connectMatch = (stranger: StrangerProfile) => {
    setCurrentStranger(stranger);
    setMatchState("connected");
    sounds.playMessageReceive();
    setMessages([
      {
        id: "sys-1",
        sender: "system",
        content: `Connected with ${stranger.name} from ${stranger.location}! Shared room: ${currentRoom.name}. Stay respectful and safe.`,
        timestamp: "Just now"
      },
      {
        id: "st-1",
        sender: "stranger",
        content: stranger.isAiFallback 
          ? "Yo! The mortal queue was quiet, so the strongest teacher answered your call. What's on your mind?" 
          : `Hey there! Glad to match with someone in the ${currentRoom.name} room. What have you been enjoying lately?`,
        timestamp: "Just now"
      }
    ]);
  };

  const handleNext = () => {
    sounds.playSwipe();
    setMessages([]);
    setCurrentStranger(null);
    const nextIdx = (selectedStrangerIndex + 1) % currentRoom.strangers.length;
    setSelectedStrangerIndex(nextIdx);
    startSearching(nextIdx);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !currentStranger) return;

    sounds.playMessageSend();
    const userMsg: MatchMessage = {
      id: `u-${Date.now()}`,
      sender: "you",
      content: inputVal.trim(),
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");

    setTimeout(() => {
      sounds.playMessageReceive();
      const replies = [
        "Haha, that's awesome! I totally agree with that.",
        "Really? I was just thinking about that earlier today!",
        "Tell me more about that, honestly sounds super cool.",
        "No way, I love that so much! Who's your favorite character in it?"
      ];
      const replyMsg: MatchMessage = {
        id: `s-${Date.now()}`,
        sender: "stranger",
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: "Just now"
      };
      setMessages((prev) => [...prev, replyMsg]);

      setWingmanSuggestions([
        { id: `w-${Date.now()}-1`, text: "Ask what they usually do on weekend nights", vibe: "playful" },
        { id: `w-${Date.now()}-2`, text: "Share your all-time favorite soundtrack", vibe: "direct" },
        { id: `w-${Date.now()}-3`, text: "Joke about having telepathic connection", vibe: "funny" }
      ]);
    }, 1400);
  };

  const handleUseWingmanSuggestion = (text: string) => {
    setInputVal(text);
    sounds.playClick();
  };

  const handleIcebreaker = () => {
    sounds.playClick();
    const icebreakers = [
      "Quick question: If you could live in any anime or game universe for 1 month, where would you go?",
      "Icebreaker time: What's the weirdest movie or rabbit hole you got obsessed with recently?",
      "Hypothetical: You're given 1 million dollars, but you have to spend it all in 24 hours. What's the first purchase?"
    ];
    setInputVal(icebreakers[Math.floor(Math.random() * icebreakers.length)]);
  };

  if (!ageVerified) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center space-y-6 max-w-md mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-white">
            18+ Age Gate Required
          </h2>
          <p className="text-xs text-white/60 leading-relaxed">
            In compliance with strict child safety policies and anti-abuse regulations, NOVA's random video and text matchmaking is strictly restricted to adults aged 18 and older.
          </p>
        </div>

        <button
          onClick={verifyAge}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-brand-500/25 hover:scale-105 active:scale-95 transition-transform"
        >
          <Check className="h-4 w-4" />
          I am 18 or Older — Enter Matchmaking
        </button>

        <Link href="/" className="text-xs text-white/40 hover:text-white">
          Return to Character Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-background">
      {/* Top Match Bar */}
      <div className="flex h-14 items-center justify-between border-b border-white/5 bg-background/90 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => sounds.playClick()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-brand-400 animate-pulse" />
            <h2 className="font-display text-sm font-bold text-white">
              Safe Matchmaking
            </h2>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
              18+ Verified
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsVideoMode(!isVideoMode);
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
              isVideoMode
                ? "border-brand-500 bg-brand-500/20 text-brand-300"
                : "border-white/10 bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {isVideoMode ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
            <span>{isVideoMode ? "Video & Voice" : "Text Only"}</span>
          </button>
        </div>
      </div>

      {matchState === "idle" ? (
        /* Setup / Room Selection Screen */
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Meet Real People, Safely.
            </h1>
            <p className="text-xs text-white/60 sm:text-sm max-w-lg">
              Choose a themed matchmaking room below. Each room connects you with verified peers sharing your passion, with AI companion fallback if a queue is quiet.
            </p>
          </div>

          {/* Curated Matchmaking Rooms Grid (2+ samples in each room) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
            {SAMPLE_ROOMS.map((room) => {
              const isSelected = room.id === selectedRoomId;
              return (
                <div
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    sounds.playClick();
                  }}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    isSelected
                      ? "border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/20 ring-1 ring-brand-500"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-display font-bold text-base text-white">
                      {room.name}
                    </span>
                    <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] text-brand-300 font-semibold">
                      {room.tag}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 pb-3">
                    {room.description}
                  </p>

                  {/* 2 Sample Peers in this room */}
                  <div className="border-t border-white/5 pt-3 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">
                      Active Peers in Room ({room.strangers.length})
                    </span>
                    <div className="flex items-center gap-3">
                      {room.strangers.map((st) => (
                        <div key={st.id} className="flex items-center gap-1.5 text-xs text-white/80">
                          <img src={st.avatar} alt={st.name} className="h-6 w-6 rounded-full object-cover border border-brand-500/40" />
                          <span className="truncate max-w-[90px]">{st.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => startSearching(0)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-accent px-10 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-transform"
          >
            <Radio className="h-4 w-4 animate-pulse" />
            Enter {currentRoom.name}
          </button>
        </div>
      ) : matchState === "searching" ? (
        /* Radar Searching Screen */
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-48 w-48 rounded-full border border-brand-500/20 animate-ping" />
            <div className="absolute h-36 w-36 rounded-full border border-brand-500/40 animate-pulse" />
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-600/30 border border-brand-500 text-brand-300 backdrop-blur-md">
              <Radio className="h-10 w-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="font-display text-xl font-bold text-white">
              Searching in {currentRoom.name}...
            </h3>
            <p className="text-xs text-white/50">
              Matching you with real peers interested in #{currentRoom.tag}
            </p>
            <div className="text-xs font-mono text-brand-400 pt-1">
              {searchCountdown > 0 ? `Matching timeout: ${searchCountdown}s` : "Queue timeout reached"}
            </div>
          </div>

          {showAiFallbackOffer && (
            <div className="rounded-2xl border border-brand-500/30 bg-[#161622] p-5 shadow-2xl max-w-md space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-brand-300 font-bold text-sm">
                <Bot className="h-4 w-4" />
                No Human Match Found in 10s
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Connect with an AI companion (*Satoru Gojo*) while waiting, or keep searching for human peers?
              </p>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  onClick={connectWithAiFallback}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-brand-500"
                >
                  Chat with Gojo (AI)
                </button>
                <button
                  onClick={() => {
                    setSearchCountdown(10);
                    setShowAiFallbackOffer(false);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  Keep Searching
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setMatchState("idle")}
            className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold text-white/50 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
        </div>
      ) : (
        /* Connected Screen */
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          <div className="flex flex-1 flex-col border-r border-white/5 bg-[#09090b]">
            <div className="flex items-center justify-between border-b border-white/5 bg-[#121218] p-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-full border border-brand-400">
                  <img src={currentStranger?.avatar} alt={currentStranger?.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{currentStranger?.name}</span>
                    {currentStranger?.isAiFallback && (
                      <span className="rounded bg-brand-600 px-1 py-0.2 text-[8px] font-bold text-white">AI COMPANION</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <Globe className="h-3 w-3" />
                    <span>{currentStranger?.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-brand-500"
                >
                  <span>Next Peer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => alert("Friend request sent!")}
                  title="Add Friend"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => alert("Room converted to private encrypted lounge!")}
                  title="Make Room Private"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {isVideoMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 flex-1 bg-black">
                <div className="relative flex items-center justify-center rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                  <img src={currentStranger?.avatar} alt="Stranger" className="h-full w-full object-cover" />
                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-md">
                    {currentStranger?.name}
                  </div>
                </div>

                <div className="relative flex items-center justify-center rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                  <video ref={userVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 space-y-2">
                      <VideoOff className="h-8 w-8" />
                      <span className="text-xs">Camera preview active</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-md">
                    You ({userProfile.name})
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex flex-1 flex-col items-center justify-center p-6 text-center space-y-3 bg-[#0c0c12]">
                <div className="h-28 w-28 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <img src={currentStranger?.avatar} alt={currentStranger?.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  Chatting in {currentRoom.name}
                </h3>
                <p className="text-xs text-white/50 max-w-xs">
                  Connected with {currentStranger?.name} from {currentStranger?.location}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-xs pt-1">
                  {currentStranger?.interests.map((t) => (
                    <span key={t} className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/70">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full lg:w-[440px] flex-col border-l border-white/5 bg-[#121218]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                if (m.sender === "system") {
                  return (
                    <div key={m.id} className="rounded-xl border border-white/5 bg-white/5 p-2.5 text-center text-[11px] text-white/50">
                      {m.content}
                    </div>
                  );
                }

                const isYou = m.sender === "you";
                return (
                  <div key={m.id} className={`flex flex-col ${isYou ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                        isYou
                          ? "bg-brand-600 text-white rounded-tr-sm"
                          : "bg-white/10 text-white/90 rounded-tl-sm border border-white/5"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[9px] text-white/40 pt-0.5 px-1">{m.timestamp}</span>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {showWingman && (
              <div className="border-t border-brand-500/20 bg-brand-950/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-brand-300">
                    <Sparkles className="h-3 w-3 text-brand-400" />
                    AI Wingman Suggestions
                  </span>
                  <button
                    onClick={handleIcebreaker}
                    className="flex items-center gap-1 text-[10px] text-brand-400 hover:text-white"
                  >
                    <Lightbulb className="h-3 w-3" />
                    <span>Icebreaker</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {wingmanSuggestions.map((sug) => (
                    <button
                      key={sug.id}
                      onClick={() => handleUseWingmanSuggestion(sug.text)}
                      className="w-full text-left rounded-xl border border-white/5 bg-white/5 p-2 text-[11px] text-white/80 hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="truncate pr-2">"{sug.text}"</span>
                      <span className="rounded bg-brand-500/20 px-1 py-0.2 text-[8px] text-brand-300 capitalize">{sug.vibe}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/5 bg-[#0e0e13] p-3">
              <input
                type="text"
                placeholder="Type a message or click an AI suggestion..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white placeholder-white/30 outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md hover:bg-brand-500 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
