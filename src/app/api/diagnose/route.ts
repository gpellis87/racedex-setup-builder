import { NextRequest, NextResponse } from "next/server";
import { CarId, SetupValues } from "@/types/setup";
import {
  Condition,
  Phase,
  RunLength,
  Severity,
  diagnose,
  formatDiagnosisAsMarkdown,
} from "@/lib/rules-engine";

interface DiagnoseRequestBody {
  carId: CarId;
  trackId: string;
  condition: Condition;
  phase: Phase;
  runLength: RunLength;
  severity: Severity;
  currentSetup?: SetupValues;
}

export async function POST(req: NextRequest) {
  try {
    const body: DiagnoseRequestBody = await req.json();
    const { carId, trackId, condition, phase, runLength, severity, currentSetup } = body;

    if (!carId || !trackId || !condition || !phase || !runLength || !severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = diagnose({
      carId,
      trackId,
      condition,
      phase,
      runLength,
      severity,
      currentSetup,
    });

    const markdown = formatDiagnosisAsMarkdown(result);

    return NextResponse.json({
      response: markdown,
      result,
      updatedSetup: result.updatedSetup,
      baselineSetup: result.baselineSetup,
    });
  } catch (error) {
    console.error("Diagnose API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
