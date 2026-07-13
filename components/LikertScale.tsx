"use client";

type LikertScaleProps = {
  legend: string;
  name: string;
  value: number | null;
  onChange: (value: number) => void;
  required?: boolean;
  labels?: string[];
};

const defaultLabels = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree"
];

export function LikertScale({
  legend,
  name,
  value,
  onChange,
  required = true,
  labels = defaultLabels
}: LikertScaleProps) {
  return (
    <fieldset className="fieldset">
      <legend>{legend}</legend>

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
            <span>
              {score}. {labels[score - 1]}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}