import { StudyState } from "@/types/study";

export type SaveResultResponse = {
  ok: boolean;
  participantId?: string;
  documentId?: string;
  collection?: string;
  savedAt?: string;
  error?: string;
};

export async function saveResultToFirebase(
  state: StudyState
): Promise<SaveResultResponse> {
  const response = await fetch("/api/save-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(state)
  });

  const data = (await response.json()) as SaveResultResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Failed to save result to Firebase.");
  }

  return data;
}