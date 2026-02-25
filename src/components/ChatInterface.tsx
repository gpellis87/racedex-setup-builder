"use client";

import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "@/types/setup";

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  hasCarAndTrack: boolean;
}

const QUICK_PROMPTS = [
  "The car is really tight on entry",
  "Loose off the corner on exit",
  "Car is good on short runs but gets tight on long runs",
  "Build me a complete setup from scratch",
  "Car won't turn in the center",
  "The rear snaps loose under braking",
];

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  hasCarAndTrack,
}: Props) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 sm:px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="animate-fade-in">
            <div className="text-center py-6 sm:py-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-700/20 border border-orange-500/30 flex items-center justify-center">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-racing-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                  />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100 mb-2">
                RaceDex Setup Advisor
              </h2>
              <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6 px-2">
                {hasCarAndTrack
                  ? "Tell me how the car feels and I'll help you dial it in. Or ask me to build a setup from scratch."
                  : "Select a car and track from the sidebar to get started."}
              </p>

              {hasCarAndTrack && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto px-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => onSendMessage(prompt)}
                      className="text-left px-3 py-2.5 sm:py-2 rounded-lg border border-racing-border bg-racing-card hover:border-zinc-600 hover:bg-racing-surface active:bg-racing-surface transition-all text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in">
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[90%] sm:max-w-[85%] bg-racing-accent/15 border border-racing-accent/30 rounded-2xl rounded-tr-md px-3 sm:px-4 py-2.5 sm:py-3">
                  <p className="text-sm text-zinc-100 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="max-w-[95%] sm:max-w-[90%]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-black text-white">
                        RD
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-racing-muted">
                      RaceDex Advisor
                    </span>
                  </div>
                  <div className="bg-racing-card border border-racing-border rounded-2xl rounded-tl-md px-3 sm:px-4 py-2.5 sm:py-3 overflow-hidden">
                    <div className="markdown-content text-sm text-zinc-300 overflow-x-auto">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-black text-white">RD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-racing-accent rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 bg-racing-accent rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-racing-accent rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
              <span className="text-xs text-racing-muted ml-1">
                Analyzing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-racing-border bg-racing-dark/80 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-3 safe-bottom">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasCarAndTrack
                  ? "How does the car feel?"
                  : "Select a car and track first..."
              }
              disabled={!hasCarAndTrack || isLoading}
              rows={1}
              className="w-full bg-racing-card border border-racing-border rounded-xl px-3 sm:px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-racing-accent/50 focus:ring-1 focus:ring-racing-accent/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !hasCarAndTrack}
            className="min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2.5 rounded-xl bg-racing-accent text-white font-semibold text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
          >
            <svg className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
        <p className="text-[10px] text-zinc-600 mt-1 sm:mt-1.5 text-center hidden sm:block">
          Shift+Enter for new line. RaceDex.gg setup advice is AI-generated — always test on track.
        </p>
      </div>
    </div>
  );
}
