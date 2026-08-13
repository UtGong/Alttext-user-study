"use client";

import { useEffect, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
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
import { ParticipantProfile, SequenceGroup, StudyState } from "@/types/study";

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
  practiceQuestion: "Please describe the scene in your own words.",
  practiceResponse: "",
  comprehensionIndex: 0,
  comprehensionOrder: [],
  preferenceIndex: 0,
  comprehensionResponses: [],
  preferenceResponses: [],
  interviewResponses: [],
  startedAt: new Date().toISOString()
};

const sample =
  "A person stands near a table in the foreground. Behind the table, a window and several objects help define the room.";

const consentPlaybackText = [
  "Consent to Participate.",
  "Please read this information before deciding whether to participate. Ask the researcher any questions you have before continuing.",
  "Purpose and activities. This study examines how blind and low-vision users understand different forms of image description. You will listen to descriptions, answer comprehension and workload questions, compare descriptions, and take part in final interview questions.",
  "Voluntary participation and withdrawal. Participation is voluntary. You may pause between sections or stop at any time, for any reason, without penalty or loss of benefits. Closing the page stops the study. Selecting Decline and leave study clears this browser session and does not submit a study record.",
  "Potential risks or discomforts. Possible discomforts include fatigue, mental effort, frustration, or discomfort from listening to repeated audio. Some descriptions may mention nudity, religious imagery, death, skulls, or injury. You may stop immediately if you feel uncomfortable.",
  "Potential benefits. There may be no direct personal benefit. Your responses may help researchers improve accessible image descriptions.",
  "Information collected and privacy. The study records a coded Participant ID, accessibility background, answers, ratings, audio replay events, and response timing. Do not enter your name or contact information in study fields. Until the researcher saves the completed record, progress is stored in this browser so the session can recover after an accidental refresh.",
  "Open-ended and choice answers may be entered using optional live speech recognition. Microphone access starts only after you select an answer-by-voice or start-speaking button. This website stores selected answers and resulting text, not microphone audio, but your browser or operating system's speech service may process the audio. Review every recognized answer before continuing. Standard controls remain available.",
  "Questions or concerns. For questions about the study, its data-retention practices, your rights, or withdrawing submitted data, contact the researcher who provided your Participant ID before agreeing.",
  "Consent confirmation. I have read and understood the information above, had an opportunity to ask questions, and voluntarily agree to participate."
].join(" ");

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
            compare two descriptions of the same image.
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
  const [consentDecision, setConsentDecision] = useState("");

  return (
    <form
      className="panel consent-panel"
      aria-labelledby="consent-heading"
      onSubmit={(event) => {
        event.preventDefault();
        if (consentDecision === "decline") {
          decline();
          return;
        }
        if (consentDecision !== "agree") return;
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
      <QuestionAudioButton
        text={consentPlaybackText}
        speed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
        label="Play complete consent form"
      />
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
        Open-ended and choice answers may be entered using optional live speech recognition.
        Microphone access starts only after you select an answer-by-voice or Start speaking
        button. This website stores selected answers and resulting text, not microphone audio,
        but your browser or operating system&apos;s speech service may process the audio. Review every
        recognized answer before continuing. Standard controls remain available.
      </p>

      <h3>Questions or concerns</h3>
      <p>
        For questions about the study, its data-retention practices, your rights, or withdrawing
        submitted data, contact the researcher who provided your Participant ID before agreeing.
      </p>

      <RadioGroup
        legend="After reviewing the information, do you voluntarily agree to participate?"
        name="consentDecision"
        value={consentDecision}
        onChange={setConsentDecision}
        options={[
          { value: "agree", label: "I agree", aliases: ["agree", "yes", "consent"] },
          { value: "decline", label: "I do not agree", aliases: ["decline", "no", "do not consent"] }
        ]}
        required
        audioSpeed={state.selectedAudioSpeed}
        voiceURI={state.selectedVoiceURI}
      />

      <p className="help-text">Consent form version: {CONSENT_VERSION}</p>

      <div className="button-row">
        <AccessibleButton
          type="submit"
          variant={consentDecision === "decline" ? "danger" : "primary"}
          disabled={!consentDecision}
        >
          Confirm consent decision
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

      <div className="field-label">
        <label htmlFor="participant-id">Participant ID</label>
        <SpeechAnswerInput
          id="participant-id"
          rows={2}
          required
          value={currentParticipant.participantId}
          onChange={(participantId) => change({ participantId })}
        />
      </div>

      <RadioGroup
        legend="Researcher sequence group"
        name="sequenceGroup"
        value={currentParticipant.sequenceGroup}
        onChange={(value) =>
          change({ sequenceGroup: value as SequenceGroup })
        }
        options={["A", "B"].map((value) => ({
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
          label: value === "very-often" ? "Very often" : value
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
  const [practiceResponse, setPracticeResponse] = useState(state.practiceResponse);

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
              practiceResponse: practiceResponse.trim(),
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
          onClick={() => updateState({ phase: "audio-settings", practiceResponse })}
        >
          Change speed
        </AccessibleButton>
      </div>
    </section>
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
    { id: "interview-1", text: "Take a moment to reflect about when a description helped you build a clear mental map of a scene right away. What made it work so well?" },
    { id: "interview-2", text: "Did listening to these descriptions ever feel mentally tiring or overwhelming?" },
    { id: "interview-3", text: "If yes, what was happening?" },
    { id: "interview-4", text: "If not, what helped make the information easy to digest?" },
    { id: "interview-5", text: "If you were designing descriptions for artworks, what is the most important rule you would recommend for how spatial layouts should be described?" }
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
      <h2>Final Questions</h2>
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
