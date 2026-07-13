type ProgressIndicatorProps = {
  label: string;
  current: number;
  total: number;
};

export function ProgressIndicator({ label, current, total }: ProgressIndicatorProps) {
  return (
    <p className="progress" aria-live="polite">
      {label}: {current} of {total}
    </p>
  );
}
