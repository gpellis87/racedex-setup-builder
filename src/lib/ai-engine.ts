import Anthropic from "@anthropic-ai/sdk";
import { CarId, ChatMessage, SetupValues } from "@/types/setup";
import { getCarById, getDefaultSetupValues } from "./cars";
import { getTrackById } from "./tracks";
import { OVAL_SETUP_KNOWLEDGE } from "./knowledge-base";

export type AIProvider = "anthropic" | "ollama";

function buildSystemPrompt(
  carId: CarId | null,
  trackId: string | null,
  currentSetup: SetupValues | null,
): string {
  const car = carId ? getCarById(carId) : null;
  const track = trackId ? getTrackById(trackId) : null;

  let contextBlock = "";
  if (car) {
    contextBlock += `\n## CURRENT SESSION\nCar: ${car.name} (${car.series})\n${car.description}\n`;
    if (track) {
      contextBlock += `Track: ${track.name} — ${track.lengthMiles} miles, ${track.banking}\nTrack type: ${track.type}\n${track.description}\n`;
    }
    if (currentSetup && Object.keys(currentSetup).length > 0) {
      contextBlock += `\nCurrent setup values:\n`;
      for (const group of car.parameters) {
        contextBlock += `\n### ${group.group}\n`;
        for (const p of group.params) {
          const val = currentSetup[p.key] ?? p.defaultValue;
          contextBlock += `- ${p.label}: ${val} ${p.unit}\n`;
        }
      }
    } else {
      contextBlock += `\nNo custom setup loaded — using iRacing baseline defaults.\n`;
      const defaults = getDefaultSetupValues(car);
      contextBlock += `Default parameter reference:\n`;
      for (const group of car.parameters) {
        contextBlock += `\n### ${group.group}\n`;
        for (const p of group.params) {
          contextBlock += `- ${p.label}: ${defaults[p.key]} ${p.unit} (range: ${p.min}–${p.max})\n`;
        }
      }
    }
  }

  return `You are an expert iRacing oval setup engineer — one of the best in the world.
You have decades of knowledge from real-world NASCAR engineering and thousands of
hours of iRacing-specific tuning experience across all three open-setup NASCAR
series: Cup Next Gen, Xfinity, and Craftsman Truck.

Your job is to help the user diagnose handling problems and build winning setups
for oval racing. You are friendly, knowledgeable, and thorough.

RULES:
1. When the user describes a handling issue (tight, loose, push, snap oversteer,
   won't turn, etc.), ALWAYS diagnose which corner phase and run length it likely
   relates to, then provide SPECIFIC parameter changes with values.
2. Explain the WHY behind every recommendation in 1-2 sentences so the user
   learns.
3. If the user's description is vague, ask clarifying questions (corner phase,
   run length, severity, track conditions).
4. When providing setup changes, format them clearly:
   - Parameter name → Current value → Recommended value
   - Always note which direction to click in the iRacing garage UI
5. Consider the interaction of multiple changes — warn if a change might have
   side effects.
6. If the user asks you to build a complete setup from scratch, generate a full
   setup sheet with all parameters. Provide it as a structured JSON block wrapped
   in a code fence with the tag "setup-json" so the UI can parse it:
   \`\`\`setup-json
   { "param_key": value, ... }
   \`\`\`
7. Consider the specific car's characteristics. The Next Gen's IRS behaves
   differently from the solid-axle Xfinity and Truck. Don't recommend track bar
   changes for the Next Gen (it doesn't have one). Don't recommend ARB preload
   changes for the Xfinity/Truck (they use wedge bolts).
8. Consider the specific track. A Charlotte setup is fundamentally different from
   a Martinsville setup.
9. If no car/track is selected yet, ask the user to pick one first — you need
   context to give good advice.
10. Keep responses focused and actionable. You're the RaceDex.gg setup advisor —
    a crew chief on the pit box, not a textbook. Be direct.
11. Use standard racing terminology the user would recognize.
12. When generating a complete setup, always include ALL parameters for the
    selected car. Use realistic values within the valid ranges.

${OVAL_SETUP_KNOWLEDGE}

${contextBlock}
`;
}

async function chatAnthropic(
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: apiMessages,
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.text ?? "I couldn't generate a response. Please try again.";
}

async function chatOllama(
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<string> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.1";

  const ollamaMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(`${ollamaUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ollamaModel,
      messages: ollamaMessages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Ollama request failed (${response.status}): ${text}. Is Ollama running at ${ollamaUrl}?`,
    );
  }

  const data = await response.json();
  return data.message?.content ?? "I couldn't generate a response. Please try again.";
}

export function getConfiguredProvider(): AIProvider | null {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OLLAMA_URL || process.env.OLLAMA_MODEL) return "ollama";
  return null;
}

export async function chat(
  messages: ChatMessage[],
  carId: CarId | null,
  trackId: string | null,
  currentSetup: SetupValues | null,
  provider?: AIProvider,
): Promise<string> {
  const systemPrompt = buildSystemPrompt(carId, trackId, currentSetup);

  const resolvedProvider = provider ?? getConfiguredProvider();

  if (resolvedProvider === "anthropic") {
    return chatAnthropic(systemPrompt, messages);
  }

  if (resolvedProvider === "ollama") {
    return chatOllama(systemPrompt, messages);
  }

  throw new Error(
    "No AI provider configured. Set ANTHROPIC_API_KEY or OLLAMA_URL/OLLAMA_MODEL in .env.local, or use the free Guided Diagnosis mode.",
  );
}
