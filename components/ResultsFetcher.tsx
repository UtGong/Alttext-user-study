"use client";

import { useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";

type ResultsResponse = {
  ok: boolean;
  collection?: string;
  count?: number;
  results?: Record<string, unknown>[];
  error?: string;
};

export function ResultsFetcher() {
  const [accessKey, setAccessKey] = useState("");
  const [data, setData] = useState<ResultsResponse | null>(null);
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

      setData(body);
    } catch (fetchError) {
      setData(null);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card researcher-data" aria-labelledby="researcher-data-heading">
      <h3 id="researcher-data-heading">Researcher data</h3>
      <p>Enter the researcher access key to fetch completed study records from Firestore.</p>
      <p><a href="/analysis">Open the full study analysis dashboard</a></p>
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
        {loading ? "Fetching user data…" : "Fetch all user data"}
      </AccessibleButton>

      {error && <p className="error-message" role="alert">{error}</p>}

      {data?.results && (
        <div className="results-output" aria-live="polite">
          <p>
            Fetched {data.count} {data.count === 1 ? "record" : "records"} from {data.collection}.
          </p>
          <details>
            <summary>View fetched user data</summary>
            <pre>{JSON.stringify(data.results, null, 2)}</pre>
          </details>
        </div>
      )}
    </section>
  );
}
