"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Hash, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Headphones, 
  PhoneOff, 
  Plus, 
  Send, 
  Smile, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  X, 
  Bot,
  AtSign,
  Radio,
  Tv
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { sounds } from "@/lib/sound-effects";

export default function CommunityPage() {
  const {
    servers,
    activeServerId,
    activeChannelId,
    setActiveServer,
    setActiveChannel,
    getServerMessages,
    sendChannelMessage,
    addReaction,
    activeVoiceChannel,
    joinVoiceChannel,
    leaveVoiceChannel,
    isMuted,
    isDeafened,
    toggleVoiceMute,
    toggleVoiceDeafen,
    userProfile,
    addServer
  } = useAppStore();

  const [messageInput, setMessageInput] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const [showVoiceStage, setShowVoiceStage] = useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [newServerName, setNewServerName] = useState("");
  const [newServerDesc, setNewServerDesc] = useState("");
  const [showMentionMenu, setShowMentionMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeServer = servers.find((s) => s.id === activeServerId) || servers[0];
  const activeChannel = activeServer?.channels.find((c) => c.id === activeChannelId) || activeServer?.channels[0];
  const messages = activeChannel ? getServerMessages(activeChannel.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChannel) return;
    sendChannelMessage(activeChannel.id, messageInput.trim());
    setMessageInput("");
    setShowMentionMenu(false);
  };

  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim()) return;
    addServer(newServerName.trim(), newServerDesc.trim() || "A community for creative roleplay");
    setNewServerName("");
    setNewServerDesc("");
    setShowCreateServerModal(false);
  };

  const handleInsertMention = (name: string) => {
    setMessageInput((prev) => `${prev}@${name} `);
    setShowMentionMenu(false);
    sounds.playClick();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#09090b] text-foreground">
      {/* 1. Leftmost Server Rail (Discord Style) */}
      <div className="flex w-18 flex-shrink-0 flex-col items-center gap-3 border-r border-white/5 bg-[#0e0e13] py-3 px-2 z-20">
        <Link
          href="/"
          title="Return to Discovery"
          onClick={() => sounds.playClick()}
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25 transition-all duration-200 hover:rounded-xl hover:scale-105"
        >
          <Sparkles className="h-6 w-6" />
        </Link>

        <div className="h-[2px] w-8 rounded-full bg-white/10 my-1" />

        {/* Server Icons List */}
        <div className="flex flex-1 flex-col items-center gap-2 overflow-y-auto scrollbar-none w-full">
          {servers.map((server) => {
            const isActive = server.id === activeServerId;
            return (
              <div key={server.id} className="relative group flex items-center">
                {/* Active Indicator Bar */}
                <div
                  className={`absolute -left-2 w-1 rounded-r-full bg-white transition-all duration-200 ${
                    isActive ? "h-10" : "h-2 scale-0 group-hover:scale-100 group-hover:h-5"
                  }`}
                />
                <button
                  onClick={() => setActiveServer(server.id)}
                  title={server.name}
                  className={`relative h-12 w-12 overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "rounded-2xl ring-2 ring-brand-500 shadow-lg shadow-brand-500/30"
                      : "rounded-3xl hover:rounded-2xl opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={server.icon}
                    alt={server.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              </div>
            );
          })}

          {/* Add Server Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowCreateServerModal(true);
            }}
            title="Create a Community Server"
            className="flex h-12 w-12 items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 text-brand-400 transition-all duration-200 hover:rounded-2xl hover:border-brand-500 hover:bg-brand-500/10 hover:text-white"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 2. Channel Sidebar */}
      <div className="flex w-60 sm:w-64 flex-shrink-0 flex-col border-r border-white/5 bg-[#121218]">
        {/* Server Header */}
        <div className="flex h-14 items-center justify-between border-b border-white/5 px-4">
          <h2 className="font-display font-bold text-sm text-white truncate">
            {activeServer?.name}
          </h2>
          <div className="flex items-center gap-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
          {/* Text Channels Section */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Text Channels
            </div>
            {activeServer?.channels
              .filter((c) => c.type === "text")
              .map((channel) => {
                const isActive = channel.id === activeChannelId;
                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white font-semibold"
                        : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    }`}
                  >
                    <Hash className="h-4 w-4 text-white/40 group-hover:text-white/70" />
                    <span className="truncate">{channel.name}</span>
                  </button>
                );
              })}
          </div>

          {/* Voice Channels Section */}
          <div className="space-y-1 pt-2">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Voice Rooms
            </div>
            {activeServer?.channels
              .filter((c) => c.type === "voice")
              .map((channel) => {
                const isConnected = activeVoiceChannel?.channelId === channel.id;
                return (
                  <button
                    key={channel.id}
                    onClick={() => {
                      if (isConnected) {
                        setShowVoiceStage(true);
                      } else {
                        joinVoiceChannel(activeServer.id, channel.id, channel.name);
                        setShowVoiceStage(true);
                      }
                    }}
                    className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      isConnected
                        ? "bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30"
                        : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Volume2 className={`h-4 w-4 ${isConnected ? "text-emerald-400" : "text-white/40"}`} />
                      <span className="truncate">{channel.name}</span>
                    </div>
                    {isConnected && (
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Voice Connected Status Bar (Discord Style) */}
        {activeVoiceChannel && (
          <div className="border-t border-emerald-500/20 bg-emerald-950/20 px-3 py-2">
            <div className="flex items-center justify-between">
              <div 
                className="cursor-pointer"
                onClick={() => setShowVoiceStage(true)}
              >
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <Radio className="h-3.5 w-3.5 animate-pulse" />
                  <span>Voice Connected</span>
                </div>
                <div className="text-[10px] text-emerald-300/70 truncate max-w-[140px]">
                  {activeVoiceChannel.name}
                </div>
              </div>
              <button
                onClick={leaveVoiceChannel}
                title="Disconnect voice"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
              >
                <PhoneOff className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* User Card at bottom of sidebar */}
        <div className="flex h-14 items-center justify-between border-t border-white/5 bg-[#0e0e13] px-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-brand-500/40">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{userProfile.name}</div>
              <div className="text-[10px] text-white/40">Level {userProfile.level} Voyager</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleVoiceMute}
              title={isMuted ? "Unmute" : "Mute"}
              className={`p-1.5 rounded-lg text-white/60 hover:text-white ${isMuted ? "text-rose-400 bg-rose-500/20" : ""}`}
            >
              {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={toggleVoiceDeafen}
              title={isDeafened ? "Undeafen" : "Deafen"}
              className={`p-1.5 rounded-lg text-white/60 hover:text-white ${isDeafened ? "text-rose-400 bg-rose-500/20" : ""}`}
            >
              {isDeafened ? <VolumeX className="h-3.5 w-3.5" /> : <Headphones className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Chat Feed */}
      <div className="flex flex-1 flex-col bg-[#09090b]">
        {/* Channel Header */}
        <div className="flex h-14 items-center justify-between border-b border-white/5 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-white/40" />
            <h3 className="font-display font-bold text-sm text-white">
              {activeChannel?.name}
            </h3>
            {activeChannel?.topic && (
              <>
                <span className="hidden sm:inline text-white/20">|</span>
                <p className="hidden sm:inline text-xs text-white/50 truncate max-w-md">
                  {activeChannel.topic}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMembers(!showMembers)}
              title="Toggle member list"
              className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors ${
                showMembers ? "bg-white/10 text-white" : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Welcome Header */}
          <div className="pb-4 pt-2 border-b border-white/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-brand-400 mb-2">
              <Hash className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-white">
              Welcome to #{activeChannel?.name}!
            </h2>
            <p className="text-xs text-white/50">
              This is the start of the #{activeChannel?.name} channel in {activeServer?.name}.
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className="group relative flex gap-3 hover:bg-white/[0.02] -mx-4 px-4 py-1.5 rounded-lg transition-colors">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10 mt-0.5">
                <img
                  src={msg.authorAvatar}
                  alt={msg.authorName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {msg.authorName}
                  </span>
                  {msg.isBot && (
                    <span className="flex items-center gap-1 rounded bg-brand-600 px-1.5 py-0.2 text-[9px] font-bold text-white">
                      <Bot className="h-2.5 w-2.5" />
                      {msg.botTag || "BOT"}
                    </span>
                  )}
                  <span className="text-[10px] text-white/40">
                    {msg.timestamp}
                  </span>
                </div>

                <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed font-sans">
                  {msg.content}
                </div>

                {/* Emoji Reactions */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(activeChannel.id, msg.id, emoji)}
                        className="flex items-center gap-1 rounded-lg border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-xs text-white/90 hover:bg-brand-500/20"
                      >
                        <span>{emoji}</span>
                        <span className="text-[10px] text-brand-300 font-semibold">{count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover Quick Action Reaction Bar */}
              <div className="absolute right-4 -top-3 hidden group-hover:flex items-center gap-1 rounded-lg border border-white/10 bg-[#161622] p-1 shadow-xl">
                {["🔥", "✨", "❤️", "😂", "👍"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(activeChannel.id, msg.id, emoji)}
                    className="p-1 hover:bg-white/10 rounded text-xs transition-transform hover:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="relative p-4 bg-[#09090b] border-t border-white/5">
          {/* Mention Menu Autocomplete */}
          {showMentionMenu && (
            <div className="absolute bottom-16 left-4 z-30 w-72 rounded-2xl border border-white/10 bg-[#161622] p-2 shadow-2xl backdrop-blur-xl space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                Mention Server Members & AI Bots
              </div>
              {activeServer?.members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleInsertMention(member.name)}
                  className="flex w-full items-center gap-2 rounded-xl p-2 text-xs text-left hover:bg-white/10 transition-colors"
                >
                  <img src={member.avatar} alt={member.name} className="h-6 w-6 rounded-full object-cover" />
                  <span className="font-semibold text-white">{member.name}</span>
                  {member.isBot && (
                    <span className="rounded bg-brand-600 px-1 py-0.5 text-[8px] text-white">BOT</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMentionMenu(!showMentionMenu)}
              title="Mention a member or AI Bot"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-400 hover:bg-white/10 hover:text-brand-300"
            >
              <AtSign className="h-4 w-4" />
            </button>

            <input
              type="text"
              placeholder={`Message #${activeChannel?.name}... (Type @ to summon AI bots)`}
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                if (e.target.value.endsWith("@")) setShowMentionMenu(true);
              }}
              className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/40 outline-none focus:border-brand-500 focus:bg-white/10"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg hover:bg-brand-500 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 4. Right Members Sidebar */}
      {showMembers && (
        <div className="hidden lg:flex w-60 flex-shrink-0 flex-col border-l border-white/5 bg-[#121218] p-4 overflow-y-auto space-y-5">
          {/* Bot NPCs Section */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <Bot className="h-3 w-3" />
              AI Bot NPCs — {activeServer?.members.filter((m) => m.isBot).length}
            </div>
            {activeServer?.members
              .filter((m) => m.isBot)
              .map((bot) => (
                <div key={bot.id} className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-white/5 transition-colors">
                  <div className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden border border-brand-500/50">
                    <img src={bot.avatar} alt={bot.name} className="h-full w-full object-cover" />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-background" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate">{bot.name}</span>
                      <span className="rounded bg-brand-600 px-1 text-[8px] text-white">BOT</span>
                    </div>
                    {bot.customStatus && (
                      <p className="text-[10px] text-white/50 truncate">{bot.customStatus}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Online Members Section */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Online Members — {activeServer?.members.filter((m) => !m.isBot).length}
            </div>
            {activeServer?.members
              .filter((m) => !m.isBot)
              .map((member) => (
                <div key={member.id} className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-white/5 transition-colors">
                  <div className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden border border-white/10">
                    <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-background" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{member.name}</div>
                    {member.customStatus && (
                      <p className="text-[10px] text-white/50 truncate">{member.customStatus}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Voice Stage Overlay Modal */}
      {showVoiceStage && activeVoiceChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#121218] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
                <h3 className="font-display font-bold text-lg text-white">
                  {activeVoiceChannel.name} — Live Stage
                </h3>
              </div>
              <button
                onClick={() => setShowVoiceStage(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Speaking Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
              {/* You */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
                <div className={`relative h-20 w-20 rounded-full overflow-hidden border-2 transition-all ${
                  isMuted ? "border-rose-500/50" : "border-emerald-400 ring-4 ring-emerald-400/30"
                }`}>
                  <img src={userProfile.avatar} alt="You" className="h-full w-full object-cover" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">You ({userProfile.name})</span>
                  <span className="text-[10px] text-emerald-400">{isMuted ? "Muted" : "Speaking"}</span>
                </div>
              </div>

              {/* Bot NPC in Voice Stage */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
                <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-brand-400 ring-4 ring-brand-400/30">
                  <img
                    src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80"
                    alt="Lumina"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block flex items-center justify-center gap-1">
                    Lumina <span className="rounded bg-brand-600 px-1 text-[8px]">BOT</span>
                  </span>
                  <span className="text-[10px] text-brand-300">Listening to cosmos</span>
                </div>
              </div>

              {/* Other member */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
                <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    alt="Aether"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block">AetherVagrant</span>
                  <span className="text-[10px] text-white/40">Connected</span>
                </div>
              </div>
            </div>

            {/* Stage Controls */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
              <button
                onClick={toggleVoiceMute}
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
                  isMuted ? "bg-rose-500 text-white border-rose-600" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                }`}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <button
                onClick={toggleVoiceDeafen}
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
                  isDeafened ? "bg-rose-500 text-white border-rose-600" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                }`}
              >
                {isDeafened ? <VolumeX className="h-5 w-5" /> : <Headphones className="h-5 w-5" />}
              </button>

              <button
                onClick={() => {
                  leaveVoiceChannel();
                  setShowVoiceStage(false);
                }}
                className="flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-rose-500"
              >
                <PhoneOff className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Server Modal */}
      {showCreateServerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121218] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display font-bold text-lg text-white">
                Create a Community Server
              </h3>
              <button
                onClick={() => setShowCreateServerModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateServer} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Server Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anime Sanctuary"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Description</label>
                <textarea
                  rows={2}
                  placeholder="Tell members what this community is all about..."
                  value={newServerDesc}
                  onChange={(e) => setNewServerDesc(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateServerModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-brand-500"
                >
                  Create Server
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

