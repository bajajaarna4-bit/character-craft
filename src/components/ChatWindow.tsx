"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Send, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Trash2, 
  ArrowLeft, 
  Sparkles,
  Info
} from "lucide-react";
import { Character, ChatMessage } from "@/types/character";
import { useAppStore } from "@/lib/store";
import { sounds } from "@/lib/sound-effects";
import MemoryPanel from "./MemoryPanel";
import SafetyBanner from "./SafetyBanner";

interface ChatWindowProps {
  character: Character;
}

export default function ChatWindow({ character }: ChatWindowProps) {
  const {
    getChatMessages,
    addMessage,
    updateMessageContent,
    addAlternateReply,
    switchAlternateReply,
    clearChat,
    getMemories,
  } = useAppStore();

  const messages = getChatMessages(character.id);
  const memories = getMemories(character.id);

  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // STT setup
  const toggleSpeechRecognition = () => {
    sounds.playClick();
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputValue(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // TTS read message
  const handleSpeak = (text: string, msgId: string) => {
    sounds.playClick();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (window.speechSynthesis.speaking && speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown asterisks for cleaner TTS speech
    const cleanText = text.replace(/\*.*?\*/g, "").trim() || text;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = character.voice.pitch || 1;
    utterance.rate = character.voice.rate || 1;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Handle user send message
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text || isGenerating) return;

    sounds.playMessageSend();
    setInputValue("");

    // Add user message to store
    addMessage(character.id, {
      sender: "user",
      content: text,
    });

    // Generate character response
    await generateCharacterResponse(text);
  };

  const generateCharacterResponse = async (userPrompt: string) => {
    setIsGenerating(true);

    // Placeholder message for streaming
    const botMsgId = addMessage(character.id, {
      sender: "character",
      content: "",
      isStreaming: true,
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character,
          messages: [...messages, { sender: "user", content: userPrompt }],
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      sounds.playMessageReceive();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        updateMessageContent(character.id, botMsgId, accumulated, true);
      }

      updateMessageContent(character.id, botMsgId, accumulated, false);
    } catch (err) {
      console.error(err);
      updateMessageContent(
        character.id,
        botMsgId,
        `*Gently sighs and looks down.* "My connection to the celestial loom faltered for a moment. Could you repeat that for me?"`,
        false
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate alternate reply (Chai / Character.ai style)
  const handleRegenerate = async (msgId: string) => {
    if (isGenerating) return;
    sounds.playClick();
    setIsGenerating(true);

    try {
      const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user")?.content || "Hello";
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character,
          messages: [{ sender: "user", content: lastUserMsg }],
        }),
      });

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
      }

      addAlternateReply(character.id, msgId, accumulated);
      sounds.playMessageReceive();
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-background">
      {/* Dynamic Ambient Background Mood Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[500px] -translate-x-1/2 rounded-full blur-[140px] opacity-25 transition-colors duration-1000"
        style={{ backgroundColor: character.themeColor || "#8b5cf6" }}
      />

      {/* Safety Notice & Crisis Helpline Bar */}
      <SafetyBanner characterName={character.name} />

      {/* Chat Header */}
      <div className="relative z-10 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => sounds.playClick()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <Link href={`/c/${character.id}`} className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-brand-500/50 shadow-md">
              <img
                src={character.avatar}
                alt={character.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  {character.name}
                </h2>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="line-clamp-1 text-xs text-white/50 max-w-[200px] sm:max-w-xs">
                {character.tagline}
              </p>
            </div>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Long term memory trigger button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsMemoryOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-300 hover:bg-brand-500/20 transition-colors"
          >
            <Brain className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Memory</span>
            <span className="rounded-full bg-brand-500/30 px-1.5 text-[10px]">
              {memories.length}
            </span>
          </button>

          {/* Lore Title page link */}
          <Link
            href={`/c/${character.id}`}
            title="View character lore"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <Info className="h-4 w-4" />
          </Link>

          {/* Reset chat */}
          <button
            onClick={() => {
              if (confirm(`Reset your chat with ${character.name}?`)) {
                clearChat(character.id);
                sounds.playClick();
              }
            }}
            title="Reset conversation"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-5 sm:px-6 md:px-8 max-w-4xl mx-auto w-full">
        {messages.map((msg) => {
          const isChar = msg.sender === "character";
          const alternatesCount = msg.alternates?.length || 1;
          const currentAltIndex = (msg.currentAlternateIndex || 0) + 1;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isChar ? "items-start" : "items-end"}`}
            >
              <div
                className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                  isChar ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Avatar */}
                {isChar && (
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-brand-500/30">
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Bubble Container */}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all ${
                      isChar
                        ? "border border-white/10 bg-[#161622]/90 text-white/90 shadow-md backdrop-blur-md rounded-tl-sm"
                        : "bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20 rounded-tr-sm"
                    }`}
                  >
                    {/* Render message with italicized roleplay parsing */}
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                      {msg.isStreaming && (
                        <span className="inline-block h-3.5 w-1.5 bg-brand-400 ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Message Meta & Chai-style Alternate Swiper */}
                  {isChar && !msg.isStreaming && (
                    <div className="flex items-center gap-3 pt-1 px-1 text-[11px] text-white/40">
                      {/* Swipe between alternates */}
                      {alternatesCount > 1 && (
                        <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 border border-white/5">
                          <button
                            onClick={() => {
                              sounds.playSwipe();
                              switchAlternateReply(character.id, msg.id, "prev");
                            }}
                            className="hover:text-white"
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </button>
                          <span>
                            {currentAltIndex}/{alternatesCount}
                          </span>
                          <button
                            onClick={() => {
                              sounds.playSwipe();
                              switchAlternateReply(character.id, msg.id, "next");
                            }}
                            className="hover:text-white"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {/* Regenerate Alternate */}
                      <button
                        onClick={() => handleRegenerate(msg.id)}
                        disabled={isGenerating}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                        title="Generate alternate response (Chai-style)"
                      >
                        <RotateCw className={`h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
                        <span>Alternate</span>
                      </button>

                      {/* Audio Read Aloud */}
                      <button
                        onClick={() => handleSpeak(msg.content, msg.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          speakingMessageId === msg.id ? "text-brand-300 font-semibold" : "hover:text-white"
                        }`}
                        title="Voice read aloud"
                      >
                        {speakingMessageId === msg.id ? (
                          <VolumeX className="h-3 w-3 animate-pulse" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                        <span>{speakingMessageId === msg.id ? "Stop" : "Listen"}</span>
                      </button>

                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {!isChar && (
                    <div className="text-[10px] text-white/40 text-right pr-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="relative z-10 border-t border-white/10 bg-background/90 p-4 backdrop-blur-xl sm:px-6">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-4xl items-center gap-2"
        >
          {/* Speech-to-text mic toggle */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            title={isListening ? "Listening... click to stop" : "Voice dictation"}
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border transition-all ${
              isListening
                ? "border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          {/* Text Input */}
          <div className="relative flex flex-1 items-center">
            <input
              type="text"
              placeholder={`Message ${character.name}... (Press Enter)`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isGenerating}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-brand-500/60 focus:bg-white/10 focus:ring-1 focus:ring-brand-500/40"
            />
          </div>

          {/* Send CTA Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isGenerating}
            onClick={() => sounds.playClick()}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25 transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Slide-out Long-term Memory Panel */}
      <MemoryPanel
        characterId={character.id}
        characterName={character.name}
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
      />
    </div>
  );
}

