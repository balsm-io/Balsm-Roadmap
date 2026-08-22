// Balsm DS — Switch
//
// Switch vs Checkbox: a switch takes effect the moment it moves
// (offline mode, notifications, a setting). A checkbox is a value
// you submit. Don't put a switch in a form behind a Save button.

export function Switch({
  label = null,
  hint = null,
  checked,
  defaultChecked,
  onChange = null,
  disabled = false,
  size = 'md',
  tone = 'primary',
  between = false,
  name,
  className = '',
  style,
  ...rest
}) {
  const cls = [
    'b-switch',
    size === 'sm' && 'b-switch--sm',
    tone !== 'primary' && `b-switch--${tone}`,
    disabled && 'b-switch--disabled',
    between && 'b-switch--between',
    className,
  ].filter(Boolean).join(' ');

  const text = (label || hint) && (
    <span className="b-switch__text">
      {label && <span className="b-switch__label">{label}</span>}
      {hint && <span className="b-switch__hint">{hint}</span>}
    </span>
  );

  const control = (
    <>
      <input
        type="checkbox"
        role="switch"
        className="b-switch__input"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange || undefined}
        disabled={disabled}
        name={name}
        {...rest}
      />
      <span className="b-switch__track"><span className="b-switch__thumb" /></span>
    </>
  );

  // In a settings row the label leads and the control sits at the end.
  return (
    <label className={cls} style={style}>
      {between ? <>{text}{control}</> : <>{control}{text}</>}
    </label>
  );
}
