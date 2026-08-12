"use client";

import { FormEvent, useMemo, useState } from "react";
import { AccessibleButton } from "@/components/AccessibleButton";
import { AudioDescriptionPlayer } from "@/components/AudioDescriptionPlayer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { QuestionAudioButton } from "@/components/QuestionAudioButton";
import { SpeechAnswerInput } from "@/components/SpeechAnswerInput";
import { SpeechChoiceInput } from "@/components/SpeechChoiceInput";
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

const rankingQuestion = "Rank descriptions A, B, C, and D from best to worst. Choose each description only once.";
const explanationQuestion = "Why did you choose this ranking?";

function parseSpokenRanking(value: string): PreferenceRanking | null {
  const labels = value.toUpperCase().match(/\b[A-D]\b/g) as DescriptionLabel[] | null;
  if (!labels || labels.length !== 4 || new Set(labels).size !== 4) return null;
  return { first: labels[0], second: labels[1], third: labels[2], fourth: labels[3] };
}

export function PreferenceFlow({ state, updateState }: Props) {
  const stimulus = preferenceStimuli[state.preferenceIndex];

  const randomizedOrder = useMemo(
    () =>
      shuffle(["baseline", "spatial", "semantic", "spatial2d"]).map((condition, index) => ({
        label: ["A", "B", "C", "D"][index] as DescriptionLabel,
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
    C: 0,
    D: 0
  });
  const [ranking, setRanking] = useState<PreferenceRanking>({
    first: "",
    second: "",
    third: "",
    fourth: ""
  });
  const [startedAt] = useState(new Date().toISOString());
  const [explanation, setExplanation] = useState("");

  const values = [ranking.first, ranking.second, ranking.third, ranking.fourth].filter(Boolean);
  const duplicate = values.length !== new Set(values).size;
  const complete = Boolean(ranking.first && ranking.second && ranking.third && ranking.fourth);
  const playedLabels = new Set(playbackEvents.map((event) => event.label));
  const allDescriptionsPlayed = ["A", "B", "C", "D"].every((label) =>
    playedLabels.has(label as DescriptionLabel)
  );

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!state.testMode && (!allDescriptionsPlayed || !complete || duplicate)) return;

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
        Listen to the four descriptions. You may play them in any order and replay them as
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
        <h3>Ranking</h3>
        <p>
          Replay descriptions A, B, C, and D as often as needed, then choose the ranking from
          best to worst. All four descriptions must be played before the ranking is saved.
        </p>
        <QuestionAudioButton
          text={rankingQuestion}
          speed={state.selectedAudioSpeed}
          voiceURI={state.selectedVoiceURI}
        />
        <SpeechChoiceInput
          id="preference-ranking-choice"
          buttonLabel="Rank by voice"
          listeningPrompt="Listening. Say the four description letters from best to worst, for example, A, C, D, B."
          helpText="Say all four description letters from best to worst. The four ranking controls will be updated; review them before continuing."
          options={[
            "A B C D", "A B D C", "A C B D", "A C D B", "A D B C", "A D C B",
            "B A C D", "B A D C", "B C A D", "B C D A", "B D A C", "B D C A",
            "C A B D", "C A D B", "C B A D", "C B D A", "C D A B", "C D B A",
            "D A B C", "D A C B", "D B A C", "D B C A", "D C A B", "D C B A"
          ].map((value) => ({
            value,
            label: value.split(" ").join(", "),
            aliases: [value, value.split(" ").map((label) => `description ${label}`).join(" ")]
          }))}
          onChange={(value) => {
            const nextRanking = parseSpokenRanking(value);
            if (nextRanking) setRanking(nextRanking);
          }}
        />
        {!allDescriptionsPlayed && !state.testMode && (
          <p className="help-text" role="status">
            Listen to all four descriptions before submitting your ranking.
          </p>
        )}

        {(["first", "second", "third", "fourth"] as const).map((position) => (
          <label key={position} className="field-label">
            {position === "first"
              ? "Best"
              : position === "second"
                ? "Second-best"
                : position === "third"
                  ? "Third-best"
                  : "Fourth-best"}{" "}
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
              <option value="D">Description D</option>
            </select>
          </label>
        ))}

        {duplicate && (
          <p className="warning">Each description can only appear once.</p>
        )}
      </section>

      <section className="question-card">
        <h3>Reason for ranking</h3>
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
        disabled={!state.testMode && (!allDescriptionsPlayed || !complete || duplicate)}
      >
        Save preference response
      </AccessibleButton>
    </form>
  );
}
