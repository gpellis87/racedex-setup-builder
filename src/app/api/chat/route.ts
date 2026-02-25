import { NextRequest, NextResponse } from "next/server";
import { chat, AIProvider } from "@/lib/ai-engine";
import { CarId, ChatMessage, SetupValues } from "@/types/setup";

export const maxDuration = 60;

interface ChatRequestBody {
  messages: ChatMessage[];
  carId: CarId | null;
  trackId: string | null;
  currentSetup: SetupValues | null;
  provider?: AIProvider;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { messages, carId, trackId, currentSetup, provider } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const response = await chat(messages, carId, trackId, currentSetup, provider);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
