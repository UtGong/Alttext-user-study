export type StudyPhase =
  | "welcome"
  | "consent"
  | "declined"
  | "setup"
  | "audio-settings"
  | "practice"
  | "comprehension"
  | "workload"
  | "preference"
  | "interview"
  | "complete";

export type SequenceGroup = "A" | "B" | "C" | "D";
export type Condition = "baseline" | "spatial" | "semantic" | "spatial2d";
export type ComplexityLevel = "low" | "medium" | "high";
export type ImageSet = "set1" | "set2" | "set3" | "set4" | "preference";
export type StimulusRole = "comprehension" | "preference" | "reserve";
export type DescriptionLabel = "A" | "B" | "C" | "D";
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

export type Stimulus = {
  role: StimulusRole;
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

export type SpatialAnswer = {
  questionId: string;
  frameOfReference: string;
  objectFocus: SpatialObjectFocus;
  question: string;
  answer: string;
  correctAnswer: string | null;
  isCorrect: boolean | null;
  requiresManualCoding: boolean;
};

export type TrialResponse = {
  participantId: string;
  sequenceGroup: SequenceGroup;
  testMode: boolean;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  trialIndex: number;
  randomizedDisplayPosition: number;
  imageId: string;
  imageFilename: string;
  uuid: string;
  rowIndex: number;
  complexityLevel: ComplexityLevel;
  imageSet: ImageSet;
  condition: Condition;
  descriptionText: string;
  replayCount: number;
  replayed: boolean;
  audioPlayEvents: AudioPlayEvent[];
  startedAt: string;
  audioStartedAt?: string;
  audioEndedAt?: string;
  submittedAt: string;
  gistAnswer: string;
  gistScore: number | null;
  freeRecall: string;
  spatialAnswers: SpatialAnswer[];
  spatialAccuracyScore: number;
  spatialEligibleQuestionCount: number;
  ratings: Ratings;
  workload: Pick<WorkloadResponse, "mentalDemand" | "effort" | "frustration">;
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
  effort: LikertResponse | null;
  frustration: LikertResponse | null;
};

export type PreferenceRanking = {
  first: DescriptionLabel | "";
  second: DescriptionLabel | "";
  third: DescriptionLabel | "";
  fourth: DescriptionLabel | "";
};

export type PreferencePlaybackEvent = AudioPlayEvent & {
  eventSequence: number;
  label: DescriptionLabel;
  condition: Condition;
};

export type PreferenceResponse = {
  participantId: string;
  sequenceGroup: SequenceGroup;
  testMode: boolean;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  trialIndex: number;
  imageId: string;
  imageFilename: string;
  uuid: string;
  rowIndex: number;
  complexityLevel: ComplexityLevel;
  randomizedOrder: {
    label: DescriptionLabel;
    displayPosition: number;
    condition: Condition;
    descriptionText: string;
  }[];
  playbackEvents: PreferencePlaybackEvent[];
  replayCounts: Record<DescriptionLabel, number>;
  bestChoice: DescriptionLabel | "";
  preferredCondition: Condition | "";
  ranking: PreferenceRanking;
  explanation: string;
  startedAt: string;
  responseTimeMs: number;
  submittedAt: string;
};

export type StudyState = {
  schemaVersion: 4;
  phase: StudyPhase;
  testMode: boolean;
  consent: ConsentRecord;
  participant: ParticipantProfile;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  comprehensionIndex: number;
  comprehensionOrder: string[];
  preferenceIndex: number;
  comprehensionResponses: TrialResponse[];
  workloadResponse: WorkloadResponse | null;
  preferenceResponses: PreferenceResponse[];
  startedAt: string;
};
