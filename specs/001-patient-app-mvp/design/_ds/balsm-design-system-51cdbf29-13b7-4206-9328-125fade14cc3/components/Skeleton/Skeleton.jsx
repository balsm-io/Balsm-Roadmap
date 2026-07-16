// Balsm DS — Skeleton (shimmer placeholder)
// Calm warm-gray shimmer for content that's loading in.
//
// variant: rect | text | title | circle | pill | card
// For multi-line copy: variant="text" lines={3}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  lines = 1,
  lastWidth = '62%',
  radius,
  className = '',
  style,
  ...rest
}) {
  const dim = (v) => (typeof v === 'number' ? `${v}px` : v);

  if (variant === 'text' && lines > 1) {
    return (
      <span className="b-skeleton-lines" style={{ width: dim(width), ...style }} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="b-skeleton b-skeleton--text"
            style={{ width: i === lines - 1 ? lastWidth : '100%' }}
          />
        ))}
      </span>
    );
  }

  const cls = [
    'b-skeleton',
    variant !== 'rect' && `b-skeleton--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  const st = { ...style };
  if (width != null) st.width = dim(width);
  if (height != null) st.height = dim(height);
  if (radius != null) st.borderRadius = dim(radius);
  if (variant === 'circle' && height == null && width != null) st.height = dim(width);

  return <span className={cls} style={st} {...rest} />;
}
