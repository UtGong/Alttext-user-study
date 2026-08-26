"use client";

import { useEffect, useMemo, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import {
  analyzeStudyRecords,
  ANALYSIS_SESSION_KEY,
  GroupSummary,
  NumericSummary,
  StudyAnalysis,
  StudyRecord,
  TrialMetricSummary
} from "@/lib/analysis";

const format = (value: number | null, suffix = "") =>
  value === null ? "—" : `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}${suffix}`;

const mean = (summary: NumericSummary) => format(summary.mean);
const meanWithN = (summary: NumericSummary) =>
  summary.n > 0 ? `${mean(summary)} (n=${summary.n})` : "—";

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
    ["Mean complexity score", mean(analysis.overall.complexityScore)],
    ["Mean presented spatial expressions", mean(analysis.overall.presentedSpatialExpressionCount)],
    ["Mean presented Kendall’s τ", mean(analysis.overall.presentedKendallTau)],
    ["Preference trials", analysis.preferenceTrialCount],
    ["No-preference choices", analysis.noPreferenceCount]
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

type ChartDatum = { label: string; value: number | null; detail?: string };

function BarChart({
  title,
  description,
  data,
  maximum,
  suffix = ""
}: {
  title: string;
  description: string;
  data: ChartDatum[];
  maximum: number;
  suffix?: string;
}) {
  return (
    <section className="analysis-chart" aria-labelledby={`${title.replace(/\W+/g, "-").toLowerCase()}-heading`}>
      <h3 id={`${title.replace(/\W+/g, "-").toLowerCase()}-heading`}>{title}</h3>
      <p>{description}</p>
      <div className="bar-chart" role="img" aria-label={`${title}. ${data.map((item) => `${item.label}: ${format(item.value, suffix)}`).join("; ")}`}>
        {data.map((item) => {
          const width = item.value === null ? 0 : Math.max(0, Math.min(100, (item.value / maximum) * 100));
          return (
            <div className="bar-chart-row" key={item.label}>
              <span className="bar-chart-label">{item.label}</span>
              <span className="bar-chart-track" aria-hidden="true">
                <span className="bar-chart-fill" style={{ width: `${width}%` }} />
              </span>
              <strong>{format(item.value, suffix)}</strong>
              {item.detail && <small>{item.detail}</small>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AnalysisCharts({ analysis }: { analysis: StudyAnalysis }) {
  const conditionAccuracy = analysis.byCondition.map((row) => ({
    label: row.name,
    value: row.spatialAccuracyPercent,
    detail: `${row.spatialCorrect}/${row.spatialEligible} eligible answers`
  }));
  const preference = analysis.preference.map((row) => ({
    label: row.condition,
    value: row.firstChoicePercent,
    detail: `${row.firstChoices}/${row.appearances} trials`
  }));
  const expressionAccuracy = analysis.bySpatialExpressionCount.map((row) => ({
    label: row.name === "Missing" ? "Missing count" : `${row.name} expressions`,
    value: row.spatialAccuracyPercent,
    detail: `${row.trialCount} trial${row.trialCount === 1 ? "" : "s"}`
  }));

  return (
    <section className="card" aria-labelledby="analysis-charts-heading">
      <h2 id="analysis-charts-heading">Analysis charts</h2>
      <p>Charts update with the selected participant records. Exact values remain available in the tables below.</p>
      <div className="analysis-chart-grid">
        <BarChart title="Spatial accuracy by condition" description="Percent correct among eligible spatial answers." data={conditionAccuracy} maximum={100} suffix="%" />
        <BarChart title="Preference by condition" description="Percent of appearances selected as the clearer spatial description." data={preference} maximum={100} suffix="%" />
        <BarChart title="Accuracy by number of spatial expressions" description="Spatial accuracy grouped by the count in the description actually presented." data={expressionAccuracy} maximum={100} suffix="%" />
      </div>
    </section>
  );
}

function DescriptionMetricsTable({ title, rows }: { title: string; rows: GroupSummary[] }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p>Cells report the mean and number of trials with a recorded value.</p>
      <div className="table-scroll">
        <table className="analysis-table">
          <thead>
            <tr>
              <th scope="col">Group</th>
              <th scope="col">Trials</th>
              <th scope="col">Complexity score</th>
              <th scope="col">Baseline spatial expressions</th>
              <th scope="col">Spatial-order expressions</th>
              <th scope="col">Spatial-order Kendall’s τ</th>
              <th scope="col">Presented expressions</th>
              <th scope="col">Presented Kendall’s τ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td>{row.trialCount}</td>
                <td>{meanWithN(row.complexityScore)}</td>
                <td>{meanWithN(row.baselineSpatialExpressionCount)}</td>
                <td>{meanWithN(row.spatialSpatialExpressionCount)}</td>
                <td>{meanWithN(row.spatialKendallTau)}</td>
                <td>{meanWithN(row.presentedSpatialExpressionCount)}</td>
                <td>{meanWithN(row.presentedKendallTau)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TrialMetricsTable({ rows }: { rows: TrialMetricSummary[] }) {
  return (
    <div className="table-scroll">
      <h3>Trial-level description metrics</h3>
      <table className="analysis-table">
        <thead>
          <tr>
            <th scope="col">Trial</th>
            <th scope="col">Image</th>
            <th scope="col">Condition</th>
            <th scope="col">Complexity</th>
            <th scope="col">Complexity score</th>
            <th scope="col">Baseline expressions</th>
            <th scope="col">Spatial-order expressions</th>
            <th scope="col">Spatial-order τ</th>
            <th scope="col">Presented expressions</th>
            <th scope="col">Presented τ</th>
            <th scope="col">Spatial accuracy</th>
            <th scope="col">Replays</th>
            <th scope="col">Time (sec)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.imageId}-${row.trialIndex ?? index}`}>
              <td>{row.trialIndex ?? index + 1}</td>
              <th scope="row">{row.imageFilename || row.imageId || "Unknown"}</th>
              <td>{row.condition}</td>
              <td>{row.complexityLevel}</td>
              <td>{format(row.complexityScore)}</td>
              <td>{format(row.baselineSpatialExpressionCount)}</td>
              <td>{format(row.spatialSpatialExpressionCount)}</td>
              <td>{format(row.spatialKendallTau)}</td>
              <td>{format(row.presentedSpatialExpressionCount)}</td>
              <td>{format(row.presentedKendallTau)}</td>
              <td>{format(row.spatialAccuracyPercent, "%")}</td>
              <td>{format(row.replayCount)}</td>
              <td>{format(row.responseTimeSeconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ANALYSIS_SESSION_KEY);
      if (!stored) {
        setError("No fetched data is available. Return home and use Fetch data and continue.");
        setLoaded(true);
        return;
      }
      const parsed = JSON.parse(stored) as StudyRecord[];
      if (!Array.isArray(parsed)) throw new Error("The fetched data could not be read.");
      setRecords(parsed);
      setSelectedIndexes(parsed.map((_, index) => index));
      setLoaded(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The fetched data could not be read.");
      setLoaded(true);
    }
  }, []);

  const selectedRecords = useMemo(
    () => records.filter((_, index) => selectedIndexes.includes(index)),
    [records, selectedIndexes]
  );
  const analysis = useMemo(() => analyzeStudyRecords(selectedRecords), [selectedRecords]);

  const toggleRecord = (index: number) => {
    setSelectedIndexes((current) =>
      current.includes(index) ? current.filter((value) => value !== index) : [...current, index]
    );
  };

  const recordLabel = (record: StudyRecord, index: number) => {
    const participant = record.participant as Record<string, unknown> | undefined;
    const participantId =
      (typeof record.participantId === "string" && record.participantId) ||
      (typeof participant?.participantId === "string" && participant.participantId) ||
      `Record ${index + 1}`;
    return `${participantId}${record.testMode === true ? " (test mode)" : ""}`;
  };

  return (
    <main id="main-content" className="container analysis-page">
      <header className="site-header">
        <p className="eyebrow">Researcher tools</p>
        <h1>Study analysis</h1>
        <p>Descriptive participant and aggregate analysis based on the current saved study schema.</p>
        <p><a href="/">Return to study home</a></p>
      </header>

      <section className="panel" aria-labelledby="select-data-heading">
        <h2 id="select-data-heading">Select data to analyze</h2>
        <p>
          Choose the participant records to include. Results update automatically when the
          selection changes.
        </p>
        {records.length > 0 && (
          <fieldset className="fieldset">
            <legend>Fetched participant records</legend>
            <div className="button-row">
              <AccessibleButton
                type="button"
                variant="secondary"
                onClick={() => setSelectedIndexes(records.map((_, index) => index))}
              >
                Select all
              </AccessibleButton>
              <AccessibleButton
                type="button"
                variant="secondary"
                onClick={() => setSelectedIndexes([])}
              >
                Clear selection
              </AccessibleButton>
            </div>
            <div className="record-selection-list">
              {records.map((record, index) => (
                <label className="checkbox-label" key={`${record.id ?? "record"}-${index}`}>
                  <input
                    type="checkbox"
                    checked={selectedIndexes.includes(index)}
                    onChange={() => toggleRecord(index)}
                  />
                  <span>{recordLabel(record, index)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="button-row">
          <AccessibleButton
            variant="secondary"
            disabled={selectedRecords.length === 0}
            onClick={() => downloadJson("study-results-selected.json", selectedRecords)}
          >
            Save selected data as JSON
          </AccessibleButton>
          <AccessibleButton
            variant="secondary"
            disabled={selectedRecords.length === 0}
            onClick={() => downloadJson("study-analysis.json", analysis)}
          >
            Save analysis as JSON
          </AccessibleButton>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>

      {loaded && selectedRecords.length > 0 && (
        <div aria-live="polite">
          <section className="card">
            <h2>Overall performance</h2>
            <p>
              {analysis.includedRecordCount} non-test records included; {analysis.excludedTestRecordCount} test-mode records excluded.
            </p>
            <SummaryCards analysis={analysis} />
          </section>

          <AnalysisCharts analysis={analysis} />

          <OutcomeTable title="Performance by condition" rows={analysis.byCondition} />
          <OutcomeTable title="Performance by image complexity" rows={analysis.byComplexity} />
          <OutcomeTable title="Performance by number of spatial expressions" rows={analysis.bySpatialExpressionCount} />
          <DescriptionMetricsTable title="Description metrics by condition" rows={analysis.byCondition} />
          <DescriptionMetricsTable title="Description metrics by image complexity" rows={analysis.byComplexity} />
          <SpatialBreakdownTable title="Spatial accuracy by frame of reference" rows={analysis.byFrameOfReference} />
          <SpatialBreakdownTable title="Spatial accuracy by object focus" rows={analysis.byObjectFocus} />

          <section className="card">
            <h2>Preference results</h2>
            <div className="table-scroll">
              <table className="analysis-table">
                <thead><tr><th scope="col">Condition</th><th scope="col">Appearances</th><th scope="col">First choices</th><th scope="col">First-choice rate</th><th scope="col">Mean rank</th><th scope="col">Mean spatial expressions</th><th scope="col">Mean Kendall’s τ</th><th scope="col">Rank counts</th></tr></thead>
                <tbody>
                  {analysis.preference.map((item) => (
                    <tr key={item.condition}>
                      <th scope="row">{item.condition}</th><td>{item.appearances}</td><td>{item.firstChoices}</td><td>{format(item.firstChoicePercent, "%")}</td><td>{format(item.meanRank)}</td><td>{meanWithN(item.spatialExpressionCount)}</td><td>{meanWithN(item.kendallTau)}</td><td>{Object.entries(item.rankCount).map(([rank, count]) => `${rank}: ${count}`).join(", ") || "—"}</td>
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
                <TrialMetricsTable rows={participant.trialMetrics} />
                {participant.preference.length > 0 && (
                  <div className="table-scroll">
                    <h3>Preference results</h3>
                    <table className="analysis-table">
                      <thead><tr><th scope="col">Condition</th><th scope="col">First choices</th><th scope="col">First-choice rate</th><th scope="col">Mean rank</th><th scope="col">Mean spatial expressions</th><th scope="col">Mean Kendall’s τ</th></tr></thead>
                      <tbody>{participant.preference.map((item) => (
                        <tr key={item.condition}><th scope="row">{item.condition}</th><td>{item.firstChoices}</td><td>{format(item.firstChoicePercent, "%")}</td><td>{format(item.meanRank)}</td><td>{meanWithN(item.spatialExpressionCount)}</td><td>{meanWithN(item.kendallTau)}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
                {participant.dataQualityFlags.length > 0 && (
                  <div><h3>Data-quality flags</h3><ul>{participant.dataQualityFlags.map((flag) => <li key={flag}>{flag}</li>)}</ul></div>
                )}
                <h3>Preference explanations</h3>
                {participant.preferenceExplanations.map((response, index) => (
                  <div className="qualitative-response" key={`${response.preferredCondition}-${index}`}><strong>Preferred condition: {response.preferredCondition || "Unknown"}</strong><p>{response.explanation || "No response"}</p></div>
                ))}
                <h3>Free recall responses</h3>
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
              <li><strong>Description metrics:</strong> report spatial-expression counts and Kendall&apos;s τ for the baseline, spatial-order, and actually presented descriptions, alongside image complexity.</li>
              <li><strong>Secondary outcomes:</strong> scene clarity, spatial confidence, content comprehension, mental demand, frustration, replay behavior, and response time.</li>
              <li><strong>Preference:</strong> first-choice rates and mean ranks by stored condition, with the description metrics for each option.</li>
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
