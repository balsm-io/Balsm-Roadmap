// Balsm DS — Button
// variant: primary | secondary | ghost | danger | link
// size:    sm | md | lg

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconTrailing = null,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className = '',
  style,
  ...rest
}) {
  const cls = [
    'b-btn',
    `b-btn-${size}`,
    `b-btn-${variant}`,
    loading   && 'b-btn--loading',
    fullWidth && 'b-btn--full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading
        ? <span className="b-spinner" aria-hidden="true" />
        : icon && <span className="b-icon" aria-hidden="true">{icon}</span>
      }
      <span>{children}</span>
      {!loading && iconTrailing &&
        <span className="b-icon" aria-hidden="true">{iconTrailing}</span>
      }
    </button>
  );
}
