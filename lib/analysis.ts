import { stimuli } from "@/lib/stimuli";

export type StudyRecord = Record<string, unknown> & {
  id?: string;
  participantId?: string;
  schemaVersion?: number;
  appVersion?: string;
  testMode?: boolean;
  participant?: Record<string, unknown>;
  comprehensionResponses?: Record<string, unknown>[];
  preferenceResponses?: Record<string, unknown>[];
  interviewResponses?: Record<string, unknown>[];
};

export const ANALYSIS_SESSION_KEY = "blv-study-analysis-records";

export type NumericSummary = {
  n: number;
  mean: number | null;
  median: number | null;
  standardDeviation: number | null;
  minimum: number | null;
  maximum: number | null;
};

export type GroupSummary = {
  name: string;
  participantCount: number;
  trialCount: number;
  spatialCorrect: number;
  spatialEligible: number;
  spatialAccuracyPercent: number | null;
  uncertainAnswerCount: number;
  complexityScore: NumericSummary;
  baselineSpatialExpressionCount: NumericSummary;
  spatialSpatialExpressionCount: NumericSummary;
  presentedSpatialExpressionCount: NumericSummary;
  spatialKendallTau: NumericSummary;
  presentedKendallTau: NumericSummary;
  overallSceneClarity: NumericSummary;
  spatialRelationsConfidence: NumericSummary;
  contentComprehension: NumericSummary;
  mentalDemand: NumericSummary;
  frustration: NumericSummary;
  effort: NumericSummary;
  replayCount: NumericSummary;
  responseTimeSeconds: NumericSummary;
};

export type PreferenceSummary = {
  condition: string;
  appearances: number;
  firstChoices: number;
  firstChoicePercent: number | null;
  meanRank: number | null;
  rankCount: Record<string, number>;
  spatialExpressionCount: NumericSummary;
  kendallTau: NumericSummary;
};

export type TrialMetricSummary = {
  trialIndex: number | null;
  imageId: string;
  imageFilename: string;
  condition: string;
  complexityLevel: string;
  complexityScore: number | null;
  baselineSpatialExpressionCount: number | null;
  spatialSpatialExpressionCount: number | null;
  presentedSpatialExpressionCount: number | null;
  spatialKendallTau: number | null;
  presentedKendallTau: number | null;
  spatialAccuracyPercent: number | null;
  replayCount: number | null;
  responseTimeSeconds: number | null;
};

export type ParticipantAnalysis = {
  participantId: string;
  recordId: string;
  schemaVersion: number | null;
  appVersion: string;
  testMode: boolean;
  sequenceGroup: string;
  overall: GroupSummary;
  byCondition: GroupSummary[];
  trialMetrics: TrialMetricSummary[];
  preference: PreferenceSummary[];
  preferenceExplanations: { preferredCondition: string; explanation: string }[];
  freeRecallResponses: { imageId: string; condition: string; response: string }[];
  interviewResponses: { question: string; answer: string }[];
  dataQualityFlags: string[];
};

export type StudyAnalysis = {
  generatedAt: string;
  planVersion: string;
  includedRecordCount: number;
  excludedTestRecordCount: number;
  participantCount: number;
  preferenceTrialCount: number;
  noPreferenceCount: number;
  overall: GroupSummary;
  byCondition: GroupSummary[];
  byComplexity: GroupSummary[];
  bySpatialExpressionCount: GroupSummary[];
  byFrameOfReference: GroupSummary[];
  byObjectFocus: GroupSummary[];
  preference: PreferenceSummary[];
  participants: ParticipantAnalysis[];
  analysisNotes: string[];
};

type Trial = Record<string, unknown>;

const asObject = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const asArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const currentStimuliById = new Map(
  stimuli.flatMap((stimulus) => [
    [stimulus.uuid, stimulus] as const,
    [stimulus.imageFilename, stimulus] as const
  ])
);

function enrichTrialMetrics(trial: Trial): Trial {
  const stimulus =
    currentStimuliById.get(asString(trial.imageId)) ??
    currentStimuliById.get(asString(trial.uuid)) ??
    currentStimuliById.get(asString(trial.imageFilename));
  if (!stimulus) return trial;

  const condition = asString(trial.condition);
  const conditionMetric =
    condition === "baseline" || condition === "spatial"
      ? stimulus.descriptionMetrics?.[condition]
      : undefined;

  return {
    ...trial,
    complexityScore: asNumber(trial.complexityScore) ?? stimulus.complexityScore ?? null,
    baselineSpatialExpressionCount:
      asNumber(trial.baselineSpatialExpressionCount) ??
      stimulus.descriptionMetrics?.baseline?.spatialExpressionCount ??
      null,
    spatialSpatialExpressionCount:
      asNumber(trial.spatialSpatialExpressionCount) ??
      stimulus.descriptionMetrics?.spatial?.spatialExpressionCount ??
      null,
    spatialKendallTau:
      asNumber(trial.spatialKendallTau) ??
      stimulus.descriptionMetrics?.spatial?.kendallTau ??
      null,
    spatialExpressionCount:
      asNumber(trial.spatialExpressionCount) ?? conditionMetric?.spatialExpressionCount ?? null,
    presentedKendallTau:
      asNumber(trial.presentedKendallTau) ?? conditionMetric?.kendallTau ?? null
  };
}

const ratingValue = (trial: Trial, group: "ratings" | "workload", key: string) =>
  asNumber(asObject(asObject(trial[group])[key]).value);

const round = (value: number) => Math.round(value * 100) / 100;

export function summarizeNumbers(values: (number | null)[]): NumericSummary {
  const valid = values.filter((value): value is number => value !== null && Number.isFinite(value));

  if (valid.length === 0) {
    return { n: 0, mean: null, median: null, standardDeviation: null, minimum: null, maximum: null };
  }

  const sorted = [...valid].sort((a, b) => a - b);
  const mean = valid.reduce((sum, value) => sum + value, 0) / valid.length;
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  const variance =
    valid.length > 1
      ? valid.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (valid.length - 1)
      : 0;

  return {
    n: valid.length,
    mean: round(mean),
    median: round(median),
    standardDeviation: round(Math.sqrt(variance)),
    minimum: round(sorted[0]),
    maximum: round(sorted[sorted.length - 1])
  };
}

function participantIdFor(record: StudyRecord) {
  return (
    asString(record.participantId) ||
    asString(asObject(record.participant).participantId) ||
    asString(record.id, "Unknown participant")
  );
}

function responseTimeSeconds(trial: Trial) {
  const direct = asNumber(trial.responseTimeMs);
  if (direct !== null) return direct / 1000;

  const timestamps = asObject(trial.stepTimestamps);
  const total = Object.values(timestamps).reduce<number>((sum, step) => {
    const duration = asNumber(asObject(step).responseTimeMs);
    return sum + (duration ?? 0);
  }, 0);
  return total > 0 ? total / 1000 : null;
}

function summarizeTrials(name: string, entries: { participantId: string; trial: Trial }[]): GroupSummary {
  let spatialCorrect = 0;
  let spatialEligible = 0;
  let uncertainAnswerCount = 0;

  for (const { trial } of entries) {
    const answers = asArray(trial.spatialAnswers);
    const eligibleAnswers = answers.filter((answer) => asString(answer.answer) !== "Not sure");
    const recordedEligible = asNumber(trial.spatialEligibleQuestionCount);
    const recordedCorrect = asNumber(trial.spatialAccuracyScore);

    spatialEligible += recordedEligible ?? eligibleAnswers.filter((answer) => answer.correctAnswer != null).length;
    spatialCorrect += recordedCorrect ?? eligibleAnswers.filter((answer) => answer.isCorrect === true).length;
    uncertainAnswerCount += answers.filter(
      (answer) => answer.isUncertain === true || asString(answer.answer) === "Not sure"
    ).length;
  }

  return {
    name,
    participantCount: new Set(entries.map((entry) => entry.participantId)).size,
    trialCount: entries.length,
    spatialCorrect,
    spatialEligible,
    spatialAccuracyPercent: spatialEligible > 0 ? round((spatialCorrect / spatialEligible) * 100) : null,
    uncertainAnswerCount,
    complexityScore: summarizeNumbers(entries.map(({ trial }) => asNumber(trial.complexityScore))),
    baselineSpatialExpressionCount: summarizeNumbers(
      entries.map(({ trial }) => asNumber(trial.baselineSpatialExpressionCount))
    ),
    spatialSpatialExpressionCount: summarizeNumbers(
      entries.map(({ trial }) => asNumber(trial.spatialSpatialExpressionCount))
    ),
    presentedSpatialExpressionCount: summarizeNumbers(
      entries.map(({ trial }) => asNumber(trial.spatialExpressionCount))
    ),
    spatialKendallTau: summarizeNumbers(entries.map(({ trial }) => asNumber(trial.spatialKendallTau))),
    presentedKendallTau: summarizeNumbers(
      entries.map(({ trial }) => asNumber(trial.presentedKendallTau))
    ),
    overallSceneClarity: summarizeNumbers(entries.map(({ trial }) => ratingValue(trial, "ratings", "overallSceneClarity"))),
    spatialRelationsConfidence: summarizeNumbers(entries.map(({ trial }) => ratingValue(trial, "ratings", "spatialRelationsConfidence"))),
    contentComprehension: summarizeNumbers(entries.map(({ trial }) => ratingValue(trial, "ratings", "contentComprehension"))),
    mentalDemand: summarizeNumbers(entries.map(({ trial }) => ratingValue(trial, "workload", "mentalDemand"))),
    frustration: summarizeNumbers(entries.map(({ trial }) => ratingValue(trial, "workload", "frustration"))),
    effort: summarizeNumbers(entries.map(({ trial }) => ratingValue(trial, "workload", "effort"))),
    replayCount: summarizeNumbers(entries.map(({ trial }) => asNumber(trial.replayCount))),
    responseTimeSeconds: summarizeNumbers(entries.map(({ trial }) => responseTimeSeconds(trial)))
  };
}

function groupTrials(
  entries: { participantId: string; trial: Trial }[],
  getNames: (trial: Trial) => string[]
) {
  const groups = new Map<string, { participantId: string; trial: Trial }[]>();
  for (const entry of entries) {
    for (const name of getNames(entry.trial).filter(Boolean)) {
      groups.set(name, [...(groups.get(name) ?? []), entry]);
    }
  }
  return Array.from(groups.entries())
    .map(([name, group]) => summarizeTrials(name, group))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const rankKeys = ["first", "second", "third", "fourth"];

function summarizePreferences(records: StudyRecord[]): PreferenceSummary[] {
  const conditions = new Map<
    string,
    {
      appearances: number;
      first: number;
      ranks: number[];
      spatialExpressionCounts: number[];
      kendallTaus: number[];
    }
  >();

  for (const record of records) {
    for (const preference of asArray(record.preferenceResponses)) {
      const preferenceStimulus =
        currentStimuliById.get(asString(preference.imageId)) ??
        currentStimuliById.get(asString(preference.uuid)) ??
        currentStimuliById.get(asString(preference.imageFilename));
      const randomizedOrder = asArray(preference.randomizedOrder);
      const labelToCondition = new Map(
        randomizedOrder.map((item) => [
          asString(item.label),
          asString(item.condition, "unknown")
        ])
      );
      const ranking = asObject(preference.ranking);
      const fallbackFirst = asString(preference.bestChoice);
      const noPreference =
        asString(preference.preferenceChoice) === "none" ||
        asString(preference.preferredCondition) === "none";

      for (const item of randomizedOrder) {
        const condition = asString(item.condition, "unknown");
        const stimulusMetric =
          condition === "baseline" || condition === "spatial"
            ? preferenceStimulus?.descriptionMetrics?.[condition]
            : undefined;
        const current = conditions.get(condition) ?? {
          appearances: 0,
          first: 0,
          ranks: [],
          spatialExpressionCounts: [],
          kendallTaus: []
        };
        current.appearances += 1;
        const spatialExpressionCount =
          asNumber(item.spatialExpressionCount) ?? stimulusMetric?.spatialExpressionCount ?? null;
        const kendallTau = asNumber(item.kendallTau) ?? stimulusMetric?.kendallTau ?? null;
        if (spatialExpressionCount !== null) current.spatialExpressionCounts.push(spatialExpressionCount);
        if (kendallTau !== null) current.kendallTaus.push(kendallTau);
        conditions.set(condition, current);
      }

      if (noPreference) continue;

      rankKeys.forEach((key, index) => {
        const label = asString(ranking[key]) || (index === 0 ? fallbackFirst : "");
        const condition = labelToCondition.get(label) || (index === 0 ? asString(preference.preferredCondition) : "");
        if (!condition) return;
        const current = conditions.get(condition) ?? {
          appearances: 0,
          first: 0,
          ranks: [],
          spatialExpressionCounts: [],
          kendallTaus: []
        };
        current.ranks.push(index + 1);
        if (index === 0) current.first += 1;
        conditions.set(condition, current);
      });
    }
  }

  return Array.from(conditions.entries())
    .map(([condition, value]) => ({
      condition,
      appearances: value.appearances,
      firstChoices: value.first,
      firstChoicePercent: value.appearances ? round((value.first / value.appearances) * 100) : null,
      meanRank: summarizeNumbers(value.ranks).mean,
      rankCount: value.ranks.reduce((counts: Record<string, number>, rank: number) => {
        counts[String(rank)] = (counts[String(rank)] ?? 0) + 1;
        return counts;
      }, {}),
      spatialExpressionCount: summarizeNumbers(value.spatialExpressionCounts),
      kendallTau: summarizeNumbers(value.kendallTaus)
    }))
    .sort((a, b) => a.condition.localeCompare(b.condition));
}

function groupSpatialAnswers(
  entries: { participantId: string; trial: Trial }[],
  dimension: "frameOfReference" | "objectFocus"
) {
  const groups = new Map<string, { participantId: string; trial: Trial }[]>();

  for (const entry of entries) {
    const answers = asArray(entry.trial.spatialAnswers);
    const names = Array.from(
      new Set(answers.map((answer) => asString(answer[dimension], "unknown")))
    );

    for (const name of names) {
      const filteredAnswers = answers.filter(
        (answer) => asString(answer[dimension], "unknown") === name
      );
      const filteredTrial: Trial = {
        ...entry.trial,
        spatialAnswers: filteredAnswers,
        spatialAccuracyScore: filteredAnswers.filter((answer) => answer.isCorrect === true).length,
        spatialEligibleQuestionCount: filteredAnswers.filter(
          (answer) =>
            answer.correctAnswer != null &&
            answer.isUncertain !== true &&
            asString(answer.answer) !== "Not sure"
        ).length
      };
      groups.set(name, [
        ...(groups.get(name) ?? []),
        { participantId: entry.participantId, trial: filteredTrial }
      ]);
    }
  }

  return Array.from(groups.entries())
    .map(([name, group]) => summarizeTrials(name, group))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function trialAccuracyPercent(trial: Trial) {
  const storedProportion = asNumber(trial.spatialAccuracyProportion);
  if (storedProportion !== null) return round(storedProportion * 100);

  const correct = asNumber(trial.spatialAccuracyScore);
  const eligible = asNumber(trial.spatialEligibleQuestionCount);
  return correct !== null && eligible !== null && eligible > 0
    ? round((correct / eligible) * 100)
    : null;
}

function trialMetricSummary(trial: Trial): TrialMetricSummary {
  return {
    trialIndex: asNumber(trial.trialIndex),
    imageId: asString(trial.imageId) || asString(trial.uuid),
    imageFilename: asString(trial.imageFilename),
    condition: asString(trial.condition, "unknown"),
    complexityLevel: asString(trial.complexityLevel, "unknown"),
    complexityScore: asNumber(trial.complexityScore),
    baselineSpatialExpressionCount: asNumber(trial.baselineSpatialExpressionCount),
    spatialSpatialExpressionCount: asNumber(trial.spatialSpatialExpressionCount),
    presentedSpatialExpressionCount: asNumber(trial.spatialExpressionCount),
    spatialKendallTau: asNumber(trial.spatialKendallTau),
    presentedKendallTau: asNumber(trial.presentedKendallTau),
    spatialAccuracyPercent: trialAccuracyPercent(trial),
    replayCount: asNumber(trial.replayCount),
    responseTimeSeconds: responseTimeSeconds(trial)
  };
}

function participantAnalysis(record: StudyRecord): ParticipantAnalysis {
  const participantId = participantIdFor(record);
  const entries = asArray(record.comprehensionResponses).map((trial) => ({
    participantId,
    trial: enrichTrialMetrics(trial)
  }));
  const flags: string[] = [];
  const trials = entries.map((entry) => entry.trial);

  if (trials.length === 0) flags.push("No comprehension trials recorded.");
  if (trials.some((trial) => asArray(trial.spatialAnswers).length === 0)) {
    flags.push("One or more trials have no spatial answers.");
  }
  if (trials.some((trial) => ratingValue(trial, "ratings", "overallSceneClarity") === null)) {
    flags.push("One or more trials are missing experience ratings.");
  }
  if (trials.some((trial) => ratingValue(trial, "workload", "mentalDemand") === null)) {
    flags.push("One or more trials are missing per-image workload ratings.");
  }
  if (
    trials.some(
      (trial) =>
        asNumber(trial.baselineSpatialExpressionCount) === null ||
        asNumber(trial.spatialSpatialExpressionCount) === null ||
        asNumber(trial.spatialKendallTau) === null
    )
  ) {
    flags.push("One or more trials are missing description metrics.");
  }
  if (trials.some((trial) => asNumber(trial.complexityScore) === null)) {
    flags.push("One or more trials are missing a complexity score.");
  }
  const conditions = new Set(trials.map((trial) => asString(trial.condition)).filter(Boolean));
  if (conditions.size > 2) flags.push("Legacy pilot record contains more than two comprehension conditions.");

  return {
    participantId,
    recordId: asString(record.id),
    schemaVersion: asNumber(record.schemaVersion),
    appVersion: asString(record.appVersion),
    testMode: record.testMode === true,
    sequenceGroup: asString(asObject(record.participant).sequenceGroup),
    overall: summarizeTrials("All conditions", entries),
    byCondition: groupTrials(entries, (trial) => [asString(trial.condition, "unknown")]),
    trialMetrics: trials.map(trialMetricSummary),
    preference: summarizePreferences([record]),
    preferenceExplanations: asArray(record.preferenceResponses).map((response) => ({
      preferredCondition: asString(response.preferredCondition),
      explanation: asString(response.explanation)
    })),
    freeRecallResponses: trials.map((trial) => ({
      imageId: asString(trial.imageId),
      condition: asString(trial.condition),
      response: asString(trial.freeRecall)
    })),
    interviewResponses: asArray(record.interviewResponses).map((response) => ({
      question: asString(response.question),
      answer: asString(response.answer)
    })),
    dataQualityFlags: flags
  };
}

export function analyzeStudyRecords(records: StudyRecord[]): StudyAnalysis {
  const included = records.filter((record) => record.testMode !== true);
  const entries = included.flatMap((record) => {
    const participantId = participantIdFor(record);
    return asArray(record.comprehensionResponses).map((trial) => ({
      participantId,
      trial: enrichTrialMetrics(trial)
    }));
  });

  return {
    generatedAt: new Date().toISOString(),
    planVersion: "current-schema-v11-description-metrics-2026-08",
    includedRecordCount: included.length,
    excludedTestRecordCount: records.length - included.length,
    participantCount: new Set(included.map(participantIdFor)).size,
    preferenceTrialCount: included.reduce(
      (sum, record) => sum + asArray(record.preferenceResponses).length,
      0
    ),
    noPreferenceCount: included.reduce(
      (sum, record) =>
        sum +
        asArray(record.preferenceResponses).filter(
          (preference) =>
            asString(preference.preferenceChoice) === "none" ||
            asString(preference.preferredCondition) === "none"
        ).length,
      0
    ),
    overall: summarizeTrials("All participants", entries),
    byCondition: groupTrials(entries, (trial) => [asString(trial.condition, "unknown")]),
    byComplexity: groupTrials(entries, (trial) => [asString(trial.complexityLevel, "unknown")]),
    bySpatialExpressionCount: groupTrials(entries, (trial) => {
      const count = asNumber(trial.spatialExpressionCount);
      return [count === null ? "Missing" : String(count)];
    }).sort((a, b) => {
      if (a.name === "Missing") return 1;
      if (b.name === "Missing") return -1;
      return Number(a.name) - Number(b.name);
    }),
    byFrameOfReference: groupSpatialAnswers(entries, "frameOfReference"),
    byObjectFocus: groupSpatialAnswers(entries, "objectFocus"),
    preference: summarizePreferences(included),
    participants: included.map(participantAnalysis),
    analysisNotes: [
      "Test-mode records are excluded from aggregate results.",
      "Not sure responses are counted as uncertainty and excluded from eligible spatial-accuracy denominators when the stored eligible count is unavailable.",
      "Free recall and interview responses are displayed for manual qualitative coding; the app does not invent automated semantic-gist or recall scores.",
      "Current schema v11 uses one combined pilot-comprehension and preference workflow, fixed pilot conditions, composite trial IDs, description metrics, and total plus frame-specific spatial accuracy.",
      "Description-metric summaries use stored spatial-expression counts, Kendall's tau, and complexity scores; missing values are backfilled only when a saved image identifier matches the current stimuli file.",
      "Legacy pilot records with additional conditions, effort ratings, or longer rankings remain readable and are labeled by their stored condition names.",
      "The dashboard provides descriptive statistics. Confirm assumptions and use participant/image-aware models or corrected paired tests in the final statistical workflow."
    ]
  };
}
