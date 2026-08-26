// Balsm DS — Progress (linear bar + circular ring)
// Determinate (value 0–100) or indeterminate (value omitted).
// Offline-default: `state` covers syncing / paused / queued sync flows.
//
// variant: primary | accent | success | warning | danger | violet | expiring | brand
// size:    sm | md | lg

export function Progress({
  value,                 // 0–100; omit/null => indeterminate
  variant = 'primary',
  size = 'md',
  label,
  showValue = false,
  indeterminate,         // force indeterminate even with a value
  striped = false,       // moving stripe overlay — "actively syncing"
  state,                 // 'syncing' | 'paused' | 'queued' convenience
  format = (v) => `${Math.round(v)}%`,
  className = '',
  style,
  ...rest
}) {
  const stateStriped = state === 'syncing';
  const isIndet = indeterminate ?? (value == null) ?? false;
  const pct = isIndet ? null : Math.max(0, Math.min(100, value));

  const cls = [
    'b-progress',
    `b-progress--${variant}`,
    size !== 'md' && `b-progress--${size}`,
    isIndet && 'b-progress--indeterminate',
    (striped || stateStriped) && 'b-progress--striped',
    state === 'paused' && 'b-progress--paused',
    state === 'queued' && 'b-progress--queued',
    className,
  ].filter(Boolean).join(' ');

  const showHead = label || showValue;

  return (
    <div
      className={cls}
      style={style}
      role="progressbar"
      aria-valuenow={isIndet ? undefined : pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={typeof label === 'string' ? label : undefined}
      {...rest}
    >
      {showHead && (
        <div className="b-progress__head">
          {label && <span className="b-progress__label">{label}</span>}
          {showValue && !isIndet && <span className="b-progress__value">{format(pct)}</span>}
        </div>
      )}
      <div className="b-progress__track">
        <span
          className="b-progress__fill"
          style={isIndet ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Circular / ring progress (determinate) ───────────────────────
export function ProgressRing({
  value = 0,
  size = 64,
  thickness = 6,
  variant = 'primary',
  showValue = true,
  format = (v) => `${Math.round(v)}%`,
  label,
  className = '',
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  const cls = ['b-progress-ring', `b-progress-ring--${variant}`, className]
    .filter(Boolean).join(' ');

  return (
    <span
      className={cls}
      style={{ width: size, height: size, ...style }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      {...rest}
    >
      <svg width={size} height={size}>
        <circle className="b-progress-ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={thickness} />
        <circle
          className="b-progress-ring__fill"
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={thickness}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      {showValue && (
        <span className="b-progress-ring__center" style={{ fontSize: Math.round(size * 0.26) }}>
          {format(pct)}
        </span>
      )}
    </span>
  );
}
