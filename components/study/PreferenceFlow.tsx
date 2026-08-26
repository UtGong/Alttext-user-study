"use client";

import { FormEvent, useMemo, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { QuestionAudioButton } from "@/components/QuestionAudioButton";
import { RadioGroup } from "@/components/RadioGroup";
import { SpeechAnswerInput } from "@/components/SpeechAnswerInput";
import { StimulusImageToggle } from "@/components/StimulusImageToggle";
import { createStimulusTrialId, getPreferenceConditions, preferenceStimuli } from "@/lib/stimuli";
import {
  Condition,
  DescriptionLabel,
  PreferenceChoice,
  PreferencePlaybackEvent,
  PreferenceRanking,
  PreferenceResponse,
  StudyState
} from "@/types/study";

type Props = {
  state: StudyState;
  updateState: (patch: Partial<StudyState>) => void;
};

function shuffle(conditions: Condition[]) {
  const copy = [...conditions];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

const rankingQuestion = "Which description communicates the spatial arrangement more clearly?";
const explanationQuestion = "What made the spatial arrangement clearer, or why did you have no preference?";

export function PreferenceFlow({ state, updateState }: Props) {
  const stimulus = preferenceStimuli[state.preferenceIndex];

  const randomizedOrder = useMemo(
    () =>
      shuffle(getPreferenceConditions(stimulus)).map((condition, index) => ({
        label: ["A", "B"][index] as DescriptionLabel,
        displayPosition: index + 1,
        condition,
        descriptionText: stimulus.descriptions[condition],
        spatialExpressionCount: stimulus.descriptionMetrics?.[condition]?.spatialExpressionCount ?? null,
        kendallTau: stimulus.descriptionMetrics?.[condition]?.kendallTau ?? null
      })),
    [stimulus]
  );

  const [playbackEvents, setPlaybackEvents] = useState<PreferencePlaybackEvent[]>([]);
  const [replayCounts, setReplayCounts] = useState<Record<DescriptionLabel, number>>({ A: 0, B: 0 });
  const [choice, setChoice] = useState<PreferenceChoice | "">("");
  const [startedAt] = useState(new Date().toISOString());
  const [explanation, setExplanation] = useState("");

  const complete = Boolean(choice);
  const playedLabels = new Set(playbackEvents.map((event) => event.label));
  const allDescriptionsPlayed = ["A", "B"].every((label) =>
    playedLabels.has(label as DescriptionLabel)
  );

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!state.testMode && (!allDescriptionsPlayed || !complete)) return;

    const submittedAt = new Date().toISOString();
    const preferenceChoice: PreferenceChoice = choice || "none";
    const ranking: PreferenceRanking = preferenceChoice === "none"
      ? { first: "", second: "" }
      : {
          first: preferenceChoice,
          second: preferenceChoice === "A" ? "B" : "A"
        };
    const preferredCondition = preferenceChoice === "none"
      ? "none"
      : randomizedOrder.find((item) => item.label === preferenceChoice)?.condition ?? "none";
    const response: PreferenceResponse = {
      participantId: state.participant.participantId,
      sessionId: state.sessionId,
      trialId: createStimulusTrialId(stimulus),
      studyMode: "pilot-preference",
      sequenceGroup: state.participant.sequenceGroup,
      testMode: state.testMode,
      selectedAudioSpeed: state.selectedAudioSpeed,
      selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: state.preferenceIndex + 1,
      imageId: stimulus.uuid,
      imageFilename: stimulus.imageFilename,
      uuid: stimulus.uuid,
      role: "preference",
      imageSet: "preference",
      rowIndex: stimulus.rowIndex,
      complexityLevel: stimulus.complexityLevel,
      complexityScore: stimulus.complexityScore ?? null,
      randomizedOrder,
      baselineSpatialExpressionCount: stimulus.descriptionMetrics?.baseline?.spatialExpressionCount ?? null,
      spatialSpatialExpressionCount: stimulus.descriptionMetrics?.spatial?.spatialExpressionCount ?? null,
      spatialKendallTau: stimulus.descriptionMetrics?.spatial?.kendallTau ?? null,
      playbackEvents,
      replayCounts,
      preferenceChoice,
      preferenceResponse: preferenceChoice === "none" ? "No preference" : `Description ${preferenceChoice}`,
      bestChoice: preferenceChoice,
      preferredCondition,
      rankingQuestion,
      ranking,
      explanationQuestion,
      explanation,
      startedAt,
      responseTimeMs: Date.parse(submittedAt) - Date.parse(startedAt),
      submittedAt
    };

    const next = state.preferenceIndex + 1;

    updateState({
      preferenceResponses: [...state.preferenceResponses, response],
      preferenceIndex: next,
      phase: next >= preferenceStimuli.length ? "interview" : "preference"
    });
  }

  return (
    <form className="panel" onSubmit={submit}>
      <ProgressIndicator
        label="Preference trial"
        current={state.preferenceIndex + 1}
        total={preferenceStimuli.length}
      />

      <h2>Preference Trial {state.preferenceIndex + 1}</h2>
      <StimulusImageToggle
        imageFilename={stimulus.imageFilename}
        imageUrl={stimulus.imageUrl}
      />
      <p>
        Listen to the two descriptions. You may play them in any order and replay them as
        needed.
      </p>

      {state.testMode && (
        <p className="warning">TEST MODE: responses can be skipped.</p>
      )}

      {randomizedOrder.map((item) => (
        <section
          key={item.label}
          className="preference-description-card"
          aria-labelledby={`preference-description-${item.label}`}
        >
          <h3 id={`preference-description-${item.label}`}>Description {item.label}</h3>

          <AudioDescriptionPlayer
            description={item.descriptionText}
            speed={state.selectedAudioSpeed}
            voiceURI={state.selectedVoiceURI}
            mode="preference"
            label={`Description ${item.label}`}
            embedded
            onReplay={() =>
              setReplayCounts((current) => ({
                ...current,
                [item.label]: current[item.label] + 1
              }))
            }
            onPlaybackEvent={(event) =>
              setPlaybackEvents((current) => [
                ...current,
                {
                  ...event,
                  eventSequence: current.length + 1,
                  label: item.label,
                  condition: item.condition
                }
              ])
            }
          />
        </section>
      ))}

      <section className="question-card">
        <h3>Preference</h3>
        <p>
          Replay descriptions A and B as often as needed, then choose which one communicates the spatial arrangement more clearly.
          Both descriptions must be played before the preference is saved.
        </p>
        <RadioGroup
          legend={rankingQuestion}
          name="preferred-description"
          options={[
            { value: "A", label: "Description A", aliases: ["A"] },
            { value: "B", label: "Description B", aliases: ["B"] },
            { value: "none", label: "No preference", aliases: ["none", "no preference", "equal"] }
          ]}
          value={choice}
          onChange={(value) => setChoice(value as PreferenceChoice)}
          required={!state.testMode}
          audioSpeed={state.selectedAudioSpeed}
          voiceURI={state.selectedVoiceURI}
        />
        {!allDescriptionsPlayed && !state.testMode && (
          <p className="help-text" role="status">
            Listen to both descriptions before submitting your preference.
          </p>
        )}

      </section>

      <section className="question-card">
        <h3>Reason for preference</h3>
        <div className="field-label">
          <label htmlFor="ranking-explanation">{explanationQuestion}</label>
          <QuestionAudioButton
            text={explanationQuestion}
            speed={state.selectedAudioSpeed}
            voiceURI={state.selectedVoiceURI}
          />
          <SpeechAnswerInput
            id="ranking-explanation"
            required={!state.testMode}
            rows={5}
            value={explanation}
            onChange={setExplanation}
          />
        </div>
      </section>

      <AccessibleButton
        type="submit"
        disabled={!state.testMode && (!allDescriptionsPlayed || !complete)}
      >
        Save preference response
      </AccessibleButton>
    </form>
  );
}
