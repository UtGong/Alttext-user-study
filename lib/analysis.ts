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
  overall: GroupSummary;
  byCondition: GroupSummary[];
  byComplexity: GroupSummary[];
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
  const conditions = new Map<string, { appearances: number; first: number; ranks: number[] }>();

  for (const record of records) {
    for (const preference of asArray(record.preferenceResponses)) {
      const labelToCondition = new Map(
        asArray(preference.randomizedOrder).map((item) => [
          asString(item.label),
          asString(item.condition, "unknown")
        ])
      );
      const ranking = asObject(preference.ranking);
      const fallbackFirst = asString(preference.bestChoice);

      for (const condition of Array.from(labelToCondition.values())) {
        const current = conditions.get(condition) ?? { appearances: 0, first: 0, ranks: [] };
        current.appearances += 1;
        conditions.set(condition, current);
      }

      rankKeys.forEach((key, index) => {
        const label = asString(ranking[key]) || (index === 0 ? fallbackFirst : "");
        const condition = labelToCondition.get(label) || (index === 0 ? asString(preference.preferredCondition) : "");
        if (!condition) return;
        const current = conditions.get(condition) ?? { appearances: 0, first: 0, ranks: [] };
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
      }, {})
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

function participantAnalysis(record: StudyRecord): ParticipantAnalysis {
  const participantId = participantIdFor(record);
  const entries = asArray(record.comprehensionResponses).map((trial) => ({ participantId, trial }));
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
    return asArray(record.comprehensionResponses).map((trial) => ({ participantId, trial }));
  });

  return {
    generatedAt: new Date().toISOString(),
    planVersion: "current-schema-v7-descriptive-2026-08",
    includedRecordCount: included.length,
    excludedTestRecordCount: records.length - included.length,
    participantCount: new Set(included.map(participantIdFor)).size,
    overall: summarizeTrials("All participants", entries),
    byCondition: groupTrials(entries, (trial) => [asString(trial.condition, "unknown")]),
    byComplexity: groupTrials(entries, (trial) => [asString(trial.complexityLevel, "unknown")]),
    byFrameOfReference: groupSpatialAnswers(entries, "frameOfReference"),
    byObjectFocus: groupSpatialAnswers(entries, "objectFocus"),
    preference: summarizePreferences(included),
    participants: included.map(participantAnalysis),
    analysisNotes: [
      "Test-mode records are excluded from aggregate results.",
      "Not sure responses are counted as uncertainty and excluded from eligible spatial-accuracy denominators when the stored eligible count is unavailable.",
      "Free recall and interview responses are displayed for manual qualitative coding; the app does not invent automated semantic-gist or recall scores.",
      "Current schema v7 uses baseline and spatial comprehension conditions, four spatial questions per image, three experience ratings, and mental-demand/frustration workload items.",
      "Legacy pilot records with additional conditions, effort ratings, or longer rankings remain readable and are labeled by their stored condition names.",
      "The dashboard provides descriptive statistics. Confirm assumptions and use participant/image-aware models or corrected paired tests in the final statistical workflow."
    ]
  };
}
