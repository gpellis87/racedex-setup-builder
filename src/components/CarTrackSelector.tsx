"use client";

import { CarId } from "@/types/setup";
import { cars } from "@/lib/cars";
import { tracks } from "@/lib/tracks";

interface Props {
  selectedCar: CarId | null;
  selectedTrack: string | null;
  onCarChange: (carId: CarId) => void;
  onTrackChange: (trackId: string) => void;
}

const trackTypeLabels: Record<string, string> = {
  short: "Short Tracks",
  intermediate: "Intermediates",
  speedway: "Speedways",
  superspeedway: "Superspeedways",
};

export default function CarTrackSelector({
  selectedCar,
  selectedTrack,
  onCarChange,
  onTrackChange,
}: Props) {
  const tracksByType = tracks.reduce(
    (acc, t) => {
      if (!acc[t.type]) acc[t.type] = [];
      acc[t.type].push(t);
      return acc;
    },
    {} as Record<string, typeof tracks>,
  );

  return (
    <div className="space-y-4">
      {/* Car Selection */}
      <div>
        <label className="block text-xs font-semibold text-racing-muted uppercase tracking-wider mb-2">
          Select Car
        </label>
        <div className="grid grid-cols-1 gap-2">
          {cars.map((car) => (
            <button
              key={car.id}
              onClick={() => onCarChange(car.id)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                selectedCar === car.id
                  ? "border-racing-accent bg-orange-500/10 text-zinc-100"
                  : "border-racing-border bg-racing-card hover:border-zinc-600 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="font-semibold text-sm leading-tight">
                {car.name}
              </div>
              <div className="text-[11px] text-racing-muted mt-0.5">
                {car.series}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Track Selection */}
      <div>
        <label className="block text-xs font-semibold text-racing-muted uppercase tracking-wider mb-2">
          Select Track
        </label>
        <div className="space-y-3 max-h-[50vh] overflow-y-auto scrollbar-thin pr-1">
          {Object.entries(tracksByType).map(([type, typeTracks]) => (
            <div key={type}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1.5 px-1">
                {trackTypeLabels[type] ?? type}
              </div>
              <div className="space-y-1">
                {typeTracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => onTrackChange(track.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                      selectedTrack === track.id
                        ? "border-racing-accent bg-orange-500/10 text-zinc-100"
                        : "border-transparent hover:border-zinc-700 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="text-sm font-medium leading-tight">
                      {track.name}
                    </div>
                    <div className="text-[10px] text-racing-muted">
                      {track.lengthMiles} mi — {track.banking}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
