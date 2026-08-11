"use client";

import { QuestionAudioButton } from "@/components/QuestionAudioButton";

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
  "Strongly disagree",
  "Disagree",
  "Neither agree nor disagree",
  "Agree",
  "Strongly agree"
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
            <span>{labels[score - 1]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
