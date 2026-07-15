"use client";

import { FormEvent, useMemo, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RadioGroup } from "@/components/RadioGroup";
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

export function PreferenceFlow({ state, updateState }: Props) {
  const stimulus = preferenceStimuli[state.preferenceIndex];

  const randomizedOrder = useMemo(
    () =>
      shuffle(["baseline", "spatial", "semantic"]).map((condition, index) => ({
        label: ["A", "B", "C"][index] as DescriptionLabel,
        displayPosition: index + 1,
        condition,
        descriptionText: stimulus.descriptions[condition]
      })),
    [stimulus]
  );

  const [playbackEvents, setPlaybackEvents] = useState<PreferencePlaybackEvent[]>([]);
  const [replayCounts, setReplayCounts] = useState<Record<DescriptionLabel, number>>({
    A: 0,
    B: 0,
    C: 0
  });
  const [bestChoice, setBestChoice] = useState<DescriptionLabel | "">("");
  const [ranking, setRanking] = useState<PreferenceRanking>({
    first: "",
    second: "",
    third: ""
  });
  const [explanation, setExplanation] = useState("");

  const values = [ranking.first, ranking.second, ranking.third].filter(Boolean);
  const duplicate = values.length !== new Set(values).size;
  const complete = Boolean(ranking.first && ranking.second && ranking.third);

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!state.testMode && (!complete || duplicate)) return;

    const response: PreferenceResponse = {
      participantId: state.participant.participantId,
      sequenceGroup: state.participant.sequenceGroup,
      testMode: state.testMode,
      selectedAudioSpeed: state.selectedAudioSpeed,
      selectedVoiceURI: state.selectedVoiceURI,
      trialIndex: state.preferenceIndex + 1,
      uuid: stimulus.uuid,
      rowIndex: stimulus.rowIndex,
      complexityLevel: stimulus.complexityLevel,
      randomizedOrder,
      playbackEvents,
      replayCounts,
      bestChoice,
      ranking,
      explanation,
      submittedAt: new Date().toISOString()
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
        Listen to the three descriptions. You may play them in any order and replay them as
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

          <div className="description-text-block">
            <h4>Text of Description {item.label}</h4>
            <p>{item.descriptionText}</p>
          </div>
        </section>
      ))}

      <section className="question-card">
        <h3>Question 1: Best description</h3>
        <RadioGroup
          legend="Which description helped you understand the image best?"
          name="bestChoice"
          value={bestChoice}
          onChange={(value) => setBestChoice(value as DescriptionLabel)}
          options={["A", "B", "C"].map((label) => ({
            value: label,
            label: `Description ${label}`
          }))}
          required={!state.testMode}
        />
      </section>

      <section className="question-card">
        <h3>Question 2: Ranking</h3>
        <p>Choose the ranking from best to worst.</p>

        {(["first", "second", "third"] as const).map((position) => (
          <label key={position} className="field-label">
            {position === "first"
              ? "Best"
              : position === "second"
                ? "Second-best"
                : "Third-best"}{" "}
            description
            <select
              required={!state.testMode}
              value={ranking[position]}
              onChange={(event) =>
                setRanking((current) => ({
                  ...current,
                  [position]: event.target.value as DescriptionLabel | ""
                }))
              }
            >
              <option value="">Select one</option>
              <option value="A">Description A</option>
              <option value="B">Description B</option>
              <option value="C">Description C</option>
            </select>
          </label>
        ))}

        {duplicate && (
          <p className="warning">Each description can only appear once.</p>
        )}
      </section>

      <section className="question-card">
        <h3>Question 3: Explanation</h3>
        <label className="field-label">
          Why did you choose this ranking?
          <textarea
            required={!state.testMode}
            rows={5}
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
          />
        </label>
      </section>

      <AccessibleButton
        type="submit"
        disabled={!state.testMode && (!complete || duplicate)}
      >
        Save preference response
      </AccessibleButton>
    </form>
  );
}
