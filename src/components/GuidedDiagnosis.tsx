"use client";

import { useState } from "react";
import { CarId } from "@/types/setup";
import {
  Condition,
  Phase,
  RunLength,
  Severity,
} from "@/lib/rules-engine";

interface Props {
  carId: CarId;
  trackId: string;
  onDiagnose: (input: {
    condition: Condition;
    phase: Phase;
    runLength: RunLength;
    severity: Severity;
  }) => void;
  isLoading: boolean;
}

const CONDITIONS: { value: Condition; label: string; desc: string }[] = [
  { value: "tight", label: "Tight (Understeer)", desc: "Car pushes / won't turn — front slides toward the wall" },
  { value: "loose", label: "Loose (Oversteer)", desc: "Rear comes around — back end slides toward the wall" },
];

const PHASES: { value: Phase; label: string; desc: string }[] = [
  { value: "entry", label: "Corner Entry", desc: "Turn-in through the apex" },
  { value: "center_off_throttle", label: "Center (Off Throttle)", desc: "Mid-corner while coasting" },
  { value: "center_on_throttle", label: "Center (On Throttle)", desc: "Mid-corner while on the gas" },
  { value: "early_exit", label: "Early Exit", desc: "Just getting back on throttle" },
  { value: "late_exit", label: "Late Exit", desc: "Accelerating out to the straight" },
];

const RUN_LENGTHS: { value: RunLength; label: string }[] = [
  { value: "short_run", label: "Short Run (first 10 laps)" },
  { value: "long_run", label: "Long Run (15+ laps on tires)" },
  { value: "both", label: "Both / All the time" },
];

const SEVERITIES: { value: Severity; label: string; color: string }[] = [
  { value: "mild", label: "Mild — slight push/loose", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  { value: "moderate", label: "Moderate — noticeable, costs time", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  { value: "severe", label: "Severe — car is undriveable", color: "text-red-400 border-red-500/30 bg-red-500/10" },
];

export default function GuidedDiagnosis({ carId, trackId, onDiagnose, isLoading }: Props) {
  const [condition, setCondition] = useState<Condition | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [runLength, setRunLength] = useState<RunLength | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);

  const canSubmit = condition && phase && runLength && severity && !isLoading;

  function handleSubmit() {
    if (!canSubmit) return;
    onDiagnose({ condition: condition!, phase: phase!, runLength: runLength!, severity: severity! });
  }

  function handleReset() {
    setCondition(null);
    setPhase(null);
    setRunLength(null);
    setSeverity(null);
  }

  return (
    <div className="space-y-5 p-4">
      {/* Step 1: Condition */}
      <div>
        <StepLabel step={1} label="How does the car feel?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCondition(c.value)}
              className={`text-left px-4 py-3 rounded-xl border transition-all ${
                condition === c.value
                  ? "border-racing-accent bg-orange-500/10"
                  : "border-racing-border bg-racing-card hover:border-zinc-600"
              }`}
            >
              <div className={`font-semibold text-sm ${condition === c.value ? "text-racing-accent" : "text-zinc-200"}`}>
                {c.label}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Phase */}
      {condition && (
        <div className="animate-fade-in">
          <StepLabel step={2} label="Where in the corner?" />
          <div className="grid grid-cols-1 gap-1.5 mt-2">
            {PHASES.map((p) => (
              <button
                key={p.value}
                onClick={() => setPhase(p.value)}
                className={`text-left px-4 py-2.5 rounded-xl border transition-all ${
                  phase === p.value
                    ? "border-racing-accent bg-orange-500/10"
                    : "border-racing-border bg-racing-card hover:border-zinc-600"
                }`}
              >
                <div className={`font-semibold text-sm ${phase === p.value ? "text-racing-accent" : "text-zinc-200"}`}>
                  {p.label}
                </div>
                <div className="text-[11px] text-zinc-500">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Run Length */}
      {phase && (
        <div className="animate-fade-in">
          <StepLabel step={3} label="When does it happen?" />
          <div className="grid grid-cols-1 gap-1.5 mt-2">
            {RUN_LENGTHS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRunLength(r.value)}
                className={`text-left px-4 py-2.5 rounded-xl border transition-all ${
                  runLength === r.value
                    ? "border-racing-accent bg-orange-500/10"
                    : "border-racing-border bg-racing-card hover:border-zinc-600"
                }`}
              >
                <div className={`font-semibold text-sm ${runLength === r.value ? "text-racing-accent" : "text-zinc-200"}`}>
                  {r.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Severity */}
      {runLength && (
        <div className="animate-fade-in">
          <StepLabel step={4} label="How bad is it?" />
          <div className="grid grid-cols-1 gap-1.5 mt-2">
            {SEVERITIES.map((s) => (
              <button
                key={s.value}
                onClick={() => setSeverity(s.value)}
                className={`text-left px-4 py-2.5 rounded-xl border transition-all ${
                  severity === s.value
                    ? `${s.color}`
                    : "border-racing-border bg-racing-card hover:border-zinc-600 text-zinc-200"
                }`}
              >
                <div className="font-semibold text-sm">{s.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {severity && (
        <div className="animate-fade-in flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-3 rounded-xl bg-racing-accent text-white font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-30 glow-pulse"
          >
            {isLoading ? "Analyzing..." : "Get Setup Changes"}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl border border-racing-border text-zinc-400 text-sm hover:text-zinc-200 hover:border-zinc-600 transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

function StepLabel({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-racing-accent/20 border border-racing-accent/40 flex items-center justify-center">
        <span className="text-[10px] font-bold text-racing-accent">{step}</span>
      </div>
      <span className="text-xs font-semibold text-zinc-300">{label}</span>
    </div>
  );
}
