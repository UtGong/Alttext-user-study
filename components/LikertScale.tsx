"use client";

import { QuestionAudioButton } from "@/components/QuestionAudioButton";
import { SpeechChoiceInput } from "@/components/SpeechChoiceInput";

type LikertScaleProps = {
  legend: string;
  name: string;
  value: number | null;
  onChange: (value: number) => void;
  required?: boolean;
  labels?: string[];
  audioSpeed?: number;
  voiceURI?: string;
};

const defaultLabels = [
  "Not at all",
  "Slightly",
  "Moderately",
  "Very",
  "Extremely well"
];

export function LikertScale({
  legend,
  name,
  value,
  onChange,
  required = true,
  labels = defaultLabels,
  audioSpeed = 1,
  voiceURI
}: LikertScaleProps) {
  const spokenText = `${legend} Answer choices: ${labels
    .map((label, index) => `${index + 1}, ${label}`)
    .join(". ")}.`;

  return (
    <fieldset className="fieldset">
      <legend>{legend}</legend>
      <QuestionAudioButton text={spokenText} speed={audioSpeed} voiceURI={voiceURI} />
      <SpeechChoiceInput
        id={`${name}-choice`}
        options={labels.map((label, index) => ({
          value: String(index + 1),
          label: `${index + 1}: ${label}`,
          aliases: [label, String(index + 1)]
        }))}
        onChange={(nextValue) => onChange(Number(nextValue))}
      />

      <div className="likert-row">
        {[1, 2, 3, 4, 5].map((score) => (
          <label key={score} className="radio-option">
            <input
              type="radio"
              name={name}
              value={score}
              checked={value === score}
              onChange={() => onChange(score)}
              required={required}
            />
            <span>{score}: {labels[score - 1]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
