/* app.jsx — shell: router, tab bar, context, scaling, Tweaks */

const ACCENTS = {
  blue:    { main: '#1283FF', d: '#0F6BCC', bg: '#E4F0FF', sh: 'rgba(18,131,255,.26)' },
  aqua:    { main: '#02BBB5', d: '#029E99', bg: '#E2F8F6', sh: 'rgba(2,187,181,.26)' },
  emerald: { main: '#01C4A2', d: '#019A7F', bg: '#E1F8F1', sh: 'rgba(1,196,162,.26)' },
  violet:  { main: '#724DD0', d: '#5C3AB0', bg: '#ECE6FA', sh: 'rgba(114,77,208,.26)' },
  mint:    { main: '#3FC366', d: '#2FA552', bg: '#E8F9EE', sh: 'rgba(85,215,127,.30)' },
};
const hexToKey = (hex) => Object.keys(ACCENTS).find(k => ACCENTS[k].main.toLowerCase() === hex.toLowerCase()) || 'blue';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "en",
  "accent": "blue",
  "fontScale": 1
}/*EDITMODE-END*/;

function useFit(w, h, pad = 40) {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const fit = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      if (mobile) { setScale(1); return; }
      setScale(Math.min(1, (window.innerWidth - pad) / w, (window.innerHeight - pad) / h));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w, h, pad]);
  return { scale, isMobile };
}

function TabBar() {
  const { t, lang, tab, setTab, openFlow } = useApp();
  const chev = lang === 'ar';
  const Tab = ({ id, icon, label }) => (
    <button className={cx('tab', tab === id && 'active')} onClick={() => setTab(id)}>
      <Icon name={icon} size={24} stroke={tab === id ? 2.1 : 1.9} />
      <span>{label}</span>
    </button>
  );
  return (
    <div className="tabbar">
      <Tab id="home" icon="home" label={t('tab_home')} />
      <Tab id="trends" icon="line-chart" label={t('tab_trends')} />
      <div className="tab tab-fab">
        <div className="fab" onClick={openFlow}><Icon name="plus" size={26} stroke={2.4} /></div>
      </div>
      <Tab id="meds" icon="pill" label={t('tab_meds')} />
      <Tab id="profile" icon="user" label={t('tab_profile')} />
    </div>
  );
}

function MainApp() {
  const { tab, flowOpen, openFlow, closeFlow, finishFlow } = useApp();
  const Screen = { home: HomeScreen, trends: TrendsScreen, meds: MedsScreen, profile: ProfileScreen }[tab] || HomeScreen;
  return (
    <div className="screen">
      <Screen />
      <TabBar />
      {flowOpen && <ReportFlow onClose={closeFlow} onDone={finishFlow} />}
    </div>
  );
}

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const lang = tw.lang;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const accentKey = tw.accent in ACCENTS ? tw.accent : 'blue';
  const A = ACCENTS[accentKey];

  const [route, setRoute] = useState('welcome');
  const [tab, setTab] = useState('home');
  const [phone, setPhone] = useState('+20 10 1234 5678');
  const [today, setToday] = useState(null);
  const [flowOpen, setFlowOpen] = useState(false);

  const t = useCallback((key) => (STR[key] && (STR[key][lang] ?? STR[key].en)) ?? key, [lang]);

  const go = (r) => { if (r === 'app') { setTab('home'); setToday(null); } if (r === 'welcome') { setToday(null); } setRoute(r); };
  const ctx = {
    t, lang, dir, accent: accentKey,
    setLang: (l) => setTweak('lang', l),
    phone, setPhone,
    go, tab, setTab,
    today, completeCheckin: setToday,
    flowOpen, openFlow: () => setFlowOpen(true), closeFlow: () => setFlowOpen(false),
    finishFlow: (toTab) => { setFlowOpen(false); setTab(toTab); },
  };

  const { scale, isMobile } = useFit(402, 874, 40);

  const AuthScreen = { welcome: WelcomeScreen, phone: PhoneScreen, otp: OtpScreen, profile: ProfileSetupScreen }[route];

  const accentVars = {
    '--app-accent': A.main, '--app-accent-600': A.d, '--app-accent-50': A.bg,
    '--app-accent-shadow': `0 8px 22px ${A.sh}`,
    '--ui-scale': tw.fontScale,
  };

  // On real mobile the stage fills the viewport; on tablet/desktop the iOS frame floats
  const frameStyle = isMobile
    ? { width: '100%', height: '100%' }
    : { transform: `scale(${scale})`, transformOrigin: 'center center' };

  const stageStyle = isMobile
    ? { padding: 0, alignItems: 'stretch', minHeight: '100dvh', minHeight: '100vh' }
    : {};

  return (
    <AppCtx.Provider value={ctx}>
      <div className="stage" style={{ ...accentVars, ...stageStyle }}>
        <div style={frameStyle}>
          <IOSDevice>
            <div dir={dir} style={{ height: '100%', position: 'absolute', inset: 0 }}>
              {route === 'app' ? <MainApp /> : <AuthScreen />}
            </div>
          </IOSDevice>
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label={t('p_lang')} />
        <TweakRadio label="Language" value={lang === 'ar' ? 'العربية' : 'English'} options={['English', 'العربية']}
          onChange={(v) => setTweak('lang', v === 'العربية' ? 'ar' : 'en')} />
        <TweakSection label="Accent petal" />
        <TweakColor label="Accent" value={A.main}
          options={Object.values(ACCENTS).map(a => a.main)}
          onChange={(hex) => setTweak('accent', hexToKey(hex))} />
        <TweakSection label="Accessibility" />
        <TweakSlider label="Text size" value={tw.fontScale} min={0.9} max={1.3} step={0.05} unit="×"
          onChange={(v) => setTweak('fontScale', v)} />
      </TweaksPanel>
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
