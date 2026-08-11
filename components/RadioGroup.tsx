"use client";

import { QuestionAudioButton } from "@/components/QuestionAudioButton";

type Option = { value: string; label: string };

type RadioGroupProps = {
  legend: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  audioSpeed?: number;
  voiceURI?: string;
};

export function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
  required,
  audioSpeed = 1,
  voiceURI
}: RadioGroupProps) {
  const spokenText = `${legend} Answer choices: ${options
    .map((option) => option.label)
    .join(". ")}.`;

  return (
    <fieldset className="fieldset">
      <legend>{legend}</legend>
      <QuestionAudioButton text={spokenText} speed={audioSpeed} voiceURI={voiceURI} />
      <div className="radio-stack">
        {options.map((option) => (
          <label key={option.value} className="radio-label">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange(event.target.value)}
              required={required}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
