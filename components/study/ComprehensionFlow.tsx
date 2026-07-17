"use client";

import { FormEvent, useMemo, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { LikertScale } from "@/components/LikertScale";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RadioGroup } from "@/components/RadioGroup";
import {
  comprehensionStimuli,
  getComprehensionStimulus,
  getConditionForStimulus,
  getDescriptionForStimulus
} from "@/lib/stimuli";
import { AudioPlayEvent, Ratings, SpatialAnswer, SpatialQuestion, StudyState } from "@/types/study";

type Props = { state: StudyState; updateState: (patch: Partial<StudyState>) => void };

function sixQuestions(stimulus: (typeof comprehensionStimuli)[number]): SpatialQuestion[] {
  const main = stimulus.spatialQuestions.slice(0, 3).map((question) => ({
    ...question,
    objectFocus: "main" as const,
    options: Array.from(
      new Set([
        ...question.options.filter((option) => option !== "Not sure"),
        "Not sure"
      ])
    )
  }));
  const elements = stimulus.targetElements;
  const templates = [
    (a: string, b: string) =>
      `Were ${a} and ${b} described as being close to each other?`,
    (a: string, b: string) =>
      `Were ${a} and ${b} described as being on the same side of the image?`,
    (a: string, b: string) =>
      `Was the position of ${a} described relative to ${b}?`
  ];
  const secondary = templates.map((template, index) => {
    const a = elements[(index + 2) % elements.length] ?? "the secondary object";
    const b = elements[(index + 3) % elements.length] ?? "another object";
    return {
      id: `${stimulus.rowIndex}_secondary_${index + 1}`,
      frameOfReference: "qualitative-relation" as const,
      objectFocus: "secondary" as const,
      question: template(a, b),
      options: ["Yes", "No"],
      requiresManualCoding: true
    };
  });
  return [...main, ...secondary];
}

export function ComprehensionFlow({ state, updateState }: Props) {
  const stimulus = getComprehensionStimulus(
    state.comprehensionOrder,
    state.comprehensionIndex
  );
  const condition = getConditionForStimulus(state.participant.sequenceGroup, stimulus);
  const descriptionText = getDescriptionForStimulus(state.participant.sequenceGroup, stimulus);
  const questions = useMemo(() => sixQuestions(stimulus), [stimulus]);
  const [played, setPlayed] = useState(state.testMode);
  const [playEvents, setPlayEvents] = useState<AudioPlayEvent[]>([]);
  const [gistAnswer, setGistAnswer] = useState("");
  const [freeRecall, setFreeRecall] = useState("");
  const [spatialAnswers, setSpatialAnswers] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Ratings>({
    overallSceneClarity: null,
    spatialRelationsConfidence: null,
    contentComprehension: null
  });
  const [startedAt] = useState(new Date().toISOString());
  const [audioStartedAt, setAudioStartedAt] = useState<string>();
  const [audioEndedAt, setAudioEndedAt] = useState<string>();

  function submit(event: FormEvent) {
    event.preventDefault();
    const answers: SpatialAnswer[] = questions.map((q) => {
      const answer = spatialAnswers[q.id] ?? "";
      const manual = Boolean(q.requiresManualCoding);
      return {
        questionId: q.id,
        frameOfReference: q.frameOfReference,
        objectFocus: q.objectFocus ?? "main",
        question: q.question,
        answer,
        correctAnswer: q.correctAnswer ?? null,
        isCorrect: manual || answer === "Not sure" ? null : answer === q.correctAnswer,
        requiresManualCoding: manual
      };
    });
    const next = state.comprehensionIndex + 1;
    updateState({
      comprehensionResponses: [...state.comprehensionResponses, {
        participantId: state.participant.participantId,
        sequenceGroup: state.participant.sequenceGroup,
        testMode: state.testMode,
        selectedAudioSpeed: state.selectedAudioSpeed,
        selectedVoiceURI: state.selectedVoiceURI,
        trialIndex: state.comprehensionIndex + 1,
        randomizedDisplayPosition: state.comprehensionIndex + 1,
        imageId: stimulus.uuid,
        imageFilename: stimulus.imageFilename,
        uuid: stimulus.uuid,
        rowIndex: stimulus.rowIndex,
        complexityLevel: stimulus.complexityLevel,
        imageSet: stimulus.imageSet,
        condition,
        descriptionText,
        replayCount: Math.max(0, playEvents.length - 1),
        replayed: playEvents.length > 1,
        audioPlayEvents: playEvents,
        startedAt,
        audioStartedAt,
        audioEndedAt,
        submittedAt: new Date().toISOString(),
        gistAnswer,
        freeRecall,
        spatialAnswers: answers,
        ratings
      }],
      comprehensionIndex: next,
      phase: next >= comprehensionStimuli.length ? "workload" : "comprehension"
    });
  }

  return <form className="panel" onSubmit={submit}>
    <ProgressIndicator label="Comprehension trial" current={state.comprehensionIndex + 1} total={comprehensionStimuli.length} />
    <h2>Comprehension Trial {state.comprehensionIndex + 1}</h2>
    {state.testMode && <p className="warning">TEST MODE: required responses and audio playback can be skipped.</p>}
    <AudioDescriptionPlayer description={descriptionText} speed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} mode="trial" label="description" maxReplays={1}
      onPlayed={() => { setPlayed(true); setAudioStartedAt(new Date().toISOString()); }}
      onPlaybackEvent={(event) => setPlayEvents((current) => [...current, event])}
      onEnded={() => setAudioEndedAt(new Date().toISOString())} />

    <section className="question-card"><h3>Question 1: Main idea</h3><label className="field-label">
      {stimulus.gistQuestion?.question ?? "What kind of scene or main subject was described?"}
      <textarea required={!state.testMode} rows={3} value={gistAnswer} onChange={(e) => setGistAnswer(e.target.value)} />
    </label></section>

    <section className="question-card"><h3>Question 2: Free recall</h3><label className="field-label">
      Please describe the scene in your own words. Include the objects or people you remember, how they were related or arranged, and any actions or other details that helped you understand the scene.
      <textarea required={!state.testMode} rows={6} value={freeRecall} onChange={(e) => setFreeRecall(e.target.value)} />
    </label><p className="help-text">There is no single correct wording. We are interested in the mental representation you formed from the description.</p></section>

    <section className="question-card"><h3>Question 3: Spatial relations</h3>
      <p>Questions 1 to 3 include a Not sure option. Questions 4 to 6 use Yes or No responses.</p>
      {questions.map((q, i) => <RadioGroup key={q.id} legend={`${i + 1}. ${q.question}`} name={q.id} value={spatialAnswers[q.id] ?? ""}
        onChange={(value) => setSpatialAnswers((v) => ({ ...v, [q.id]: value }))}
        options={q.options.map((x) => ({ value: x, label: x }))} required={!state.testMode} />)}
    </section>

    <section className="question-card"><h3>Experience ratings</h3>
      <LikertScale legend="I could picture the overall scene in my mind." name="overallSceneClarity" value={ratings.overallSceneClarity} onChange={(value) => setRatings((current) => ({ ...current, overallSceneClarity: value }))} required={!state.testMode} />
      <LikertScale legend="I could identify the spatial relationships among the described elements." name="spatialRelationsConfidence" value={ratings.spatialRelationsConfidence} onChange={(value) => setRatings((current) => ({ ...current, spatialRelationsConfidence: value }))} required={!state.testMode} />
      <LikertScale legend="I understood the main subject and actions in the image." name="contentComprehension" value={ratings.contentComprehension} onChange={(value) => setRatings((current) => ({ ...current, contentComprehension: value }))} required={!state.testMode} />
    </section>

    <AccessibleButton type="submit" disabled={!played && !state.testMode}>Save and continue</AccessibleButton>
  </form>;
}
