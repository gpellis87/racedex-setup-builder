"use client";

export default function Header() {
  return (
    <header className="border-b border-racing-border bg-racing-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-black text-white text-sm tracking-tight">
            RD
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-100 leading-tight">
              RaceDex<span className="text-racing-accent">.gg</span> <span className="font-normal text-zinc-400">Setup Builder</span>
            </h1>
            <p className="text-[11px] text-racing-muted leading-none">
              NASCAR Oval Setup Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-racing-muted">
          <span className="hidden sm:inline">Powered by AI</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
