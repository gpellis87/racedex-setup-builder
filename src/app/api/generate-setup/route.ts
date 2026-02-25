import { NextRequest, NextResponse } from "next/server";
import { CarId, SetupValues } from "@/types/setup";
import { generateSetupSheet, generateSetupJSON } from "@/lib/setup-generator";

interface GenerateRequestBody {
  carId: CarId;
  trackId: string;
  values: SetupValues;
  name?: string;
  format: "text" | "json";
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestBody = await req.json();
    const { carId, trackId, values, name, format } = body;

    if (!carId || !trackId || !values) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (format === "json") {
      const json = generateSetupJSON(carId, trackId, values, name);
      return new NextResponse(json, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${slugify(name ?? "setup")}.json"`,
        },
      });
    }

    const text = generateSetupSheet(carId, trackId, values, name);
    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${slugify(name ?? "setup")}.txt"`,
      },
    });
  } catch (error) {
    console.error("Generate setup error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
