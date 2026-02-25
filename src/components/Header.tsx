"use client";

export default function Header() {
  return (
    <header className="border-b border-racing-border bg-racing-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-black text-white text-xs sm:text-sm tracking-tight shrink-0">
            RD
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-zinc-100 leading-tight truncate">
              RaceDex<span className="text-racing-accent">.gg</span>{" "}
              <span className="font-normal text-zinc-400 hidden xs:inline">Setup Builder</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-racing-muted leading-none">
              <span className="sm:hidden">Setup Builder</span>
              <span className="hidden sm:inline">NASCAR Oval Setup Assistant</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-racing-muted shrink-0">
          <span className="hidden sm:inline">Powered by AI</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
