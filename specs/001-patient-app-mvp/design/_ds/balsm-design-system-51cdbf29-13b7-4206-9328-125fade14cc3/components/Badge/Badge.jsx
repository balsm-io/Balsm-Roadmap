// Balsm DS — Badge / Status Chip
// variant: success | warning | danger | info | controlled | expiring
//          neutral | brand | outline | emerald
// size:    sm | md

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon = null,
  onRemove = null,
  children,
  className = '',
  style,
  ...rest
}) {
  const cls = [
    'b-badge',
    `b-badge--${variant}`,
    size === 'sm' && 'b-badge--sm',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={cls} style={style} {...rest}>
      {icon
        ? <span className="b-badge__icon" aria-hidden="true">{icon}</span>
        : dot && <span className="b-badge__dot" aria-hidden="true" />
      }
      {children}
      {onRemove && (
        <button
          type="button"
          className="b-badge__remove"
          onClick={onRemove}
          aria-label="Remove"
        >×</button>
      )}
    </span>
  );
}
