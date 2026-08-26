// Balsm DS — Avatar
// Initials, image, or fallback. Tone is derived from the name so the
// same person is always the same color across every surface.

const TONES = ['aqua', 'emerald', 'blue', 'mint', 'violet'];

export function toneFor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

export function initialsFor(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name = '',
  initials = null,
  src = null,
  alt = null,
  size = 'md',
  tone = null,
  square = false,
  status = null,
  className = '',
  style,
  ...rest
}) {
  const text = initials != null ? initials : initialsFor(name);
  const cls = [
    'b-avatar',
    size !== 'md' && `b-avatar--${size}`,
    `b-avatar--${tone || toneFor(name)}`,
    square && 'b-avatar--square',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={cls} style={style} title={name || undefined} {...rest}>
      {src
        ? <img src={src} alt={alt != null ? alt : name} />
        : <span aria-hidden={!name}>{text}</span>}
      {status && (
        <span
          className={`b-avatar__status b-avatar__status--${status}`}
          aria-label={status}
        />
      )}
    </span>
  );
}

// Stacked group with a "+N" overflow chip.
export function AvatarGroup({
  people = [],
  max = 4,
  size = 'md',
  tight = false,
  className = '',
  ...rest
}) {
  const shown = people.slice(0, max);
  const rest_ = people.length - shown.length;
  return (
    <span className={`b-avatar-group ${tight ? 'b-avatar-group--tight' : ''} ${className}`.trim()} {...rest}>
      {shown.map((p, i) => (
        <Avatar key={p.id || p.name || i} size={size} {...(typeof p === 'string' ? { name: p } : p)} />
      ))}
      {rest_ > 0 && (
        <span className={`b-avatar b-avatar--more ${size !== 'md' ? `b-avatar--${size}` : ''}`.trim()}>
          +{rest_}
        </span>
      )}
    </span>
  );
}
