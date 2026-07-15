"use client";

import { FormEvent, useMemo, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { LikertScale } from "@/components/LikertScale";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RadioGroup } from "@/components/RadioGroup";
import { comprehensionStimuli, getConditionForStimulus, getDescriptionForStimulus } from "@/lib/stimuli";
import { AudioPlayEvent, Ratings, SpatialAnswer, SpatialQuestion, StudyState } from "@/types/study";

type Props = { state: StudyState; updateState: (patch: Partial<StudyState>) => void };

function sixQuestions(stimulus: (typeof comprehensionStimuli)[number]): SpatialQuestion[] {
  const main = stimulus.spatialQuestions.slice(0, 3).map((q) => ({ ...q, objectFocus: "main" as const }));
  const elements = stimulus.targetElements;
  const secondary = [0, 1, 2].map((i) => {
    const a = elements[(i + 2) % elements.length] ?? "secondary object";
    const b = elements[(i + 3) % elements.length] ?? "another object";
    return {
      id: `${stimulus.rowIndex}_secondary_${i + 1}`,
      frameOfReference: "qualitative-relation" as const,
      objectFocus: "secondary" as const,
      question: `Where was ${a} in relation to ${b}?`,
      options: ["Left", "Right", "Above", "Below", "In front of", "Behind", "Not sure"],
      requiresManualCoding: true
    };
  });
  return [...main, ...secondary];
}

export function ComprehensionFlow({ state, updateState }: Props) {
  const stimulus = comprehensionStimuli[state.comprehensionIndex];
  const condition = getConditionForStimulus(state.participant.sequenceGroup, stimulus);
  const descriptionText = getDescriptionForStimulus(state.participant.sequenceGroup, stimulus);
  const questions = useMemo(() => sixQuestions(stimulus), [stimulus]);
  const [played, setPlayed] = useState(state.testMode);
  const [playEvents, setPlayEvents] = useState<AudioPlayEvent[]>([]);
  const [gistAnswer, setGistAnswer] = useState("");
  const [freeRecall, setFreeRecall] = useState("");
  const [spatialAnswers, setSpatialAnswers] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Ratings>({ mentalImageClarity: null, spatialClarity: null, perceivedQuality: null });
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
        isCorrect: manual ? null : answer === q.correctAnswer,
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
      <p>The first three questions concern main scene elements. The next three concern secondary scene elements.</p>
      {questions.map((q, i) => <RadioGroup key={q.id} legend={`${i + 1}. ${q.question}`} name={q.id} value={spatialAnswers[q.id] ?? ""}
        onChange={(value) => setSpatialAnswers((v) => ({ ...v, [q.id]: value }))}
        options={q.options.map((x) => ({ value: x, label: x }))} required={!state.testMode} />)}
    </section>

    <section className="question-card"><h3>Question 4: Ratings</h3>
      <LikertScale legend="I could form a clear mental image of the scene." name="mentalImageClarity" value={ratings.mentalImageClarity} onChange={(v) => setRatings((r) => ({ ...r, mentalImageClarity: v }))} required={!state.testMode} />
      <LikertScale legend="I understood where the described elements were located in the image." name="spatialClarity" value={ratings.spatialClarity} onChange={(v) => setRatings((r) => ({ ...r, spatialClarity: v }))} required={!state.testMode} />
      <LikertScale legend="This description was useful for understanding the image." name="perceivedQuality" value={ratings.perceivedQuality} onChange={(v) => setRatings((r) => ({ ...r, perceivedQuality: v }))} required={!state.testMode} />
    </section>
    <AccessibleButton type="submit" disabled={!played && !state.testMode}>Save and continue</AccessibleButton>
  </form>;
}
