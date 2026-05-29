/* data.jsx — bilingual copy + sample patient data for the Balsm patient app */

/* ── i18n dictionary. t(key) resolves against current language. ─────────── */
const STR = {
  /* Welcome */
  w_title:   { en: "Your health, kept close.", ar: "صحتك، دائماً قريبة." },
  w_sub:     { en: "Daily check-ins, medication reminders, and trends — saved on your phone, synced when you're ready.",
               ar: "متابعة يومية، تذكير بالدواء، ورسوم بيانية — محفوظة على هاتفك، وتُزامَن عند رغبتك." },
  w_start:   { en: "Get started", ar: "ابدأ الآن" },
  w_have:    { en: "I already have an account", ar: "لديّ حساب بالفعل" },
  w_signin:  { en: "Sign in", ar: "تسجيل الدخول" },
  trust_device: { en: "Stored on your device", ar: "محفوظ على جهازك" },
  trust_private:{ en: "Private by default", ar: "خصوصية افتراضية" },
  trust_offline:{ en: "Works offline", ar: "يعمل دون إنترنت" },

  /* Phone */
  ph_title:  { en: "What's your number?", ar: "ما رقم هاتفك؟" },
  ph_help:   { en: "We'll text you a code to confirm it's you.", ar: "سنرسل لك رمزاً عبر رسالة للتأكد من هويتك." },
  ph_label:  { en: "Mobile number", ar: "رقم الموبايل" },
  ph_terms:  { en: "By continuing you agree to Balsm's terms and privacy policy.", ar: "بالمتابعة فإنك توافق على شروط بَلسَم وسياسة الخصوصية." },
  continue:  { en: "Continue", ar: "متابعة" },

  /* OTP */
  otp_title: { en: "Enter your code", ar: "أدخل رمز التحقق" },
  otp_help:  { en: "We sent a 6-digit code to", ar: "أرسلنا رمزاً من 6 أرقام إلى" },
  otp_resend:{ en: "Resend code", ar: "إعادة إرسال الرمز" },
  otp_in:    { en: "Resend in", ar: "إعادة الإرسال خلال" },
  otp_wrong: { en: "Wrong number?", ar: "الرقم غير صحيح؟" },
  verify:    { en: "Verify", ar: "تأكيد" },

  /* Profile setup */
  pf_title:  { en: "Tell us about you", ar: "عرّفنا بنفسك" },
  pf_help:   { en: "This helps your care team read your reports correctly.", ar: "هذا يساعد فريق الرعاية على قراءة تقاريرك بدقة." },
  pf_name:   { en: "Full name", ar: "الاسم بالكامل" },
  pf_name_ph:{ en: "e.g. Layla Hassan", ar: "مثال: ليلى حسن" },
  pf_dob:    { en: "Date of birth", ar: "تاريخ الميلاد" },
  pf_gender: { en: "Gender", ar: "النوع" },
  pf_female: { en: "Female", ar: "أنثى" },
  pf_male:   { en: "Male", ar: "ذكر" },
  pf_gov:    { en: "Governorate", ar: "المحافظة" },
  pf_create: { en: "Create my profile", ar: "إنشاء ملفّي" },
  pf_secure: { en: "Your details stay on this device.", ar: "تبقى بياناتك على هذا الجهاز." },

  /* Home */
  greet:     { en: "Good morning", ar: "صباح الخير" },
  today_lbl: { en: "Today's check-in", ar: "متابعة اليوم" },
  hero_q:    { en: "How are you feeling today?", ar: "كيف تشعرين اليوم؟" },
  hero_cta:  { en: "Start check-in", ar: "ابدأ المتابعة" },
  hero_time: { en: "About 2 minutes", ar: "حوالي دقيقتين" },
  done_lbl:  { en: "All done for today", ar: "انتهيتِ لليوم" },
  done_q:    { en: "Check-in complete", ar: "اكتملت المتابعة" },
  done_cta:  { en: "View today's report", ar: "عرض تقرير اليوم" },
  streak:    { en: "day streak", ar: "يوم متتالٍ" },
  streak_help:{ en: "Checked in 6 of the last 7 days", ar: "تابعتِ 6 من آخر 7 أيام" },
  latest:    { en: "Latest readings", ar: "آخر القياسات" },
  meds_today:{ en: "Today's medications", ar: "أدوية اليوم" },
  mark_all:  { en: "Mark all taken", ar: "تحديد الكل كمأخوذ" },
  recent:    { en: "Recent reports", ar: "آخر التقارير" },
  see_all:   { en: "See all", ar: "عرض الكل" },
  taken:     { en: "Taken", ar: "مأخوذ" },
  due:       { en: "Due", ar: "مستحق" },
  take:      { en: "Take", ar: "أخذ" },

  /* metrics */
  m_bp:      { en: "Blood pressure", ar: "ضغط الدم" },
  m_glucose: { en: "Blood glucose", ar: "سكر الدم" },
  m_mood:    { en: "Mood", ar: "الحالة" },
  m_pain:    { en: "Pain", ar: "الألم" },
  m_weight:  { en: "Weight", ar: "الوزن" },
  unit_bp:   { en: "mmHg", ar: "ملم زئبق" },
  unit_glu:  { en: "mg/dL", ar: "مجم/دل" },
  bp_normal: { en: "In range", ar: "ضمن المعدل" },
  bp_high:   { en: "A little high", ar: "أعلى قليلاً" },
  yesterday: { en: "vs yesterday", ar: "عن أمس" },

  /* Report flow */
  step_of:   { en: "of", ar: "من" },
  back:      { en: "Back", ar: "رجوع" },
  finish:    { en: "Finish check-in", ar: "إنهاء المتابعة" },
  skip_q:    { en: "I didn't measure this today", ar: "لم أقِس هذا اليوم" },

  q_mood_t:  { en: "How are you feeling today?", ar: "كيف تشعرين اليوم؟" },
  q_mood_h:  { en: "Pick the face that fits best.", ar: "اختاري الوجه الأقرب لحالتك." },
  mood_1:    { en: "Rough", ar: "متعبة" },
  mood_2:    { en: "Low", ar: "ضعيفة" },
  mood_3:    { en: "Okay", ar: "عادية" },
  mood_4:    { en: "Good", ar: "جيدة" },
  mood_5:    { en: "Great", ar: "ممتازة" },

  q_bp_t:    { en: "What's your blood pressure?", ar: "كم ضغط دمك؟" },
  q_bp_h:    { en: "Tap a number, then use the keypad.", ar: "اضغطي على الرقم ثم استخدمي لوحة الأرقام." },
  sys:       { en: "Systolic", ar: "الانقباضي" },
  dia:       { en: "Diastolic", ar: "الانبساطي" },

  q_glu_t:   { en: "And your blood sugar?", ar: "وكم نسبة السكر؟" },
  q_glu_h:   { en: "Enter the reading from your glucometer.", ar: "أدخلي القراءة من جهاز قياس السكر." },
  glu_fast:  { en: "Fasting", ar: "صائمة" },
  glu_meal:  { en: "After a meal", ar: "بعد الأكل" },
  glu_random:{ en: "Random", ar: "عشوائي" },

  q_med_t:   { en: "Did you take your medications?", ar: "هل أخذتِ أدويتك؟" },
  q_med_h:   { en: "Tap each one you've taken today.", ar: "اضغطي على كل دواء أخذتِه اليوم." },
  skipped:   { en: "Skipped", ar: "لم يُؤخذ" },
  mark_skip: { en: "Didn't take", ar: "لم آخذه" },

  q_sym_t:   { en: "Any pain or symptoms?", ar: "هل لديك ألم أو أعراض؟" },
  q_sym_h:   { en: "Slide to your pain level, then tap anything you feel.", ar: "حرّكي المؤشر لمستوى الألم، ثم اختاري ما تشعرين به." },
  pain_0:    { en: "No pain", ar: "لا ألم" },
  pain_mild: { en: "Mild", ar: "خفيف" },
  pain_mod:  { en: "Moderate", ar: "متوسط" },
  pain_sev:  { en: "Severe", ar: "شديد" },
  pain_worst:{ en: "Worst", ar: "الأسوأ" },
  note_lbl:  { en: "Anything else? (optional)", ar: "أي شيء آخر؟ (اختياري)" },
  note_ph:   { en: "Add a note for your doctor…", ar: "اكتبي ملاحظة لطبيبك…" },
  add_photo: { en: "Add a photo", ar: "إضافة صورة" },

  /* symptoms */
  s_headache:{ en: "Headache", ar: "صداع" },
  s_dizzy:   { en: "Dizziness", ar: "دوخة" },
  s_fatigue: { en: "Fatigue", ar: "إرهاق" },
  s_blurred: { en: "Blurred vision", ar: "تشوش الرؤية" },
  s_swelling:{ en: "Swelling", ar: "تورّم" },
  s_chest:   { en: "Chest tightness", ar: "ضيق بالصدر" },
  s_nausea:  { en: "Nausea", ar: "غثيان" },
  s_thirst:  { en: "Excess thirst", ar: "عطش زائد" },
  s_none:    { en: "Nothing", ar: "لا شيء" },

  /* Summary */
  saved_t:   { en: "Check-in saved", ar: "تم حفظ المتابعة" },
  saved_local:{ en: "Saved locally. Will sync when you reconnect.", ar: "حُفظ محلياً — ستتم المزامنة عند الاتصال." },
  to_doctor: { en: "A copy reaches Dr. Sara at your next visit.", ar: "ستصل نسخة إلى د. سارة في زيارتك القادمة." },
  meds_taken:{ en: "taken", ar: "مأخوذة" },
  to_home:   { en: "Back to home", ar: "العودة للرئيسية" },
  view_trends:{ en: "View trends", ar: "عرض الرسوم" },
  no_symptoms:{ en: "No symptoms", ar: "لا أعراض" },

  /* Trends / history */
  trends:    { en: "Trends", ar: "الرسوم البيانية" },
  reports:   { en: "Past reports", ar: "التقارير السابقة" },
  range_w:   { en: "Week", ar: "أسبوع" },
  range_m:   { en: "Month", ar: "شهر" },
  range_3m:  { en: "3 months", ar: "3 أشهر" },
  avg:       { en: "avg", ar: "متوسط" },

  /* Meds tab */
  medications:{ en: "Medications", ar: "الأدوية" },
  morning:   { en: "Morning", ar: "الصباح" },
  evening:   { en: "Evening", ar: "المساء" },
  adherence: { en: "this week", ar: "هذا الأسبوع" },
  on_track:  { en: "On track", ar: "ملتزمة" },

  /* Profile */
  profile:   { en: "Profile", ar: "الملف الشخصي" },
  since:     { en: "Balsm patient since", ar: "مريضة بَلسَم منذ" },
  p_personal:{ en: "Personal details", ar: "البيانات الشخصية" },
  p_cond:    { en: "Conditions & allergies", ar: "الحالات والحساسية" },
  p_care:    { en: "Care team", ar: "فريق الرعاية" },
  p_notif:   { en: "Reminders", ar: "التذكيرات" },
  p_lang:    { en: "Language", ar: "اللغة" },
  p_privacy: { en: "Privacy & data", ar: "الخصوصية والبيانات" },
  p_help:    { en: "Help & support", ar: "المساعدة والدعم" },
  p_signout: { en: "Sign out", ar: "تسجيل الخروج" },

  /* tabs */
  tab_home:  { en: "Home", ar: "الرئيسية" },
  tab_trends:{ en: "Trends", ar: "الرسوم" },
  tab_meds:  { en: "Meds", ar: "الأدوية" },
  tab_profile:{ en: "Profile", ar: "الملف" },
};

/* Sample patient */
const PATIENT = {
  name:   { en: "Layla Hassan", ar: "ليلى حسن" },
  initials: "LH",
  phone:  "+20 10 1234 5678",
  age: 58,
  since: { en: "Mar 2025", ar: "مارس 2025" },
  conditions: [
    { en: "Type 2 diabetes", ar: "السكري من النوع الثاني" },
    { en: "Hypertension", ar: "ارتفاع ضغط الدم" },
  ],
};

/* Medications (chronic regimen) */
const MEDS = [
  { id: "metformin", name: { en: "Metformin", ar: "ميتفورمين" }, dose: { en: "500 mg · with breakfast", ar: "500 ملجم · مع الإفطار" }, when: "morning", tone: "info", icon: "pill" },
  { id: "amlodipine", name: { en: "Amlodipine", ar: "أملوديبين" }, dose: { en: "5 mg · once daily", ar: "5 ملجم · مرة يومياً" }, when: "morning", tone: "violet", icon: "heart-pulse" },
  { id: "atorvastatin", name: { en: "Atorvastatin", ar: "أتورفاستاتين" }, dose: { en: "20 mg · after dinner", ar: "20 ملجم · بعد العشاء" }, when: "evening", tone: "success", icon: "pill" },
];

/* Egyptian governorates */
const GOVERNORATES = [
  { en: "Cairo", ar: "القاهرة" }, { en: "Giza", ar: "الجيزة" }, { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Dakahlia", ar: "الدقهلية" }, { en: "Sharqia", ar: "الشرقية" }, { en: "Qalyubia", ar: "القليوبية" },
  { en: "Gharbia", ar: "الغربية" }, { en: "Beheira", ar: "البحيرة" }, { en: "Menoufia", ar: "المنوفية" },
  { en: "Aswan", ar: "أسوان" }, { en: "Luxor", ar: "الأقصر" }, { en: "Port Said", ar: "بورسعيد" },
];

/* Mood faces — drawn with simple arcs (calm, not emoji) */
const MOOD_COLORS = ["#D44A3C", "#D97A20", "#E5B428", "#55D77F", "#01C4A2"];

/* History of past check-ins (most recent first; today excluded until done) */
const HISTORY = [
  { d: 28, m: { en: "MAY", ar: "مايو" }, bp: "128/82", glu: 142, mood: 4, pain: 1, sym: 0 },
  { d: 27, m: { en: "MAY", ar: "مايو" }, bp: "134/86", glu: 156, mood: 3, pain: 3, sym: 1 },
  { d: 26, m: { en: "MAY", ar: "مايو" }, bp: "131/84", glu: 138, mood: 4, pain: 0, sym: 0 },
  { d: 25, m: { en: "MAY", ar: "مايو" }, bp: "126/80", glu: 129, mood: 5, pain: 0, sym: 0 },
  { d: 24, m: { en: "MAY", ar: "مايو" }, bp: "139/88", glu: 167, mood: 2, pain: 4, sym: 2 },
  { d: 23, m: { en: "MAY", ar: "مايو" }, bp: "130/83", glu: 145, mood: 3, pain: 2, sym: 0 },
];

/* Trend series for charts */
const TREND_BP_SYS = [126, 139, 130, 134, 131, 128, 127]; // last 7 days systolic
const TREND_BP_DIA = [80, 88, 83, 86, 84, 82, 81];
const TREND_GLU = [129, 167, 145, 156, 138, 142, 134];

Object.assign(window, { STR, PATIENT, MEDS, GOVERNORATES, MOOD_COLORS, HISTORY, TREND_BP_SYS, TREND_BP_DIA, TREND_GLU });
