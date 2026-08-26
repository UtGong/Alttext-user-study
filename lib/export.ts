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
    "sessionId",
    "trialId",
    "studyMode",
    "sequenceGroup",
    "selectedAudioSpeed",
    "selectedVoiceURI",
    "trialIndex",
    "randomizedDisplayPosition",
    "imageFilename",
    "uuid",
    "role",
    "pilotIndex",
    "rowIndex",
    "complexityLevel",
    "complexityScore",
    "imageSet",
    "condition",
    "baselineSpatialExpressionCount",
    "spatialSpatialExpressionCount",
    "spatialKendallTau",
    "spatialExpressionCount",
    "presentedKendallTau",
    "replayCount",
    "startedAt",
    "audioStartedAt",
    "audioEndedAt",
    "submittedAt",
    "responseTimeMs",
    "descriptionText",
    "freeRecall",
    "freeRecallQuestion",
    "spatialAccuracyScore",
    "spatialEligibleQuestionCount",
    "spatialAccuracyProportion",
    "intrinsicCorrect",
    "intrinsicEligible",
    "intrinsicAccuracyProportion",
    "absoluteCorrect",
    "absoluteEligible",
    "absoluteAccuracyProportion",
    "overallSceneClarity",
    "overallSceneClarityLabel",
    "spatialRelationsConfidence",
    "spatialRelationsConfidenceLabel",
    "contentComprehension",
    "contentComprehensionLabel",
    "ratingQuestionsJson",
    "workloadMentalDemand",
    "workloadMentalDemandLabel",
    "workloadFrustration",
    "workloadFrustrationLabel",
    "workloadQuestionsJson",
    "spatialAnswersJson",
    "audioPlayEventsJson",
    "stepTimestampsJson"
  ];

  const rows = state.comprehensionResponses.map((response) => ({
    participantId: response.participantId,
    sessionId: response.sessionId,
    trialId: response.trialId,
    studyMode: response.studyMode,
    sequenceGroup: response.sequenceGroup,
    selectedAudioSpeed: response.selectedAudioSpeed,
    selectedVoiceURI: response.selectedVoiceURI,
    trialIndex: response.trialIndex,
    randomizedDisplayPosition: response.randomizedDisplayPosition,
    imageFilename: response.imageFilename,
    uuid: response.uuid,
    role: response.role,
    pilotIndex: response.pilotIndex,
    rowIndex: response.rowIndex,
    complexityLevel: response.complexityLevel,
    complexityScore: response.complexityScore,
    imageSet: response.imageSet,
    condition: response.condition,
    baselineSpatialExpressionCount: response.baselineSpatialExpressionCount,
    spatialSpatialExpressionCount: response.spatialSpatialExpressionCount,
    spatialKendallTau: response.spatialKendallTau,
    spatialExpressionCount: response.spatialExpressionCount,
    presentedKendallTau: response.presentedKendallTau,
    replayCount: response.replayCount,
    startedAt: response.startedAt,
    audioStartedAt: response.audioStartedAt,
    audioEndedAt: response.audioEndedAt,
    submittedAt: response.submittedAt,
    responseTimeMs: response.responseTimeMs,
    descriptionText: response.descriptionText,
    freeRecall: response.freeRecall,
    freeRecallQuestion: response.freeRecallQuestion,
    spatialAccuracyScore: response.spatialAccuracyScore,
    spatialEligibleQuestionCount: response.spatialEligibleQuestionCount,
    spatialAccuracyProportion: response.spatialAccuracyProportion,
    intrinsicCorrect: response.intrinsicAccuracy.correct,
    intrinsicEligible: response.intrinsicAccuracy.eligible,
    intrinsicAccuracyProportion: response.intrinsicAccuracy.proportion,
    absoluteCorrect: response.absoluteAccuracy.correct,
    absoluteEligible: response.absoluteAccuracy.eligible,
    absoluteAccuracyProportion: response.absoluteAccuracy.proportion,
    overallSceneClarity: response.ratings.overallSceneClarity?.value,
    overallSceneClarityLabel: response.ratings.overallSceneClarity?.label,
    spatialRelationsConfidence: response.ratings.spatialRelationsConfidence?.value,
    spatialRelationsConfidenceLabel: response.ratings.spatialRelationsConfidence?.label,
    contentComprehension: response.ratings.contentComprehension?.value,
    contentComprehensionLabel: response.ratings.contentComprehension?.label,
    ratingQuestionsJson: response.ratingQuestions,
    workloadMentalDemand: response.workload.mentalDemand?.value,
    workloadMentalDemandLabel: response.workload.mentalDemand?.label,
    workloadFrustration: response.workload.frustration?.value,
    workloadFrustrationLabel: response.workload.frustration?.label,
    workloadQuestionsJson: response.workloadQuestions,
    spatialAnswersJson: response.spatialAnswers,
    audioPlayEventsJson: response.audioPlayEvents,
    stepTimestampsJson: response.stepTimestamps
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
    "sessionId",
    "trialId",
    "studyMode",
    "sequenceGroup",
    "selectedAudioSpeed",
    "selectedVoiceURI",
    "trialIndex",
    "randomizedDisplayPosition",
    "uuid",
    "role",
    "pilotIndex",
    "complexityLevel",
    "complexityScore",
    "imageSet",
    "condition",
    "submittedAt",
    "mentalDemand",
    "mentalDemandLabel",
    "frustration",
    "frustrationLabel"
  ];

  const rows = state.comprehensionResponses.map((response) => ({
    participantId: response.participantId,
    sessionId: response.sessionId,
    trialId: response.trialId,
    studyMode: response.studyMode,
    sequenceGroup: response.sequenceGroup,
    selectedAudioSpeed: response.selectedAudioSpeed,
    selectedVoiceURI: response.selectedVoiceURI,
    trialIndex: response.trialIndex,
    randomizedDisplayPosition: response.randomizedDisplayPosition,
    uuid: response.uuid,
    role: response.role,
    pilotIndex: response.pilotIndex,
    complexityLevel: response.complexityLevel,
    complexityScore: response.complexityScore,
    imageSet: response.imageSet,
    condition: response.condition,
    submittedAt: response.submittedAt,
    mentalDemand: response.workload.mentalDemand?.value,
    mentalDemandLabel: response.workload.mentalDemand?.label,
    frustration: response.workload.frustration?.value,
    frustrationLabel: response.workload.frustration?.label
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
    "sessionId",
    "trialId",
    "studyMode",
    "sequenceGroup",
    "selectedAudioSpeed",
    "selectedVoiceURI",
    "trialIndex",
    "imageFilename",
    "uuid",
    "role",
    "imageSet",
    "rowIndex",
    "complexityLevel",
    "complexityScore",
    "submittedAt",
    "randomizedOrderJson",
    "descriptionACondition",
    "descriptionAText",
    "descriptionASpatialExpressionCount",
    "descriptionAKendallTau",
    "descriptionBCondition",
    "descriptionBText",
    "descriptionBSpatialExpressionCount",
    "descriptionBKendallTau",
    "baselineSpatialExpressionCount",
    "spatialSpatialExpressionCount",
    "spatialKendallTau",
    "playbackEventsJson",
    "replayCountsJson",
    "preferenceChoice",
    "preferenceResponse",
    "bestChoice",
    "preferredCondition",
    "rankingQuestion",
    "rankingFirst",
    "rankingSecond",
    "startedAt",
    "responseTimeMs",
    "explanationQuestion",
    "explanation"
  ];

  const rows = state.preferenceResponses.map((response) => {
    const descriptionA = response.randomizedOrder.find((item) => item.label === "A");
    const descriptionB = response.randomizedOrder.find((item) => item.label === "B");

    return {
      participantId: response.participantId,
      sessionId: response.sessionId,
      trialId: response.trialId,
      studyMode: response.studyMode,
      sequenceGroup: response.sequenceGroup,
      selectedAudioSpeed: response.selectedAudioSpeed,
      selectedVoiceURI: response.selectedVoiceURI,
      trialIndex: response.trialIndex,
      imageFilename: response.imageFilename,
      uuid: response.uuid,
      role: response.role,
      imageSet: response.imageSet,
      rowIndex: response.rowIndex,
      complexityLevel: response.complexityLevel,
      complexityScore: response.complexityScore,
      submittedAt: response.submittedAt,
      randomizedOrderJson: response.randomizedOrder,
      descriptionACondition: descriptionA?.condition,
      descriptionAText: descriptionA?.descriptionText,
      descriptionASpatialExpressionCount: descriptionA?.spatialExpressionCount,
      descriptionAKendallTau: descriptionA?.kendallTau,
      descriptionBCondition: descriptionB?.condition,
      descriptionBText: descriptionB?.descriptionText,
      descriptionBSpatialExpressionCount: descriptionB?.spatialExpressionCount,
      descriptionBKendallTau: descriptionB?.kendallTau,
      baselineSpatialExpressionCount: response.baselineSpatialExpressionCount,
      spatialSpatialExpressionCount: response.spatialSpatialExpressionCount,
      spatialKendallTau: response.spatialKendallTau,
      playbackEventsJson: response.playbackEvents,
      replayCountsJson: response.replayCounts,
      preferenceChoice: response.preferenceChoice,
      preferenceResponse: response.preferenceResponse,
      bestChoice: response.bestChoice,
      preferredCondition: response.preferredCondition,
      rankingQuestion: response.rankingQuestion,
      rankingFirst: response.ranking.first,
      rankingSecond: response.ranking.second,
      startedAt: response.startedAt,
      responseTimeMs: response.responseTimeMs,
      explanationQuestion: response.explanationQuestion,
      explanation: response.explanation
    };
  });

  downloadFile(
    `blv-study-preference-${timestamp}.csv`,
    toCsv(headers, rows),
    "text/csv"
  );
}

export function exportInterviewCsv(state: StudyState) {
  const timestamp = timestampForFilename();
  const headers = [
    "participantId",
    "sequenceGroup",
    "questionId",
    "question",
    "answer",
    "submittedAt"
  ];

  const rows = state.interviewResponses.map((response) => ({
    participantId: state.participant.participantId,
    sequenceGroup: state.participant.sequenceGroup,
    questionId: response.questionId,
    question: response.question,
    answer: response.answer,
    submittedAt: response.submittedAt
  }));

  downloadFile(
    `blv-study-interview-${timestamp}.csv`,
    toCsv(headers, rows),
    "text/csv"
  );
}

export function exportAllCsv(state: StudyState) {
  exportComprehensionCsv(state);
  exportWorkloadCsv(state);
  exportPreferenceCsv(state);
  exportInterviewCsv(state);
}

/**
 * Backward-compatible name, in case app/page.tsx still imports exportTrialCsv.
 * This now exports all CSV files, not only comprehension trials.
 */
export function exportTrialCsv(state: StudyState) {
  exportAllCsv(state);
}
