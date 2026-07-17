import { StudyState } from "@/types/study";

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";

  const stringValue =
    typeof value === "object" ? JSON.stringify(value) : String(value);

  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toCsv(headers: string[], rows: Record<string, unknown>[]) {
  const headerRow = headers.map(csvEscape).join(",");

  const bodyRows = rows.map((row) =>
    headers.map((header) => csvEscape(row[header])).join(",")
  );

  return [headerRow, ...bodyRows].join("\n");
}

function timestampForFilename() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export function exportJson(state: StudyState) {
  const timestamp = timestampForFilename();

  downloadFile(
    `blv-study-full-export-${timestamp}.json`,
    JSON.stringify(state, null, 2),
    "application/json"
  );
}

export function exportComprehensionCsv(state: StudyState) {
  const timestamp = timestampForFilename();

  const headers = [
    "participantId",
    "sequenceGroup",
    "selectedAudioSpeed",
    "selectedVoiceURI",
    "trialIndex",
    "randomizedDisplayPosition",
    "uuid",
    "rowIndex",
    "complexityLevel",
    "imageSet",
    "condition",
    "replayCount",
    "startedAt",
    "audioStartedAt",
    "audioEndedAt",
    "submittedAt",
    "descriptionText",
    "freeRecall",
    "gistAnswer",
    "overallSceneClarity",
    "spatialRelationsConfidence",
    "contentComprehension",
    "workloadMentalDemand",
    "spatialAnswersJson"
  ];

  const rows = state.comprehensionResponses.map((response) => ({
    participantId: response.participantId,
    sequenceGroup: response.sequenceGroup,
    selectedAudioSpeed: response.selectedAudioSpeed,
    selectedVoiceURI: response.selectedVoiceURI,
    trialIndex: response.trialIndex,
    randomizedDisplayPosition: response.randomizedDisplayPosition,
    uuid: response.uuid,
    rowIndex: response.rowIndex,
    complexityLevel: response.complexityLevel,
    imageSet: response.imageSet,
    condition: response.condition,
    replayCount: response.replayCount,
    startedAt: response.startedAt,
    audioStartedAt: response.audioStartedAt,
    audioEndedAt: response.audioEndedAt,
    submittedAt: response.submittedAt,
    descriptionText: response.descriptionText,
    freeRecall: response.freeRecall,
    gistAnswer: response.gistAnswer,
    overallSceneClarity: response.ratings.overallSceneClarity,
    spatialRelationsConfidence: response.ratings.spatialRelationsConfidence,
    contentComprehension: response.ratings.contentComprehension,
    workloadMentalDemand: response.workload.mentalDemand,
    spatialAnswersJson: response.spatialAnswers
  }));

  downloadFile(
    `blv-study-comprehension-${timestamp}.csv`,
    toCsv(headers, rows),
    "text/csv"
  );
}

export function exportWorkloadCsv(state: StudyState) {
  const timestamp = timestampForFilename();

  const headers = [
    "participantId",
    "sequenceGroup",
    "selectedAudioSpeed",
    "selectedVoiceURI",
    "trialIndex",
    "randomizedDisplayPosition",
    "uuid",
    "rowIndex",
    "complexityLevel",
    "imageSet",
    "condition",
    "submittedAt",
    "mentalDemand"
  ];

  const rows = state.comprehensionResponses.map((response) => ({
    participantId: response.participantId,
    sequenceGroup: response.sequenceGroup,
    selectedAudioSpeed: response.selectedAudioSpeed,
    selectedVoiceURI: response.selectedVoiceURI,
    trialIndex: response.trialIndex,
    randomizedDisplayPosition: response.randomizedDisplayPosition,
    uuid: response.uuid,
    rowIndex: response.rowIndex,
    complexityLevel: response.complexityLevel,
    imageSet: response.imageSet,
    condition: response.condition,
    submittedAt: response.submittedAt,
    mentalDemand: response.workload.mentalDemand
  }));

  downloadFile(
    `blv-study-workload-${timestamp}.csv`,
    toCsv(headers, rows),
    "text/csv"
  );
}

export function exportPreferenceCsv(state: StudyState) {
  const timestamp = timestampForFilename();

  const headers = [
    "participantId",
    "sequenceGroup",
    "selectedAudioSpeed",
    "selectedVoiceURI",
    "trialIndex",
    "uuid",
    "rowIndex",
    "complexityLevel",
    "submittedAt",
    "randomizedOrderJson",
    "replayCountsJson",
    "bestChoice",
    "rankingFirst",
    "rankingSecond",
    "rankingThird",
    "explanation"
  ];

  const rows = state.preferenceResponses.map((response) => ({
    participantId: response.participantId,
    sequenceGroup: response.sequenceGroup,
    selectedAudioSpeed: response.selectedAudioSpeed,
    selectedVoiceURI: response.selectedVoiceURI,
    trialIndex: response.trialIndex,
    uuid: response.uuid,
    rowIndex: response.rowIndex,
    complexityLevel: response.complexityLevel,
    submittedAt: response.submittedAt,
    randomizedOrderJson: response.randomizedOrder,
    replayCountsJson: response.replayCounts,
    bestChoice: response.bestChoice,
    rankingFirst: response.ranking.first,
    rankingSecond: response.ranking.second,
    rankingThird: response.ranking.third,
    explanation: response.explanation
  }));

  downloadFile(
    `blv-study-preference-${timestamp}.csv`,
    toCsv(headers, rows),
    "text/csv"
  );
}

export function exportAllCsv(state: StudyState) {
  exportComprehensionCsv(state);
  exportWorkloadCsv(state);
  exportPreferenceCsv(state);
}

/**
 * Backward-compatible name, in case app/page.tsx still imports exportTrialCsv.
 * This now exports all CSV files, not only comprehension trials.
 */
export function exportTrialCsv(state: StudyState) {
  exportAllCsv(state);
}
