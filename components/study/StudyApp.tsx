"use client";

import { FormEvent, useEffect, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { LikertScale } from "@/components/LikertScale";
import { QuestionAudioButton } from "@/components/QuestionAudioButton";
import { RadioGroup } from "@/components/RadioGroup";
import { SpeechAnswerInput } from "@/components/SpeechAnswerInput";
import { ComprehensionFlow } from "@/components/study/ComprehensionFlow";
import { PreferenceFlow } from "@/components/study/PreferenceFlow";
import {
  AUDIO_SPEED_OPTIONS,
  CONSENT_VERSION,
  STORAGE_KEY,
  STUDY_SCHEMA_VERSION
} from "@/lib/config";
import { createRandomizedComprehensionOrder, preferenceStimuli } from "@/lib/stimuli";
import { saveResultToFirebase } from "@/lib/saveResult";
import { createMockStudyData } from "@/lib/mockStudyData";
import { LikertResponse, ParticipantProfile, SequenceGroup, StudyState } from "@/types/study";

const participant: ParticipantProfile = {
  participantId: "",
  sequenceGroup: "A",
  visionBackground: "",
  visionSelfDescribe: "",
  screenReader: "",
  screenReaderOther: "",
  imageDescriptionExperience: ""
};

const initial: StudyState = {
  schemaVersion: STUDY_SCHEMA_VERSION,
  phase: "welcome",
  testMode: false,
  consent: {
    accepted: false,
    acceptedAt: "",
    version: CONSENT_VERSION
  },
  participant,
  selectedAudioSpeed: 1,
  selectedVoiceURI: "",
  comprehensionIndex: 0,
  comprehensionOrder: [],
  preferenceIndex: 0,
  comprehensionResponses: [],
  workloadResponse: null,
  preferenceResponses: [],
  interviewResponses: [],
  startedAt: new Date().toISOString()
};

const sample =
  "A person stands near a table in the foreground. Behind the table, a window and several objects help define the room.";

const workloadLabels = ["Very low", "Low", "Moderate", "High", "Very high"];

export function StudyApp() {
  const [state, setState] = useState<StudyState>(initial);

  const updateState = (patch: Partial<StudyState>) => {
    setState((current) => ({ ...current, ...patch }));
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as Partial<StudyState>;

      if (saved.schemaVersion !== STUDY_SCHEMA_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      setState({
        ...initial,
        ...saved,
        schemaVersion: STUDY_SCHEMA_VERSION,
        comprehensionOrder:
          saved.comprehensionOrder?.length
            ? saved.comprehensionOrder
            : createRandomizedComprehensionOrder()
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [state.phase, state.comprehensionIndex, state.preferenceIndex]);

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...initial,
      consent: { ...initial.consent },
      startedAt: new Date().toISOString()
    });
  };

  const decline = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...initial,
      phase: "declined",
      consent: { ...initial.consent },
      startedAt: new Date().toISOString()
    });
  };

  return (
    <main id="main-content" className="container">
      <header className="site-header">
        <p className="eyebrow">BLV Image Description Study</p>
        <h1>Accessible User Study Interface</h1>
      </header>

      {state.testMode && (
        <p className="warning" role="status">
          TEST MODE ACTIVE. Saved records are marked testMode: true.
        </p>
      )}

      {state.phase === "welcome" && (
        <section className="panel">
          <h2>Welcome</h2>
          <p>
            Listen to image descriptions and answer questions about what you understood. Later,
            compare four descriptions of the same image.
          </p>
          <div className="button-row">
            <AccessibleButton
              onClick={() => updateState({ phase: "consent", testMode: false })}
            >
              Review consent form
            </AccessibleButton>
            <AccessibleButton
              variant="secondary"
              onClick={() =>
                updateState({
                  phase: "consent",
                  testMode: true,
                  participant: {
                    ...participant,
                    participantId: `TEST_${Date.now()}`
                  },
                  comprehensionIndex: 0,
                  comprehensionOrder: [],
                  preferenceIndex: 0,
                  comprehensionResponses: [],
                  preferenceResponses: [],
                  workloadResponse: null,
                  interviewResponses: []
                })
              }
            >
              Start test mode
            </AccessibleButton>
          </div>
        </section>
      )}

      {state.phase === "consent" && (
        <Consent state={state} updateState={updateState} decline={decline} />
      )}
      {state.phase === "declined" && <Declined reset={reset} />}
      {state.phase === "setup" && (
        <Setup state={state} updateState={updateState} />
      )}
      {state.phase === "audio-settings" && (
        <Audio state={state} updateState={updateState} />
      )}
      {state.phase === "practice" && (
        <Practice state={state} updateState={updateState} />
      )}
      {state.phase === "comprehension" && (
        <ComprehensionFlow
          key={state.comprehensionIndex}
          state={state}
          updateState={updateState}
        />
      )}
      {state.phase === "workload" && (
        <Workload state={state} updateState={updateState} />
      )}
      {state.phase === "preference" && (
        <PreferenceFlow
          key={state.preferenceIndex}
          state={state}
          updateState={updateState}
        />
      )}
      {state.phase === "interview" && (
        <Interview state={state} updateState={updateState} />
      )}
      {state.phase === "complete" && (
        <Complete state={state} reset={reset} />
      )}
    </main>
  );
}

function Consent({
  state,
  updateState,
  decline
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
  decline: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form
      className="panel consent-panel"
      aria-labelledby="consent-heading"
      onSubmit={(event) => {
        event.preventDefault();
        const acceptedAt = new Date().toISOString();
        updateState({
          phase: "setup",
          consent: {
            accepted: true,
            acceptedAt,
            version: CONSENT_VERSION
          },
          startedAt: acceptedAt
        });
      }}
    >
      <h2 id="consent-heading">Consent to Participate</h2>
      <p>
        Please read this information before deciding whether to participate. Ask the researcher
        any questions you have before continuing.
      </p>

      <h3>Purpose and activities</h3>
      <p>
        This study examines how blind and low-vision users understand different forms of image
        description. You will listen to descriptions, answer comprehension and workload
        questions, compare descriptions, and take part in final interview questions.
      </p>

      <h3>Voluntary participation and withdrawal</h3>
      <p>
        Participation is voluntary. You may pause between sections or stop at any time, for any
        reason, without penalty or loss of benefits. Closing the page stops the study. Selecting
        “Decline and leave study” below clears this browser session and does not submit a study
        record.
      </p>

      <h3>Potential risks or discomforts</h3>
      <p>
        Possible discomforts include fatigue, mental effort, frustration, or discomfort from
        listening to repeated audio. Some descriptions may mention nudity, religious imagery,
        death, skulls, or injury. You may stop immediately if you feel uncomfortable.
      </p>

      <h3>Potential benefits</h3>
      <p>
        There may be no direct personal benefit. Your responses may help researchers improve
        accessible image descriptions.
      </p>

      <h3>Information collected and privacy</h3>
      <p>
        The study records a coded Participant ID, accessibility background, answers, ratings,
        audio replay events, and response timing. Do not enter your name or contact information
        in study fields. Until the researcher saves the completed record, progress is stored in
        this browser so the session can recover after an accidental refresh.
      </p>
      <p>
        Open-ended answers may be entered by typing or optional live speech-to-text. Speech input
        requests microphone access only after you select Start speaking. This website stores the
        resulting text, not microphone audio, but your browser or operating system&apos;s speech
        service may process the audio to create the transcript. You may type instead and can edit
        every transcript before continuing.
      </p>

      <h3>Questions or concerns</h3>
      <p>
        For questions about the study, its data-retention practices, your rights, or withdrawing
        submitted data, contact the researcher who provided your Participant ID before agreeing.
      </p>

      <div className="consent-confirmation">
        <label>
          <input
            type="checkbox"
            required
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span>
            I have read and understood the information above, had an opportunity to ask
            questions, and voluntarily agree to participate.
          </span>
        </label>
      </div>

      <p className="help-text">Consent form version: {CONSENT_VERSION}</p>

      <div className="button-row">
        <AccessibleButton type="submit" disabled={!confirmed}>
          I agree — continue
        </AccessibleButton>
        <AccessibleButton type="button" variant="danger" onClick={decline}>
          Decline and leave study
        </AccessibleButton>
        {state.testMode && <span className="help-text">Test-mode consent record</span>}
      </div>
    </form>
  );
}

function Declined({ reset }: { reset: () => void }) {
  return (
    <section className="panel" aria-labelledby="declined-heading">
      <h2 id="declined-heading">Participation declined</h2>
      <p>
        You have chosen not to participate. No study response has been submitted. You may close
        this page now.
      </p>
      <AccessibleButton variant="secondary" onClick={reset}>
        Return to welcome page
      </AccessibleButton>
    </section>
  );
}

function Setup({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  const currentParticipant = state.participant;

  const change = (patch: Partial<ParticipantProfile>) => {
    updateState({
      participant: {
        ...currentParticipant,
        ...patch
      }
    });
  };

  return (
    <form
      className="panel"
      onSubmit={(event) => {
        event.preventDefault();
        updateState({ phase: "audio-settings" });
      }}
    >
      <h2>Participant Setup</h2>

      <label className="field-label">
        Participant ID
        <input
          required
          value={currentParticipant.participantId}
          onChange={(event) => change({ participantId: event.target.value })}
        />
      </label>

      <RadioGroup
        legend="Researcher sequence group"
        name="sequenceGroup"
        value={currentParticipant.sequenceGroup}
        onChange={(value) =>
          change({ sequenceGroup: value as SequenceGroup })
        }
        options={["A", "B", "C", "D"].map((value) => ({
          value,
          label: `Group ${value}`
        }))}
        required
        audioSpeed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
      />

      <RadioGroup
        legend="Vision background"
        name="visionBackground"
        value={currentParticipant.visionBackground}
        onChange={(value) => change({ visionBackground: value })}
        options={[
          { value: "blind", label: "Blind" },
          { value: "low-vision", label: "Low vision" },
          { value: "legally-blind", label: "Legally blind" },
          { value: "self-describe", label: "Prefer to self-describe" },
          { value: "prefer-not", label: "Prefer not to say" }
        ]}
        required
        audioSpeed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
      />

      <RadioGroup
        legend="Screen reader use"
        name="screenReader"
        value={currentParticipant.screenReader}
        onChange={(value) => change({ screenReader: value })}
        options={["NVDA", "JAWS", "VoiceOver", "TalkBack", "Other", "None"].map(
          (value) => ({ value, label: value })
        )}
        required
        audioSpeed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
      />

      <RadioGroup
        legend="Image-description experience"
        name="experience"
        value={currentParticipant.imageDescriptionExperience}
        onChange={(value) => change({ imageDescriptionExperience: value })}
        options={["rarely", "sometimes", "often", "very-often"].map((value) => ({
          value,
          label: value
        }))}
        required
        audioSpeed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
      />

      <AccessibleButton type="submit">
        Continue to audio setup
      </AccessibleButton>

      {state.testMode && (
        <AccessibleButton
          type="button"
          variant="secondary"
          onClick={() => updateState(createMockStudyData(state))}
        >
          Generate mock data and go to save page
        </AccessibleButton>
      )}
    </form>
  );
}

function Audio({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  return (
    <section className="panel">
      <h2>Audio Setup</h2>
      <p>
        Play the sample, then choose a comfortable speed. The selected speed stays fixed during
        the study.
      </p>
      <AudioDescriptionPlayer
        description={sample}
        speed={state.selectedAudioSpeed}
        voiceURI=""
        mode="sample"
        label="sample description"
      />
      <RadioGroup
        legend="Preferred audio speed"
        name="audioSpeed"
        value={String(state.selectedAudioSpeed)}
        onChange={(value) =>
          updateState({ selectedAudioSpeed: Number(value) })
        }
        options={AUDIO_SPEED_OPTIONS.map((value) => ({
          value: String(value),
          label: `${value} times speed`
        }))}
        audioSpeed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
      />
      <AccessibleButton onClick={() => updateState({ phase: "practice" })}>
        Continue to practice
      </AccessibleButton>
    </section>
  );
}

function Practice({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  const [practiceResponse, setPracticeResponse] = useState("");

  return (
    <section className="panel">
      <h2>Practice Trial</h2>
      <AudioDescriptionPlayer
        description={sample}
        speed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
        mode="practice"
        label="practice description"
        maxReplays={1}
      />
      <div className="field-label">
        <label htmlFor="practice-response">Please describe the scene in your own words.</label>
        <QuestionAudioButton
          text="Please describe the scene in your own words."
          speed={state.selectedAudioSpeed}
          voiceURI={state.selectedVoiceURI}
        />
        <SpeechAnswerInput
          id="practice-response"
          rows={4}
          value={practiceResponse}
          onChange={setPracticeResponse}
        />
      </div>
      <div className="button-row">
        <AccessibleButton
          onClick={() =>
            updateState({
              phase: "comprehension",
              comprehensionIndex: 0,
              comprehensionOrder: createRandomizedComprehensionOrder(),
              comprehensionResponses: []
            })
          }
        >
          Start real study
        </AccessibleButton>
        <AccessibleButton
          variant="secondary"
          onClick={() => updateState({ phase: "audio-settings" })}
        >
          Change speed
        </AccessibleButton>
      </div>
    </section>
  );
}

function Workload({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  const [mentalDemand, setMentalDemand] = useState<number | null>(null);
  const [effort, setEffort] = useState<number | null>(null);
  const [frustration, setFrustration] = useState<number | null>(null);
  const response = (value: number | null): LikertResponse | null =>
    value === null ? null : { value, label: workloadLabels[value - 1] };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateState({
      workloadResponse: {
        participantId: state.participant.participantId,
        sequenceGroup: state.participant.sequenceGroup,
        testMode: state.testMode,
        selectedAudioSpeed: state.selectedAudioSpeed,
        selectedVoiceURI: state.selectedVoiceURI,
        submittedAt: new Date().toISOString(),
        mentalDemand: response(mentalDemand),
        effort: response(effort),
        frustration: response(frustration)
      },
      phase: preferenceStimuli.length ? "preference" : "interview"
    });
  };

  return (
    <form className="panel" onSubmit={submit}>
      <h2>Overall Workload Questions</h2>
      {[
        ["How mentally demanding was this task?", mentalDemand, setMentalDemand, "mental"],
        ["How much effort did you need?", effort, setEffort, "effort"],
        ["How frustrated did you feel?", frustration, setFrustration, "frustration"]
      ].map(([question, value, setter, name]) => (
        <LikertScale
          key={name as string}
          legend={question as string}
          name={name as string}
          value={value as number | null}
          onChange={setter as (nextValue: number) => void}
          labels={workloadLabels}
          required={!state.testMode}
          audioSpeed={state.selectedAudioSpeed}
          voiceURI={state.selectedVoiceURI}
        />
      ))}
      <AccessibleButton type="submit">Continue</AccessibleButton>
    </form>
  );
}

function Interview({
  state,
  updateState
}: {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
}) {
  const questions = [
    { id: "interview-1", text: "Which descriptions helped you understand the image best?" },
    { id: "interview-2", text: "Did the order of information affect how you built the image in your mind?" },
    { id: "interview-3", text: "Were spatial descriptions helpful, confusing, or unnecessary?" },
    { id: "interview-4", text: "Were semantic groupings helpful, confusing, or unnecessary?" },
    { id: "interview-5", text: "What spatial or orientation details were missing?" },
    { id: "interview-6", text: "Did any description feel too long or hard to follow?" },
    { id: "interview-7", text: "In real use, what kind of image description would you prefer?" }
  ];
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      state.interviewResponses.map((response) => [response.questionId, response.answer])
    )
  );

  return (
    <form
      className="panel"
      onSubmit={(event) => {
        event.preventDefault();
        const submittedAt = new Date().toISOString();
        updateState({
          interviewResponses: questions.map((question) => ({
            questionId: question.id,
            question: question.text,
            answer: answers[question.id]?.trim() ?? "",
            submittedAt
          })),
          phase: "complete"
        });
      }}
    >
      <h2>Final Interview Questions</h2>
      <ol className="question-list">
        {questions.map((question) => (
          <li key={question.id}>
            <label htmlFor={`${question.id}-answer`}>{question.text}</label>
            <QuestionAudioButton
              text={question.text}
              speed={state.selectedAudioSpeed}
              voiceURI={state.selectedVoiceURI}
            />
            <SpeechAnswerInput
              id={`${question.id}-answer`}
              rows={4}
              value={answers[question.id] ?? ""}
              onChange={(answer) =>
                setAnswers((current) => ({ ...current, [question.id]: answer }))
              }
            />
          </li>
        ))}
      </ol>
      <AccessibleButton type="submit">
        Continue to save page
      </AccessibleButton>
    </form>
  );
}

function Complete({
  state,
  reset
}: {
  state: StudyState;
  reset: () => void;
}) {
  const [status, setStatus] = useState("");

  const save = async () => {
    setStatus("Saving...");

    try {
      const result = await saveResultToFirebase(state);
      setStatus(`Saved as ${result.documentId}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    }
  };

  return (
    <section className="panel">
      <h2>Study Complete</h2>
      <p>Participant ID: {state.participant.participantId}</p>
      <p>Comprehension responses: {state.comprehensionResponses.length}</p>
      <p>Preference responses: {state.preferenceResponses.length}</p>
      <p>
        Final interview answers: {state.interviewResponses.filter((response) => response.answer).length}
      </p>
      <p>Mode: {state.testMode ? "Test" : "Study"}</p>
      <div className="button-row">
        <AccessibleButton onClick={save}>Save result</AccessibleButton>
        <AccessibleButton variant="danger" onClick={reset}>
          Clear session and restart
        </AccessibleButton>
      </div>
      {status && <p role="status">{status}</p>}
    </section>
  );
}
