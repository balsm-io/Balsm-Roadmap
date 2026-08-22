// Balsm DS — Input + Textarea
// Use multiline={true} for a <textarea>

export function Input({
  type = 'text',
  label,
  hint,
  error,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  readOnly = false,
  required = false,
  leadingIcon = null,
  trailingIcon = null,
  size = 'md',
  fullWidth = false,
  multiline = false,
  rows = 4,
  id,
  name,
  dir,
  className = '',
  style,
  inputStyle,
  ...rest
}) {
  const autoId = React.useId ? React.useId() : `inp-${Math.random().toString(36).slice(2,7)}`;
  const uid = id || autoId;

  const fieldCls = ['b-field', fullWidth && 'b-field--full', className].filter(Boolean).join(' ');
  const inputCls = [
    multiline ? 'b-textarea' : 'b-input',
    !multiline && `b-input--${size}`,
    error    && (multiline ? 'b-textarea--error' : 'b-input--error'),
    !multiline && leadingIcon  && 'b-input--has-leading',
    !multiline && trailingIcon && 'b-input--has-trailing',
    disabled && 'b-input--disabled',
  ].filter(Boolean).join(' ');

  const shared = {
    id: uid, name, dir,
    placeholder, value, defaultValue,
    onChange, onBlur, onFocus,
    disabled, readOnly, required,
    style: inputStyle,
    'aria-invalid':     error ? true : undefined,
    'aria-describedby': (hint || error) ? `${uid}-desc` : undefined,
  };

  return (
    <div className={fieldCls} style={style}>
      {label && (
        <label htmlFor={uid} className="b-field__label">
          {label}
          {required && <span className="b-field__req" aria-hidden="true">*</span>}
        </label>
      )}
      {multiline
        ? <textarea className={inputCls} rows={rows} {...shared} {...rest} />
        : (
          <div className="b-input-wrap">
            {leadingIcon && <span className="b-input__leading" aria-hidden="true">{leadingIcon}</span>}
            <input type={type} className={inputCls} {...shared} {...rest} />
            {trailingIcon && <span className="b-input__trailing" aria-hidden="true">{trailingIcon}</span>}
          </div>
        )
      }
      {(hint || error) && (
        <p id={`${uid}-desc`} className={error ? 'b-field__error' : 'b-field__hint'}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
