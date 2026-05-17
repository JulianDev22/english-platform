interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md';
  label?: string;
  animated?: boolean;
}

export function ProgressBar({ value, size = 'sm', label, animated = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-text-secondary">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-surface-3 ${size === 'sm' ? 'h-1' : 'h-2'}`}>
        <div
          className={`h-full rounded-full bg-accent ${animated && 'transition-all duration-700'}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
