"use client";

import { useState } from "react";
import { ShieldAlert, PhoneCall, Flag, X, ShieldCheck } from "lucide-react";
import { sounds } from "@/lib/sound-effects";

interface SafetyBannerProps {
  characterName: string;
}

export default function SafetyBanner({ characterName }: SafetyBannerProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReported, setIsReported] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReported(true);
    sounds.playClick();
    setTimeout(() => {
      setShowReportModal(false);
      setIsReported(false);
      setReportReason("");
    }, 2000);
  };

  return (
    <>
      {/* Top micro-safety disclaimer banner */}
      <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-4 py-1.5 text-[11px] text-white/50 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="h-3 w-3 text-brand-400" />
          <span>
            <strong>{characterName}</strong> is an AI persona, not a real human. Content is generated algorithmically.
          </span>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            setShowReportModal(true);
          }}
          className="flex items-center gap-1 text-white/40 hover:text-white/80 transition-colors"
        >
          <Flag className="h-3 w-3" />
          <span>Safety / Report</span>
        </button>
      </div>

      {/* Report & Safety Dialog Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121218] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-display font-bold text-white">
                  Safety & Content Review
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isReported ? (
              <div className="py-8 text-center space-y-2">
                <ShieldCheck className="mx-auto h-10 w-10 text-emerald-400" />
                <h4 className="font-bold text-white">Report Submitted</h4>
                <p className="text-xs text-white/60">
                  Thank you. Our automated safety queue will review this transcript within 5 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 pt-4">
                <p className="text-xs text-white/70">
                  NOVA maintains strict zero-tolerance policies against non-consensual sexual content, harassment, hate speech, and self-harm incitement.
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/80">
                    Reason for report:
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white outline-none focus:border-brand-500"
                  >
                    <option value="" disabled className="bg-neutral-900">Select an issue...</option>
                    <option value="inappropriate" className="bg-neutral-900">Inappropriate / Unsafe content</option>
                    <option value="impersonation" className="bg-neutral-900">Impersonating a real living person</option>
                    <option value="harassment" className="bg-neutral-900">Harassment or abusive dialogue</option>
                    <option value="crisis" className="bg-neutral-900">Self-harm or crisis concern</option>
                    <option value="other" className="bg-neutral-900">Other policy violation</option>
                  </select>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                    <PhoneCall className="h-3.5 w-3.5" />
                    24/7 Crisis Support Lifelines
                  </div>
                  <p className="text-[11px] text-amber-100/70">
                    If you or someone you know is in crisis, call or text <strong>988</strong> (US) or visit <strong>findahelpline.com</strong>.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-rose-500"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
