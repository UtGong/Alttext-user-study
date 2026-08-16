"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AccessibleButton } from "@/components/AccessibleButton";
import { ANALYSIS_SESSION_KEY } from "@/lib/analysis";

type ResultsResponse = {
  ok: boolean;
  collection?: string;
  count?: number;
  results?: Record<string, unknown>[];
  error?: string;
};

export function ResultsFetcher() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/results", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessKey}`
        }
      });
      const body = (await response.json()) as ResultsResponse;

      if (!response.ok || !body.ok) {
        throw new Error(body.error || "Failed to fetch user data.");
      }

      sessionStorage.setItem(ANALYSIS_SESSION_KEY, JSON.stringify(body.results ?? []));
      router.push("/analysis");
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card researcher-data" aria-labelledby="researcher-data-heading">
      <h3 id="researcher-data-heading">Researcher data</h3>
      <p>
        Enter the researcher access key to fetch completed Firestore records. You will then
        choose which records to analyze on the next page.
      </p>
      <div className="field-label">
        <label htmlFor="researcher-access-key">Researcher access key</label>
        <input
          id="researcher-access-key"
          type="password"
          autoComplete="current-password"
          value={accessKey}
          onChange={(event) => setAccessKey(event.target.value)}
        />
      </div>
      <AccessibleButton
        type="button"
        variant="secondary"
        onClick={fetchResults}
        disabled={loading || accessKey.length === 0}
      >
        {loading ? "Fetching user data…" : "Fetch data and continue"}
      </AccessibleButton>

      {error && <p className="error-message" role="alert">{error}</p>}

    </section>
  );
}
