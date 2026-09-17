import { calculateSpatialAccuracy } from "@/lib/scoring";
import {
  createStimulusTrialId,
  getComprehensionStimuli,
  getConditionForStimulus,
  getPreferenceConditions,
  preferenceStimuli
} from "@/lib/stimuli";
import { DescriptionLabel, LikertResponse, StudyState } from "@/types/study";

const labels: DescriptionLabel[] = ["A", "B"];
const agreement: LikertResponse = { value: 4, label: "Very" };
const workload: LikertResponse = { value: 2, label: "Low" };

export function createMockStudyData(state: StudyState): Partial<StudyState> {
  const studyMode = state.studyMode;
  const now = new Date().toISOString();
  const sessionId = state.sessionId || `mock-session-${Date.now()}`;
  const participantId = state.participant.participantId.trim() || `TEST_${Date.now()}`;
  const participant = {
    ...state.participant,
    participantId,
    visionBackground: state.participant.visionBackground || "test-data",
    screenReader: state.participant.screenReader || "test-data",
    imageDescriptionExperience: state.participant.imageDescriptionExperience || "test-data"
  };
  const activeComprehensionStimuli = getComprehensionStimuli();

  const comprehensionResponses = activeComprehensionStimuli.map((stimulus, index) => {
    const condition = getConditionForStimulus(participant.sequenceGroup, stimulus, state.selectedConditions);
    const spatialAnswers = (stimulus.spatialQuestions ?? []).map((question) => ({
      questionId: question.id,
      frameOfReference: question.frameOfReference,
      objectFocus: question.objectFocus ?? "main" as const,
      question: question.question,
      answer: question.correctAnswer ?? question.options[0] ?? "",
      correctAnswer: question.correctAnswer ?? null,
      isCorrect: question.correctAnswer ? true : null,
      isUncertain: false,
      requiresManualCoding: Boolean(question.requiresManualCoding)
    }));
    const accuracy = calculateSpatialAccuracy(spatialAnswers);

    return {
      participantId, sessionId, trialId: createStimulusTrialId(stimulus),
      studyMode,
      sequenceGroup: participant.sequenceGroup, selectedConditions: state.selectedConditions, testMode: true,
      selectedAudioSpeed: state.selectedAudioSpeed, selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: index + 1, randomizedDisplayPosition: index + 1,
      imageId: stimulus.uuid, imageFilename: stimulus.imageFilename, uuid: stimulus.uuid,
      role: "comprehension" as const,
      pilotIndex: stimulus.pilotIndex ?? null,
      rowIndex: stimulus.rowIndex, complexityLevel: stimulus.complexityLevel, complexityScore: stimulus.complexityScore ?? null,
      imageSet: stimulus.imageSet, condition, descriptionText: stimulus.descriptions[condition],
      baselineSpatialExpressionCount: stimulus.descriptionMetrics?.baseline?.spatialExpressionCount ?? null,
      spatialSpatialExpressionCount: stimulus.descriptionMetrics?.spatial?.spatialExpressionCount ?? null,
      spatialKendallTau: stimulus.descriptionMetrics?.spatial?.kendallTau ?? null,
      spatialExpressionCount: stimulus.descriptionMetrics?.[condition]?.spatialExpressionCount ?? null,
      presentedKendallTau: stimulus.descriptionMetrics?.[condition]?.kendallTau ?? null,
      replayCount: 0, replayed: false, audioPlayEvents: [], startedAt: now,
      submittedAt: now, responseTimeMs: 0,
      freeRecallQuestion: "Describe the scene in your own words. Mention what you remember, including the people or objects present, and how they were arranged in relation to each other.",
      freeRecall: "Mock free-recall response.", spatialAnswers,
      spatialAccuracyScore: accuracy.overall.correct,
      spatialEligibleQuestionCount: accuracy.overall.eligible,
      spatialAccuracyProportion: accuracy.overall.proportion,
      intrinsicAccuracy: accuracy.intrinsic, absoluteAccuracy: accuracy.absolute,
      ratings: { overallSceneClarity: agreement, spatialRelationsConfidence: agreement, contentComprehension: agreement },
      ratingQuestions: { overallSceneClarity: "I could picture the overall scene in my mind.", spatialRelationsConfidence: "I could identify the spatial relationships among the described elements.", contentComprehension: "The description gave me enough information about where things were in the image." },
      workload: { mentalDemand: workload, frustration: workload },
      workloadQuestions: { mentalDemand: "How mentally demanding was it to understand this image description?", frustration: "How frustrated did you feel while understanding this image description?" },
      stepTimestamps: { mock: { startedAt: now, completedAt: now, responseTimeMs: 0 } }
    };
  });

  const preferenceResponses = preferenceStimuli.map((stimulus, index) => {
    const conditions = getPreferenceConditions(stimulus, state.selectedConditions);
    const orderedConditions = index % 2 === 0 ? conditions : [...conditions].reverse();
    const randomizedOrder = orderedConditions.map((condition, position) => ({
      label: labels[position], displayPosition: position + 1, condition,
      descriptionText: stimulus.descriptions[condition],
      spatialExpressionCount: stimulus.descriptionMetrics?.[condition]?.spatialExpressionCount ?? null,
      kendallTau: stimulus.descriptionMetrics?.[condition]?.kendallTau ?? null
    }));
    const preferredCondition = randomizedOrder[0].condition;

    return {
      participantId, sessionId, trialId: createStimulusTrialId(stimulus), studyMode,
      sequenceGroup: participant.sequenceGroup, selectedConditions: state.selectedConditions, testMode: true,
      selectedAudioSpeed: state.selectedAudioSpeed, selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: index + 1, imageId: stimulus.uuid, imageFilename: stimulus.imageFilename,
      uuid: stimulus.uuid, role: "preference" as const, imageSet: "preference" as const,
      rowIndex: stimulus.rowIndex, complexityLevel: stimulus.complexityLevel, complexityScore: stimulus.complexityScore ?? null,
      randomizedOrder,
      baselineSpatialExpressionCount: stimulus.descriptionMetrics?.baseline?.spatialExpressionCount ?? null,
      spatialSpatialExpressionCount: stimulus.descriptionMetrics?.spatial?.spatialExpressionCount ?? null,
      spatialKendallTau: stimulus.descriptionMetrics?.spatial?.kendallTau ?? null,
      playbackEvents: [], replayCounts: { A: 0, B: 0 },
      preferenceChoice: "A" as const, preferenceResponse: "Description A" as const,
      bestChoice: "A" as const, preferredCondition,
      rankingQuestion: "Which description communicates the spatial arrangement more clearly?",
      ranking: { first: "A" as const, second: "B" as const },
      explanationQuestion: "What made the spatial arrangement clearer, or why did you have no preference?",
      explanation: "Mock preference explanation.", startedAt: now, responseTimeMs: 0, submittedAt: now
    };
  });

  const interviewQuestions = [
    "Take a moment to reflect about when a description helped you build a clear mental map of a scene right away. What made it work so well?",
    "Did listening to these descriptions ever feel mentally tiring or overwhelming?",
    "If yes, what was happening?",
    "If not, what helped make the information easy to digest?",
    "If you were designing descriptions for artworks, what is the most important rule you would recommend for how spatial layouts should be described?"
  ];

  const interviewResponses = interviewQuestions.map((question, index) => ({
    questionId: `interview-${index + 1}`,
    question,
    answer: `Mock interview response ${index + 1}.`,
    submittedAt: now
  }));

  return {
    phase: "complete", testMode: true, studyMode, sessionId, participant,
    practiceQuestion: "Please describe the scene in your own words.",
    practiceResponse: "Mock practice response.",
    comprehensionOrder: activeComprehensionStimuli.map(createStimulusTrialId),
    comprehensionIndex: activeComprehensionStimuli.length, comprehensionResponses,
    preferenceIndex: preferenceResponses.length, preferenceResponses, interviewResponses
  };
}
