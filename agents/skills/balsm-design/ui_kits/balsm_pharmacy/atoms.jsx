/* atoms.jsx — small reusable components for the Balsm pharmacy kit */
const { useState, useEffect, useRef } = React;

function Icon({ name, size = 16, stroke = 1.75, className = '', style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons({
      icons: window.lucide.icons,
      attrs: { 'stroke-width': stroke, width: size, height: size },
      nameAttr: 'data-lucide',
    });
  }, [name, size, stroke]);
  return <i ref={ref} data-lucide={name} className={className} style={{ width: size, height: size, ...style }} />;
}

function Btn({ children, variant = 'primary', size, block, icon, onClick, disabled, type = 'button', style }) {
  const cls = ['btn', variant, size, block && 'block', disabled && 'is-disabled'].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} style={style}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

function IconBtn({ icon, onClick, title }) {
  return (
    <button className="icon-btn" onClick={onClick} title={title}>
      <Icon name={icon} />
    </button>
  );
}

function Pill({ tone = 'neutral', icon, dot = true, children }) {
  return (
    <span className={`pill ${tone}`}>
      {dot && !icon && <span className="dot" />}
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

function Avatar({ initials, tone = '', size = '' }) {
  return <span className={`avatar ${tone} ${size}`.trim()}>{initials}</span>;
}

Object.assign(window, { Icon, Btn, IconBtn, Pill, Avatar });
