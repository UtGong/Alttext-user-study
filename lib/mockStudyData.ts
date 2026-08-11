import { getConditionForStimulus, comprehensionStimuli, preferenceStimuli } from "@/lib/stimuli";
import { Condition, DescriptionLabel, LikertResponse, StudyState } from "@/types/study";

const conditions: Condition[] = ["baseline", "spatial", "semantic", "spatial2d"];
const labels: DescriptionLabel[] = ["A", "B", "C", "D"];
const agreement: LikertResponse = { value: 4, label: "Agree" };
const workload: LikertResponse = { value: 2, label: "Low" };

export function createMockStudyData(state: StudyState): Partial<StudyState> {
  const now = new Date().toISOString();
  const participantId = state.participant.participantId.trim() || `TEST_${Date.now()}`;
  const participant = {
    ...state.participant,
    participantId,
    visionBackground: state.participant.visionBackground || "test-data",
    screenReader: state.participant.screenReader || "test-data",
    imageDescriptionExperience: state.participant.imageDescriptionExperience || "test-data"
  };

  const comprehensionResponses = comprehensionStimuli.map((stimulus, index) => {
    const condition = getConditionForStimulus(participant.sequenceGroup, stimulus);
    const spatialAnswers = (stimulus.spatialQuestions ?? []).map((question) => ({
      questionId: question.id,
      frameOfReference: question.frameOfReference,
      objectFocus: question.objectFocus ?? "main" as const,
      question: question.question,
      answer: question.correctAnswer ?? question.options[0] ?? "",
      correctAnswer: question.correctAnswer ?? null,
      isCorrect: question.correctAnswer ? true : null,
      requiresManualCoding: Boolean(question.requiresManualCoding)
    }));
    const eligible = spatialAnswers.filter((answer) => answer.correctAnswer !== null);

    return {
      participantId, sequenceGroup: participant.sequenceGroup, testMode: true,
      selectedAudioSpeed: state.selectedAudioSpeed, selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: index + 1, randomizedDisplayPosition: index + 1,
      imageId: stimulus.uuid, imageFilename: stimulus.imageFilename, uuid: stimulus.uuid,
      rowIndex: stimulus.rowIndex, complexityLevel: stimulus.complexityLevel, imageSet: stimulus.imageSet,
      condition, descriptionText: stimulus.descriptions[condition], replayCount: 0, replayed: false,
      audioPlayEvents: [], startedAt: now, submittedAt: now,
      gistAnswer: "Mock gist response", gistScore: null, freeRecall: "Mock free-recall response.",
      spatialAnswers, spatialAccuracyScore: eligible.length, spatialEligibleQuestionCount: eligible.length,
      ratings: { overallSceneClarity: agreement, spatialRelationsConfidence: agreement, contentComprehension: agreement },
      workload: { mentalDemand: workload, effort: workload, frustration: workload },
      stepTimestamps: { mock: { startedAt: now, completedAt: now, responseTimeMs: 0 } }
    };
  });

  const preferenceResponses = preferenceStimuli.map((stimulus, index) => {
    const rotated = conditions.map((_, offset) => conditions[(index + offset) % conditions.length]);
    const randomizedOrder = rotated.map((condition, position) => ({
      label: labels[position], displayPosition: position + 1, condition,
      descriptionText: stimulus.descriptions[condition]
    }));

    return {
      participantId, sequenceGroup: participant.sequenceGroup, testMode: true,
      selectedAudioSpeed: state.selectedAudioSpeed, selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: index + 1, imageId: stimulus.uuid, imageFilename: stimulus.imageFilename,
      uuid: stimulus.uuid, rowIndex: stimulus.rowIndex, complexityLevel: stimulus.complexityLevel,
      randomizedOrder, playbackEvents: [], replayCounts: { A: 0, B: 0, C: 0, D: 0 },
      bestChoice: "A" as const, preferredCondition: rotated[0],
      ranking: { first: "A" as const, second: "B" as const, third: "C" as const, fourth: "D" as const },
      explanation: "Mock preference explanation.", startedAt: now, responseTimeMs: 0, submittedAt: now
    };
  });

  const interviewQuestions = [
    "Which descriptions helped you understand the image best?",
    "Did the order of information affect how you built the image in your mind?",
    "Were spatial descriptions helpful, confusing, or unnecessary?",
    "Were semantic groupings helpful, confusing, or unnecessary?",
    "What spatial or orientation details were missing?",
    "Did any description feel too long or hard to follow?",
    "In real use, what kind of image description would you prefer?"
  ];

  const interviewResponses = interviewQuestions.map((question, index) => ({
    questionId: `interview-${index + 1}`,
    question,
    answer: `Mock interview response ${index + 1}.`,
    submittedAt: now
  }));

  return {
    phase: "complete", testMode: true, participant,
    comprehensionOrder: comprehensionStimuli.map((stimulus) => stimulus.uuid),
    comprehensionIndex: comprehensionStimuli.length, comprehensionResponses,
    preferenceIndex: preferenceStimuli.length, preferenceResponses, interviewResponses
  };
}
