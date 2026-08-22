// Balsm DS — Select (single-value dropdown)
// Supports: label, hint, error, searchable, disabled

export function Select({
  options = [],
  value = null,
  onChange,
  placeholder = 'Select…',
  label,
  hint,
  error,
  disabled = false,
  searchable = false,
  size = 'md',
  fullWidth = false,
  id,
  dir,
  className = '',
  style,
}) {
  const [open, setOpen]     = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef        = React.useRef(null);
  const searchRef           = React.useRef(null);
  const uid = id || `sel-${Math.random().toString(36).slice(2,7)}`;

  React.useEffect(() => {
    if (!open) return;
    const fn = e => { if (containerRef.current && !containerRef.current.contains(e.target)) close(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const fn = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open]);

  React.useEffect(() => {
    if (open && searchable && searchRef.current) searchRef.current.focus();
  }, [open, searchable]);

  const close  = () => { setOpen(false); setSearch(''); };
  const toggle = () => { if (!disabled) setOpen(o => !o); };

  const filtered = (searchable && search)
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selected = options.find(o => o.value === value);

  const wrapCls    = ['b-select-wrap', fullWidth && 'b-select-wrap--full', className].filter(Boolean).join(' ');
  const triggerCls = [
    'b-select', `b-select--${size}`,
    open     && 'b-select--open',
    error    && 'b-select--error',
    disabled && 'b-select--disabled',
  ].filter(Boolean).join(' ');

  function ChevronDown() {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  function Check() {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  return (
    <div className={wrapCls} style={style} ref={containerRef}>
      {label && <label className="b-field__label" onClick={toggle}>{label}</label>}
      <div className="b-select-container">
        <button type="button" id={uid} className={triggerCls}
          onClick={toggle} disabled={disabled}
          aria-haspopup="listbox" aria-expanded={open} dir={dir}>
          {selected
            ? <span className="b-select__value">{selected.label}</span>
            : <span className="b-select__placeholder">{placeholder}</span>
          }
          <span className="b-select__chevron" aria-hidden="true"><ChevronDown /></span>
        </button>
        {open && (
          <div className="b-select-menu" role="listbox" dir={dir}>
            {searchable && (
              <div className="b-select-search">
                <input ref={searchRef} className="b-select-search__input"
                  placeholder="Search…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  onClick={e => e.stopPropagation()} />
              </div>
            )}
            {filtered.length === 0
              ? <div className="b-select-empty">No results</div>
              : filtered.map(opt => (
                <div key={opt.value} role="option" aria-selected={opt.value === value}
                  className={['b-select-option',
                    opt.value === value && 'b-select-option--selected',
                    opt.disabled       && 'b-select-option--disabled',
                  ].filter(Boolean).join(' ')}
                  onClick={() => { if (!opt.disabled) { onChange?.(opt.value); close(); } }}>
                  <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{opt.label}</span>
                  {opt.value === value && <span className="b-select-option__check"><Check /></span>}
                </div>
              ))
            }
          </div>
        )}
      </div>
      {(hint || error) && (
        <p className={error ? 'b-field__error' : 'b-field__hint'}>{error || hint}</p>
      )}
    </div>
  );
}
