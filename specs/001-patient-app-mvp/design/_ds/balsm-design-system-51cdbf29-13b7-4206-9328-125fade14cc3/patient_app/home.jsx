/* home.jsx — main app screens: Home, Trends, Meds, Profile */

/* Simple responsive line chart (data viz, not illustration). */
function LineChart({ series, rtl, yPad = 8, height = 96 }) {
  const W = 320, H = height;
  const all = series.flatMap(s => s.data);
  const min = Math.min(...all), max = Math.max(...all);
  const range = max - min || 1;
  const n = series[0].data.length;
  const x = (i) => {
    const r = n === 1 ? 0.5 : i / (n - 1);
    return (rtl ? 1 - r : r) * (W - 16) + 8;
  };
  const y = (v) => yPad + (1 - (v - min) / range) * (H - yPad * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      {[0.5].map(g => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--balsm-ink-100)" strokeWidth="1" />)}
      {series.map((s, si) => {
        const pts = s.data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
        return <g key={si}>
          <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {s.data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === (rtl ? 0 : n - 1) ? 4 : 2.5} fill="#fff" stroke={s.color} strokeWidth="2" />)}
        </g>;
      })}
    </svg>
  );
}

function HomeScreen() {
  const { t, lang, accent, openFlow, setTab, today } = useApp();
  const checkedIn = !!today;
  const cur = today || { bp: HISTORY[0].bp, glu: HISTORY[0].glu, mood: HISTORY[0].mood, pain: HISTORY[0].pain };
  const moodLbl = cur.mood ? t('mood_' + cur.mood) : '—';

  const metrics = [
    { icon: 'activity', lab: t('m_bp'), val: cur.bp || '—', unit: t('unit_bp'), foot: t('bp_normal'), tone: 'down' },
    { icon: 'droplet', lab: t('m_glucose'), val: cur.glu || '—', unit: t('unit_glu'), foot: t('bp_high'), tone: 'up' },
    { icon: 'smile', lab: t('m_mood'), val: moodLbl, unit: '', foot: '', tone: '' },
    { icon: 'thermometer', lab: t('m_pain'), val: (cur.pain ?? 0) + '/10', unit: '', foot: '', tone: '' },
  ];

  return (
    <div className="screen-scroll fade-in">
      <div className="pad-top" />
      <div className="appbar">
        <div className="avatar" style={{ background: 'var(--petal-aqua)' }}>{PATIENT.initials}</div>
        <div className="grow">
          <div className="meta">{t('greet')}</div>
          <h1 style={{ fontSize: 'var(--pt-xl)' }}>{PATIENT.name[lang].split(' ')[0]}</h1>
        </div>
        <button className="round-btn" aria-label="Reminders"><Icon name="bell" /></button>
      </div>

      {/* Hero check-in */}
      {!checkedIn ? (
        <div className="hero-card">

          <div className="label">{t('today_lbl')}</div>
          <div className="h" style={{ textWrap: 'balance' }}>{t('hero_q')}</div>
          <div className="cta" onClick={openFlow} style={{ whiteSpace: 'nowrap' }}>
            <Icon name="plus-circle" size={20} />{t('hero_cta')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 'var(--pt-sm)', opacity: 0.9 }}>
            <Icon name="clock" size={15} />{t('hero_time')}
          </div>
        </div>
      ) : (
        <div className="hero-card done">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="confirm-mark" style={{ width: 52, height: 52, margin: 0 }}><Icon name="check" size={28} /></div>
            <div className="grow">
              <div className="label">{t('done_lbl')}</div>
              <div className="subhead" style={{ marginTop: 2 }}>{t('done_q')}</div>
            </div>
            <button className="round-btn" onClick={() => setTab('trends')}><Icon name="chevron-right" style={{ transform: lang==='ar'?'scaleX(-1)':'none' }} /></button>
          </div>
        </div>
      )}

      {/* Streak */}
      <div className="card" style={{ margin: '16px 20px 0', padding: 16 }}>
        <div className="streak">
          <div className="ring">
            <svg width="56" height="56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="var(--balsm-ink-100)" strokeWidth="6" />
              <circle cx="28" cy="28" r="24" fill="none" stroke="var(--app-accent)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * (1 - 6/7)} />
            </svg>
            <div className="rtxt">6</div>
          </div>
          <div className="grow">
            <div className="subhead" style={{ fontSize: 'var(--pt-md)' }}><b className="num">6</b> {t('streak')}</div>
            <div className="meta" style={{ marginTop: 2 }}>{t('streak_help')}</div>
          </div>
          <Icon name="flame" size={24} style={{ color: 'var(--balsm-sun-500)' }} />
        </div>
      </div>

      {/* Latest readings */}
      <div className="row-head"><h2>{t('latest')}</h2></div>
      <div className="metric-grid">
        {metrics.map((m, i) => (
          <div key={i} className="metric">
            <div className="mlab"><Icon name={m.icon} size={15} />{m.lab}</div>
            <div className="mval" dir={/[0-9]/.test(String(m.val)) ? 'ltr' : undefined} style={{ textAlign: lang==='ar' && /[0-9]/.test(String(m.val)) ? 'right' : undefined }}>
              {m.val}{m.unit && <span className="unit">{m.unit}</span>}
            </div>
            {m.foot && <div className={cx('mfoot', m.tone)}>{m.tone && <Icon name={m.tone==='up'?'arrow-up-right':'arrow-down-right'} size={14} />}{m.foot}</div>}
          </div>
        ))}
      </div>

      {/* Today's meds */}
      <div className="row-head"><h2>{t('meds_today')}</h2><a onClick={() => setTab('meds')}>{t('see_all')}</a></div>
      <div className="card" style={{ margin: '0 20px' }}>
        {MEDS.map((m, i) => {
          const tone = m.tone;
          const bg = { info: 'var(--petal-blue-50)', violet: 'var(--petal-violet-50)', success: 'var(--petal-mint-50)' }[tone];
          const fg = { info: 'var(--petal-blue)', violet: 'var(--petal-violet)', success: 'var(--petal-mint-600)' }[tone];
          const done = checkedIn || i === 0;
          return (
            <div key={m.id} className="med-row">
              <div className="med-ico" style={{ background: bg, color: fg }}><Icon name={m.icon} /></div>
              <div className="grow">
                <div className="mname">{m.name[lang]}</div>
                <div className="mdose">{m.dose[lang]}</div>
              </div>
              {done
                ? <span className="pill success"><span className="dot" />{t('taken')}</span>
                : <button className="btn soft" style={{ height: 40, padding: '0 18px' }}>{t('take')}</button>}
            </div>
          );
        })}
      </div>

      {/* Recent reports */}
      <div className="row-head"><h2>{t('recent')}</h2><a onClick={() => setTab('trends')}>{t('see_all')}</a></div>
      <div className="card" style={{ margin: '0 20px' }}>
        {HISTORY.slice(0, 3).map((h, i) => <HistoryRow key={i} h={h} onClick={() => setTab('trends')} />)}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

function HistoryRow({ h, onClick }) {
  const { t, lang } = useApp();
  const pinfo = (() => { if (h.pain === 0) return 'success'; if (h.pain <= 3) return 'success'; if (h.pain <= 6) return 'warn'; return 'danger'; })();
  return (
    <div className="history-row" onClick={onClick}>
      <div className="h-date"><div className="d num">{h.d}</div><div className="m">{h.m[lang]}</div></div>
      <div className="grow">
        <div className="hsummary">
          <Icon name="activity" size={14} style={{ color: 'var(--petal-violet)' }} /><span className="num" dir="ltr">{h.bp}</span>
          <span style={{ color: 'var(--balsm-ink-300)' }}>·</span>
          <Icon name="droplet" size={14} style={{ color: 'var(--petal-mint-600)' }} /><span className="num">{h.glu}</span>
        </div>
      </div>
      <MoodFace level={h.mood} size={26} color={MOOD_COLORS[h.mood-1]} />
      <span className={cx('pill', pinfo)} style={{ padding: '3px 8px' }}><span className="num">{h.pain}</span></span>
    </div>
  );
}

function TrendsScreen() {
  const { t, lang } = useApp();
  const [range, setRange] = useState('range_w');
  const rtl = lang === 'ar';
  return (
    <div className="screen-scroll fade-in">
      <div className="pad-top" />
      <div className="appbar"><h1 className="grow">{t('trends')}</h1>
        <div className="range-tabs">
          {['range_w','range_m','range_3m'].map(r => (
            <button key={r} className={cx(range===r && 'on')} onClick={() => setRange(r)}>{t(r)}</button>
          ))}
        </div>
      </div>

      {/* BP chart */}
      <div className="card chart-card">
        <div className="chart-head">
          <span className="ctitle">{t('m_bp')}</span>
          <span className="cval">{t('avg')} <b className="num" style={{ color: 'var(--fg1)' }}>131/84</b> {t('unit_bp')}</span>
        </div>
        <LineChart rtl={rtl} series={[
          { data: TREND_BP_SYS, color: 'var(--petal-violet)' },
          { data: TREND_BP_DIA, color: 'var(--petal-blue)' },
        ]} />
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <span className="meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="dot" style={{ width: 8, height: 8, borderRadius: 9, background: 'var(--petal-violet)' }} />{t('sys')}</span>
          <span className="meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="dot" style={{ width: 8, height: 8, borderRadius: 9, background: 'var(--petal-blue)' }} />{t('dia')}</span>
        </div>
      </div>

      {/* Glucose chart */}
      <div className="card chart-card" style={{ marginTop: 14 }}>
        <div className="chart-head">
          <span className="ctitle">{t('m_glucose')}</span>
          <span className="cval">{t('avg')} <b className="num" style={{ color: 'var(--fg1)' }}>144</b> {t('unit_glu')}</span>
        </div>
        <LineChart rtl={rtl} series={[{ data: TREND_GLU, color: 'var(--petal-mint-600)' }]} />
      </div>

      {/* Past reports */}
      <div className="row-head"><h2>{t('reports')}</h2></div>
      <div className="card" style={{ margin: '0 20px' }}>
        {HISTORY.map((h, i) => <HistoryRow key={i} h={h} onClick={() => {}} />)}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

function MedsScreen() {
  const { t, lang } = useApp();
  const groups = [
    { key: 'morning', icon: 'sunrise', meds: MEDS.filter(m => m.when === 'morning') },
    { key: 'evening', icon: 'moon', meds: MEDS.filter(m => m.when === 'evening') },
  ];
  return (
    <div className="screen-scroll fade-in">
      <div className="pad-top" />
      <div className="appbar"><h1 className="grow">{t('medications')}</h1></div>

      {/* adherence */}
      <div className="card" style={{ margin: '0 20px 8px', padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="ring">
          <svg width="56" height="56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="var(--balsm-ink-100)" strokeWidth="6" />
            <circle cx="28" cy="28" r="24" fill="none" stroke="var(--petal-mint)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * (1 - 0.92)} />
          </svg>
          <div className="rtxt num" style={{ fontSize: 'var(--pt-sm)' }}>92%</div>
        </div>
        <div className="grow">
          <div className="subhead" style={{ fontSize: 'var(--pt-md)' }}><b className="num">92%</b> · {t('adherence')}</div>
          <span className="pill success" style={{ marginTop: 6 }}><span className="dot" />{t('on_track')}</span>
        </div>
      </div>

      {groups.map(g => (
        <div key={g.key}>
          <div className="row-head" style={{ margin: '18px 0 10px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--pt-md)' }}><Icon name={g.icon} size={18} style={{ color: 'var(--fg3)' }} />{t(g.key)}</h2>
          </div>
          <div className="card" style={{ margin: '0 20px' }}>
            {g.meds.map(m => {
              const bg = { info: 'var(--petal-blue-50)', violet: 'var(--petal-violet-50)', success: 'var(--petal-mint-50)' }[m.tone];
              const fg = { info: 'var(--petal-blue)', violet: 'var(--petal-violet)', success: 'var(--petal-mint-600)' }[m.tone];
              return (
                <div key={m.id} className="med-row">
                  <div className="med-ico" style={{ background: bg, color: fg }}><Icon name={m.icon} /></div>
                  <div className="grow">
                    <div className="mname">{m.name[lang]}</div>
                    <div className="mdose">{m.dose[lang]}</div>
                  </div>
                  {m.id === 'metformin'
                    ? <span className="pill success"><span className="dot" />{t('taken')}</span>
                    : <span className="pill neutral"><span className="dot" />{t('due')}</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ height: 24 }} />
    </div>
  );
}

function ProfileScreen() {
  const { t, lang, setLang, go } = useApp();
  const rows = [
    { icon: 'user', key: 'p_personal' },
    { icon: 'clipboard-list', key: 'p_cond' },
    { icon: 'stethoscope', key: 'p_care' },
    { icon: 'bell', key: 'p_notif' },
    { icon: 'shield-check', key: 'p_privacy' },
    { icon: 'life-buoy', key: 'p_help' },
  ];
  return (
    <div className="screen-scroll fade-in">
      <div className="pad-top" />
      <div className="appbar"><h1 className="grow">{t('profile')}</h1></div>
      <div className="profile-head">
        <div className="avatar" style={{ background: 'var(--petal-aqua)' }}>{PATIENT.initials}</div>
        <div className="pname">{PATIENT.name[lang]}</div>
        <div className="pmeta">{t('since')} {PATIENT.since[lang]}</div>
        <div className="chip-wrap" style={{ justifyContent: 'center', marginTop: 12 }}>
          {PATIENT.conditions.map((c, i) => (
            <span key={i} className="pill" style={{ background: 'var(--balsm-ink-100)', color: 'var(--balsm-ink-700)' }}>{c[lang]}</span>
          ))}
        </div>
      </div>

      {/* Language toggle (functional) */}
      <div className="card list-card">
        <div className="list-row" style={{ cursor: 'default' }}>
          <div className="lico"><Icon name="languages" /></div>
          <div className="grow">{t('p_lang')}</div>
          <div className="segmented" style={{ width: 150 }}>
            <button className={cx(lang==='en' && 'active')} onClick={() => setLang('en')}>English</button>
            <button className={cx(lang==='ar' && 'active')} onClick={() => setLang('ar')} style={{ fontFamily: 'var(--font-arabic)', fontSize: 'var(--pt-md)' }}>عربي</button>
          </div>
        </div>
      </div>

      <div className="card list-card">
        {rows.map((r, i) => (
          <div key={r.key} className="list-row">
            <div className="lico"><Icon name={r.icon} /></div>
            <div className="grow">{t(r.key)}</div>
            <span className="rchev"><Icon name="chevron-right" /></span>
          </div>
        ))}
      </div>

      <div className="px-20" style={{ paddingBottom: 24 }}>
        <button className="btn secondary block" style={{ color: 'var(--balsm-danger)' }} onClick={() => go('welcome')}>
          <Icon name="log-out" size={18} />{t('p_signout')}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, TrendsScreen, MedsScreen, ProfileScreen, LineChart });
