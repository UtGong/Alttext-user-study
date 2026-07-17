import { NextRequest, NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, initializeFirestore } from "firebase-admin/firestore";

export const runtime = "nodejs";

function sanitizeId(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 80);
}

function getFirebasePrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY.");
  }

  return privateKey.replace(/\\n/g, "\n");
}

function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID.");
  }

  if (!clientEmail) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL.");
  }

  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: getFirebasePrivateKey()
    })
  });

  // Important: prefer REST transport instead of gRPC.
  // This avoids DEADLINE_EXCEEDED / Waiting for LB pick issues on some local and Vercel environments.
  initializeFirestore(app, {
    preferRest: true
  });

  return app;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rawParticipantId = body?.participant?.participantId;

    const participantId =
      typeof rawParticipantId === "string" && rawParticipantId.trim().length > 0
        ? sanitizeId(rawParticipantId)
        : "unknown_participant";

    const app = getFirebaseApp();
    const db = getFirestore(app);

    const collectionName = process.env.FIRESTORE_COLLECTION || "studyResults";
    const submittedAt = new Date().toISOString();
    const documentId = `${participantId}_${submittedAt.replace(/[:.]/g, "-")}`;

    const resultToSave = {
      ...body,
      participantId,
      schemaVersion: 2,
      comprehensionOrder: Array.isArray(body?.comprehensionOrder)
        ? body.comprehensionOrder
        : [],
      responseSummary: {
        comprehensionCount: Array.isArray(body?.comprehensionResponses)
          ? body.comprehensionResponses.length
          : 0,
        preferenceCount: Array.isArray(body?.preferenceResponses)
          ? body.preferenceResponses.length
          : 0,
        hasPerImageWorkload: Array.isArray(body?.comprehensionResponses)
          ? body.comprehensionResponses.every(
              (response: { workload?: { mentalDemand?: unknown } }) =>
                response?.workload?.mentalDemand !== undefined
            )
          : false
      },
      serverSubmittedAt: submittedAt,
      createdAt: FieldValue.serverTimestamp(),
      appVersion: "blv-user-study-nextjs-v2"
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
