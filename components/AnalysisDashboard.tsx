"use client";

import { useMemo, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import {
  analyzeStudyRecords,
  GroupSummary,
  NumericSummary,
  StudyAnalysis,
  StudyRecord
} from "@/lib/analysis";

type ResultsResponse = {
  ok: boolean;
  collection?: string;
  results?: StudyRecord[];
  error?: string;
};

const format = (value: number | null, suffix = "") =>
  value === null ? "—" : `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}${suffix}`;

const mean = (summary: NumericSummary) => format(summary.mean);

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function SummaryCards({ analysis }: { analysis: StudyAnalysis }) {
  const cards = [
    ["Participants", analysis.participantCount],
    ["Comprehension trials", analysis.overall.trialCount],
    ["Spatial accuracy", format(analysis.overall.spatialAccuracyPercent, "%")],
    ["Uncertain answers", analysis.overall.uncertainAnswerCount],
    ["Mean scene clarity", mean(analysis.overall.overallSceneClarity)],
    ["Mean spatial confidence", mean(analysis.overall.spatialRelationsConfidence)],
    ["Mean mental demand", mean(analysis.overall.mentalDemand)],
    ["Preference trials", analysis.preference.reduce((sum, item) => sum + item.firstChoices, 0)]
  ];

  return (
    <div className="analysis-card-grid">
      {cards.map(([label, value]) => (
        <div className="metric-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function OutcomeTable({ title, rows }: { title: string; rows: GroupSummary[] }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="table-scroll">
        <table className="analysis-table">
          <thead>
            <tr>
              <th scope="col">Group</th>
              <th scope="col">Participants</th>
              <th scope="col">Trials</th>
              <th scope="col">Spatial accuracy</th>
              <th scope="col">Uncertain</th>
              <th scope="col">Scene clarity</th>
              <th scope="col">Spatial confidence</th>
              <th scope="col">Comprehension</th>
              <th scope="col">Mental demand</th>
              <th scope="col">Frustration</th>
              <th scope="col">Mean replays</th>
              <th scope="col">Mean time (sec)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td>{row.participantCount}</td>
                <td>{row.trialCount}</td>
                <td>{format(row.spatialAccuracyPercent, "%")} ({row.spatialCorrect}/{row.spatialEligible})</td>
                <td>{row.uncertainAnswerCount}</td>
                <td>{mean(row.overallSceneClarity)}</td>
                <td>{mean(row.spatialRelationsConfidence)}</td>
                <td>{mean(row.contentComprehension)}</td>
                <td>{mean(row.mentalDemand)}</td>
                <td>{mean(row.frustration)}</td>
                <td>{mean(row.replayCount)}</td>
                <td>{mean(row.responseTimeSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SpatialBreakdownTable({ title, rows }: { title: string; rows: GroupSummary[] }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="table-scroll">
        <table className="analysis-table">
          <thead><tr><th scope="col">Group</th><th scope="col">Participants</th><th scope="col">Contributing trials</th><th scope="col">Correct</th><th scope="col">Eligible</th><th scope="col">Accuracy</th><th scope="col">Uncertain</th></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.name}><th scope="row">{row.name}</th><td>{row.participantCount}</td><td>{row.trialCount}</td><td>{row.spatialCorrect}</td><td>{row.spatialEligible}</td><td>{format(row.spatialAccuracyPercent, "%")}</td><td>{row.uncertainAnswerCount}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}

export function AnalysisDashboard() {
  const [accessKey, setAccessKey] = useState("");
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const analysis = useMemo(() => analyzeStudyRecords(records), [records]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/results", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${accessKey}` }
      });
      const body = (await response.json()) as ResultsResponse;
      if (!response.ok || !body.ok) throw new Error(body.error || "Unable to fetch study data.");
      setRecords(body.results ?? []);
      setLoaded(true);
    } catch (fetchError) {
      setLoaded(false);
      setError(fetchError instanceof Error ? fetchError.message : "Unable to fetch study data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="container analysis-page">
      <header className="site-header">
        <p className="eyebrow">Researcher tools</p>
        <h1>Study analysis</h1>
        <p>Descriptive participant and aggregate analysis based on the current saved study schema.</p>
        <p><a href="/">Return to study home</a></p>
      </header>

      <section className="panel" aria-labelledby="load-data-heading">
        <h2 id="load-data-heading">Load protected study data</h2>
        <div className="field-label">
          <label htmlFor="analysis-access-key">Researcher access key</label>
          <input
            id="analysis-access-key"
            type="password"
            autoComplete="current-password"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
          />
        </div>
        <div className="button-row">
          <AccessibleButton onClick={fetchData} disabled={loading || accessKey.length === 0}>
            {loading ? "Fetching and analyzing…" : "Fetch and analyze all data"}
          </AccessibleButton>
          <AccessibleButton
            variant="secondary"
            disabled={!loaded}
            onClick={() => downloadJson("study-results-raw.json", records)}
          >
            Save raw data as JSON
          </AccessibleButton>
          <AccessibleButton
            variant="secondary"
            disabled={!loaded}
            onClick={() => downloadJson("study-analysis.json", analysis)}
          >
            Save analysis as JSON
          </AccessibleButton>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>

      {loaded && (
        <div aria-live="polite">
          <section className="card">
            <h2>Overall performance</h2>
            <p>
              {analysis.includedRecordCount} non-test records included; {analysis.excludedTestRecordCount} test-mode records excluded.
            </p>
            <SummaryCards analysis={analysis} />
          </section>

          <OutcomeTable title="Performance by condition" rows={analysis.byCondition} />
          <OutcomeTable title="Performance by image complexity" rows={analysis.byComplexity} />
          <SpatialBreakdownTable title="Spatial accuracy by frame of reference" rows={analysis.byFrameOfReference} />
          <SpatialBreakdownTable title="Spatial accuracy by object focus" rows={analysis.byObjectFocus} />

          <section className="card">
            <h2>Preference results</h2>
            <div className="table-scroll">
              <table className="analysis-table">
                <thead><tr><th scope="col">Condition</th><th scope="col">Appearances</th><th scope="col">First choices</th><th scope="col">First-choice rate</th><th scope="col">Mean rank</th><th scope="col">Rank counts</th></tr></thead>
                <tbody>
                  {analysis.preference.map((item) => (
                    <tr key={item.condition}>
                      <th scope="row">{item.condition}</th><td>{item.appearances}</td><td>{item.firstChoices}</td><td>{format(item.firstChoicePercent, "%")}</td><td>{format(item.meanRank)}</td><td>{Object.entries(item.rankCount).map(([rank, count]) => `${rank}: ${count}`).join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <h2>Individual participant performance</h2>
            {analysis.participants.map((participant) => (
              <details className="participant-analysis" key={participant.recordId || participant.participantId}>
                <summary>{participant.participantId} — {format(participant.overall.spatialAccuracyPercent, "%")} spatial accuracy</summary>
                <p>Schema {participant.schemaVersion ?? "unknown"}; app {participant.appVersion || "unknown"}; sequence group {participant.sequenceGroup || "unknown"}.</p>
                <OutcomeTable title="Condition results" rows={participant.byCondition} />
                {participant.preference.length > 0 && (
                  <div className="table-scroll">
                    <h3>Preference results</h3>
                    <table className="analysis-table">
                      <thead><tr><th scope="col">Condition</th><th scope="col">First choices</th><th scope="col">First-choice rate</th><th scope="col">Mean rank</th></tr></thead>
                      <tbody>{participant.preference.map((item) => (
                        <tr key={item.condition}><th scope="row">{item.condition}</th><td>{item.firstChoices}</td><td>{format(item.firstChoicePercent, "%")}</td><td>{format(item.meanRank)}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
                {participant.dataQualityFlags.length > 0 && (
                  <div><h3>Data-quality flags</h3><ul>{participant.dataQualityFlags.map((flag) => <li key={flag}>{flag}</li>)}</ul></div>
                )}
                <h3>Preference explanations (manual coding required)</h3>
                {participant.preferenceExplanations.map((response, index) => (
                  <div className="qualitative-response" key={`${response.preferredCondition}-${index}`}><strong>Preferred condition: {response.preferredCondition || "Unknown"}</strong><p>{response.explanation || "No response"}</p></div>
                ))}
                <h3>Free recall responses (manual coding required)</h3>
                {participant.freeRecallResponses.map((response, index) => (
                  <div className="qualitative-response" key={`${response.imageId}-${index}`}>
                    <strong>{response.condition || "Unknown condition"}, image {response.imageId || index + 1}</strong>
                    <p>{response.response || "No response"}</p>
                  </div>
                ))}
                <h3>Interview responses</h3>
                {participant.interviewResponses.map((response, index) => (
                  <div className="qualitative-response" key={`${response.question}-${index}`}><strong>{response.question}</strong><p>{response.answer || "No response"}</p></div>
                ))}
              </details>
            ))}
          </section>

          <section className="card">
            <h2>Updated analysis plan</h2>
            <ol>
              <li><strong>Primary outcome:</strong> spatial-answer accuracy by condition, using stored eligible denominators and reporting uncertainty separately.</li>
              <li><strong>Secondary outcomes:</strong> scene clarity, spatial confidence, content comprehension, mental demand, frustration, replay behavior, and response time.</li>
              <li><strong>Preference:</strong> first-choice rates and mean ranks by stored condition, supporting current two-condition and legacy multi-condition pilots.</li>
              <li><strong>Moderators:</strong> describe results by complexity, frame of reference, and main versus secondary object focus.</li>
              <li><strong>Qualitative analysis:</strong> manually code free recall, preference explanations, and interviews; report a codebook and inter-rater agreement rather than automated scores.</li>
              <li><strong>Final inference:</strong> after data collection, inspect distributions and use participant/image-aware mixed models or corrected paired nonparametric tests. Report effect sizes and uncertainty, not p-values alone.</li>
            </ol>
            <ul>{analysis.analysisNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          </section>
        </div>
      )}
    </main>
  );
}
