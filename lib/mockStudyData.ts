import { getConditionForStimulus, comprehensionStimuli, preferenceStimuli } from "@/lib/stimuli";
import { Condition, DescriptionLabel, LikertResponse, StudyState } from "@/types/study";

const conditions: Condition[] = ["baseline", "spatial", "semantic", "spatial2d"];
const labels: DescriptionLabel[] = ["A", "B", "C", "D"];
const agreement: LikertResponse = { value: 4, label: "Very" };
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
      isUncertain: false,
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
      gistQuestion: "In 1-2 sentences, what was the main focus of the scene?", gistAnswer: "Mock gist response", gistScore: null,
      freeRecallQuestion: "Describe the scene in your own words. Mention what you remember, including the people or objects present, and how they were arranged in relation to each other.", freeRecall: "Mock free-recall response.",
      spatialAnswers, spatialAccuracyScore: eligible.length, spatialEligibleQuestionCount: eligible.length,
      ratings: { overallSceneClarity: agreement, spatialRelationsConfidence: agreement, contentComprehension: agreement },
      ratingQuestions: { overallSceneClarity: "I could picture the overall scene in my mind.", spatialRelationsConfidence: "I could identify the spatial relationships among the described elements.", contentComprehension: "The description gave me enough information about where things were in the image." },
      workload: { mentalDemand: workload, effort: workload, frustration: workload },
      workloadQuestions: { mentalDemand: "How mentally demanding was it to understand this image description?", effort: "How much effort did you need to understand this image description?", frustration: "How frustrated did you feel while understanding this image description?" },
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
      rankingQuestion: "Rank descriptions A, B, C, and D from best to worst. Choose each description only once.",
      ranking: { first: "A" as const, second: "B" as const, third: "C" as const, fourth: "D" as const },
      explanationQuestion: "Why did you choose this ranking?", explanation: "Mock preference explanation.", startedAt: now, responseTimeMs: 0, submittedAt: now
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
    phase: "complete", testMode: true, participant,
    practiceQuestion: "Please describe the scene in your own words.", practiceResponse: "Mock practice response.",
    comprehensionOrder: comprehensionStimuli.map((stimulus) => stimulus.uuid),
    comprehensionIndex: comprehensionStimuli.length, comprehensionResponses,
    preferenceIndex: preferenceStimuli.length, preferenceResponses, interviewResponses
  };
}
