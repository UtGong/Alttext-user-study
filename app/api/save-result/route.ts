import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDatabase, getStudyResultsCollectionName } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

function sanitizeId(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      body?.consent?.accepted !== true ||
      typeof body?.consent?.acceptedAt !== "string" ||
      body.consent.acceptedAt.length === 0
    ) {
      return NextResponse.json(
        { ok: false, error: "A valid consent record is required before saving study data." },
        { status: 400 }
      );
    }

    const rawParticipantId = body?.participant?.participantId;

    const participantId =
      typeof rawParticipantId === "string" && rawParticipantId.trim().length > 0
        ? sanitizeId(rawParticipantId)
        : "unknown_participant";

    const db = getFirebaseDatabase();

    const collectionName = getStudyResultsCollectionName();
    const submittedAt = new Date().toISOString();
    const documentId = `${participantId}_${submittedAt.replace(/[:.]/g, "-")}`;

    const resultToSave = {
      ...body,
      participantId,
      schemaVersion: 7,
      comprehensionOrder: Array.isArray(body?.comprehensionOrder)
        ? body.comprehensionOrder
        : [],
      responseSummary: {
        consentAccepted: true,
        comprehensionCount: Array.isArray(body?.comprehensionResponses)
          ? body.comprehensionResponses.length
          : 0,
        preferenceCount: Array.isArray(body?.preferenceResponses)
          ? body.preferenceResponses.length
          : 0,
        interviewAnswerCount: Array.isArray(body?.interviewResponses)
          ? body.interviewResponses.filter(
              (response: { answer?: unknown }) =>
                typeof response?.answer === "string" && response.answer.trim().length > 0
            ).length
          : 0,
        hasPerImageWorkload: Array.isArray(body?.comprehensionResponses)
          ? body.comprehensionResponses.every(
              (response: { workload?: { mentalDemand?: unknown; frustration?: unknown } }) =>
                response?.workload?.mentalDemand !== undefined &&
                response?.workload?.frustration !== undefined
            )
          : false,
        practiceResponseRecorded:
          typeof body?.practiceResponse === "string" && body.practiceResponse.trim().length > 0,
        uncertainSpatialAnswerCount: Array.isArray(body?.comprehensionResponses)
          ? body.comprehensionResponses.reduce(
              (count: number, response: { spatialAnswers?: { isUncertain?: unknown }[] }) =>
                count +
                (Array.isArray(response?.spatialAnswers)
                  ? response.spatialAnswers.filter((answer) => answer?.isUncertain === true).length
                  : 0),
              0
            )
          : 0
      },
      serverSubmittedAt: submittedAt,
      createdAt: FieldValue.serverTimestamp(),
      appVersion: "blv-user-study-nextjs-v7"
    };

    await db.collection(collectionName).doc(documentId).set(resultToSave);

    return NextResponse.json({
      ok: true,
      participantId,
      documentId,
      collection: collectionName,
      savedAt: submittedAt
    });
  } catch (error) {
    console.error("Failed to save result to Firebase:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save result to Firebase."
      },
      { status: 500 }
    );
  }
}
