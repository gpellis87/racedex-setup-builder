"use client";

import { useRef, useState } from "react";
import { CarId, SetupValues } from "@/types/setup";
import { getCarById, getDefaultSetupValues } from "@/lib/cars";

interface Props {
  carId: CarId;
  currentSetup: SetupValues;
  onSetupChange: (values: SetupValues) => void;
}

export default function SetupEditor({ carId, currentSetup, onSetupChange }: Props) {
  const car = getCarById(carId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  if (!car) return null;

  const defaults = getDefaultSetupValues(car);
  const values = Object.keys(currentSetup).length > 0 ? currentSetup : defaults;
  const hasCustomValues = Object.keys(currentSetup).length > 0 &&
    Object.keys(currentSetup).some((k) => currentSetup[k] !== defaults[k]);

  function handleParamChange(key: string, val: number) {
    onSetupChange({ ...values, [key]: val });
  }

  function handleReset() {
    onSetupChange({});
    setUploadError(null);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);

        // Support our own export format
        if (data.parameters && typeof data.parameters === "object") {
          const imported: SetupValues = {};
          for (const [key, info] of Object.entries(data.parameters)) {
            const paramInfo = info as { value?: number };
            if (typeof paramInfo.value === "number") {
              imported[key] = paramInfo.value;
            }
          }
          if (Object.keys(imported).length > 0) {
            onSetupChange(imported);
            return;
          }
        }

        // Support flat key-value format
        if (typeof data === "object" && !Array.isArray(data)) {
          const flat: SetupValues = {};
          for (const [key, val] of Object.entries(data)) {
            if (typeof val === "number") {
              flat[key] = val;
            }
          }
          if (Object.keys(flat).length > 0) {
            onSetupChange(flat);
            return;
          }
        }

        setUploadError("Couldn't find valid setup values in this file.");
      } catch {
        setUploadError("Invalid JSON file. Upload a setup file exported from this app.");
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      {/* Upload / Reset controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg border border-dashed border-racing-border bg-racing-card hover:border-zinc-500 hover:bg-racing-surface transition-colors text-zinc-400 hover:text-zinc-200"
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Setup (.json)
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
        {hasCustomValues && (
          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-racing-border bg-racing-card hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {uploadError && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {uploadError}
        </div>
      )}

      {hasCustomValues && (
        <div className="text-[10px] text-green-400 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Custom setup loaded — changes will be applied on top of these values
        </div>
      )}

      {/* Collapsible parameter groups */}
      <div className="space-y-1">
        {car.parameters.map((group) => {
          const isExpanded = expandedGroup === group.group;
          const customCount = group.params.filter(
            (p) => currentSetup[p.key] !== undefined && currentSetup[p.key] !== defaults[p.key],
          ).length;

          return (
            <div key={group.group} className="border border-racing-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedGroup(isExpanded ? null : group.group)}
                className="w-full flex items-center justify-between px-3 py-2 bg-racing-card hover:bg-racing-surface transition-colors"
              >
                <span className="text-xs font-semibold text-zinc-300">{group.group}</span>
                <div className="flex items-center gap-2">
                  {customCount > 0 && (
                    <span className="text-[10px] bg-racing-accent/20 text-racing-accent px-1.5 py-0.5 rounded-full font-medium">
                      {customCount} edited
                    </span>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 py-2 space-y-2 bg-racing-darker border-t border-racing-border">
                  {group.params.map((param) => {
                    const val = values[param.key] ?? param.defaultValue;
                    const isCustom = currentSetup[param.key] !== undefined && currentSetup[param.key] !== defaults[param.key];
                    return (
                      <div key={param.key} className="flex items-center gap-2">
                        <label className="text-[11px] text-zinc-400 flex-1 min-w-0 truncate">
                          {param.label}
                        </label>
                        <input
                          type="number"
                          value={val}
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value) || param.defaultValue)}
                          className={`w-20 text-right text-xs font-mono px-2 py-1 rounded-md border bg-racing-card focus:outline-none focus:ring-1 focus:ring-racing-accent/30 ${
                            isCustom
                              ? "border-racing-accent/40 text-racing-accent"
                              : "border-racing-border text-zinc-300"
                          }`}
                        />
                        <span className="text-[10px] text-zinc-600 w-10 text-right">{param.unit}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-zinc-600 text-center">
        Edit values to match your current in-game setup, or upload a previously exported .json file.
      </p>
    </div>
  );
}
