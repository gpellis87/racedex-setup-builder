"use client";

import { CarId, SetupValues } from "@/types/setup";
import { getCarById, getDefaultSetupValues } from "@/lib/cars";
import { getTrackById } from "@/lib/tracks";

interface Props {
  carId: CarId;
  trackId: string;
  setupValues: SetupValues;
  baselineValues?: SetupValues;
  hasChanges: boolean;
  onDownloadText: () => void;
  onDownloadJSON: () => void;
}

export default function SetupDisplay({
  carId,
  trackId,
  setupValues,
  baselineValues,
  hasChanges,
  onDownloadText,
  onDownloadJSON,
}: Props) {
  const car = getCarById(carId);
  const track = getTrackById(trackId);
  if (!car || !track) return null;

  const defaults = getDefaultSetupValues(car);
  const values = Object.keys(setupValues).length > 0 ? setupValues : defaults;
  const baseline = baselineValues && Object.keys(baselineValues).length > 0 ? baselineValues : defaults;

  const changedCount = hasChanges
    ? car.parameters.flatMap((g) => g.params).filter((p) => {
        const newVal = values[p.key];
        const oldVal = baseline[p.key] ?? defaults[p.key];
        return newVal !== undefined && newVal !== oldVal;
      }).length
    : 0;

  return (
    <div className="space-y-4">
      {/* Download section — prominent when changes exist */}
      {hasChanges && changedCount > 0 && (
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-700/10 border border-racing-accent/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-racing-accent/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-racing-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-100">
                Updated Setup Ready
              </div>
              <div className="text-[11px] text-zinc-400">
                {changedCount} parameter{changedCount !== 1 ? "s" : ""} changed
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDownloadJSON}
              className="flex-1 py-2.5 rounded-lg bg-racing-accent text-white font-bold text-xs hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download .json
            </button>
            <button
              onClick={onDownloadText}
              className="flex-1 py-2.5 rounded-lg border border-racing-accent/40 text-racing-accent font-bold text-xs hover:bg-racing-accent/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Download .txt
            </button>
          </div>
        </div>
      )}

      {/* Header without download when no changes */}
      {!hasChanges && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-100">
            {Object.keys(setupValues).length > 0 ? "Your Setup" : "Default Setup"}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={onDownloadText}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-racing-card border border-racing-border hover:border-zinc-600 transition-colors"
            >
              .txt
            </button>
            <button
              onClick={onDownloadJSON}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-racing-accent text-white hover:bg-orange-600 transition-colors"
            >
              .json
            </button>
          </div>
        </div>
      )}

      {/* Setup Sheet */}
      <div className="bg-racing-card border border-racing-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-racing-border bg-racing-surface">
          <div className="text-sm font-bold text-zinc-100">{car.name}</div>
          <div className="text-xs text-racing-muted">
            {track.name} — {track.lengthMiles} mi
          </div>
          {hasChanges && changedCount > 0 && (
            <div className="text-[10px] text-racing-accent mt-1 font-medium">
              Changes highlighted in orange
            </div>
          )}
        </div>

        <div className="divide-y divide-racing-border">
          {car.parameters.map((group) => (
            <div key={group.group} className="px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-racing-accent mb-2">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.params.map((param) => {
                  const val = values[param.key] ?? defaults[param.key];
                  const oldVal = baseline[param.key] ?? defaults[param.key];
                  const changed = hasChanges && val !== oldVal;
                  const direction = val > oldVal ? "↑" : val < oldVal ? "↓" : "";

                  return (
                    <div
                      key={param.key}
                      className={`flex items-center justify-between text-xs rounded-md px-1.5 py-0.5 -mx-1.5 ${
                        changed ? "bg-racing-accent/5" : ""
                      }`}
                    >
                      <span className={changed ? "text-zinc-200 font-medium" : "text-zinc-400"}>
                        {param.label}
                      </span>
                      <span className="font-mono font-medium flex items-center gap-1.5">
                        {changed && (
                          <span className="text-zinc-600 line-through text-[10px]">
                            {formatParamValue(oldVal, param.unit)}
                          </span>
                        )}
                        <span className={changed ? "text-racing-accent" : "text-zinc-200"}>
                          {formatParamValue(val, param.unit)} {param.unit}
                        </span>
                        {changed && (
                          <span className={`text-[10px] font-bold ${val > oldVal ? "text-green-400" : "text-red-400"}`}>
                            {direction}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatParamValue(val: number, unit: string): string {
  if (unit === "clicks") return String(Math.round(val));
  if (unit === ":1") return val.toFixed(2);
  if (unit === "%") return val.toFixed(1).replace(/\.0$/, "");
  return val.toFixed(2);
}
