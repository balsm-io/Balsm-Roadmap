/* shell.jsx — Sidebar, TopBar, OfflineBanner */

function Flower({ size = 38 }) {
  return <img src="../../brand/logo-vertical.svg" alt="" style={{ width: size, height: size, objectFit: 'contain', objectPosition: 'top' }} />;
}

function Brand() {
  return (
    <div className="brand">
      {/* render just the petal portion by clipping the vertical logo to the top half */}
      <div style={{ width: 38, height: 38, overflow: 'hidden', borderRadius: 8 }}>
        <img src="../../brand/logo-vertical.svg" alt="" style={{ width: 38, height: 50, objectFit: 'cover', objectPosition: 'top' }} />
      </div>
      <div className="stack">
        <span className="name">Balsm<span className="tld">.health</span></span>
        <span className="ar">بَلسَم</span>
      </div>
    </div>
  );
}

function Sidebar({ screen, onScreen, dir }) {
  const items = [
    { group: 'Pharmacy', children: [
      { id: 'pos',       label: dir === 'rtl' ? 'نقطة البيع'  : 'Point of sale',  ar: 'نقطة البيع', icon: 'scan-barcode',     count: '47' },
      { id: 'inventory', label: dir === 'rtl' ? 'المخزون'     : 'Inventory',     ar: 'المخزون', icon: 'package',          count: '12 ↓' },
      { id: 'customers', label: dir === 'rtl' ? 'العملاء'     : 'Customers',     ar: 'العملاء', icon: 'users-round' },
      { id: 'sales',     label: dir === 'rtl' ? 'المبيعات'    : 'Sales history', ar: 'المبيعات', icon: 'receipt' },
    ]},
    { group: 'Operations', children: [
      { id: 'reports',   label: dir === 'rtl' ? 'التقارير'    : 'Reports',       ar: 'التقارير', icon: 'bar-chart-3' },
      { id: 'cash',      label: dir === 'rtl' ? 'الصندوق'     : 'Cash drawer',   ar: 'الصندوق', icon: 'wallet' },
      { id: 'sync',      label: dir === 'rtl' ? 'المزامنة'    : 'Sync queue',    ar: 'المزامنة', icon: 'cloud-upload', count: '3' },
    ]},
    { group: dir === 'rtl' ? 'المنظومة' : 'System', children: [
      { id: 'staff',     label: dir === 'rtl' ? 'الموظفون'    : 'Staff & roles', ar: 'الموظفون', icon: 'shield-check' },
      { id: 'settings',  label: dir === 'rtl' ? 'الإعدادات'   : 'Settings',     ar: 'الإعدادات', icon: 'settings-2' },
    ]},
  ];
  return (
    <aside className="sidebar">
      <Brand />
      {items.map(group => (
        <React.Fragment key={group.group}>
          <div className="nav-section">{group.group}</div>
          {group.children.map(item => (
            <div key={item.id}
                 className={`nav-item ${screen === item.id ? 'active' : ''}`}
                 onClick={() => onScreen(item.id)}>
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.count && <span className="count">{item.count}</span>}
            </div>
          ))}
        </React.Fragment>
      ))}
      <div className="footer">
        <Avatar initials="MS" tone="b2" />
        <div className="info">
          <span className="who">Mahmoud S.</span>
          <span className="role">{dir === 'rtl' ? 'صيدلي · فرع وسط البلد' : 'Pharmacist · Downtown branch'}</span>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ screen, dir, online, onLang, onToggleOnline }) {
  const titles = {
    pos:       dir === 'rtl' ? 'نقطة البيع' : 'Point of sale',
    inventory: dir === 'rtl' ? 'المخزون'     : 'Inventory',
    customers: dir === 'rtl' ? 'العملاء'     : 'Customers',
    sales:     dir === 'rtl' ? 'المبيعات'    : 'Sales history',
    reports:   dir === 'rtl' ? 'التقارير'    : 'Reports',
    cash:      dir === 'rtl' ? 'الصندوق'     : 'Cash drawer',
    sync:      dir === 'rtl' ? 'المزامنة'    : 'Sync queue',
    staff:     dir === 'rtl' ? 'الموظفون'    : 'Staff & roles',
    settings:  dir === 'rtl' ? 'الإعدادات'   : 'Settings',
  };
  const today = new Date().toLocaleDateString('en-GB');
  return (
    <header className="topbar">
      <div>
        <span className="title">{titles[screen] || screen}</span>
        <span className="meta" style={{ marginLeft: 12 }}>· {dir === 'rtl' ? 'فرع وسط البلد' : 'Downtown branch'} · {today}</span>
      </div>
      <div className="spacer" />
      <div className="search">
        <Icon name="search" size={16} />
        <input placeholder={dir === 'rtl' ? 'ابحث في الدواء، العميل، الفاتورة…' : 'Search medication, customer, invoice…'} />
        <span className="kbd">⌘ K</span>
      </div>
      <span className={`online-pill ${online ? '' : 'offline'}`} onClick={onToggleOnline} style={{ cursor: 'pointer' }} title="Click to toggle">
        <span className="dot" />
        {online ? (dir === 'rtl' ? 'متصل بالخادم' : 'Local server connected') : (dir === 'rtl' ? 'غير متصل · 3 في الطابور' : 'Offline · 3 queued')}
      </span>
      <div className="lang-toggle">
        <button className={dir === 'ltr' ? 'active' : ''} onClick={() => onLang('ltr')}>EN</button>
        <button className={dir === 'rtl' ? 'active' : ''} onClick={() => onLang('rtl')}>ع</button>
      </div>
    </header>
  );
}

function OfflineBanner({ dir }) {
  return (
    <div className="offline-banner">
      <Icon name="cloud-off" size={16} />
      <span>
        <b>{dir === 'rtl' ? 'غير متصل.' : 'Offline.'} </b>
        {dir === 'rtl'
          ? 'كل البيع يُحفظ محلياً. سيتم المزامنة عند عودة الاتصال.'
          : 'Sales are saved locally. They will sync when you reconnect.'}
      </span>
    </div>
  );
}

Object.assign(window, { Flower, Brand, Sidebar, TopBar, OfflineBanner });
