// Balsm DS — TimePicker (hour / minute columns popover)
// Value & onChange use 24-hour 'HH:MM' strings regardless of display format.

function btPad(n) { return String(n).padStart(2, '0'); }
function btParse(s) {
  if (!s || typeof s !== 'string') return null;
  const [h, m] = s.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { h, m };
}
function btToMinutes(s) { const t = btParse(s); return t ? t.h * 60 + t.m : null; }
function btDisplay(s, use12h, isRTL) {
  const t = btParse(s);
  if (!t) return '';
  if (!use12h) return `${btPad(t.h)}:${btPad(t.m)}`;
  const period = t.h < 12 ? (isRTL ? 'ص' : 'AM') : (isRTL ? 'م' : 'PM');
  let h12 = t.h % 12; if (h12 === 0) h12 = 12;
  return `${btPad(h12)}:${btPad(t.m)} ${period}`;
}

export function TimePicker({
  value = null,
  onChange,
  label,
  hint,
  error,
  placeholder = 'HH:MM',
  disabled = false,
  clearable = true,
  minuteStep = 5,
  use12Hour = false,
  min,
  max,
  size = 'md',
  fullWidth = false,
  id,
  dir = 'ltr',
  className = '',
  style,
}) {
  const isRTL = dir === 'rtl';
  const sel = btParse(value);
  const minM = btToMinutes(min);
  const maxM = btToMinutes(max);

  const [open, setOpen] = React.useState(false);
  const containerRef    = React.useRef(null);
  const hourColRef      = React.useRef(null);
  const minColRef       = React.useRef(null);
  const uid = id || `tp-${React.useRef(Math.random().toString(36).slice(2, 7)).current}`;

  React.useEffect(() => {
    if (!open) return;
    const onDoc = e => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  // scroll selected options into view when opening
  React.useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      [hourColRef.current, minColRef.current].forEach(col => {
        if (!col) return;
        const active = col.querySelector('.b-time__opt--selected');
        if (active) col.scrollTop = active.offsetTop - col.clientHeight / 2 + active.clientHeight / 2;
      });
    });
  }, [open]);

  const inRange = (h, m) => {
    const mins = h * 60 + m;
    if (minM != null && mins < minM) return false;
    if (maxM != null && mins > maxM) return false;
    return true;
  };

  const hours   = use12Hour ? Array.from({ length: 12 }, (_, i) => i) : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

  const curH = sel ? sel.h : null;
  const curM = sel ? sel.m : null;
  const period = sel ? (sel.h < 12 ? 'AM' : 'PM') : 'AM';

  function emit(h, m, per) {
    let h24 = h;
    if (use12Hour) {
      const base = h % 12;                       // 12 -> 0
      h24 = per === 'PM' ? base + 12 : base;
    }
    onChange?.(`${btPad(h24)}:${btPad(m)}`);
  }
  function pickHour(displayH) {
    const m = curM ?? 0;
    if (use12Hour) { if (!inRange((period === 'PM' ? (displayH % 12) + 12 : displayH % 12), m)) return; emit(displayH, m, period); }
    else { if (!inRange(displayH, m)) return; emit(displayH, m); }
  }
  function pickMin(m) {
    const h = curH ?? (use12Hour ? 12 : 0);
    if (!inRange(use12Hour ? h : h, m)) return;
    if (use12Hour) emit(((h % 12) || 12), m, period);
    else emit(h, m);
  }
  function pickPeriod(per) {
    const h = curH ?? 9;
    const m = curM ?? 0;
    const disp = (h % 12) || 12;
    emit(disp, m, per);
  }

  const triggerCls = [
    'b-picker-trigger', `b-picker-trigger--${size}`,
    open && 'b-picker-trigger--open',
    error && 'b-picker-trigger--error',
    disabled && 'b-picker-trigger--disabled',
  ].filter(Boolean).join(' ');
  const wrapCls = ['b-select-wrap', fullWidth && 'b-select-wrap--full', className].filter(Boolean).join(' ');

  const toggle = () => { if (!disabled) setOpen(o => !o); };

  // current display hour for highlight in 12h mode
  const dispCurH = sel ? ((sel.h % 12) || 12) : null;

  const Clock = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const X = () => (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className={wrapCls} style={style} ref={containerRef} dir={dir}>
      {label && <label className="b-field__label" htmlFor={uid} onClick={toggle}>{label}</label>}
      <div className="b-select-container">
        <button type="button" id={uid} className={triggerCls} onClick={toggle} disabled={disabled}
          aria-haspopup="dialog" aria-expanded={open}>
          <span className="b-picker-trigger__icon" aria-hidden="true"><Clock /></span>
          {sel
            ? <span className="b-picker-trigger__value b-picker-trigger__value--mono">{btDisplay(value, use12Hour, isRTL)}</span>
            : <span className="b-picker-trigger__placeholder">{placeholder}</span>}
          {clearable && sel && !disabled && (
            <span className="b-picker-trigger__clear" role="button" aria-label="Clear"
              onClick={e => { e.stopPropagation(); onChange?.(null); }}><X /></span>
          )}
        </button>
        {open && (
          <div className="b-picker-pop" role="dialog">
            <div className="b-time">
              <div className="b-time__col" ref={hourColRef}>
                {hours.map(h => {
                  const isSel = use12Hour ? dispCurH === h : curH === h;
                  const probeH = use12Hour ? (period === 'PM' ? (h % 12) + 12 : h % 12) : h;
                  const dis = !inRange(probeH, curM ?? 0);
                  return (
                    <button type="button" key={`h-${h}`} disabled={dis}
                      className={['b-time__opt', isSel && 'b-time__opt--selected'].filter(Boolean).join(' ')}
                      onClick={() => pickHour(h)}>{btPad(h)}</button>
                  );
                })}
              </div>
              <div className="b-time__col" ref={minColRef}>
                {minutes.map(m => {
                  const isSel = curM === m;
                  const dis = !inRange(curH ?? (use12Hour ? 12 : 0), m);
                  return (
                    <button type="button" key={`m-${m}`} disabled={dis}
                      className={['b-time__opt', isSel && 'b-time__opt--selected'].filter(Boolean).join(' ')}
                      onClick={() => pickMin(m)}>{btPad(m)}</button>
                  );
                })}
              </div>
              {use12Hour && (
                <div className="b-time__col" style={{ width: 46 }}>
                  {['AM', 'PM'].map(p => (
                    <button type="button" key={p}
                      className={['b-time__opt', period === p && sel && 'b-time__opt--selected'].filter(Boolean).join(' ')}
                      onClick={() => pickPeriod(p)}>{isRTL ? (p === 'AM' ? 'ص' : 'م') : p}</button>
                  ))}
                </div>
              )}
            </div>
            {clearable && (
              <div className="b-time__foot">
                <button type="button" className="b-cal__action b-cal__action--muted"
                  onClick={() => { onChange?.(null); setOpen(false); }}>
                  {isRTL ? 'مسح' : 'Clear'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {(hint || error) && <p className={error ? 'b-field__error' : 'b-field__hint'}>{error || hint}</p>}
    </div>
  );
}
