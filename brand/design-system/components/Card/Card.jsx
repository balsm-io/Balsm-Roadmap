// Balsm DS — Card
// Surface container. Three shapes of the same box:
//   default      — header / body / footer content card
//   metric       — a single number is the content
//   interactive  — the whole card is a button
//
// accent puts a hairline of clinical meaning on the TOP edge, not
// the left: a left accent lands on the wrong side in RTL.

export function Card({
  title = null,
  subtitle = null,
  actions = null,
  footer = null,
  size = 'md',
  accent = null,
  interactive = false,
  selected = false,
  flush = false,
  onClick = null,
  children,
  className = '',
  style,
  ...rest
}) {
  const cls = [
    'b-card',
    size !== 'md' && `b-card--${size}`,
    accent && `b-card--accent b-card--accent-${accent}`,
    (interactive || onClick) && 'b-card--interactive',
    selected && 'b-card--selected',
    flush && 'b-card--flush',
    className,
  ].filter(Boolean).join(' ');

  const Tag = (interactive || onClick) ? 'button' : 'div';

  return (
    <Tag
      className={cls}
      style={style}
      onClick={onClick || undefined}
      type={Tag === 'button' ? 'button' : undefined}
      aria-pressed={Tag === 'button' && selected ? true : undefined}
      {...rest}
    >
      {(title || actions) && (
        <div className="b-card__header">
          <div>
            {title && <div className="b-card__title">{title}</div>}
            {subtitle && <div className="b-card__subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="b-card__actions">{actions}</div>}
        </div>
      )}
      <div className="b-card__body">{children}</div>
      {footer && <div className="b-card__footer">{footer}</div>}
    </Tag>
  );
}

// A metric card is common enough to deserve its own door.
export function MetricCard({
  label,
  value,
  delta = null,
  direction = 'flat',
  accent = null,
  className = '',
  ...rest
}) {
  return (
    <Card size="sm" accent={accent} className={`b-card--metric ${className}`.trim()} {...rest}>
      <div className="b-card__metric-label">{label}</div>
      <div className="b-card__metric-value">{value}</div>
      {delta && (
        <div className={`b-card__metric-delta b-card__metric-delta--${direction}`}>
          {direction === 'up' ? '↑' : direction === 'down' ? '↓' : '·'} {delta}
        </div>
      )}
    </Card>
  );
}
