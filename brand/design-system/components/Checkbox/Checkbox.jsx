// Balsm DS — Checkbox / Radio
// The real input stays in the a11y tree (visually hidden, not
// display:none) so screen readers and form submission work normally.

const Tick = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true"><polyline points="2.5,7.5 5.5,10.5 11.5,3.5" /></svg>
);
const Dash = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true"><line x1="3" y1="7" x2="11" y2="7" /></svg>
);

export function Checkbox({
  label = null,
  hint = null,
  checked,
  defaultChecked,
  indeterminate = false,
  onChange = null,
  disabled = false,
  error = false,
  size = 'md',
  name,
  value,
  className = '',
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const cls = [
    'b-check',
    size === 'sm' && 'b-check--sm',
    disabled && 'b-check--disabled',
    error && 'b-check--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={cls} style={style}>
      <input
        ref={ref}
        type="checkbox"
        className="b-check__input"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange || undefined}
        disabled={disabled}
        name={name}
        value={value}
        {...rest}
      />
      <span className="b-check__box">{indeterminate ? <Dash /> : <Tick />}</span>
      {(label || hint) && (
        <span className="b-check__text">
          {label && <span className="b-check__label">{label}</span>}
          {hint && <span className="b-check__hint">{hint}</span>}
        </span>
      )}
    </label>
  );
}

export function Radio({
  label = null,
  hint = null,
  checked,
  defaultChecked,
  onChange = null,
  disabled = false,
  size = 'md',
  name,
  value,
  className = '',
  style,
  ...rest
}) {
  const cls = [
    'b-check', 'b-check--radio',
    size === 'sm' && 'b-check--sm',
    disabled && 'b-check--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={cls} style={style}>
      <input
        type="radio"
        className="b-check__input"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange || undefined}
        disabled={disabled}
        name={name}
        value={value}
        {...rest}
      />
      <span className="b-check__box" />
      {(label || hint) && (
        <span className="b-check__text">
          {label && <span className="b-check__label">{label}</span>}
          {hint && <span className="b-check__hint">{hint}</span>}
        </span>
      )}
    </label>
  );
}

export function CheckGroup({ row = false, children, className = '', ...rest }) {
  return (
    <div className={`b-check-group ${row ? 'b-check-group--row' : ''} ${className}`.trim()} role="group" {...rest}>
      {children}
    </div>
  );
}
