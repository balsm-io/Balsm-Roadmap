// Balsm DS — Modal / Dialog
//
// Owns the things a hand-rolled dialog always forgets: Escape to
// close, focus moved in and restored on exit, focus trapped while
// open, background scroll locked, and a click on the scrim (but not
// a drag that ended there) dismissing it.
//
// On phones it becomes a bottom sheet — a 460px dialog centred on a
// 360px screen is a cramped card.

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Modal({
  open = false,
  onClose = null,
  title = null,
  subtitle = null,
  icon = null,
  tone = null,
  size = 'md',
  footer = null,
  footerBetween = false,
  closeOnScrim = true,
  showClose = true,
  labelledBy,
  children,
  className = '',
  style,
  ...rest
}) {
  const panelRef = React.useRef(null);
  const restoreRef = React.useRef(null);
  const scrimDownRef = React.useRef(false);
  const uid = React.useRef(`modal-${Math.random().toString(36).slice(2, 7)}`).current;

  React.useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // focus the first control, or the panel itself
    const t = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector(FOCUSABLE);
      (first || panel).focus();
    });

    const onKey = e => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose && onClose(); return; }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      cancelAnimationFrame(t);
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      if (restoreRef.current && restoreRef.current.focus) restoreRef.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const cls = ['b-modal', size !== 'md' && `b-modal--${size}`, className].filter(Boolean).join(' ');

  return (
    <div
      className="b-modal-scrim"
      onMouseDown={e => { scrimDownRef.current = e.target === e.currentTarget; }}
      onMouseUp={e => {
        // only close when press AND release both happened on the scrim,
        // so a text selection dragged out of the panel doesn't dismiss it
        if (closeOnScrim && scrimDownRef.current && e.target === e.currentTarget) onClose && onClose();
        scrimDownRef.current = false;
      }}
    >
      <div
        ref={panelRef}
        className={cls}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy || (title ? `${uid}-title` : undefined)}
        tabIndex={-1}
        {...rest}
      >
        {(title || showClose) && (
          <div className="b-modal__header">
            <div>
              {icon && (
                <div className={`b-modal__icon b-modal__icon--${tone || 'info'}`} aria-hidden="true">{icon}</div>
              )}
              {title && <div className="b-modal__title" id={`${uid}-title`}>{title}</div>}
              {subtitle && <div className="b-modal__subtitle">{subtitle}</div>}
            </div>
            {showClose && (
              <button type="button" className="b-modal__close" onClick={onClose || undefined} aria-label="Close">×</button>
            )}
          </div>
        )}
        <div className="b-modal__body">{children}</div>
        {footer && (
          <div className={`b-modal__footer ${footerBetween ? 'b-modal__footer--between' : ''}`.trim()}>{footer}</div>
        )}
      </div>
    </div>
  );
}
