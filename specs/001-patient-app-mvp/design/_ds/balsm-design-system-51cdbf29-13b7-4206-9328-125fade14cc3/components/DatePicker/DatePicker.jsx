// Balsm DS — DatePicker (calendar popover, Egypt-localized DD/MM/YYYY)
// Value & onChange use ISO 'YYYY-MM-DD' strings. min/max accept ISO strings too.

const B_MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const B_MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const B_DOW_EN = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const B_DOW_AR = ['أحد','إثن','ثلا','أرب','خمي','جمع','سبت'];

function bPad(n) { return String(n).padStart(2, '0'); }
function bToISO(d) { return `${d.getFullYear()}-${bPad(d.getMonth() + 1)}-${bPad(d.getDate())}`; }
function bParseISO(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
function bSameDay(a, b) { return a && b && bToISO(a) === bToISO(b); }
function bFmt(d, dir) {
  if (!d) return '';
  return dir === 'rtl'
    ? `${bPad(d.getDate())}/${bPad(d.getMonth() + 1)}/${d.getFullYear()}`
    : `${bPad(d.getDate())}/${bPad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function DatePicker({
  value = null,
  onChange,
  label,
  hint,
  error,
  placeholder = 'DD/MM/YYYY',
  disabled = false,
  clearable = true,
  min,
  max,
  size = 'md',
  fullWidth = false,
  weekStartsMonday = false,
  id,
  dir = 'ltr',
  className = '',
  style,
}) {
  const isRTL = dir === 'rtl';
  const selected = bParseISO(value);
  const minD = bParseISO(min);
  const maxD = bParseISO(max);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const [open, setOpen]   = React.useState(false);
  const [view, setView]   = React.useState(() => selected || today);
  const containerRef      = React.useRef(null);
  const uid = id || `dp-${React.useRef(Math.random().toString(36).slice(2, 7)).current}`;

  React.useEffect(() => { if (selected) setView(selected); }, [value]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = e => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const toggle = () => { if (!disabled) { setView(selected || today); setOpen(o => !o); } };

  const months = isRTL ? B_MONTHS_AR : B_MONTHS_EN;
  const dow = (isRTL ? B_DOW_AR : B_DOW_EN);
  const orderedDow = weekStartsMonday ? [...dow.slice(1), dow[0]] : dow;

  const isOutOfRange = d => (minD && d < minD) || (maxD && d > maxD);

  function buildGrid() {
    const y = view.getFullYear(), m = view.getMonth();
    const first = new Date(y, m, 1);
    let lead = first.getDay();                       // 0=Sun
    if (weekStartsMonday) lead = (lead + 6) % 7;
    const start = new Date(y, m, 1 - lead);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      cells.push(d);
    }
    return cells;
  }

  function pick(d) {
    if (isOutOfRange(d)) return;
    onChange?.(bToISO(d));
    setOpen(false);
  }
  function goToday() {
    if (isOutOfRange(today)) return;
    setView(today);
    onChange?.(bToISO(today));
    setOpen(false);
  }

  const stepMonth = delta => setView(v => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  const triggerCls = [
    'b-picker-trigger', `b-picker-trigger--${size}`,
    open && 'b-picker-trigger--open',
    error && 'b-picker-trigger--error',
    disabled && 'b-picker-trigger--disabled',
  ].filter(Boolean).join(' ');

  const wrapCls = ['b-select-wrap', fullWidth && 'b-select-wrap--full', className].filter(Boolean).join(' ');

  const Cal = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
  const Chevron = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const ChevronR = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
          <span className="b-picker-trigger__icon" aria-hidden="true"><Cal /></span>
          {selected
            ? <span className="b-picker-trigger__value b-picker-trigger__value--mono">{bFmt(selected, dir)}</span>
            : <span className="b-picker-trigger__placeholder">{placeholder}</span>}
          {clearable && selected && !disabled && (
            <span className="b-picker-trigger__clear" role="button" aria-label="Clear"
              onClick={e => { e.stopPropagation(); onChange?.(null); }}><X /></span>
          )}
        </button>
        {open && (
          <div className="b-picker-pop" role="dialog">
            <div className="b-cal">
              <div className="b-cal__head">
                <button type="button" className="b-cal__nav" onClick={() => stepMonth(-1)} aria-label="Previous month"><Chevron /></button>
                <span className="b-cal__title">{months[view.getMonth()]} {view.getFullYear()}</span>
                <button type="button" className="b-cal__nav" onClick={() => stepMonth(1)} aria-label="Next month"><ChevronR /></button>
              </div>
              <div className="b-cal__grid">
                {orderedDow.map((d, i) => <div key={`dow-${i}`} className="b-cal__dow">{d}</div>)}
                {buildGrid().map((d, i) => {
                  const muted = d.getMonth() !== view.getMonth();
                  const isToday = bSameDay(d, today);
                  const isSel = bSameDay(d, selected);
                  const oor = isOutOfRange(d);
                  const cls = ['b-cal__day',
                    muted && 'b-cal__day--muted',
                    isToday && !isSel && 'b-cal__day--today',
                    isSel && 'b-cal__day--selected',
                  ].filter(Boolean).join(' ');
                  return (
                    <button type="button" key={`d-${i}`} className={cls} disabled={oor}
                      onClick={() => pick(d)}>{d.getDate()}</button>
                  );
                })}
              </div>
              <div className="b-cal__foot">
                <button type="button" className="b-cal__action" onClick={goToday} disabled={isOutOfRange(today)}>
                  {isRTL ? 'اليوم' : 'Today'}
                </button>
                {clearable && (
                  <button type="button" className="b-cal__action b-cal__action--muted"
                    onClick={() => { onChange?.(null); setOpen(false); }}>
                    {isRTL ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {(hint || error) && <p className={error ? 'b-field__error' : 'b-field__hint'}>{error || hint}</p>}
    </div>
  );
}
