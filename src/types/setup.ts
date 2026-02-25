export type CarId = "nextgen_cup" | "xfinity" | "truck";

export interface CarDefinition {
  id: CarId;
  name: string;
  series: string;
  description: string;
  parameters: SetupParameterGroup[];
}

export interface SetupParameterGroup {
  group: string;
  params: SetupParameter[];
}

export interface SetupParameter {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  corners?: ("LF" | "RF" | "LR" | "RR")[];
}

export type TrackType = "short" | "intermediate" | "speedway" | "superspeedway" | "road_course";

export interface TrackDefinition {
  id: string;
  name: string;
  type: TrackType;
  lengthMiles: number;
  banking: string;
  description: string;
}

export interface SetupValues {
  [paramKey: string]: number;
}

export interface SetupSheet {
  carId: CarId;
  trackId: string;
  name: string;
  values: SetupValues;
  notes: string;
}

export type HandlingCondition = "tight" | "loose" | "neutral";
export type CornerPhase = "entry" | "center" | "early_exit" | "late_exit";
export type RunLength = "short" | "long" | "both";

export interface HandlingIssue {
  condition: HandlingCondition;
  phase: CornerPhase;
  runLength: RunLength;
  severity: "mild" | "moderate" | "severe";
  additionalNotes?: string;
}

export interface SetupRecommendation {
  parameter: string;
  direction: "increase" | "decrease";
  magnitude: "small" | "medium" | "large";
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  setupSheet?: SetupSheet;
}

export interface SessionState {
  carId: CarId | null;
  trackId: string | null;
  currentSetup: SetupValues | null;
  messages: ChatMessage[];
}
