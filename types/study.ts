export type StudyPhase =
  | "welcome"
  | "consent"
  | "declined"
  | "setup"
  | "audio-settings"
  | "practice"
  | "comprehension"
  | "preference"
  | "interview"
  | "complete";

export type SequenceGroup = "A" | "B";
export type Condition = "baseline" | "spatial";
export type StudyMode = "pilot-preference";
export type ComplexityLevel = "low" | "medium" | "high";
export type ImageSet = "set1" | "set2" | "set3" | "set4" | "preference" | "pilot";
export type StimulusRole = "comprehension" | "preference" | "reserve" | "pilot";
export type DescriptionLabel = "A" | "B";
export type PreferenceChoice = DescriptionLabel | "none";
export type SpatialObjectFocus = "main" | "secondary";

export type ParticipantProfile = {
  participantId: string;
  sequenceGroup: SequenceGroup;
  visionBackground: string;
  visionSelfDescribe: string;
  screenReader: string;
  screenReaderOther: string;
  imageDescriptionExperience: string;
};

export type ConsentRecord = {
  accepted: boolean;
  acceptedAt: string;
  version: string;
};

export type SpatialQuestion = {
  id: string;
  frameOfReference: "intrinsic" | "relative" | "absolute" | "viewer-centered" | "qualitative-relation";
  objectFocus?: SpatialObjectFocus;
  question: string;
  options: string[];
  correctAnswer?: string;
  requiresManualCoding?: boolean;
};

export type GistQuestion = {
  question: string;
  expectedAnswer?: string;
  options?: string[];
};

export type DescriptionMetric = {
  spatialExpressionCount?: number;
  kendallTau?: number;
};

export type DescriptionMetrics = Partial<Record<Condition, DescriptionMetric>>;

export type Stimulus = {
  role: StimulusRole;
  pilotIndex?: number;
  pilotCondition?: Condition;
  rowIndex: number;
  uuid: string;
  imageFilename: string;
  imageUrl?: string;
  complexityLevel: ComplexityLevel;
  complexityScore?: number;
  imageSet: ImageSet;
  descriptions: {
    baseline: string;
    spatial: string;
    semantic: string;
    spatial2d: string;
  };
  audio?: {
    baseline?: string;
    spatial?: string;
    semantic?: string;
    spatial2d?: string;
  };
  targetElements: string[];
  spatialQuestions: SpatialQuestion[];
  gistQuestion?: GistQuestion;
  preferenceConditions?: Condition[];
  descriptionMetrics?: DescriptionMetrics;
};

export type LikertResponse = {
  value: number;
  label: string;
};

export type Ratings = {
  overallSceneClarity: LikertResponse | null;
  spatialRelationsConfidence: LikertResponse | null;
  contentComprehension: LikertResponse | null;
};

export type AudioPlayEvent = {
  playedAt: string;
  playNumber: number;
  isReplay: boolean;
};

export type OrderedAudioPlayEvent = AudioPlayEvent & {
  eventSequence: number;
};

export type AccuracySummary = {
  correct: number;
  eligible: number;
  proportion: number | null;
};

export type SpatialAnswer = {
  questionId: string;
  frameOfReference: string;
  objectFocus: SpatialObjectFocus;
  question: string;
  answer: string;
  correctAnswer: string | null;
  isCorrect: boolean | null;
  isUncertain: boolean;
  requiresManualCoding: boolean;
};

export type TrialResponse = {
  participantId: string;
  sessionId: string;
  trialId: string;
  studyMode: StudyMode;
  sequenceGroup: SequenceGroup;
  testMode: boolean;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  trialIndex: number;
  randomizedDisplayPosition: number;
  imageId: string;
  imageFilename: string;
  uuid: string;
  role: "comprehension" | "pilot";
  pilotIndex: number | null;
  rowIndex: number;
  complexityLevel: ComplexityLevel;
  complexityScore: number | null;
  imageSet: ImageSet;
  condition: Condition;
  descriptionText: string;
  baselineSpatialExpressionCount: number | null;
  spatialSpatialExpressionCount: number | null;
  spatialKendallTau: number | null;
  spatialExpressionCount: number | null;
  presentedKendallTau: number | null;
  replayCount: number;
  replayed: boolean;
  audioPlayEvents: OrderedAudioPlayEvent[];
  startedAt: string;
  audioStartedAt?: string;
  audioEndedAt?: string;
  submittedAt: string;
  responseTimeMs: number;
  freeRecallQuestion: string;
  freeRecall: string;
  spatialAnswers: SpatialAnswer[];
  spatialAccuracyScore: number;
  spatialEligibleQuestionCount: number;
  spatialAccuracyProportion: number | null;
  intrinsicAccuracy: AccuracySummary;
  absoluteAccuracy: AccuracySummary;
  ratings: Ratings;
  ratingQuestions: Record<keyof Ratings, string>;
  workload: Pick<WorkloadResponse, "mentalDemand" | "frustration">;
  workloadQuestions: Record<"mentalDemand" | "frustration", string>;
  stepTimestamps: Record<string, { startedAt: string; completedAt: string; responseTimeMs: number }>;
};

export type WorkloadResponse = {
  participantId: string;
  sequenceGroup: SequenceGroup;
  testMode: boolean;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  submittedAt: string;
  mentalDemand: LikertResponse | null;
  frustration: LikertResponse | null;
};

export type PreferenceRanking = {
  first: DescriptionLabel | "";
  second: DescriptionLabel | "";
};

export type PreferencePlaybackEvent = AudioPlayEvent & {
  eventSequence: number;
  label: DescriptionLabel;
  condition: Condition;
};

export type PreferenceResponse = {
  participantId: string;
  sessionId: string;
  trialId: string;
  studyMode: StudyMode;
  sequenceGroup: SequenceGroup;
  testMode: boolean;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  trialIndex: number;
  imageId: string;
  imageFilename: string;
  uuid: string;
  role: "preference";
  imageSet: "preference";
  rowIndex: number;
  complexityLevel: ComplexityLevel;
  complexityScore: number | null;
  randomizedOrder: {
    label: DescriptionLabel;
    displayPosition: number;
    condition: Condition;
    descriptionText: string;
    spatialExpressionCount: number | null;
    kendallTau: number | null;
  }[];
  baselineSpatialExpressionCount: number | null;
  spatialSpatialExpressionCount: number | null;
  spatialKendallTau: number | null;
  playbackEvents: PreferencePlaybackEvent[];
  replayCounts: Record<DescriptionLabel, number>;
  preferenceChoice: PreferenceChoice;
  preferenceResponse: "Description A" | "Description B" | "No preference";
  bestChoice: PreferenceChoice;
  preferredCondition: Condition | "none";
  rankingQuestion: string;
  ranking: PreferenceRanking;
  explanationQuestion: string;
  explanation: string;
  startedAt: string;
  responseTimeMs: number;
  submittedAt: string;
};

export type InterviewResponse = {
  questionId: string;
  question: string;
  answer: string;
  submittedAt: string;
};

export type StudyState = {
  schemaVersion: 11;
  phase: StudyPhase;
  testMode: boolean;
  studyMode: StudyMode;
  sessionId: string;
  consent: ConsentRecord;
  participant: ParticipantProfile;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  practiceQuestion: string;
  practiceResponse: string;
  comprehensionIndex: number;
  comprehensionOrder: string[];
  preferenceIndex: number;
  comprehensionResponses: TrialResponse[];
  preferenceResponses: PreferenceResponse[];
  interviewResponses: InterviewResponse[];
  startedAt: string;
};
