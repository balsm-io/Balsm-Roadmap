// Balsm DS — ProgressButton
// A button whose own surface fills with progress, or sweeps an
// indeterminate sheen, or shows an inline spinner while working.
// Built on .b-btn. variant: primary | secondary | ghost | danger

export function ProgressButton({
  progress,                 // 0–100 determinate fill; omit for none
  loading = false,          // show inline spinner + aria-busy
  indeterminate = false,    // sweeping sheen, unknown duration
  variant = 'primary',
  size = 'md',
  showPct = false,
  children,
  disabled,
  className = '',
  ...rest
}) {
  const pct = progress == null ? null : Math.max(0, Math.min(100, progress));
  const cls = [
    'b-btn', `b-btn-${variant}`, `b-btn-${size}`,
    'b-progress-btn',
    indeterminate && 'b-progress-btn--indeterminate',
    variant !== 'primary' && `b-progress-btn--${variant}`,
    loading && 'b-btn--loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={cls}
      disabled={disabled}
      aria-busy={loading || indeterminate || undefined}
      {...rest}
    >
      <span
        className="b-progress-btn__fill"
        style={indeterminate ? undefined : { width: `${pct ?? 0}%` }}
        aria-hidden="true"
      />
      <span className="b-progress-btn__label">
        {loading && <span className="b-spinner" aria-hidden="true" />}
        {children}
        {showPct && pct != null && <span className="b-progress-btn__pct">{Math.round(pct)}%</span>}
      </span>
    </button>
  );
}
