/* auth.jsx — Welcome → Phone → OTP → Profile setup */

/* Calm mood face drawn from arcs (no emoji) — shared with report flow */
function MoodFace({ level, size = 34, color }) {
  // level 1..5 → mouth curvature. eyes are simple dots.
  const curve = { 1: 7, 2: 3, 3: 0, 4: -4, 5: -8 }[level] ?? 0;
  const cy = 21 + (curve > 0 ? 1 : 0);
  const d = `M9 ${cy} Q17 ${cy + curve * 1.4} 25 ${cy}`;
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" style={{ display: 'block' }}>
      <circle cx="12.5" cy="14" r="1.9" fill={color} />
      <circle cx="21.5" cy="14" r="1.9" fill={color} />
      <path d={d} stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function WelcomeScreen() {
  const { t, go, accent } = useApp();
  return (
    <div className="welcome fade-in">
      <div className="wbg" style={{ backgroundImage: 'url(assets/balsm-background.png)', backgroundPosition: 'top right', backgroundSize: '110%' }} />
      <div className="wgrad" />
      <div className="pad-top" />
      <div className="wbody">
        <div className="wwordmark">
          <span className="wword-en">Balsm</span>
          <span className="wword-ar">بَلسَم</span>
        </div>
        <div className="wtitle" style={{ textWrap: 'balance' }}>{t('w_title')}</div>
        <div className="wsub" style={{ textWrap: 'pretty' }}>{t('w_sub')}</div>
        <div className="wactions">
          <button className="btn primary lg block" onClick={() => go('phone')}>{t('w_start')}</button>
          <div className="signin-link" onClick={() => go('phone')}>
            {t('w_have')} <b>{t('w_signin')}</b>
          </div>
        </div>
      </div>
      <div className="trust">
        <div className="ti"><Icon name="shield-check" size={22} /><span>{t('trust_device')}</span></div>
        <div className="ti"><Icon name="user-check" size={22} /><span>{t('trust_private')}</span></div>
        <div className="ti"><Icon name="wifi-off" size={22} /><span>{t('trust_offline')}</span></div>
      </div>
      <div className="pad-bottom" />
    </div>
  );
}

function AuthHeader({ onBack, step }) {
  return (
    <div className="appbar">
      <button className="round-btn" onClick={onBack} aria-label="Back"><Icon name="arrow-left" /></button>
      <div className="grow" />
      {step && (
        <div className="segmented" style={{ padding: 4, gap: 4, background: 'transparent', border: 'none' }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              width: i === step - 1 ? 22 : 7, height: 7, borderRadius: 999,
              background: i <= step - 1 ? 'var(--app-accent)' : 'var(--balsm-ink-200)',
              transition: 'all .25s var(--ease-out)', display: 'inline-block',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function PhoneScreen() {
  const { t, go, phone, setPhone } = useApp();
  const [val, setVal] = useState(phone.replace('+20 ', '') || '');
  const clean = val.replace(/\D/g, '');
  const ok = clean.length >= 10;
  const submit = () => { if (ok) { setPhone('+20 ' + val); go('otp'); } };
  return (
    <div className="screen cream fade-in">
      <div className="pad-top" />
      <AuthHeader onBack={() => go('welcome')} step={1} />
      <div className="screen-scroll px-20">
        <h1 className="title mt-8" style={{ margin: '8px 0 8px' }}>{t('ph_title')}</h1>
        <p className="body" style={{ margin: '0 0 28px' }}>{t('ph_help')}</p>
        <div className="field">
          <label>{t('ph_label')}</label>
          <div className="phone-field">
            <div className="dial-code"><span className="flag">🇪🇬</span><span>+20</span></div>
            <input
              className="input num" inputMode="tel" autoFocus
              placeholder="10 1234 5678" value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
        </div>
      </div>
      <div className="flow-foot" style={{ flexDirection: 'column', gap: 14 }}>
        <button className={cx('btn primary lg block', !ok && 'is-disabled')} onClick={submit}>{t('continue')}</button>
        <p className="meta" style={{ textAlign: 'center', margin: 0, lineHeight: 1.5 }}>{t('ph_terms')}</p>
      </div>
    </div>
  );
}

function OtpScreen() {
  const { t, go, phone } = useApp();
  const [code, setCode] = useState('');
  const [secs, setSecs] = useState(28);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  useEffect(() => {
    if (secs <= 0) return;
    const id = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secs]);
  const ok = code.length === 6;
  const submit = () => { if (ok) go('profile'); };
  // auto-submit on 6th digit
  useEffect(() => { if (code.length === 6) { const id = setTimeout(submit, 280); return () => clearTimeout(id); } }, [code]);
  return (
    <div className="screen cream fade-in">
      <div className="pad-top" />
      <AuthHeader onBack={() => go('phone')} step={2} />
      <div className="screen-scroll px-20">
        <h1 className="title mt-8" style={{ margin: '8px 0 8px' }}>{t('otp_title')}</h1>
        <p className="body" style={{ margin: '0 0 28px' }}>
          {t('otp_help')} <b className="num" style={{ color: 'var(--fg1)' }} dir="ltr">{phone}</b>
        </p>
        <div className="otp-row" onClick={() => inputRef.current && inputRef.current.focus()} dir="ltr">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className={cx('otp-box', code[i] && 'filled', code.length === i && 'active')}>
              {code[i] || ''}
            </div>
          ))}
        </div>
        <input
          ref={inputRef} inputMode="numeric" maxLength={6}
          value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
        />
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          {secs > 0
            ? <span className="meta">{t('otp_in')} <b className="num">{secs}s</b></span>
            : <button className="btn ghost" onClick={() => setSecs(28)}>{t('otp_resend')}</button>}
        </div>
      </div>
      <div className="flow-foot">
        <button className={cx('btn primary lg block', !ok && 'is-disabled')} onClick={submit}>{t('verify')}</button>
      </div>
    </div>
  );
}

function ProfileSetupScreen() {
  const { t, lang, go } = useApp();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('female');
  const [gov, setGov] = useState('');
  const ok = name.trim().length > 1 && gov;
  return (
    <div className="screen cream fade-in">
      <div className="pad-top" />
      <AuthHeader onBack={() => go('otp')} step={3} />
      <div className="screen-scroll px-20" style={{ paddingBottom: 12 }}>
        <h1 className="title mt-8" style={{ margin: '8px 0 8px' }}>{t('pf_title')}</h1>
        <p className="body" style={{ margin: '0 0 24px' }}>{t('pf_help')}</p>
        <div className="gap-16">
          <div className="field">
            <label>{t('pf_name')}</label>
            <input className="input" placeholder={t('pf_name_ph')} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>{t('pf_dob')}</label>
            <input className="input num" inputMode="numeric" placeholder="DD / MM / YYYY" value={dob}
              onChange={e => setDob(e.target.value)} dir="ltr" />
          </div>
          <div className="field">
            <label>{t('pf_gender')}</label>
            <div className="segmented">
              <button className={cx(gender === 'female' && 'active')} onClick={() => setGender('female')}>{t('pf_female')}</button>
              <button className={cx(gender === 'male' && 'active')} onClick={() => setGender('male')}>{t('pf_male')}</button>
            </div>
          </div>
          <div className="field">
            <label>{t('pf_gov')}</label>
            <div style={{ position: 'relative' }}>
              <select className="input" value={gov} onChange={e => setGov(e.target.value)}
                style={{ appearance: 'none', WebkitAppearance: 'none', color: gov ? 'var(--fg1)' : 'var(--fg4)' }}>
                <option value="" disabled>—</option>
                {GOVERNORATES.map((g, i) => <option key={i} value={g.en}>{g[lang]}</option>)}
              </select>
              <Icon name="chevron-down" size={20} style={{ position: 'absolute', top: 17, [lang==='ar'?'left':'right']: 14, color: 'var(--fg3)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>
      <div className="flow-foot" style={{ flexDirection: 'column', gap: 12 }}>
        <button className={cx('btn primary lg block', !ok && 'is-disabled')} onClick={() => go('app')}>{t('pf_create')}</button>
        <p className="meta" style={{ textAlign: 'center', margin: 0, display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name="shield-check" size={14} />{t('pf_secure')}
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { MoodFace, WelcomeScreen, PhoneScreen, OtpScreen, ProfileSetupScreen });
