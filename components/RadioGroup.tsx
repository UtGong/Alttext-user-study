type Option = { value: string; label: string };

type RadioGroupProps = {
  legend: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function RadioGroup({ legend, name, options, value, onChange, required }: RadioGroupProps) {
  return (
    <fieldset className="fieldset">
      <legend>{legend}</legend>
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
