export type StudyPhase =
  | "welcome"
  | "setup"
  | "audio-settings"
  | "practice"
  | "comprehension"
  | "workload"
  | "preference"
  | "interview"
  | "complete";

export type SequenceGroup = "A" | "B" | "C";
export type Condition = "baseline" | "spatial" | "semantic";
export type ComplexityLevel = "low" | "medium" | "high";
export type ImageSet = "set1" | "set2" | "set3";
export type StimulusRole = "comprehension" | "preference" | "reserve";
export type DescriptionLabel = "A" | "B" | "C";
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

export type SpatialQuestion = {
  id: string;
  frameOfReference: "relative" | "absolute" | "viewer-centered" | "qualitative-relation";
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
  };
  audio?: {
    baseline?: string;
    spatial?: string;
    semantic?: string;
  };
  targetElements: string[];
  spatialQuestions: SpatialQuestion[];
  gistQuestion?: GistQuestion;
};

export type Ratings = {
  mentalImageClarity: number | null;
  spatialClarity: number | null;
  perceivedQuality: number | null;
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
  freeRecall: string;
  spatialAnswers: SpatialAnswer[];
  ratings: Ratings;
};

export type WorkloadResponse = {
  participantId: string;
  sequenceGroup: SequenceGroup;
  testMode: boolean;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  submittedAt: string;
  mentalDemand: number | null;
  effort: number | null;
  frustration: number | null;
};

export type PreferenceRanking = {
  first: DescriptionLabel | "";
  second: DescriptionLabel | "";
  third: DescriptionLabel | "";
};

export type PreferencePlaybackEvent = AudioPlayEvent & {
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
  ranking: PreferenceRanking;
  explanation: string;
  submittedAt: string;
};

export type StudyState = {
  phase: StudyPhase;
  testMode: boolean;
  participant: ParticipantProfile;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  comprehensionIndex: number;
  preferenceIndex: number;
  comprehensionResponses: TrialResponse[];
  workloadResponse: WorkloadResponse | null;
  preferenceResponses: PreferenceResponse[];
  startedAt: string;
};