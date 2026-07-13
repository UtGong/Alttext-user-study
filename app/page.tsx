"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { LikertScale } from "@/components/LikertScale";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RadioGroup } from "@/components/RadioGroup";
import { getAvailableVoices, SpeechVoiceOption } from "@/lib/audio";
import { AUDIO_SPEED_OPTIONS, STORAGE_KEY } from "@/lib/config";
import { saveResultToRepo } from "@/lib/saveResult";
import {
  comprehensionStimuli,
  getConditionForStimulus,
  getDescriptionForStimulus,
  preferenceStimuli
} from "@/lib/stimuli";
import {
  Condition,
  ParticipantProfile,
  PreferenceResponse,
  Ratings,
  SequenceGroup,
  SpatialAnswer,
  StudyState
} from "@/types/study";

const defaultParticipant: ParticipantProfile = {
  participantId: "",
  sequenceGroup: "A",
  visionBackground: "",
  visionSelfDescribe: "",
  screenReader: "",
  screenReaderOther: "",
  imageDescriptionExperience: ""
};

const defaultState: StudyState = {
  phase: "welcome",
  participant: defaultParticipant,
  selectedAudioSpeed: 1,
  selectedVoiceURI: "",
  comprehensionIndex: 0,
  preferenceIndex: 0,
  comprehensionResponses: [],
  workloadResponse: null,
  preferenceResponses: [],
  interviewNotes: "",
  startedAt: new Date().toISOString()
};

const sampleDescription =
  "A person stands near a table in the foreground. Behind the table, a window and several objects help define the room. This sample is only for choosing the audio voice and speed.";

const workloadLabels = ["Very low", "Low", "Moderate", "High", "Very high"];

function loadInitialState(): StudyState {
  if (typeof window === "undefined") return defaultState;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState;

  try {
    const parsed = JSON.parse(saved) as StudyState;
    return {
      ...defaultState,
      ...parsed,
      selectedVoiceURI: parsed.selectedVoiceURI ?? ""
    };
  } catch {
    return defaultState;
  }
}

function randomizePreferenceOrder(stimulusIndex: number) {
  const conditions: Condition[] = ["baseline", "spatial", "semantic"];
  const offset = stimulusIndex % conditions.length;
  const rotated = [...conditions.slice(offset), ...conditions.slice(0, offset)];

  return rotated.map((condition, index) => ({
    label: ["A", "B", "C"][index] as "A" | "B" | "C",
    condition
  }));
}

export default function HomePage() {
  const [state, setState] = useState<StudyState>(defaultState);
  const [liveMessage, setLiveMessage] = useState("Ready.");

  useEffect(() => {
    setState(loadInitialState());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  function updateState(patch: Partial<StudyState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function resetStudy() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({ ...defaultState, startedAt: new Date().toISOString() });
    setLiveMessage("Study reset.");
  }

  const phase = state.phase;

  return (
    <main id="main-content" className="container">
      <p className="sr-only" aria-live="polite">
        {liveMessage}
      </p>

      <header className="site-header">
        <p className="eyebrow">BLV Image Description Study</p>
        <h1>Accessible User Study Interface</h1>
      </header>

      {phase === "welcome" && (
        <section className="panel" aria-labelledby="welcome-heading">
          <h2 id="welcome-heading">Welcome</h2>
          <p>
            We are studying different ways of organizing image descriptions. You will listen to
            descriptions of images and answer questions about what you understood. Later, you may
            compare different descriptions of the same image and tell us which one works better for
            you.
          </p>

          <div className="button-row">
            <AccessibleButton onClick={() => updateState({ phase: "setup" })}>
              Start
            </AccessibleButton>

            {state.comprehensionResponses.length > 0 && (
              <AccessibleButton
                variant="secondary"
                onClick={() => updateState({ phase: "complete" })}
              >
                Go to export page
              </AccessibleButton>
            )}
          </div>
        </section>
      )}

      {phase === "setup" && <SetupPage state={state} updateState={updateState} />}

      {phase === "audio-settings" && (
        <AudioSettingsPage
          state={state}
          updateState={updateState}
          setLiveMessage={setLiveMessage}
        />
      )}

      {phase === "practice" && (
        <PracticePage state={state} updateState={updateState} />
      )}

      {phase === "comprehension" && (
        <ComprehensionPage
          key={`comprehension-${state.comprehensionIndex}`}
          state={state}
          updateState={updateState}
          setLiveMessage={setLiveMessage}
        />
      )}

      {phase === "workload" && (
        <WorkloadPage state={state} updateState={updateState} />
      )}

      {phase === "preference" && (
        <PreferencePage
          key={`preference-${state.preferenceIndex}`}
          state={state}
          updateState={updateState}
          setLiveMessage={setLiveMessage}
        />
      )}

      {phase === "interview" && (
        <InterviewPage state={state} updateState={updateState} />
      )}

      {phase === "complete" && (
        <CompletePage state={state} resetStudy={resetStudy} />
      )}
    </main>
  );
}

function SetupPage({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  const participant = state.participant;

  function updateParticipant(patch: Partial<ParticipantProfile>) {
    updateState({ participant: { ...participant, ...patch } });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    updateState({ phase: "audio-settings" });
  }

  return (
    <form className="panel" onSubmit={submit} aria-labelledby="setup-heading">
      <h2 id="setup-heading">Participant Setup</h2>

      <label className="field-label">
        Participant ID
        <input
          required
          value={participant.participantId}
          onChange={(event) => updateParticipant({ participantId: event.target.value })}
        />
      </label>

      <RadioGroup
        legend="Researcher sequence group"
        name="sequenceGroup"
        value={participant.sequenceGroup}
        onChange={(value) => updateParticipant({ sequenceGroup: value as SequenceGroup })}
        options={[
          { value: "A", label: "Group A" },
          { value: "B", label: "Group B" },
          { value: "C", label: "Group C" }
        ]}
        required
      />

      <RadioGroup
        legend="Vision background"
        name="visionBackground"
        value={participant.visionBackground}
        onChange={(value) => updateParticipant({ visionBackground: value })}
        options={[
          { value: "blind", label: "Blind" },
          { value: "low-vision", label: "Low vision" },
          { value: "legally-blind", label: "Legally blind" },
          { value: "self-describe", label: "Prefer to self-describe" },
          { value: "prefer-not", label: "Prefer not to say" }
        ]}
        required
      />

      {participant.visionBackground === "self-describe" && (
        <label className="field-label">
          Self-description
          <input
            value={participant.visionSelfDescribe}
            onChange={(event) =>
              updateParticipant({ visionSelfDescribe: event.target.value })
            }
          />
        </label>
      )}

      <RadioGroup
        legend="Screen reader use"
        name="screenReader"
        value={participant.screenReader}
        onChange={(value) => updateParticipant({ screenReader: value })}
        options={[
          { value: "NVDA", label: "NVDA" },
          { value: "JAWS", label: "JAWS" },
          { value: "VoiceOver", label: "VoiceOver" },
          { value: "TalkBack", label: "TalkBack" },
          { value: "Other", label: "Other" },
          { value: "None", label: "None" }
        ]}
        required
      />

      {participant.screenReader === "Other" && (
        <label className="field-label">
          Other screen reader
          <input
            value={participant.screenReaderOther}
            onChange={(event) =>
              updateParticipant({ screenReaderOther: event.target.value })
            }
          />
        </label>
      )}

      <RadioGroup
        legend="Image-description experience"
        name="imageDescriptionExperience"
        value={participant.imageDescriptionExperience}
        onChange={(value) => updateParticipant({ imageDescriptionExperience: value })}
        options={[
          { value: "rarely", label: "Rarely" },
          { value: "sometimes", label: "Sometimes" },
          { value: "often", label: "Often" },
          { value: "very-often", label: "Very often" }
        ]}
        required
      />

      <div className="button-row">
        <AccessibleButton type="submit">
          Continue to audio setup
        </AccessibleButton>
      </div>
    </form>
  );
}

function AudioSettingsPage({
  state,
  updateState,
  setLiveMessage
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
  setLiveMessage: (message: string) => void;
}) {
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);

  useEffect(() => {
    function loadVoices() {
      const available = getAvailableVoices();
      setVoices(available);

      if (!state.selectedVoiceURI && available.length > 0) {
        const preferred =
          available.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              voice.name.toLowerCase().includes("natural")
          ) ||
          available.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              voice.name.toLowerCase().includes("google")
          ) ||
          available.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              voice.name.toLowerCase().includes("microsoft")
          ) ||
          available.find((voice) => voice.lang.startsWith("en")) ||
          available[0];

        updateState({ selectedVoiceURI: preferred.voiceURI });
      }
    }

    loadVoices();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [state.selectedVoiceURI, updateState]);

  return (
    <section className="panel" aria-labelledby="audio-heading">
      <h2 id="audio-heading">Audio Setup</h2>
      <p>
        Choose the voice and speed you prefer. These settings will be fixed during the real
        study trials.
      </p>

      <label className="field-label">
        Preferred voice
        <select
          value={state.selectedVoiceURI}
          onChange={(event) => updateState({ selectedVoiceURI: event.target.value })}
        >
          {voices.length === 0 && <option value="">Default browser voice</option>}
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.label}
            </option>
          ))}
        </select>
      </label>

      <RadioGroup
        legend="Preferred audio speed"
        name="audioSpeed"
        value={String(state.selectedAudioSpeed)}
        onChange={(value) => updateState({ selectedAudioSpeed: Number(value) })}
        options={AUDIO_SPEED_OPTIONS.map((speed) => ({
          value: String(speed),
          label: `${speed} times speed`
        }))}
      />

      <AudioDescriptionPlayer
        description={sampleDescription}
        speed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
        mode="sample"
        label="sample description"
        onEnded={() => setLiveMessage("Sample audio ended.")}
      />

      <div className="button-row">
        <AccessibleButton onClick={() => updateState({ phase: "practice" })}>
          Confirm voice and speed, then continue to practice
        </AccessibleButton>
      </div>
    </section>
  );
}

function PracticePage({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  return (
    <section className="panel" aria-labelledby="practice-heading">
      <h2 id="practice-heading">Practice Trial</h2>
      <p>This practice trial uses the same interaction pattern as the real trials.</p>

      <AudioDescriptionPlayer
        description={sampleDescription}
        speed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
        mode="practice"
        label="practice description"
      />

      <label className="field-label">
        Practice response: what did you understand?
        <textarea rows={4} />
      </label>

      <p>Is this audio voice and speed comfortable for the rest of the study?</p>

      <div className="button-row">
        <AccessibleButton
          onClick={() =>
            updateState({
              phase: "comprehension",
              comprehensionIndex: 0,
              comprehensionResponses: []
            })
          }
        >
          Yes, start real study
        </AccessibleButton>

        <AccessibleButton
          variant="secondary"
          onClick={() => updateState({ phase: "audio-settings" })}
        >
          No, change voice or speed
        </AccessibleButton>
      </div>
    </section>
  );
}

function ComprehensionPage({
  state,
  updateState,
  setLiveMessage
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
  setLiveMessage: (message: string) => void;
}) {
  const stimulus = comprehensionStimuli[state.comprehensionIndex];
  const condition = getConditionForStimulus(state.participant.sequenceGroup, stimulus);
  const descriptionText = getDescriptionForStimulus(
    state.participant.sequenceGroup,
    stimulus
  );

  const [played, setPlayed] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [freeRecall, setFreeRecall] = useState("");
  const [gistAnswer, setGistAnswer] = useState("");
  const [spatialAnswers, setSpatialAnswers] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Ratings>({
    mentalImageClarity: null,
    spatialClarity: null,
    perceivedQuality: null
  });
  const [startedAt] = useState(new Date().toISOString());
  const [audioStartedAt, setAudioStartedAt] = useState<string | undefined>();
  const [audioEndedAt, setAudioEndedAt] = useState<string | undefined>();

  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLiveMessage(
      `Moved to comprehension trial ${state.comprehensionIndex + 1} of ${
        comprehensionStimuli.length
      }.`
    );
  }, [state.comprehensionIndex, setLiveMessage]);

  function submit(event: FormEvent) {
    event.preventDefault();

    const answers: SpatialAnswer[] = stimulus.spatialQuestions.map((question) => {
      const answer = spatialAnswers[question.id] ?? "";
      return {
        questionId: question.id,
        frameOfReference: question.frameOfReference,
        question: question.question,
        answer,
        correctAnswer: question.correctAnswer,
        isCorrect: answer === question.correctAnswer
      };
    });

    const response = {
      participantId: state.participant.participantId,
      sequenceGroup: state.participant.sequenceGroup,
      selectedAudioSpeed: state.selectedAudioSpeed,
      selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: state.comprehensionIndex + 1,
      uuid: stimulus.uuid,
      rowIndex: stimulus.rowIndex,
      complexityLevel: stimulus.complexityLevel,
      imageSet: stimulus.imageSet,
      condition,
      descriptionText,
      replayCount,
      startedAt,
      audioStartedAt,
      audioEndedAt,
      submittedAt: new Date().toISOString(),
      freeRecall,
      spatialAnswers: answers,
      gistAnswer,
      ratings
    };

    const nextResponses = [...state.comprehensionResponses, response];
    const nextIndex = state.comprehensionIndex + 1;

    updateState({
      comprehensionResponses: nextResponses,
      comprehensionIndex: nextIndex,
      phase: nextIndex >= comprehensionStimuli.length ? "workload" : "comprehension"
    });

    setLiveMessage("Response saved.");
  }

  return (
    <form className="panel" onSubmit={submit} aria-labelledby="trial-heading">
      <div className="trial-banner" aria-live="polite">
        <ProgressIndicator
          label="Comprehension trial"
          current={state.comprehensionIndex + 1}
          total={comprehensionStimuli.length}
        />

        <h2 id="trial-heading" ref={headingRef} tabIndex={-1}>
          New comprehension trial: {state.comprehensionIndex + 1} of{" "}
          {comprehensionStimuli.length}
        </h2>

        <p>
          Complexity level: <strong>{stimulus.complexityLevel}</strong>. Please listen to
          the description, then answer the questions below.
        </p>
      </div>

      <p className="help-text">
        The condition name is hidden from participants. Researcher note: {condition}.
      </p>

      <AudioDescriptionPlayer
        description={descriptionText}
        speed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
        mode="trial"
        label="description"
        onPlayed={() => {
          setPlayed(true);
          setAudioStartedAt(new Date().toISOString());
        }}
        onReplay={() => setReplayCount((count) => count + 1)}
        onEnded={() => setAudioEndedAt(new Date().toISOString())}
      />

      <section className="question-card" aria-labelledby="free-recall-heading">
        <h3 id="free-recall-heading">Question 1: Free recall</h3>
        <label className="field-label">
          Please describe what you understood about the image.
          <textarea
            required
            rows={5}
            value={freeRecall}
            onChange={(event) => setFreeRecall(event.target.value)}
          />
        </label>
      </section>

      <section className="question-card" aria-labelledby="spatial-heading">
        <h3 id="spatial-heading">Question 2: Spatial relation questions</h3>
        <fieldset className="fieldset nested-fieldset">
          <legend>Answer the following spatial questions.</legend>

          {stimulus.spatialQuestions.map((question, index) => (
            <RadioGroup
              key={question.id}
              legend={`Spatial question ${index + 1}. ${question.question} Frame of reference: ${question.frameOfReference}.`}
              name={question.id}
              value={spatialAnswers[question.id] ?? ""}
              onChange={(value) =>
                setSpatialAnswers((current) => ({
                  ...current,
                  [question.id]: value
                }))
              }
              options={question.options.map((option) => ({
                value: option,
                label: option
              }))}
              required
            />
          ))}
        </fieldset>
      </section>

      <section className="question-card" aria-labelledby="gist-heading">
        <h3 id="gist-heading">Question 3: Main idea</h3>
        <label className="field-label">
          {stimulus.gistQuestion?.question ??
            "What kind of scene or main subject was described?"}
          <input
            required
            value={gistAnswer}
            onChange={(event) => setGistAnswer(event.target.value)}
          />
        </label>
      </section>

      <section className="question-card" aria-labelledby="ratings-heading">
        <h3 id="ratings-heading">Question 4: Ratings</h3>

        <LikertScale
          legend="I could form a clear mental image of the scene."
          name="mentalImageClarity"
          value={ratings.mentalImageClarity}
          onChange={(value) =>
            setRatings((current) => ({
              ...current,
              mentalImageClarity: value
            }))
          }
        />

        <LikertScale
          legend="I understood where the described elements were located in the image."
          name="spatialClarity"
          value={ratings.spatialClarity}
          onChange={(value) =>
            setRatings((current) => ({
              ...current,
              spatialClarity: value
            }))
          }
        />

        <LikertScale
          legend="This description was useful for understanding the image."
          name="perceivedQuality"
          value={ratings.perceivedQuality}
          onChange={(value) =>
            setRatings((current) => ({
              ...current,
              perceivedQuality: value
            }))
          }
        />
      </section>

      <div className="button-row">
        <AccessibleButton type="submit" disabled={!played}>
          Save and continue
        </AccessibleButton>
      </div>

      {!played && (
        <p className="warning">Please play the description at least once before continuing.</p>
      )}
    </form>
  );
}

function WorkloadPage({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  const [mentalDemand, setMentalDemand] = useState<number | null>(
    state.workloadResponse?.mentalDemand ?? null
  );
  const [effort, setEffort] = useState<number | null>(
    state.workloadResponse?.effort ?? null
  );
  const [frustration, setFrustration] = useState<number | null>(
    state.workloadResponse?.frustration ?? null
  );

  function submit(event: FormEvent) {
    event.preventDefault();

    updateState({
      workloadResponse: {
        participantId: state.participant.participantId,
        sequenceGroup: state.participant.sequenceGroup,
        selectedAudioSpeed: state.selectedAudioSpeed,
        selectedVoiceURI: state.selectedVoiceURI,
        submittedAt: new Date().toISOString(),
        mentalDemand,
        effort,
        frustration
      },
      phase: preferenceStimuli.length > 0 ? "preference" : "interview"
    });
  }

  return (
    <form className="panel" onSubmit={submit} aria-labelledby="workload-heading">
      <h2 id="workload-heading">Workload Questions</h2>

      <LikertScale
        legend="How mentally demanding was this task?"
        name="mentalDemand"
        value={mentalDemand}
        onChange={setMentalDemand}
        labels={workloadLabels}
      />

      <LikertScale
        legend="How much effort did you need?"
        name="effort"
        value={effort}
        onChange={setEffort}
        labels={workloadLabels}
      />

      <LikertScale
        legend="How frustrated did you feel?"
        name="frustration"
        value={frustration}
        onChange={setFrustration}
        labels={workloadLabels}
      />

      <AccessibleButton type="submit">Continue</AccessibleButton>
    </form>
  );
}

function PreferencePage({
  state,
  updateState,
  setLiveMessage
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
  setLiveMessage: (message: string) => void;
}) {
  const stimulus = preferenceStimuli[state.preferenceIndex];

  const randomizedOrder = useMemo(
    () =>
      randomizePreferenceOrder(state.preferenceIndex).map((item) => ({
        ...item,
        descriptionText: stimulus.descriptions[item.condition]
      })),
    [state.preferenceIndex, stimulus]
  );

  const [replayCounts, setReplayCounts] = useState<Record<"A" | "B" | "C", number>>({
    A: 0,
    B: 0,
    C: 0
  });
  const [bestChoice, setBestChoice] = useState<"A" | "B" | "C" | "">("");
  const [ranking, setRanking] = useState<{
    first: "A" | "B" | "C" | "";
    second: "A" | "B" | "C" | "";
    third: "A" | "B" | "C" | "";
  }>({
    first: "",
    second: "",
    third: ""
  });

  const rankingHasDuplicate =
    [ranking.first, ranking.second, ranking.third].filter(Boolean).length !==
    new Set([ranking.first, ranking.second, ranking.third].filter(Boolean)).size;

  const rankingComplete = Boolean(ranking.first && ranking.second && ranking.third);
  const [explanation, setExplanation] = useState("");

  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLiveMessage(
      `Moved to preference trial ${state.preferenceIndex + 1} of ${preferenceStimuli.length}.`
    );
  }, [state.preferenceIndex, setLiveMessage]);

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!rankingComplete || rankingHasDuplicate) {
      setLiveMessage("Please choose a complete ranking without repeating a description.");
      return;
    }

    const response: PreferenceResponse = {
      participantId: state.participant.participantId,
      sequenceGroup: state.participant.sequenceGroup,
      selectedAudioSpeed: state.selectedAudioSpeed,
      selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: state.preferenceIndex + 1,
      uuid: stimulus.uuid,
      rowIndex: stimulus.rowIndex,
      complexityLevel: stimulus.complexityLevel,
      randomizedOrder,
      replayCounts,
      bestChoice,
      ranking,
      explanation,
      submittedAt: new Date().toISOString()
    };

    const nextIndex = state.preferenceIndex + 1;

    updateState({
      preferenceResponses: [...state.preferenceResponses, response],
      preferenceIndex: nextIndex,
      phase: nextIndex >= preferenceStimuli.length ? "interview" : "preference"
    });

    setLiveMessage("Preference response saved.");
  }
  function updateRanking(
    position: "first" | "second" | "third",
    value: "A" | "B" | "C" | ""
  ) {
    setRanking((current) => ({
      ...current,
      [position]: value
    }));
  }

  return (
    <form className="panel" onSubmit={submit} aria-labelledby="preference-heading">
      <div className="trial-banner" aria-live="polite">
        <ProgressIndicator
          label="Preference trial"
          current={state.preferenceIndex + 1}
          total={preferenceStimuli.length}
        />

        <h2 id="preference-heading" ref={headingRef} tabIndex={-1}>
          New preference trial: {state.preferenceIndex + 1} of {preferenceStimuli.length}
        </h2>

        <p>
          Listen to all three descriptions of the same image. The condition names are hidden
          from participants.
        </p>
      </div>

      {randomizedOrder.map((item) => (
        <AudioDescriptionPlayer
          key={item.label}
          description={item.descriptionText}
          speed={state.selectedAudioSpeed}
          voiceURI={state.selectedVoiceURI}
          mode="preference"
          label={`Description ${item.label}`}
          onReplay={() =>
            setReplayCounts((current) => ({
              ...current,
              [item.label]: current[item.label] + 1
            }))
          }
        />
      ))}

      <section className="question-card" aria-labelledby="preference-best-heading">
        <h3 id="preference-best-heading">Question 1: Best description</h3>
        <RadioGroup
          legend="Which description helped you understand the image best?"
          name="bestChoice"
          value={bestChoice}
          onChange={(value) => setBestChoice(value as "A" | "B" | "C")}
          options={["A", "B", "C"].map((label) => ({
            value: label,
            label: `Description ${label}`
          }))}
          required
        />
      </section>

      <section className="question-card" aria-labelledby="preference-ranking-heading">
        <h3 id="preference-ranking-heading">Question 2: Ranking</h3>
        <p>Please choose the ranking from best to worst.</p>

        <label className="field-label">
          Best description
          <select
            required
            value={ranking.first}
            onChange={(event) =>
              updateRanking("first", event.target.value as "A" | "B" | "C" | "")
            }
          >
            <option value="">Select one</option>
            <option value="A">Description A</option>
            <option value="B">Description B</option>
            <option value="C">Description C</option>
          </select>
        </label>

        <label className="field-label">
          Second-best description
          <select
            required
            value={ranking.second}
            onChange={(event) =>
              updateRanking("second", event.target.value as "A" | "B" | "C" | "")
            }
          >
            <option value="">Select one</option>
            <option value="A">Description A</option>
            <option value="B">Description B</option>
            <option value="C">Description C</option>
          </select>
        </label>

        <label className="field-label">
          Third-best description
          <select
            required
            value={ranking.third}
            onChange={(event) =>
              updateRanking("third", event.target.value as "A" | "B" | "C" | "")
            }
          >
            <option value="">Select one</option>
            <option value="A">Description A</option>
            <option value="B">Description B</option>
            <option value="C">Description C</option>
          </select>
        </label>

        {rankingHasDuplicate && (
          <p className="warning" role="alert">
            Each description can only appear once in the ranking.
          </p>
        )}
      </section>

      <section className="question-card" aria-labelledby="preference-explanation-heading">
        <h3 id="preference-explanation-heading">Question 3: Explanation</h3>
        <label className="field-label">
          Why did you choose this ranking?
          <textarea
            required
            rows={5}
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
          />
        </label>
      </section>

      <AccessibleButton
        type="submit"
        disabled={!rankingComplete || rankingHasDuplicate}
      >
        Save preference response
      </AccessibleButton>
    </form>
  );
}

function InterviewPage({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  return (
    <section className="panel" aria-labelledby="interview-heading">
      <h2 id="interview-heading">Final Interview Guide</h2>

      <ol className="question-list">
        <li>Which descriptions helped you understand the image best?</li>
        <li>Did the order of information affect how you built the image in your mind?</li>
        <li>Were spatial descriptions helpful, confusing, or unnecessary?</li>
        <li>Were semantic groupings helpful, confusing, or unnecessary?</li>
        <li>What spatial or orientation details were missing?</li>
        <li>Did any description feel too long or too hard to follow?</li>
        <li>In real use, what kind of image description would you prefer?</li>
      </ol>

      <label className="field-label">
        Researcher notes
        <textarea
          rows={8}
          value={state.interviewNotes}
          onChange={(event) => updateState({ interviewNotes: event.target.value })}
        />
      </label>

      <AccessibleButton onClick={() => updateState({ phase: "complete" })}>
        Finish study
      </AccessibleButton>
    </section>
  );
}

function CompletePage({
  state,
  resetStudy
}: {
  state: StudyState;
  resetStudy: () => void;
}) {
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [savedPath, setSavedPath] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSaveResult() {
    setSaveStatus("saving");
    setSavedPath("");
    setErrorMessage("");

    try {
      const result = await saveResultToRepo(state);
      setSaveStatus("saved");
      setSavedPath(result.savedPath ?? "");
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save result."
      );
    }
  }

  return (
    <section className="panel" aria-labelledby="complete-heading">
      <h2 id="complete-heading">Study Complete</h2>
      <p>Thank you. The study is complete.</p>

      <dl className="summary-list">
        <dt>Participant ID</dt>
        <dd>{state.participant.participantId || "Not set"}</dd>

        <dt>Selected audio speed</dt>
        <dd>{state.selectedAudioSpeed}x</dd>

        <dt>Selected voice</dt>
        <dd>{state.selectedVoiceURI || "Default browser voice"}</dd>

        <dt>Comprehension responses</dt>
        <dd>{state.comprehensionResponses.length}</dd>

        <dt>Workload response</dt>
        <dd>{state.workloadResponse ? "Saved in session" : "Missing"}</dd>

        <dt>Preference responses</dt>
        <dd>{state.preferenceResponses.length}</dd>
      </dl>

      <div className="button-row">
        <AccessibleButton
          onClick={handleSaveResult}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? "Saving result..." : "Save result to repo"}
        </AccessibleButton>

        <AccessibleButton variant="danger" onClick={resetStudy}>
          Clear session and restart
        </AccessibleButton>
      </div>

      {saveStatus === "saved" && (
        <p className="success" role="status">
          Result saved successfully: <code>{savedPath}</code>
        </p>
      )}

      {saveStatus === "error" && (
        <p className="warning" role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  );
}