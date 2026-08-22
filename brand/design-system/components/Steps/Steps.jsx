// Balsm DS — Steps / Stepper
// Multi-stage progress: onboarding, dispense flow, encounter steps.
// orientation: horizontal | vertical · variant: numbered | dot
// color: primary | success | violet
// responsive: when true (default), a horizontal stepper collapses to a
//   vertical layout once its CONTAINER (not the viewport) gets narrow —
//   so it adapts correctly inside a tablet two-pane / foldable as well.
// Each step: { label, description?, status? }  status auto-derives from `current`.

const _StepCheck = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7.5l2.5 2.5 5.5-6" />
  </svg>
);

export function Steps({
  steps = [],
  current = 0,
  variant = 'numbered',          // 'numbered' | 'dot'
  color = 'primary',             // 'primary' | 'success' | 'violet'
  orientation = 'horizontal',    // 'horizontal' | 'vertical'
  responsive = true,             // horizontal → vertical in narrow containers
  className = '',
  ...rest
}) {
  const cls = [
    'b-steps',
    orientation === 'vertical' && 'b-steps--vertical',
    variant === 'dot' && 'b-steps--dot',
    color !== 'primary' && `b-steps--${color}`,
    className,
  ].filter(Boolean).join(' ');

  const body = (
    <div className={cls} role="list" {...rest}>
      {steps.map((s, i) => {
        const status = s.status || (i < current ? 'done' : i === current ? 'active' : 'upcoming');
        const isLast = i === steps.length - 1;
        return (
          <div className={`b-step b-step--${status}`} role="listitem" aria-current={status === 'active' ? 'step' : undefined} key={i}>
            <div className="b-step__node">
              <span className="b-step__marker">
                {status === 'done' ? <_StepCheck /> : (variant === 'dot' ? null : i + 1)}
              </span>
              {(s.label || s.description) && (
                <span className="b-step__text">
                  {s.label && <span className="b-step__label">{s.label}</span>}
                  {s.description && <span className="b-step__desc">{s.description}</span>}
                </span>
              )}
            </div>
            {!isLast && <span className="b-step__line" aria-hidden="true" />}
          </div>
        );
      })}
    </div>
  );

  // Container-query wrapper only for horizontal steppers that opt in.
  if (responsive && orientation !== 'vertical') {
    return <div className="b-steps-c b-steps-c--responsive">{body}</div>;
  }
  return body;
}
