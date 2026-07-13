import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function sanitizeFilename(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 80);
}

function timestampForFilename() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rawParticipantId = body?.participant?.participantId;

    const participantId =
      typeof rawParticipantId === "string" && rawParticipantId.trim().length > 0
        ? sanitizeFilename(rawParticipantId)
        : "unknown_participant";

    const resultsDir = path.join(process.cwd(), "study-results", participantId);
    await mkdir(resultsDir, { recursive: true });

    const timestamp = timestampForFilename();
    const jsonPath = path.join(resultsDir, `result-${timestamp}.json`);

    await writeFile(jsonPath, JSON.stringify(body, null, 2), "utf8");

    return NextResponse.json({
      ok: true,
      participantId,
      savedPath: `study-results/${participantId}/result-${timestamp}.json`
    });
  } catch (error) {
    console.error("Failed to save result:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to save result."
      },
      { status: 500 }
    );
  }
}