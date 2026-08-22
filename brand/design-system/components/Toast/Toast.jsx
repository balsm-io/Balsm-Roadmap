// Balsm DS — Toast / Notification system
// Exports: Toast, ToastContainer, addToast, removeToast, useToast

// ── Global store ──────────────────────────────────────────────
const _listeners = new Set();
const _queue     = [];
let   _id        = 1;

export function addToast(opts = {}) {
  const t = { id: _id++, variant: 'info', duration: 4500, closeable: true, ...opts };
  _queue.unshift(t);
  _listeners.forEach(fn => fn([..._queue]));
  if (t.duration > 0) setTimeout(() => removeToast(t.id), t.duration);
  return t.id;
}

export function removeToast(id) {
  const i = _queue.findIndex(t => t.id === id);
  if (i !== -1) { _queue.splice(i, 1); _listeners.forEach(fn => fn([..._queue])); }
}

export function useToast() {
  return { addToast, removeToast };
}

// ── Private icon components ───────────────────────────────────
function _IcoSuccess() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><path d="M6.5 10l2.5 2.5 5-5"/></svg>;
}
function _IcoWarning() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 2L1 18h18L10 2z"/><line x1="10" y1="9" x2="10" y2="13"/><circle cx="10" cy="15.5" r=".6" fill="currentColor" stroke="none"/></svg>;
}
function _IcoDanger() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><line x1="7" y1="7" x2="13" y2="13"/><line x1="13" y1="7" x2="7" y2="13"/></svg>;
}
function _IcoInfo() {
  return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6.5" r=".6" fill="currentColor" stroke="none"/></svg>;
}
function _IcoClose() {
  return <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>;
}
function _ToastIcon({ variant }) {
  if (variant === 'success') return <_IcoSuccess />;
  if (variant === 'warning') return <_IcoWarning />;
  if (variant === 'danger')  return <_IcoDanger />;
  return <_IcoInfo />;
}

// ── Single Toast item ─────────────────────────────────────────
export function Toast({ id, variant = 'info', title, message, action, closeable = true, onClose }) {
  return (
    <div className={`b-toast b-toast--${variant}`} role="alert" aria-live="polite">
      <span className="b-toast__icon" aria-hidden="true">
        <_ToastIcon variant={variant} />
      </span>
      <div className="b-toast__body">
        {title   && <div className="b-toast__title">{title}</div>}
        {message && <div className="b-toast__msg">{message}</div>}
        {action  && (
          <button type="button" className="b-toast__action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
      {closeable && (
        <button type="button" className="b-toast__close" onClick={onClose} aria-label="Dismiss">
          <_IcoClose />
        </button>
      )}
    </div>
  );
}

// ── ToastContainer (mount once per app) ──────────────────────
export function ToastContainer({ position = 'top-right' }) {
  const [toasts, setToasts] = React.useState([..._queue]);
  React.useEffect(() => {
    _listeners.add(setToasts);
    return () => _listeners.delete(setToasts);
  }, []);
  if (typeof document === 'undefined' || !toasts.length) return null;
  return ReactDOM.createPortal(
    <div className={`b-toast-stack b-toast-stack--${position}`}>
      {toasts.map(t => <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />)}
    </div>,
    document.body
  );
}
