import { CarId, SetupValues } from "@/types/setup";
import { getCarById, getDefaultSetupValues } from "./cars";
import { getTrackById } from "./tracks";

export type Condition = "tight" | "loose";
export type Phase = "entry" | "center_off_throttle" | "center_on_throttle" | "early_exit" | "late_exit";
export type RunLength = "short_run" | "long_run" | "both";
export type TrackBanking = "low" | "high";
export type Severity = "mild" | "moderate" | "severe";

export interface DiagnosisInput {
  carId: CarId;
  trackId: string;
  condition: Condition;
  phase: Phase;
  runLength: RunLength;
  severity: Severity;
  currentSetup?: SetupValues;
}

export interface SetupChange {
  paramKey: string;
  paramLabel: string;
  direction: "increase" | "decrease";
  amount: number;
  unit: string;
  currentValue: number;
  newValue: number;
  explanation: string;
  priority: number;
}

export interface DiagnosisResult {
  summary: string;
  changes: SetupChange[];
  tips: string[];
  /** The full setup with all recommended changes applied. */
  updatedSetup: SetupValues;
  /** The setup values that were used as the starting point. */
  baselineSetup: SetupValues;
}

const PHASE_LABELS: Record<Phase, string> = {
  entry: "corner entry",
  center_off_throttle: "mid-corner (off throttle)",
  center_on_throttle: "mid-corner (on throttle)",
  early_exit: "early corner exit",
  late_exit: "late corner exit",
};

const SEVERITY_MULTIPLIER: Record<Severity, number> = {
  mild: 0.5,
  moderate: 1.0,
  severe: 1.5,
};

interface RuleAction {
  paramKey: string;
  direction: "increase" | "decrease";
  baseAmount: number;
  explanation: string;
  priority: number;
  /** Only apply for these car types, or all if omitted */
  carTypes?: CarId[];
  /** Only apply for these track types, or all if omitted */
  trackTypes?: string[];
}

type RuleKey = `${Condition}_${Phase}`;

/**
 * Every rule encodes: "when the car is [condition] at [phase], make these
 * changes." The baseAmount is in the parameter's native unit and gets scaled
 * by severity. Priority determines order of presentation (lower = do first).
 */
const RULES: Record<RuleKey, RuleAction[]> = {
  tight_entry: [
    { paramKey: "cross_weight", direction: "decrease", baseAmount: 0.3, explanation: "Reducing cross weight (wedge) frees up the front end on entry by putting less diagonal load on the RF+LR pair.", priority: 1, carTypes: ["xfinity", "truck"] },
    { paramKey: "arb_preload_front", direction: "decrease", baseAmount: 1, explanation: "Decreasing front ARB preload reduces cross weight, freeing the front end on turn-in.", priority: 1, carTypes: ["nextgen_cup"] },
    { paramKey: "arb_preload_rear", direction: "increase", baseAmount: 1, explanation: "Increasing rear ARB preload works with the front change to reduce cross weight.", priority: 1, carTypes: ["nextgen_cup"] },
    { paramKey: "nose_weight", direction: "decrease", baseAmount: 0.5, explanation: "Less nose weight shifts static weight rearward, reducing the tendency for the front to push.", priority: 2, carTypes: ["nextgen_cup"] },
    { paramKey: "spring_rate_rf", direction: "decrease", baseAmount: 25, explanation: "A softer RF spring lets the right front compress more on entry, increasing its contact patch and mechanical grip.", priority: 3 },
    { paramKey: "tire_pressure_rf", direction: "decrease", baseAmount: 1, explanation: "Lower RF pressure increases the tire's contact patch for more grip on the right front.", priority: 4 },
    { paramKey: "camber_rf", direction: "decrease", baseAmount: 0.2, explanation: "More negative RF camber helps the tire maintain full contact through the turn, improving entry grip.", priority: 5 },
    { paramKey: "sway_bar_front", direction: "decrease", baseAmount: 0.0625, explanation: "A smaller front sway bar allows more front roll, improving front grip on entry.", priority: 6, carTypes: ["xfinity", "truck"] },
    { paramKey: "arb_size_front", direction: "decrease", baseAmount: 0.0625, explanation: "A smaller front ARB allows more front roll, improving front grip on entry.", priority: 6, carTypes: ["nextgen_cup"] },
    { paramKey: "brake_bias", direction: "decrease", baseAmount: 1, explanation: "Less front brake bias reduces front lock-up tendency, helping the car rotate under braking.", priority: 7 },
  ],

  tight_center_off_throttle: [
    { paramKey: "cross_weight", direction: "decrease", baseAmount: 0.3, explanation: "Lower cross weight frees the front end through the center of the corner.", priority: 1, carTypes: ["xfinity", "truck"] },
    { paramKey: "arb_preload_front", direction: "decrease", baseAmount: 1, explanation: "Decreasing front ARB preload reduces cross weight, freeing the car through center.", priority: 1, carTypes: ["nextgen_cup"] },
    { paramKey: "spring_rate_lr", direction: "increase", baseAmount: 25, explanation: "Stiffer LR spring with softer RR creates rear spring split that promotes rotation through the center.", priority: 2 },
    { paramKey: "spring_rate_rr", direction: "decrease", baseAmount: 25, explanation: "Softer RR relative to LR promotes center rotation.", priority: 2 },
    { paramKey: "track_bar_height", direction: "increase", baseAmount: 0.25, explanation: "Raising the track bar moves the rear roll center higher, transferring more load to the left rear and freeing the front.", priority: 3, carTypes: ["xfinity", "truck"] },
    { paramKey: "tape", direction: "decrease", baseAmount: 5, explanation: "Less tape reduces front downforce at speed, which can help a mid-corner push on faster tracks.", priority: 5 },
  ],

  tight_center_on_throttle: [
    { paramKey: "cross_weight", direction: "decrease", baseAmount: 0.3, explanation: "Lower cross weight frees up the center under throttle.", priority: 1, carTypes: ["xfinity", "truck"] },
    { paramKey: "arb_preload_front", direction: "decrease", baseAmount: 1, explanation: "Reducing front ARB preload decreases cross weight for better center rotation.", priority: 1, carTypes: ["nextgen_cup"] },
    { paramKey: "spring_rate_lr", direction: "decrease", baseAmount: 25, explanation: "Softer LR spring with stiffer RR helps the car drive off the corner without pushing when on throttle.", priority: 2 },
    { paramKey: "spring_rate_rr", direction: "increase", baseAmount: 25, explanation: "Stiffer RR supports the rear under acceleration, reducing the diagonal loading that causes tight.", priority: 2 },
    { paramKey: "shock_rr_reb", direction: "decrease", baseAmount: 1, explanation: "Less RR rebound lets weight transfer off the right rear faster, helping the car rotate on throttle.", priority: 3, carTypes: ["xfinity", "truck"] },
  ],

  tight_early_exit: [
    { paramKey: "spring_rate_lr", direction: "decrease", baseAmount: 25, explanation: "Softer LR spring promotes rotation on early exit by allowing the left rear to compress more.", priority: 1 },
    { paramKey: "spring_rate_rr", direction: "increase", baseAmount: 25, explanation: "Stiffer RR relative to LR promotes exit rotation.", priority: 1 },
    { paramKey: "shock_rr_reb", direction: "decrease", baseAmount: 1, explanation: "Less RR rebound allows faster weight transfer, helping the car rotate off the corner.", priority: 2, carTypes: ["xfinity", "truck"] },
    { paramKey: "cross_weight", direction: "decrease", baseAmount: 0.2, explanation: "Slightly less cross weight can free up the exit.", priority: 3, carTypes: ["xfinity", "truck"] },
  ],

  tight_late_exit: [
    { paramKey: "spring_rate_rr", direction: "decrease", baseAmount: 25, explanation: "On low-banked tracks, softening the RR spring and lowering cross weight helps the car drive off the corner.", priority: 1 },
    { paramKey: "cross_weight", direction: "decrease", baseAmount: 0.2, explanation: "Less cross weight frees the exit, especially on tracks where banking decreases on corner exit.", priority: 2, carTypes: ["xfinity", "truck"] },
    { paramKey: "tire_pressure_rr", direction: "decrease", baseAmount: 0.5, explanation: "Lower RR pressure adds grip to the right rear, helping the car get off the corner.", priority: 3 },
  ],

  loose_entry: [
    { paramKey: "cross_weight", direction: "increase", baseAmount: 0.3, explanation: "More cross weight (wedge) plants the rear on entry by increasing diagonal load on the RF+LR pair.", priority: 1, carTypes: ["xfinity", "truck"] },
    { paramKey: "arb_preload_front", direction: "increase", baseAmount: 1, explanation: "Increasing front ARB preload adds cross weight, stabilizing the rear on entry.", priority: 1, carTypes: ["nextgen_cup"] },
    { paramKey: "arb_preload_rear", direction: "decrease", baseAmount: 1, explanation: "Decreasing rear ARB preload works with the front change to increase cross weight.", priority: 1, carTypes: ["nextgen_cup"] },
    { paramKey: "nose_weight", direction: "increase", baseAmount: 0.5, explanation: "More nose weight shifts load forward, planting the front and stabilizing the rear under braking.", priority: 2, carTypes: ["nextgen_cup"] },
    { paramKey: "spring_rate_rf", direction: "increase", baseAmount: 25, explanation: "A stiffer RF spring reduces front dive, keeping load on the rear tires during entry.", priority: 3 },
    { paramKey: "tire_pressure_rf", direction: "increase", baseAmount: 1, explanation: "Higher RF pressure stiffens the front, transferring less load away from the rear on entry.", priority: 4 },
    { paramKey: "camber_rf", direction: "increase", baseAmount: 0.2, explanation: "Less negative RF camber reduces front grip slightly, balancing the car toward the rear.", priority: 5 },
    { paramKey: "sway_bar_front", direction: "increase", baseAmount: 0.0625, explanation: "A larger front sway bar resists front roll, keeping more load on the rear.", priority: 6, carTypes: ["xfinity", "truck"] },
    { paramKey: "arb_size_front", direction: "increase", baseAmount: 0.0625, explanation: "A larger front ARB resists front roll, keeping more load on the rear.", priority: 6, carTypes: ["nextgen_cup"] },
    { paramKey: "brake_bias", direction: "increase", baseAmount: 1, explanation: "More front brake bias keeps the rear tires from locking, reducing entry oversteer.", priority: 7 },
  ],

  loose_center_off_throttle: [
    { paramKey: "cross_weight", direction: "increase", baseAmount: 0.3, explanation: "More cross weight stabilizes the rear through mid-corner.", priority: 1, carTypes: ["xfinity", "truck"] },
    { paramKey: "arb_preload_front", direction: "increase", baseAmount: 1, explanation: "More front ARB preload increases cross weight, stabilizing the rear through center.", priority: 1, carTypes: ["nextgen_cup"] },
    { paramKey: "spring_rate_lr", direction: "decrease", baseAmount: 25, explanation: "Softer LR spring lets the left rear absorb more load, planting it better through center.", priority: 2 },
    { paramKey: "spring_rate_rr", direction: "increase", baseAmount: 25, explanation: "Stiffer RR spring supports the loaded right rear, stabilizing the rear end.", priority: 2 },
    { paramKey: "track_bar_height", direction: "decrease", baseAmount: 0.25, explanation: "Lowering the track bar moves the rear roll center lower, putting more load on the right rear.", priority: 3, carTypes: ["xfinity", "truck"] },
    { paramKey: "sway_bar_front", direction: "increase", baseAmount: 0.0625, explanation: "A stiffer front bar resists roll, keeping weight on the rear tires.", priority: 4, carTypes: ["xfinity", "truck"] },
  ],

  loose_center_on_throttle: [
    { paramKey: "cross_weight", direction: "increase", baseAmount: 0.3, explanation: "More cross weight stabilizes the rear when on throttle through center.", priority: 1, carTypes: ["xfinity", "truck"] },
    { paramKey: "arb_preload_front", direction: "increase", baseAmount: 1, explanation: "More front ARB preload adds cross weight, stabilizing under power.", priority: 1, carTypes: ["nextgen_cup"] },
    { paramKey: "spring_rate_lr", direction: "increase", baseAmount: 25, explanation: "Stiffer LR supports the rear under acceleration through center.", priority: 2 },
    { paramKey: "spring_rate_rr", direction: "decrease", baseAmount: 25, explanation: "Softer RR lets the right rear conform to the track better under power.", priority: 2 },
  ],

  loose_early_exit: [
    { paramKey: "spring_rate_lr", direction: "increase", baseAmount: 25, explanation: "Stiffer LR spring stabilizes the rear on early exit by resisting weight transfer.", priority: 1 },
    { paramKey: "spring_rate_rr", direction: "decrease", baseAmount: 25, explanation: "Softer RR conforms better to the track on exit, adding rear grip.", priority: 1 },
    { paramKey: "shock_rr_reb", direction: "increase", baseAmount: 1, explanation: "More RR rebound slows weight transfer off the right rear, keeping it planted longer.", priority: 2, carTypes: ["xfinity", "truck"] },
    { paramKey: "tire_pressure_rr", direction: "increase", baseAmount: 0.5, explanation: "Slightly higher RR pressure can stabilize the rear on exit.", priority: 3 },
  ],

  loose_late_exit: [
    { paramKey: "spring_rate_rr", direction: "increase", baseAmount: 25, explanation: "On low-banked tracks, stiffening the RR and adding cross weight stabilizes exit.", priority: 1 },
    { paramKey: "cross_weight", direction: "increase", baseAmount: 0.2, explanation: "More cross weight plants the rear on late exit.", priority: 2, carTypes: ["xfinity", "truck"] },
    { paramKey: "tire_pressure_rr", direction: "increase", baseAmount: 0.5, explanation: "Higher RR pressure stabilizes the rear on corner exit.", priority: 3 },
    { paramKey: "spring_rate_lr", direction: "increase", baseAmount: 25, explanation: "On high-banked tracks, stiffer LR with softer RR stabilizes exit.", priority: 4 },
  ],
};

/** Run-length-specific additional adjustments. */
const RUN_LENGTH_RULES: Record<`${Condition}_${RunLength}`, RuleAction[]> = {
  tight_short_run: [
    { paramKey: "camber_rf", direction: "decrease", baseAmount: 0.2, explanation: "More negative RF camber gives better short-run grip by maximizing the tire's contact patch early in a run.", priority: 10 },
    { paramKey: "tire_pressure_lr", direction: "decrease", baseAmount: 0.5, explanation: "Lower LR pressure helps the left rear grip up on short runs.", priority: 11 },
  ],
  tight_long_run: [
    { paramKey: "camber_rf", direction: "increase", baseAmount: 0.2, explanation: "Less negative RF camber reduces tire wear, preserving grip over a long run.", priority: 10 },
    { paramKey: "spring_rate_lr", direction: "decrease", baseAmount: 25, explanation: "Softer LR spring helps maintain grip as tires wear over a long run.", priority: 11 },
    { paramKey: "nose_weight", direction: "decrease", baseAmount: 0.5, explanation: "Less nose weight shifts load rearward, helping rear grip on worn tires.", priority: 12, carTypes: ["nextgen_cup"] },
  ],
  tight_both: [],
  loose_short_run: [
    { paramKey: "camber_rf", direction: "increase", baseAmount: 0.2, explanation: "Less negative RF camber reduces front grip slightly, balancing the car when tires are fresh.", priority: 10 },
    { paramKey: "tire_pressure_lr", direction: "increase", baseAmount: 0.5, explanation: "Higher LR pressure reduces left rear grip slightly, balancing the car.", priority: 11 },
    { paramKey: "tape", direction: "increase", baseAmount: 5, explanation: "More tape adds front downforce, which can stabilize entry on fast tracks.", priority: 12 },
  ],
  loose_long_run: [
    { paramKey: "camber_rf", direction: "decrease", baseAmount: 0.2, explanation: "More negative RF camber adds front grip as the rear tires wear, balancing the car.", priority: 10 },
    { paramKey: "spring_rate_lr", direction: "increase", baseAmount: 25, explanation: "Stiffer LR spring supports the rear as tires degrade over a long run.", priority: 11 },
  ],
  loose_both: [],
};

export function diagnose(input: DiagnosisInput): DiagnosisResult {
  const car = getCarById(input.carId);
  const track = getTrackById(input.trackId);
  if (!car || !track) {
    return { summary: "Invalid car or track selection.", changes: [], tips: [], updatedSetup: {}, baselineSetup: {} };
  }

  const defaults = getDefaultSetupValues(car);
  const setup = input.currentSetup && Object.keys(input.currentSetup).length > 0
    ? input.currentSetup
    : defaults;

  const ruleKey: RuleKey = `${input.condition}_${input.phase}`;
  const phaseRules = RULES[ruleKey] ?? [];

  const runKey = `${input.condition}_${input.runLength}` as keyof typeof RUN_LENGTH_RULES;
  const runRules = RUN_LENGTH_RULES[runKey] ?? [];

  const allRules = [...phaseRules, ...runRules];
  const mult = SEVERITY_MULTIPLIER[input.severity];

  const paramKeys = new Set(car.parameters.flatMap((g) => g.params.map((p) => p.key)));

  const changes: SetupChange[] = [];
  const seenParams = new Set<string>();

  for (const rule of allRules) {
    if (!paramKeys.has(rule.paramKey)) continue;
    if (rule.carTypes && !rule.carTypes.includes(input.carId)) continue;
    if (rule.trackTypes && !rule.trackTypes.includes(track.type)) continue;
    if (seenParams.has(rule.paramKey)) continue;
    seenParams.add(rule.paramKey);

    const param = car.parameters
      .flatMap((g) => g.params)
      .find((p) => p.key === rule.paramKey);
    if (!param) continue;

    const currentValue = setup[rule.paramKey] ?? param.defaultValue;
    const delta = rule.baseAmount * mult;
    let newValue =
      rule.direction === "increase"
        ? currentValue + delta
        : currentValue - delta;

    newValue = Math.round(newValue / param.step) * param.step;
    newValue = Math.max(param.min, Math.min(param.max, newValue));

    if (newValue === currentValue) continue;

    changes.push({
      paramKey: rule.paramKey,
      paramLabel: param.label,
      direction: rule.direction,
      amount: Math.abs(newValue - currentValue),
      unit: param.unit,
      currentValue,
      newValue: parseFloat(newValue.toFixed(4)),
      explanation: rule.explanation,
      priority: rule.priority,
    });
  }

  changes.sort((a, b) => a.priority - b.priority);

  const tips = buildTips(input, track.type);

  const condLabel = input.condition === "tight" ? "TIGHT (understeer)" : "LOOSE (oversteer)";
  const summary = `Your ${car.name} is **${condLabel}** on **${PHASE_LABELS[input.phase]}** at ${track.name}. ${
    input.runLength !== "both"
      ? `This is primarily a **${input.runLength.replace("_", " ")}** issue.`
      : ""
  } Here are the recommended changes (${input.severity} severity):`;

  // Build the updated setup with all changes applied
  const updatedSetup: SetupValues = { ...setup };
  for (const change of changes) {
    updatedSetup[change.paramKey] = change.newValue;
  }

  return { summary, changes, tips, updatedSetup, baselineSetup: { ...setup } };
}

function buildTips(input: DiagnosisInput, trackType: string): string[] {
  const tips: string[] = [];

  tips.push("Make ONE change at a time and run 5+ laps to evaluate before changing more.");

  if (input.severity === "severe") {
    tips.push(
      "Since this is a severe issue, apply the first 2-3 changes together, then fine-tune.",
    );
  }

  if (trackType === "superspeedway") {
    tips.push(
      "At superspeedways, aero is everything. Focus on tape and ride height — mechanical changes have less impact at these speeds.",
    );
  }

  if (trackType === "short" && input.condition === "tight") {
    tips.push(
      "On short tracks, tire pressure is one of your most powerful tools. Small pressure changes have a big impact at lower speeds.",
    );
  }

  if (input.phase === "entry") {
    tips.push(
      "Entry handling is heavily influenced by braking technique. Make sure the issue isn't caused by trail-braking too deep or not enough.",
    );
  }

  if (input.runLength === "long_run") {
    tips.push(
      "Long-run issues are often tire wear related. Consider whether you're using too much throttle early in the run, burning off the tires.",
    );
  }

  return tips;
}

/**
 * Formats a diagnosis result into a readable markdown string,
 * matching the style of the AI chat responses.
 */
export function formatDiagnosisAsMarkdown(result: DiagnosisResult): string {
  const lines: string[] = [];

  lines.push(result.summary);
  lines.push("");

  if (result.changes.length === 0) {
    lines.push("No applicable changes found for this car/configuration. Try describing the issue differently or check if you have the right car selected.");
    return lines.join("\n");
  }

  lines.push("| Parameter | Current | → | Recommended | Direction |");
  lines.push("|-----------|---------|---|-------------|-----------|");

  for (const change of result.changes) {
    const cur = formatVal(change.currentValue, change.unit);
    const rec = formatVal(change.newValue, change.unit);
    const arrow = change.direction === "increase" ? "↑" : "↓";
    lines.push(
      `| ${change.paramLabel} | ${cur} ${change.unit} | → | **${rec} ${change.unit}** | ${arrow} ${change.direction} |`,
    );
  }

  lines.push("");
  lines.push("### Why These Changes");
  lines.push("");

  for (const change of result.changes) {
    lines.push(`- **${change.paramLabel}**: ${change.explanation}`);
  }

  if (result.tips.length > 0) {
    lines.push("");
    lines.push("### Tips");
    lines.push("");
    for (const tip of result.tips) {
      lines.push(`- ${tip}`);
    }
  }

  lines.push("");
  lines.push("---");
  lines.push("**Your updated setup is ready.** Check the Setup Sheet tab in the sidebar to see all values with changes highlighted, or download it directly.");

  return lines.join("\n");
}

function formatVal(val: number, unit: string): string {
  if (unit === "clicks") return String(Math.round(val));
  if (unit === ":1") return val.toFixed(2);
  if (unit === "%") return val.toFixed(1).replace(/\.0$/, "");
  return val.toFixed(2);
}
