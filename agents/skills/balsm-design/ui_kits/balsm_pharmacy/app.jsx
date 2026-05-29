/* app.jsx — top-level Balsm Pharmacy App */

function PlaceholderView({ icon, title, sub }) {
  return (
    <div className="page">
      <div style={{ background: '#fff', border: '1px solid var(--balsm-border)', borderRadius: 14, padding: 64, textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 999, background: 'var(--petal-aqua-50)', color: 'var(--petal-aqua-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={28} />
        </div>
        <h2 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--balsm-ink-900)' }}>{title}</h2>
        <p style={{ margin: 0, color: 'var(--fg3)', fontSize: 14 }}>{sub}</p>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('pos');
  const [dir, setDir] = useState('ltr');
  const [online, setOnline] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
  }, [dir]);

  // Re-init lucide on every screen / dir change
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  function renderScreen() {
    switch (screen) {
      case 'pos':       return <POSView dir={dir} />;
      case 'inventory': return <InventoryView dir={dir} />;
      case 'customers': return <CustomersView dir={dir} />;
      case 'sales':     return <PlaceholderView icon="receipt" title={dir==='rtl'?'سجل المبيعات':'Sales history'} sub={dir==='rtl'?'الفواتير ومرتجعات المبيعات. ساكن في الـ Slice 1 — تم التركيز هنا على نقطة البيع.':'Invoices and returns. Slice 1 stub — focus was on POS.'} />;
      case 'reports':   return <PlaceholderView icon="bar-chart-3" title={dir==='rtl'?'التقارير':'Reports'} sub={dir==='rtl'?'تقارير يومية / أسبوعية / شهرية. ساكن في الـ Slice 1.':'Daily / weekly / monthly reports. Slice 1 stub.'} />;
      case 'cash':      return <PlaceholderView icon="wallet" title={dir==='rtl'?'الصندوق':'Cash drawer'} sub={dir==='rtl'?'مفتاح / غلق اليوم وتسوية النقدية.':'Open & close-of-day cash reconciliation.'} />;
      case 'sync':      return <PlaceholderView icon="cloud-upload" title={dir==='rtl'?'طابور المزامنة':'Sync queue'} sub={dir==='rtl'?'٣ معاملات في انتظار الاتصال.':'3 transactions waiting to flush.'} />;
      case 'staff':     return <PlaceholderView icon="shield-check" title={dir==='rtl'?'الموظفون والأدوار':'Staff & roles'} sub={dir==='rtl'?'٣ أدوار في الـ Slice 1: مدير، صيدلي، مساعد.':'3 roles in Slice 1: Admin, Pharmacist, Assistant.'} />;
      case 'settings':  return <PlaceholderView icon="settings-2" title={dir==='rtl'?'الإعدادات':'Settings'} sub={dir==='rtl'?'إعدادات الصيدلية والخادم المحلي.':'Pharmacy entity and local-server settings.'} />;
      default:          return <POSView dir={dir} />;
    }
  }

  return (
    <div className="app">
      <Sidebar screen={screen} onScreen={setScreen} dir={dir} />
      <TopBar
        screen={screen}
        dir={dir}
        online={online}
        onLang={setDir}
        onToggleOnline={() => setOnline(o => !o)}
      />
      <main className="main">
        {!online && <OfflineBanner dir={dir} />}
        {renderScreen()}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
