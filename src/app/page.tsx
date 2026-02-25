"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import CarTrackSelector from "@/components/CarTrackSelector";
import ChatInterface from "@/components/ChatInterface";
import SetupDisplay from "@/components/SetupDisplay";
import SetupEditor from "@/components/SetupEditor";
import GuidedDiagnosis from "@/components/GuidedDiagnosis";
import { CarId, ChatMessage, SetupValues } from "@/types/setup";
import { getCarById, getDefaultSetupValues } from "@/lib/cars";
import {
  Condition,
  Phase,
  RunLength,
  Severity,
} from "@/lib/rules-engine";

type AppMode = "guided" | "ai_chat";
type SidebarTab = "config" | "your_setup" | "updated_setup";

interface AIConfig {
  aiAvailable: boolean;
  provider: string | null;
}

export default function Home() {
  const [selectedCar, setSelectedCar] = useState<CarId | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSetup, setCurrentSetup] = useState<SetupValues>({});
  const [updatedSetup, setUpdatedSetup] = useState<SetupValues>({});
  const [baselineSetup, setBaselineSetup] = useState<SetupValues>({});
  const [hasAppliedChanges, setHasAppliedChanges] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("config");
  const [mobilePanel, setMobilePanel] = useState<"chat" | "sidebar">("chat");
  const [mode, setMode] = useState<AppMode>("guided");
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);

  const hasCarAndTrack = selectedCar !== null && selectedTrack !== null;

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: AIConfig) => setAiConfig(data))
      .catch(() => setAiConfig({ aiAvailable: false, provider: null }));
  }, []);

  useEffect(() => {
    if (hasCarAndTrack) {
      setSidebarTab("your_setup");
      setMobilePanel("chat");
    }
  }, [selectedCar, selectedTrack, hasCarAndTrack]);

  function resetSession() {
    setCurrentSetup({});
    setUpdatedSetup({});
    setBaselineSetup({});
    setHasAppliedChanges(false);
    setMessages([]);
  }

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages,
            carId: selectedCar,
            trackId: selectedTrack,
            currentSetup:
              Object.keys(currentSetup).length > 0 ? currentSetup : null,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to get response");
        }

        const data = await res.json();

        const setupJsonMatch = data.response.match(
          /```setup-json\n([\s\S]*?)```/,
        );
        if (setupJsonMatch) {
          try {
            const setupData = JSON.parse(setupJsonMatch[1]);
            setUpdatedSetup(setupData);
            setBaselineSetup(
              Object.keys(currentSetup).length > 0
                ? currentSetup
                : selectedCar
                  ? getDefaultSetupValues(getCarById(selectedCar)!)
                  : {},
            );
            setHasAppliedChanges(true);
            setSidebarTab("updated_setup");
          } catch {
            // ignore
          }
        }

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response,
          timestamp: Date.now(),
        };

        setMessages([...newMessages, assistantMessage]);
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : "Something went wrong";
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `**Error:** ${errMsg}\n\nMake sure your API key is configured in \`.env.local\`, or use the free **Guided Diagnosis** mode.`,
          timestamp: Date.now(),
        };
        setMessages([...newMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, selectedCar, selectedTrack, currentSetup],
  );

  const handleGuidedDiagnose = useCallback(
    async (input: {
      condition: Condition;
      phase: Phase;
      runLength: RunLength;
      severity: Severity;
    }) => {
      if (!selectedCar || !selectedTrack) return;
      setIsLoading(true);

      const condLabel = input.condition === "tight" ? "tight (understeer)" : "loose (oversteer)";
      const phaseLabels: Record<Phase, string> = {
        entry: "corner entry",
        center_off_throttle: "mid-corner (off throttle)",
        center_on_throttle: "mid-corner (on throttle)",
        early_exit: "early exit",
        late_exit: "late exit",
      };
      const userContent = `The car is ${condLabel} on ${phaseLabels[input.phase]}. Severity: ${input.severity}. ${input.runLength === "both" ? "Happens all the time." : `Mainly on ${input.runLength.replace("_", " ")}s.`}`;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userContent,
        timestamp: Date.now(),
      };

      try {
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            carId: selectedCar,
            trackId: selectedTrack,
            ...input,
            currentSetup:
              Object.keys(currentSetup).length > 0 ? currentSetup : undefined,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Diagnosis failed");
        }

        const data = await res.json();

        if (data.updatedSetup) {
          setUpdatedSetup(data.updatedSetup);
          setBaselineSetup(data.baselineSetup || currentSetup);
          setHasAppliedChanges(true);
          setSidebarTab("updated_setup");
        }

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : "Something went wrong";
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `**Error:** ${errMsg}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMessage, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCar, selectedTrack, currentSetup],
  );

  function handleAcceptChanges() {
    setCurrentSetup(updatedSetup);
    setHasAppliedChanges(false);
    setUpdatedSetup({});
    setBaselineSetup({});
    setSidebarTab("your_setup");
  }

  function getDownloadSetup(): SetupValues {
    if (hasAppliedChanges && Object.keys(updatedSetup).length > 0) {
      return updatedSetup;
    }
    if (Object.keys(currentSetup).length > 0) return currentSetup;
    if (selectedCar) return getDefaultSetupValues(getCarById(selectedCar)!);
    return {};
  }

  function handleDownload(format: "text" | "json") {
    if (!selectedCar || !selectedTrack) return;
    const values = getDownloadSetup();

    fetch("/api/generate-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carId: selectedCar,
        trackId: selectedTrack,
        values,
        format,
      }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `setup.${format === "json" ? "json" : "txt"}`;
        a.click();
        URL.revokeObjectURL(url);
      });
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <Header />

      {/* Mobile bottom tab bar */}
      <div className="sm:hidden flex border-b border-racing-border bg-racing-dark safe-bottom">
        <button
          onClick={() => setMobilePanel("chat")}
          className={`flex-1 py-3 text-xs font-semibold text-center transition-colors relative ${
            mobilePanel === "chat"
              ? "text-racing-accent border-b-2 border-racing-accent"
              : "text-zinc-500 active:text-zinc-300"
          }`}
        >
          {mode === "guided" ? "Diagnosis" : "Chat"}
        </button>
        <button
          onClick={() => {
            setMobilePanel("sidebar");
            if (!hasCarAndTrack) setSidebarTab("config");
          }}
          className={`flex-1 py-3 text-xs font-semibold text-center transition-colors relative ${
            mobilePanel === "sidebar"
              ? "text-racing-accent border-b-2 border-racing-accent"
              : "text-zinc-500 active:text-zinc-300"
          }`}
        >
          {hasAppliedChanges ? "Updated Setup" : hasCarAndTrack ? "Setup" : "Select Car"}
          {hasAppliedChanges && mobilePanel !== "sidebar" && (
            <span className="absolute top-2 right-[calc(50%-28px)] w-2 h-2 bg-racing-accent rounded-full" />
          )}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar — full width on mobile, fixed 320px on desktop */}
        <aside
          className={`${
            mobilePanel === "sidebar" ? "flex" : "hidden"
          } sm:flex w-full sm:w-80 border-r border-racing-border bg-racing-dark flex-shrink-0 flex-col overflow-hidden`}
        >
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="p-3 sm:p-4">
              {/* Sidebar tab navigation */}
              {hasCarAndTrack && (
                <div className="flex mb-4 bg-racing-card rounded-lg p-0.5 border border-racing-border">
                  <button
                    onClick={() => setSidebarTab("config")}
                    className={`flex-1 py-2 sm:py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      sidebarTab === "config"
                        ? "bg-racing-surface text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Car & Track
                  </button>
                  <button
                    onClick={() => setSidebarTab("your_setup")}
                    className={`flex-1 py-2 sm:py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      sidebarTab === "your_setup"
                        ? "bg-racing-surface text-zinc-100"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Your Setup
                  </button>
                  {hasAppliedChanges && (
                    <button
                      onClick={() => setSidebarTab("updated_setup")}
                      className={`flex-1 py-2 sm:py-1.5 text-xs font-semibold rounded-md transition-colors relative ${
                        sidebarTab === "updated_setup"
                          ? "bg-racing-surface text-zinc-100"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      Updated
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-racing-accent rounded-full" />
                    </button>
                  )}
                </div>
              )}

              {/* Config Tab */}
              {(sidebarTab === "config" || !hasCarAndTrack) && (
                <CarTrackSelector
                  selectedCar={selectedCar}
                  selectedTrack={selectedTrack}
                  onCarChange={(id) => {
                    setSelectedCar(id);
                    resetSession();
                  }}
                  onTrackChange={(id) => {
                    setSelectedTrack(id);
                    resetSession();
                  }}
                />
              )}

              {/* Your Setup Tab */}
              {sidebarTab === "your_setup" && hasCarAndTrack && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 sm:mb-3">
                      Your Current Setup
                    </h3>
                    <p className="text-[11px] text-zinc-500 mb-3">
                      Enter your current in-game values so the advisor knows what to change. Or leave as defaults.
                    </p>
                    <SetupEditor
                      carId={selectedCar!}
                      currentSetup={currentSetup}
                      onSetupChange={setCurrentSetup}
                    />
                  </div>

                  <div className="border-t border-racing-border pt-4">
                    <SetupDisplay
                      carId={selectedCar!}
                      trackId={selectedTrack!}
                      setupValues={Object.keys(currentSetup).length > 0 ? currentSetup : {}}
                      hasChanges={false}
                      onDownloadText={() => handleDownload("text")}
                      onDownloadJSON={() => handleDownload("json")}
                    />
                  </div>
                </div>
              )}

              {/* Updated Setup Tab */}
              {sidebarTab === "updated_setup" && hasCarAndTrack && hasAppliedChanges && (
                <div className="space-y-4">
                  <SetupDisplay
                    carId={selectedCar!}
                    trackId={selectedTrack!}
                    setupValues={updatedSetup}
                    baselineValues={baselineSetup}
                    hasChanges={true}
                    onDownloadText={() => handleDownload("text")}
                    onDownloadJSON={() => handleDownload("json")}
                  />

                  <button
                    onClick={handleAcceptChanges}
                    className="w-full py-3 sm:py-2.5 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 font-semibold text-xs hover:bg-green-500/20 active:bg-green-500/30 transition-colors"
                  >
                    Accept Changes as New Baseline
                  </button>
                  <p className="text-[10px] text-zinc-600 text-center">
                    This sets the updated values as your current setup so you can keep iterating.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 flex flex-col overflow-hidden ${
            mobilePanel === "chat" ? "flex" : "hidden"
          } sm:flex`}
        >
          {/* Mode Toggle */}
          {hasCarAndTrack && (
            <div className="border-b border-racing-border bg-racing-dark/80 backdrop-blur-md px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
              <div className="flex bg-racing-card rounded-lg p-0.5 border border-racing-border shrink-0">
                <button
                  onClick={() => setMode("guided")}
                  className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-colors ${
                    mode === "guided"
                      ? "bg-racing-accent text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Guided
                </button>
                <button
                  onClick={() => setMode("ai_chat")}
                  className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                    mode === "ai_chat"
                      ? "bg-racing-accent text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  AI Chat
                  {aiConfig && !aiConfig.aiAvailable && (
                    <span className="text-[8px] sm:text-[9px] bg-zinc-700 text-zinc-400 px-1 py-0.5 rounded hidden sm:inline">
                      needs key
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {mode === "guided" && (
                  <span className="text-[10px] text-green-400 font-medium flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Free
                  </span>
                )}
                {hasAppliedChanges && (
                  <button
                    onClick={() => {
                      setSidebarTab("updated_setup");
                      setMobilePanel("sidebar");
                    }}
                    className="text-[10px] text-racing-accent font-semibold flex items-center gap-1 hover:underline shrink-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-racing-accent animate-pulse" />
                    <span className="hidden sm:inline">View Updated Setup</span>
                    <span className="sm:hidden">Updated</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Guided Diagnosis Mode */}
          {mode === "guided" && hasCarAndTrack ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {messages.length === 0 ? (
                  <GuidedDiagnosis
                    carId={selectedCar!}
                    trackId={selectedTrack!}
                    onDiagnose={handleGuidedDiagnose}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="px-3 sm:px-4 py-4 space-y-4">
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
                                  <span className="text-[9px] font-black text-white">RD</span>
                                </div>
                                <span className="text-[11px] font-semibold text-racing-muted">
                                  RaceDex Advisor
                                </span>
                              </div>
                              <div className="bg-racing-card border border-racing-border rounded-2xl rounded-tl-md px-3 sm:px-4 py-2.5 sm:py-3 overflow-hidden">
                                <div className="markdown-content text-sm text-zinc-300 overflow-x-auto">
                                  <MarkdownRenderer content={msg.content} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Diagnose again */}
                    <div className="border-t border-racing-border pt-6 mt-6">
                      <h3 className="text-sm font-bold text-zinc-300 mb-3 text-center">
                        Run Another Diagnosis
                      </h3>
                      <GuidedDiagnosis
                        carId={selectedCar!}
                        trackId={selectedTrack!}
                        onDiagnose={handleGuidedDiagnose}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              hasCarAndTrack={hasCarAndTrack}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const html = simpleMarkdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function simpleMarkdownToHtml(md: string): string {
  let html = md;

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="font-bold text-zinc-100 mt-4 mb-2 text-base">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="font-bold text-zinc-100 mt-4 mb-2 text-lg">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="font-bold text-zinc-100 mt-4 mb-2 text-xl">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-racing-border my-4" />');

  // Tables — wrap in scrollable container
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split("|").filter(Boolean).map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) {
      return "<!-- table-sep -->";
    }
    const cellsHtml = cells
      .map((c) => `<td class="border border-zinc-700 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap">${inlineFormat(c)}</td>`)
      .join("");
    return `<tr>${cellsHtml}</tr>`;
  });

  html = html.replace(
    /<tr>([\s\S]*?)<\/tr>\s*<!-- table-sep -->/g,
    (_, cells) => {
      const promoted = cells.replace(/<td /g, '<th ').replace(/<\/td>/g, '</th>');
      return `<tr>${promoted}</tr>`;
    },
  );
  html = html.replace(/<!-- table-sep -->/g, "");

  html = html.replace(
    /(<tr>[\s\S]*?<\/tr>(?:\s*<tr>[\s\S]*?<\/tr>)*)/g,
    '<div class="overflow-x-auto -mx-1 px-1 mb-3"><table class="w-full border-collapse min-w-[480px]">$1</table></div>',
  );

  // Code blocks
  html = html.replace(/```[\w-]*\n([\s\S]*?)```/g, '<pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-3 sm:p-4 mb-3 overflow-x-auto text-xs sm:text-sm"><code class="text-zinc-300">$1</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-orange-300 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono">$1</code>');

  // Bold + italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-orange-400 font-semibold">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Bullet lists
  html = html.replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>');
  html = html.replace(/(<li[\s\S]*?<\/li>\n?)+/g, '<ul class="list-disc pl-5 sm:pl-6 mb-3">$&</ul>');

  // Paragraphs
  html = html.replace(/^(?!<[a-z/!])((?!<).+)$/gm, '<p class="mb-2 leading-relaxed">$1</p>');

  return html;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-orange-400 font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-orange-300 px-1 rounded text-xs">$1</code>');
}
