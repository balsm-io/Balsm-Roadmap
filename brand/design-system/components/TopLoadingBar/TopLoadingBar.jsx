// Balsm DS — TopLoadingBar
// Thin route/page-level progress bar pinned to the top edge.
// Two ways to drive it:
//   • Controlled:  <TopLoadingBar value={42} />
//   • Auto-trickle: <TopLoadingBar loading={isFetching} />  (creeps to ~90%,
//                   snaps to 100% + fades when loading flips false)
// Set indeterminate for a continuous slide instead.

export function TopLoadingBar({
  value = null,
  loading,
  variant = 'primary',     // primary | accent | success | brand
  height = 3,
  contained = false,       // absolute (pins to a positioned parent) vs fixed
  indeterminate = false,
  className = '',
  style,
  ...rest
}) {
  const managed = value == null && typeof loading === 'boolean';
  const [auto, setAuto] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!managed) return;
    let timer;
    if (loading) {
      setVisible(true);
      setAuto((a) => (a > 0 ? a : 8));
      timer = setInterval(() => {
        setAuto((a) => (a >= 90 ? a : Math.min(90, a + (90 - a) * 0.06 + 0.4)));
      }, 280);
      return () => clearInterval(timer);
    }
    if (visible) {
      setAuto(100);
      const t = setTimeout(() => { setVisible(false); setAuto(0); }, 420);
      return () => clearTimeout(t);
    }
  }, [loading, managed]); // eslint-disable-line

  const pct = managed ? auto : (value ?? 0);
  const done = managed ? !loading : pct >= 100;

  if (managed && !visible && !loading) return null;

  const cls = [
    'b-toploader',
    contained && 'b-toploader--contained',
    variant !== 'primary' && `b-toploader--${variant}`,
    indeterminate && 'b-toploader--indeterminate',
    done && !indeterminate && 'b-toploader--done',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={{ height, ...style }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      {...rest}
    >
      <div className="b-toploader__bar" style={indeterminate ? undefined : { width: `${pct}%` }} />
    </div>
  );
}
