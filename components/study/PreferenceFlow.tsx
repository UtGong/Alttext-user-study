"use client";

import { FormEvent, useMemo, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { QuestionAudioButton } from "@/components/QuestionAudioButton";
import { RadioGroup } from "@/components/RadioGroup";
import { SpeechAnswerInput } from "@/components/SpeechAnswerInput";
import { STUDY_CONDITIONS } from "@/lib/config";
import { preferenceStimuli } from "@/lib/stimuli";
import {
  Condition,
  DescriptionLabel,
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

const rankingQuestion = "Which description did you prefer, A or B?";
const explanationQuestion = "Why did you prefer that description?";

export function PreferenceFlow({ state, updateState }: Props) {
  const stimulus = preferenceStimuli[state.preferenceIndex];

  const randomizedOrder = useMemo(
    () =>
      shuffle(STUDY_CONDITIONS).map((condition, index) => ({
        label: ["A", "B"][index] as DescriptionLabel,
        displayPosition: index + 1,
        condition,
        descriptionText: stimulus.descriptions[condition]
      })),
    [stimulus]
  );

  const [playbackEvents, setPlaybackEvents] = useState<PreferencePlaybackEvent[]>([]);
  const [replayCounts, setReplayCounts] = useState<Record<DescriptionLabel, number>>({ A: 0, B: 0 });
  const [ranking, setRanking] = useState<PreferenceRanking>({
    first: "",
    second: ""
  });
  const [startedAt] = useState(new Date().toISOString());
  const [explanation, setExplanation] = useState("");

  const complete = Boolean(ranking.first && ranking.second);
  const playedLabels = new Set(playbackEvents.map((event) => event.label));
  const allDescriptionsPlayed = ["A", "B"].every((label) =>
    playedLabels.has(label as DescriptionLabel)
  );

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!state.testMode && (!allDescriptionsPlayed || !complete)) return;

    const submittedAt = new Date().toISOString();
    const bestChoice = ranking.first;
    const response: PreferenceResponse = {
      participantId: state.participant.participantId,
      sequenceGroup: state.participant.sequenceGroup,
      testMode: state.testMode,
      selectedAudioSpeed: state.selectedAudioSpeed,
      selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: state.preferenceIndex + 1,
      imageId: stimulus.uuid,
      imageFilename: stimulus.imageFilename,
      uuid: stimulus.uuid,
      rowIndex: stimulus.rowIndex,
      complexityLevel: stimulus.complexityLevel,
      randomizedOrder,
      playbackEvents,
      replayCounts,
      bestChoice,
      preferredCondition: randomizedOrder.find((item) => item.label === bestChoice)?.condition ?? "",
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
      <p>
        Listen to the two descriptions. You may play them in any order and replay them as
        needed.
      </p>

      {state.testMode && (
        <p className="warning">TEST MODE: responses can be skipped.</p>
      )}

      {randomizedOrder.map((item) => (
        <section key={item.label} className="question-card">
          <h3>Description {item.label}</h3>

          <AudioDescriptionPlayer
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
          Replay descriptions A and B as often as needed, then choose which one you preferred.
          Both descriptions must be played before the preference is saved.
        </p>
        <RadioGroup
          legend={rankingQuestion}
          name="preferred-description"
          options={(["A", "B"] as DescriptionLabel[]).map((label) => ({
            value: label,
            label: `Description ${label}`,
            aliases: [label]
          }))}
          value={ranking.first}
          onChange={(value) => {
            const first = value as DescriptionLabel;
            setRanking({ first, second: first === "A" ? "B" : "A" });
          }}
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
