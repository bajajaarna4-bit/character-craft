"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Radio, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Sparkles, 
  ArrowRight, 
  UserPlus, 
  Lock, 
  ShieldAlert, 
  Send, 
  Lightbulb, 
  Bot, 
  Check, 
  RotateCw, 
  ArrowLeft,
  Flame,
  Globe
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { sounds } from "@/lib/sound-effects";
import { StrangerProfile, MatchMessage, WingmanSuggestion } from "@/types/match";

const INTEREST_TAGS = [
  "Anime & Manga",
  "Gaming",
  "Late Night Talks",
  "Cyberpunk & Tech",
  "Philosophy",
  "Music & Vinyl",
  "Creative Writing",
  "Casual Vibes"
];

const SAMPLE_STRANGERS: StrangerProfile[] = [
  {
    id: "stranger-1",
    name: "Starlight_Fox",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    location: "Tokyo, Japan",
    interests: ["Anime & Manga", "Gaming", "Music & Vinyl"],
    isAiFallback: false
  },
  {
    id: "stranger-2",
    name: "NeonRider",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    location: "Berlin, Germany",
    interests: ["Cyberpunk & Tech", "Late Night Talks"],
    isAiFallback: false
  },
  {
    id: "stranger-ai-lumina",
    name: "Lumina Starweaver (AI Wing Companion)",
    avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80",
    location: "Celestial Rift Sector 4",
    interests: ["Anime & Manga", "Philosophy", "Creative Writing"],
    isAiFallback: true,
    aiCharacterId: "lumina-starweaver"
  }
];

export default function RandomMatchPage() {
  const { ageVerified, verifyAge, userProfile } = useAppStore();

  const [selectedTags, setSelectedTags] = useState<string[]>(["Anime & Manga", "Gaming"]);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [matchState, setMatchState] = useState<"idle" | "searching" | "connected">("idle");
  const [searchCountdown, setSearchCountdown] = useState(10);
  const [showAiFallbackOffer, setShowAiFallbackOffer] = useState(false);
  
  const [currentStranger, setCurrentStranger] = useState<StrangerProfile | null>(null);
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [inputVal, setInputVal] = useState("");

  // Wingman & Icebreakers
  const [showWingman, setShowWingman] = useState(true);
  const [wingmanSuggestions, setWingmanSuggestions] = useState<WingmanSuggestion[]>([
    { id: "w-1", text: "Ask what anime series made them cry the hardest", vibe: "thoughtful" },
    { id: "w-2", text: "Ask if they'd survive a cyberpunk dystopia for 24 hours", vibe: "playful" },
    { id: "w-3", text: "Compliment their vibe and ask about their favorite soundtrack", vibe: "direct" }
  ]);

  const [cameraActive, setCameraActive] = useState(false);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 10-Second Fallback Countdown
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

  // WebRTC User Camera
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

  const toggleTag = (tag: string) => {
    sounds.playClick();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const startSearching = () => {
    sounds.playClick();
    setMatchState("searching");
    setSearchCountdown(10);
    setShowAiFallbackOffer(false);

    // Simulate finding a match in 4 seconds
    setTimeout(() => {
      const matchCandidate = SAMPLE_STRANGERS[Math.floor(Math.random() * 2)];
      connectMatch(matchCandidate);
    }, 4500);
  };

  const connectWithAiFallback = () => {
    sounds.playClick();
    const aiCandidate = SAMPLE_STRANGERS[2]; // Lumina
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
        content: `Connected with a stranger from ${stranger.location}! Shared interests: ${stranger.interests.join(", ")}. Stay respectful and safe.`,
        timestamp: "Just now"
      },
      {
        id: "st-1",
        sender: "stranger",
        content: stranger.isAiFallback 
          ? "Hey there! The mortal queue was quiet, so the stars routed you to me. What are you up to tonight?" 
          : "Hey! Nice to match with you. What kind of games or anime are you into lately?",
        timestamp: "Just now"
      }
    ]);
  };

  const handleNext = () => {
    sounds.playSwipe();
    setMessages([]);
    setCurrentStranger(null);
    startSearching();
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

    // Simulate stranger response
    setTimeout(() => {
      sounds.playMessageReceive();
      const replies = [
        "Haha, that's awesome! I totally agree with that.",
        "Really? I was just thinking about that earlier today!",
        "Tell me more about that, honestly sounds super cool."
      ];
      const replyMsg: MatchMessage = {
        id: `s-${Date.now()}`,
        sender: "stranger",
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: "Just now"
      };
      setMessages((prev) => [...prev, replyMsg]);

      // Update AI wingman suggestions dynamically
      setWingmanSuggestions([
        { id: `w-${Date.now()}-1`, text: "Ask what they usually do on weekend nights", vibe: "playful" },
        { id: `w-${Date.now()}-2`, text: "Share your all-time favorite hobby", vibe: "direct" },
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
    const picked = icebreakers[Math.floor(Math.random() * icebreakers.length)];
    setInputVal(picked);
  };

  // 18+ Verification Gate Modal Check
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

        {/* Mode Selector */}
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

      {/* Main Content Viewport */}
      {matchState === "idle" ? (
        /* Setup / Filter Screen */
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Meet Real People, Safely.
            </h1>
            <p className="text-xs text-white/60 sm:text-sm">
              Instant matchmaking paired by your shared passions. Fallback AI companion support ensures you are never left hanging in an empty queue.
            </p>
          </div>

          {/* Interests Selector */}
          <div className="w-full space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left">
            <span className="text-xs font-bold text-white/80 block">
              Pick Your Interest Tags:
            </span>
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                      isSelected
                        ? "border-brand-500 bg-brand-600 text-white shadow-md shadow-brand-500/20"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={startSearching}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-accent px-10 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-transform"
          >
            <Radio className="h-4 w-4 animate-pulse" />
            Find Match Now
          </button>
        </div>
      ) : matchState === "searching" ? (
        /* Radar Searching Animation Screen */
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-8">
          <div className="relative flex items-center justify-center">
            {/* Sonar Radar Rings */}
            <div className="absolute h-48 w-48 rounded-full border border-brand-500/20 animate-ping" />
            <div className="absolute h-36 w-36 rounded-full border border-brand-500/40 animate-pulse" />
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-600/30 border border-brand-500 text-brand-300 backdrop-blur-md">
              <Radio className="h-10 w-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="font-display text-xl font-bold text-white">
              Searching for Match...
            </h3>
            <p className="text-xs text-white/50">
              Scanning active travelers interested in {selectedTags.slice(0, 2).join(", ")}
            </p>
            <div className="text-xs font-mono text-brand-400 pt-1">
              {searchCountdown > 0 ? `Matching timeout: ${searchCountdown}s` : "Queue timeout reached"}
            </div>
          </div>

          {/* 10-Second AI Fallback Modal Prompt */}
          {showAiFallbackOffer && (
            <div className="rounded-2xl border border-brand-500/30 bg-[#161622] p-5 shadow-2xl max-w-md space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-brand-300 font-bold text-sm">
                <Bot className="h-4 w-4" />
                No Human Match Found in 10s
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Would you like to connect with a verified AI companion (*Lumina Starweaver*) while you wait, or keep searching for human users?
              </p>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  onClick={connectWithAiFallback}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-brand-500"
                >
                  Chat with Lumina (AI)
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
        /* Connected Match Screen */
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Left: Split Video / Stranger Screen */}
          <div className="flex flex-1 flex-col border-r border-white/5 bg-[#09090b]">
            {/* Top Stranger Info & Action Bar */}
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

              {/* Action Buttons: Next / Skip, Add Friend */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-brand-500"
                >
                  <span>Next</span>
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

            {/* Split Video or Portrait Area */}
            {isVideoMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 flex-1 bg-black">
                {/* Stranger Video */}
                <div className="relative flex items-center justify-center rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                  <img
                    src={currentStranger?.avatar}
                    alt="Stranger"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-md">
                    {currentStranger?.name}
                  </div>
                </div>

                {/* You Video */}
                <div className="relative flex items-center justify-center rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                  <video
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
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
              /* Text mode atmospheric card */
              <div className="hidden sm:flex flex-1 flex-col items-center justify-center p-6 text-center space-y-3 bg-[#0c0c12]">
                <div className="h-28 w-28 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <img src={currentStranger?.avatar} alt={currentStranger?.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  Chatting with {currentStranger?.name}
                </h3>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
                  {currentStranger?.interests.map((t) => (
                    <span key={t} className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/70">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Text Chat & AI Wingman */}
          <div className="flex w-full lg:w-[440px] flex-col border-l border-white/5 bg-[#121218]">
            {/* Chat Messages List */}
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

            {/* AI Wingman Assistant Bar */}
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

            {/* Chat Input */}
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
