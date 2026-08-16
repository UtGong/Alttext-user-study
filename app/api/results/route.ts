import { NextResponse } from "next/server";
import { getFirebaseDatabase, getStudyResultsCollectionName } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collection = getStudyResultsCollectionName();
    const snapshot = await getFirebaseDatabase()
      .collection(collection)
      .orderBy("createdAt", "desc")
      .get();

    const results = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }));

    return NextResponse.json({
      ok: true,
      collection,
      count: results.length,
      results
    });
  } catch (error) {
    console.error("Failed to fetch results from Firebase:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to fetch results from Firebase."
      },
      { status: 500 }
    );
  }
}
