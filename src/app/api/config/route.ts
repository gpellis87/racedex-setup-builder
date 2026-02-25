import { NextResponse } from "next/server";
import { getConfiguredProvider } from "@/lib/ai-engine";

export async function GET() {
  const provider = getConfiguredProvider();
  return NextResponse.json({
    aiAvailable: provider !== null,
    provider,
    hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
    hasOllama: !!(process.env.OLLAMA_URL || process.env.OLLAMA_MODEL),
  });
}
