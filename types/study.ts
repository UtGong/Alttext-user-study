export type Condition = "baseline" | "spatial" | "semantic";
export type ComplexityLevel = "low" | "medium" | "high";
export type ImageSet = "set1" | "set2" | "set3";
export type SequenceGroup = "A" | "B" | "C";
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

export type SpatialQuestion = {
  id: string;
  frameOfReference: "relative" | "absolute" | "viewer-centered";
  question: string;
  options: string[];
  correctAnswer: string;
};

export type Stimulus = {
  rowIndex: number;
  uuid: string;
  imageFilename: string;
  complexityLevel: ComplexityLevel;
  complexityScore?: number;
  role: "comprehension" | "preference" | "reserve" | string;
  imageSet: ImageSet;
  descriptions: Record<Condition, string>;
  audio?: Partial<Record<Condition, string>>;
  targetElements: string[];
  spatialQuestions: SpatialQuestion[];
  gistQuestion?: {
    question: string;
    expectedAnswer?: string;
    options?: string[];
  };
};

export type ParticipantProfile = {
  participantId: string;
  sequenceGroup: SequenceGroup;
  visionBackground: string;
  visionSelfDescribe: string;
  screenReader: string;
  screenReaderOther: string;
  imageDescriptionExperience: string;
};

export type Ratings = {
  mentalImageClarity: number | null;
  spatialClarity: number | null;
  perceivedQuality: number | null;
};

export type SpatialAnswer = {
  questionId: string;
  frameOfReference: string;
  question: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export type TrialResponse = {
  participantId: string;
  sequenceGroup: SequenceGroup;
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
  startedAt: string;
  audioStartedAt?: string;
  audioEndedAt?: string;
  submittedAt: string;
  freeRecall: string;
  spatialAnswers: SpatialAnswer[];
  gistAnswer: string;
  ratings: Ratings;
};

export type WorkloadResponse = {
  participantId: string;
  sequenceGroup: SequenceGroup;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  submittedAt: string;
  mentalDemand: number | null;
  effort: number | null;
  frustration: number | null;
};

export type PreferenceResponse = {
  participantId: string;
  sequenceGroup: SequenceGroup;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  trialIndex: number;
  uuid: string;
  rowIndex: number;
  complexityLevel: ComplexityLevel;
  randomizedOrder: { label: "A" | "B" | "C"; condition: Condition; descriptionText: string }[];
  replayCounts: Record<"A" | "B" | "C", number>;
  bestChoice: "A" | "B" | "C" | "";
  ranking: {
    first: "A" | "B" | "C" | "";
    second: "A" | "B" | "C" | "";
    third: "A" | "B" | "C" | "";
  };
  explanation: string;
  submittedAt: string;
};

export type StudyState = {
  phase: StudyPhase;
  participant: ParticipantProfile;
  selectedAudioSpeed: number;
  selectedVoiceURI: string;
  comprehensionIndex: number;
  preferenceIndex: number;
  comprehensionResponses: TrialResponse[];
  workloadResponse: WorkloadResponse | null;
  preferenceResponses: PreferenceResponse[];
  interviewNotes: string;
  startedAt: string;
};