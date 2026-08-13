"use client";

import { FormEvent, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { LikertScale } from "@/components/LikertScale";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { QuestionAudioButton } from "@/components/QuestionAudioButton";
import { RadioGroup } from "@/components/RadioGroup";
import { SpeechAnswerInput } from "@/components/SpeechAnswerInput";
import { comprehensionStimuli, getComprehensionStimulus, getConditionForStimulus, getDescriptionForStimulus, preferenceStimuli } from "@/lib/stimuli";
import { AudioPlayEvent, LikertResponse, SpatialAnswer, StudyState } from "@/types/study";

type Props = { state: StudyState; updateState: (patch: Partial<StudyState>) => void };
type Step = "audio" | "recall" | "spatial" | "ratings" | "workload";

const agreementLabels = ["Not at all", "Slightly", "Moderately", "Very", "Extremely well"];
const workloadLabels = ["Very low", "Low", "Moderate", "High", "Very high"];
const recallPrompt = "Describe the scene in your own words. Mention what you remember, including the people or objects present, and how they were arranged in relation to each other.";
const ratingQuestions = {
  overallSceneClarity: "I could picture the overall scene in my mind.",
  spatialRelationsConfidence: "I could identify the spatial relationships among the described elements.",
  contentComprehension: "The description gave me enough information about where things were in the image."
};
const workloadQuestions = {
  mentalDemand: "How mentally demanding was it to understand this image description?",
  frustration: "How frustrated did you feel while understanding this image description?"
};
const likert = (value: number | null, labels: string[]): LikertResponse | null => value === null ? null : ({ value, label: labels[value - 1] });

export function ComprehensionFlow({ state, updateState }: Props) {
  const stimulus = getComprehensionStimulus(state.comprehensionOrder, state.comprehensionIndex);
  const condition = getConditionForStimulus(state.participant.sequenceGroup, stimulus);
  const descriptionText = getDescriptionForStimulus(state.participant.sequenceGroup, stimulus);
  const questions = stimulus.spatialQuestions ?? [];
  const [step, setStep] = useState<Step>("audio");
  const [played, setPlayed] = useState(state.testMode);
  const [audioCompleted, setAudioCompleted] = useState(state.testMode);
  const [playEvents, setPlayEvents] = useState<AudioPlayEvent[]>([]);
  const [freeRecall, setFreeRecall] = useState("");
  const [spatialAnswers, setSpatialAnswers] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState({ overallSceneClarity: null as number | null, spatialRelationsConfidence: null as number | null, contentComprehension: null as number | null });
  const [workload, setWorkload] = useState({ mentalDemand: null as number | null, frustration: null as number | null });
  const [startedAt] = useState(new Date().toISOString());
  const [stepStartedAt, setStepStartedAt] = useState(startedAt);
  const [stepTimestamps, setStepTimestamps] = useState<Record<string, { startedAt: string; completedAt: string; responseTimeMs: number }>>({});
  const [audioStartedAt, setAudioStartedAt] = useState<string>();
  const [audioEndedAt, setAudioEndedAt] = useState<string>();

  function advance(next: Step) {
    const completedAt = new Date().toISOString();
    setStepTimestamps((current) => ({ ...current, [step]: { startedAt: stepStartedAt, completedAt, responseTimeMs: Date.parse(completedAt) - Date.parse(stepStartedAt) } }));
    setStepStartedAt(completedAt);
    setStep(next);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const submittedAt = new Date().toISOString();
    const finalSteps = { ...stepTimestamps, workload: { startedAt: stepStartedAt, completedAt: submittedAt, responseTimeMs: Date.parse(submittedAt) - Date.parse(stepStartedAt) } };
    const answers: SpatialAnswer[] = questions.map((q) => {
      const answer = spatialAnswers[q.id] ?? "";
      const isUncertain = answer === "Not sure";
      return { questionId: q.id, frameOfReference: q.frameOfReference, objectFocus: q.objectFocus ?? "main", question: q.question, answer, correctAnswer: q.correctAnswer ?? null, isCorrect: q.correctAnswer && !isUncertain ? answer === q.correctAnswer : null, isUncertain, requiresManualCoding: Boolean(q.requiresManualCoding) };
    });
    const eligible = answers.filter((answer) => answer.correctAnswer !== null && !answer.isUncertain);
    const next = state.comprehensionIndex + 1;
    updateState({
      comprehensionResponses: [...state.comprehensionResponses, {
        participantId: state.participant.participantId, sequenceGroup: state.participant.sequenceGroup, testMode: state.testMode,
        selectedAudioSpeed: state.selectedAudioSpeed, selectedVoiceURI: state.selectedVoiceURI, trialIndex: next, randomizedDisplayPosition: next,
        imageId: stimulus.uuid, imageFilename: stimulus.imageFilename, uuid: stimulus.uuid, rowIndex: stimulus.rowIndex, complexityLevel: stimulus.complexityLevel,
        imageSet: stimulus.imageSet, condition, descriptionText, replayCount: Math.max(0, playEvents.length - 1), replayed: playEvents.length > 1,
        audioPlayEvents: playEvents, startedAt, audioStartedAt, audioEndedAt, submittedAt, freeRecallQuestion: recallPrompt, freeRecall, spatialAnswers: answers,
        spatialAccuracyScore: eligible.filter((answer) => answer.isCorrect).length, spatialEligibleQuestionCount: eligible.length,
        ratings: { overallSceneClarity: likert(ratings.overallSceneClarity, agreementLabels), spatialRelationsConfidence: likert(ratings.spatialRelationsConfidence, agreementLabels), contentComprehension: likert(ratings.contentComprehension, agreementLabels) }, ratingQuestions,
        workload: { mentalDemand: likert(workload.mentalDemand, workloadLabels), frustration: likert(workload.frustration, workloadLabels) }, workloadQuestions, stepTimestamps: finalSteps
      }],
      comprehensionIndex: next,
      phase: next >= comprehensionStimuli.length ? (preferenceStimuli.length ? "preference" : "interview") : "comprehension"
    });
  }

  const required = !state.testMode;
  return <form className="panel" onSubmit={submit}>
    <ProgressIndicator label="Comprehension trial" current={state.comprehensionIndex + 1} total={comprehensionStimuli.length} />
    <h2>Comprehension Trial {state.comprehensionIndex + 1}</h2>
    {state.testMode && <p className="warning">TEST MODE: required responses and audio playback can be skipped.</p>}

    <AudioDescriptionPlayer description={descriptionText} speed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} mode="trial" label="description" maxReplays={1}
      onPlayed={() => { setPlayed(true); setAudioCompleted(false); setAudioStartedAt(new Date().toISOString()); }} onPlaybackEvent={(event) => setPlayEvents((current) => [...current, event])} onEnded={() => { setAudioCompleted(true); setAudioEndedAt(new Date().toISOString()); }} />

    {step === "audio" && <AccessibleButton type="button" disabled={required && (!played || !audioCompleted)} onClick={() => advance("recall")}>Continue</AccessibleButton>}

    {step === "recall" && <section className="question-card"><h3>Scene recall</h3><div className="field-label"><label htmlFor="free-recall">{recallPrompt}</label><QuestionAudioButton text={recallPrompt} speed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} /><SpeechAnswerInput id="free-recall" required={required} rows={6} value={freeRecall} onChange={setFreeRecall} /></div><AccessibleButton type="button" disabled={required && !freeRecall.trim()} onClick={() => advance(questions.length ? "spatial" : "ratings")}>Continue</AccessibleButton></section>}

    {step === "spatial" && questions.length > 0 && <section className="question-card"><h3>Spatial relations</h3>{questions.map((q, i) => <RadioGroup key={q.id} legend={`${i + 1}. ${q.question}`} name={q.id} value={spatialAnswers[q.id] ?? ""} onChange={(value) => setSpatialAnswers((v) => ({ ...v, [q.id]: value }))} options={[...q.options, ...(q.options.includes("Not sure") ? [] : ["Not sure"])].map((x) => ({ value: x, label: x }))} required={required} audioSpeed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} />)}<AccessibleButton type="button" disabled={required && questions.some((q) => !spatialAnswers[q.id])} onClick={() => advance("ratings")}>Continue</AccessibleButton></section>}

    {step === "ratings" && <section className="question-card"><h3>Experience ratings</h3>
      <LikertScale legend={ratingQuestions.overallSceneClarity} name="overallSceneClarity" value={ratings.overallSceneClarity} onChange={(value) => setRatings((v) => ({ ...v, overallSceneClarity: value }))} required={required} labels={agreementLabels} audioSpeed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} />
      <LikertScale legend={ratingQuestions.spatialRelationsConfidence} name="spatialRelationsConfidence" value={ratings.spatialRelationsConfidence} onChange={(value) => setRatings((v) => ({ ...v, spatialRelationsConfidence: value }))} required={required} labels={agreementLabels} audioSpeed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} />
      <LikertScale legend={ratingQuestions.contentComprehension} name="contentComprehension" value={ratings.contentComprehension} onChange={(value) => setRatings((v) => ({ ...v, contentComprehension: value }))} required={required} labels={agreementLabels} audioSpeed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} />
      <AccessibleButton type="button" disabled={required && Object.values(ratings).some((value) => value === null)} onClick={() => advance("workload")}>Continue</AccessibleButton></section>}

    {step === "workload" && <section className="question-card"><h3>Workload</h3>{(Object.entries(workloadQuestions) as [keyof typeof workloadQuestions, string][]).map(([name, legend]) => <LikertScale key={name} legend={legend} name={name} value={workload[name]} onChange={(value) => setWorkload((v) => ({ ...v, [name]: value }))} labels={workloadLabels} required={required} audioSpeed={state.selectedAudioSpeed} voiceURI={state.selectedVoiceURI} />)}<AccessibleButton type="submit" disabled={required && Object.values(workload).some((value) => value === null)}>Save and continue</AccessibleButton></section>}
  </form>;
}
