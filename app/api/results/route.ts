import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getFirebaseDatabase, getStudyResultsCollectionName } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const configuredKey = process.env.RESEARCHER_ACCESS_KEY;

  if (!configuredKey) {
    throw new Error("Missing RESEARCHER_ACCESS_KEY.");
  }

  const authorization = request.headers.get("authorization");
  const suppliedKey = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const configuredBuffer = Buffer.from(configuredKey);
  const suppliedBuffer = Buffer.from(suppliedKey);

  return (
    configuredBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(configuredBuffer, suppliedBuffer)
  );
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { ok: false, error: "Invalid researcher access key." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const collection = getStudyResultsCollectionName();
    const snapshot = await getFirebaseDatabase()
      .collection(collection)
      .orderBy("createdAt", "desc")
      .get();

    const results = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }));

    return NextResponse.json(
      {
        ok: true,
        collection,
        count: results.length,
        results
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Failed to fetch results from Firebase:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to fetch results from Firebase."
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
