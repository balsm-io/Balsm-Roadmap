/* bodymap.jsx — multi-view anatomical diagram: surface / muscles / organs · front / back · female / male */

/* ── Layer config ──────────────────────────────────────────── */
const LAYER_CFG = {
  surface: { label: { en: 'Surface',  ar: 'السطح'   }, icon: 'user'         },
  muscles: { label: { en: 'Muscles',  ar: 'العضلات' }, icon: 'dumbbell'     },
  organs:  { label: { en: 'Organs',   ar: 'الأعضاء' }, icon: 'heart-pulse'  },
};

/* ── Hotspots: front view ─────────────────────────────────── */
const HP_FRONT = [
  { id: 'head',        label: { en: 'Head',          ar: 'الرأس'            }, cx: 100, cy: 32  },
  { id: 'neck',        label: { en: 'Neck',           ar: 'الرقبة'           }, cx: 100, cy: 62  },
  { id: 'l-shoulder',  label: { en: 'L. Shoulder',    ar: 'كتف أيسر'         }, cx: 52,  cy: 89  },
  { id: 'r-shoulder',  label: { en: 'R. Shoulder',    ar: 'كتف أيمن'         }, cx: 148, cy: 89  },
  { id: 'chest',       label: { en: 'Chest',          ar: 'الصدر'            }, cx: 100, cy: 106 },
  { id: 'l-upper-arm', label: { en: 'L. Upper arm',   ar: 'عضد أيسر'         }, cx: 40,  cy: 128 },
  { id: 'r-upper-arm', label: { en: 'R. Upper arm',   ar: 'عضد أيمن'         }, cx: 160, cy: 128 },
  { id: 'abdomen',     label: { en: 'Abdomen',        ar: 'البطن'            }, cx: 100, cy: 150 },
  { id: 'l-elbow',     label: { en: 'L. Elbow',       ar: 'مرفق أيسر'        }, cx: 36,  cy: 162 },
  { id: 'r-elbow',     label: { en: 'R. Elbow',       ar: 'مرفق أيمن'        }, cx: 164, cy: 162 },
  { id: 'l-forearm',   label: { en: 'L. Forearm',     ar: 'ساعد أيسر'        }, cx: 33,  cy: 192 },
  { id: 'r-forearm',   label: { en: 'R. Forearm',     ar: 'ساعد أيمن'        }, cx: 167, cy: 192 },
  { id: 'pelvis',      label: { en: 'Pelvis',         ar: 'الحوض'            }, cx: 100, cy: 197 },
  { id: 'l-hand',      label: { en: 'L. Hand',        ar: 'يد يسرى'          }, cx: 33,  cy: 230 },
  { id: 'r-hand',      label: { en: 'R. Hand',        ar: 'يد يمنى'          }, cx: 167, cy: 230 },
  { id: 'l-thigh',     label: { en: 'L. Thigh',       ar: 'فخذ أيسر'         }, cx: 80,  cy: 256 },
  { id: 'r-thigh',     label: { en: 'R. Thigh',       ar: 'فخذ أيمن'         }, cx: 120, cy: 256 },
  { id: 'l-knee',      label: { en: 'L. Knee',        ar: 'ركبة يسرى'        }, cx: 80,  cy: 298 },
  { id: 'r-knee',      label: { en: 'R. Knee',        ar: 'ركبة يمنى'        }, cx: 120, cy: 298 },
  { id: 'l-shin',      label: { en: 'L. Shin',        ar: 'ساق يسرى'         }, cx: 80,  cy: 330 },
  { id: 'r-shin',      label: { en: 'R. Shin',        ar: 'ساق يمنى'         }, cx: 120, cy: 330 },
  { id: 'l-ankle',     label: { en: 'L. Ankle',       ar: 'كاحل أيسر'        }, cx: 80,  cy: 358 },
  { id: 'r-ankle',     label: { en: 'R. Ankle',       ar: 'كاحل أيمن'        }, cx: 120, cy: 358 },
  { id: 'l-foot',      label: { en: 'L. Foot',        ar: 'قدم يسرى'         }, cx: 80,  cy: 372 },
  { id: 'r-foot',      label: { en: 'R. Foot',        ar: 'قدم يمنى'         }, cx: 120, cy: 372 },
];

/* ── Hotspots: back view ──────────────────────────────────── */
const HP_BACK = [
  { id: 'bk-head',       label: { en: 'Head',          ar: 'الرأس'            }, cx: 100, cy: 32  },
  { id: 'bk-neck',       label: { en: 'Neck',           ar: 'الرقبة'           }, cx: 100, cy: 62  },
  { id: 'bk-l-shoulder', label: { en: 'L. Shoulder',    ar: 'كتف أيسر'         }, cx: 52,  cy: 89  },
  { id: 'bk-r-shoulder', label: { en: 'R. Shoulder',    ar: 'كتف أيمن'         }, cx: 148, cy: 89  },
  { id: 'bk-upper',      label: { en: 'Upper back',     ar: 'أعلى الظهر'       }, cx: 100, cy: 110 },
  { id: 'bk-l-arm',      label: { en: 'L. Upper arm',   ar: 'عضد أيسر'         }, cx: 40,  cy: 128 },
  { id: 'bk-r-arm',      label: { en: 'R. Upper arm',   ar: 'عضد أيمن'         }, cx: 160, cy: 128 },
  { id: 'bk-l-lat',      label: { en: 'L. Lat',         ar: 'عضلة ظهر أيسر'    }, cx: 60,  cy: 138 },
  { id: 'bk-r-lat',      label: { en: 'R. Lat',         ar: 'عضلة ظهر أيمن'    }, cx: 140, cy: 138 },
  { id: 'bk-mid',        label: { en: 'Mid back',       ar: 'وسط الظهر'        }, cx: 100, cy: 140 },
  { id: 'bk-lower',      label: { en: 'Lower back',     ar: 'أسفل الظهر'       }, cx: 100, cy: 166 },
  { id: 'bk-l-forearm',  label: { en: 'L. Forearm',     ar: 'ساعد أيسر'        }, cx: 33,  cy: 192 },
  { id: 'bk-r-forearm',  label: { en: 'R. Forearm',     ar: 'ساعد أيمن'        }, cx: 167, cy: 192 },
  { id: 'bk-l-hand',     label: { en: 'L. Hand',        ar: 'يد يسرى'          }, cx: 33,  cy: 230 },
  { id: 'bk-r-hand',     label: { en: 'R. Hand',        ar: 'يد يمنى'          }, cx: 167, cy: 230 },
  { id: 'bk-l-glute',    label: { en: 'L. Glute',       ar: 'أرداف أيسر'       }, cx: 82,  cy: 206 },
  { id: 'bk-r-glute',    label: { en: 'R. Glute',       ar: 'أرداف أيمن'       }, cx: 118, cy: 206 },
  { id: 'bk-l-hamstr',   label: { en: 'L. Hamstring',   ar: 'أوتار ركبة يسرى'  }, cx: 80,  cy: 256 },
  { id: 'bk-r-hamstr',   label: { en: 'R. Hamstring',   ar: 'أوتار ركبة يمنى'  }, cx: 120, cy: 256 },
  { id: 'bk-l-knee',     label: { en: 'L. Knee (back)', ar: 'ركبة يسرى (خلف)'  }, cx: 80,  cy: 298 },
  { id: 'bk-r-knee',     label: { en: 'R. Knee (back)', ar: 'ركبة يمنى (خلف)'  }, cx: 120, cy: 298 },
  { id: 'bk-l-calf',     label: { en: 'L. Calf',        ar: 'بطة ساق يسرى'     }, cx: 80,  cy: 330 },
  { id: 'bk-r-calf',     label: { en: 'R. Calf',        ar: 'بطة ساق يمنى'     }, cx: 120, cy: 330 },
  { id: 'bk-l-heel',     label: { en: 'L. Heel',        ar: 'كعب أيسر'         }, cx: 80,  cy: 358 },
  { id: 'bk-r-heel',     label: { en: 'R. Heel',        ar: 'كعب أيمن'         }, cx: 120, cy: 358 },
];

const HP_ALL = [...HP_FRONT, ...HP_BACK];
const HOTSPOTS = HP_ALL; // backward compat

/* ── SVG skin palette ─────────────────────────────────────── */
const SK = '#F0E4D4';      // skin fill
const SK2 = '#E4C8A8';     // skin mid-tone (lips, ear detail)
const SKS = '#C4907A';     // skin stroke
const SKD = '#B87A60';     // skin detail lines (opacity applied separately)

/* ── Head ─────────────────────────────────────────────────── */
function HeadSVG({ back }) {
  return (
    <g>
      {back && (
        <path d="M80,10 C80,6 90,4 100,4 C110,4 120,6 120,10 C120,20 118,32 116,40 L84,40 C82,32 80,20 80,10 Z"
          fill="#6B4A30" stroke="none" />
      )}
      <ellipse cx="100" cy="33" rx="21" ry="25" fill={SK} stroke={SKS} strokeWidth="1.2" />
      <ellipse cx="79"  cy="35" rx="4"  ry="5.5" fill={SK} stroke={SKS} strokeWidth="1" />
      <ellipse cx="121" cy="35" rx="4"  ry="5.5" fill={SK} stroke={SKS} strokeWidth="1" />
      {!back && (
        <g fill="none" stroke={SKD} strokeWidth="0.7" opacity="0.55">
          <path d="M92,38 C94,42 100,44 108,42" />
          <ellipse cx="93" cy="26" rx="4" ry="3.5" />
          <ellipse cx="107" cy="26" rx="4" ry="3.5" />
          <path d="M86,22 C88,20 92,19 96,20" />
          <path d="M104,20 C108,19 112,20 114,22" />
        </g>
      )}
    </g>
  );
}

/* ── Body silhouette ──────────────────────────────────────── */
function BodySVG({ gender, back }) {
  const f = gender === 'female';
  const torsoF = "M90,58 C82,60 66,66 56,76 C50,84 48,96 48,110 C48,124 52,138 56,150 C60,162 64,174 66,184 C62,196 58,208 58,218 C60,224 64,228 70,230 L130,230 C136,228 140,224 142,218 C142,208 138,196 134,184 C136,174 140,162 144,150 C148,138 152,124 152,110 C152,96 150,84 144,76 C134,66 118,60 110,58 Z";
  const torsoM = "M90,58 C82,60 62,64 50,74 C44,82 42,96 44,110 C46,124 50,138 54,150 C58,162 62,174 64,184 C62,196 62,208 64,218 C66,224 68,228 70,230 L130,230 C132,228 134,224 136,218 C138,208 138,196 136,184 C138,174 142,162 146,150 C150,138 154,124 156,110 C158,96 156,82 150,74 C138,64 118,60 110,58 Z";
  const lArm = "M56,74 C48,82 40,96 36,110 C32,122 32,136 34,148 C36,158 38,166 40,174 L50,176 C50,168 50,160 50,150 C50,140 50,126 52,114 C54,104 58,94 62,84 Z";
  const rArm = "M144,74 C152,82 160,96 164,110 C168,122 168,136 166,148 C164,158 162,166 160,174 L150,176 C150,168 150,160 150,150 C150,140 150,126 148,114 C146,104 142,94 138,84 Z";
  const lFore = "M34,146 C30,158 28,170 28,182 C28,194 30,204 34,212 L44,214 C42,206 42,196 42,186 C42,176 42,166 40,156 Z";
  const rFore = "M166,146 C170,158 172,170 172,182 C172,194 170,204 166,212 L156,214 C158,206 158,196 158,186 C158,176 158,166 160,156 Z";
  const lThighF = "M70,228 C66,238 64,252 64,266 C64,278 66,288 70,296 C72,302 74,306 76,308 L94,308 C96,306 96,302 94,296 C92,288 90,278 88,266 C86,252 84,238 82,230 Z";
  const rThighF = "M130,228 C134,238 136,252 136,266 C136,278 134,288 130,296 C128,302 126,306 124,308 L106,308 C104,306 104,302 106,296 C108,288 110,278 112,266 C114,252 116,238 118,230 Z";
  const lThighM = "M68,228 C64,238 62,252 62,266 C62,278 64,288 68,296 C70,302 72,306 74,308 L92,308 C94,306 94,302 92,296 C90,288 88,278 86,266 C84,252 82,238 80,230 Z";
  const rThighM = "M132,228 C136,238 138,252 138,266 C138,278 136,288 132,296 C130,302 128,306 126,308 L108,308 C106,306 106,302 108,296 C110,288 112,278 114,266 C116,252 118,238 120,230 Z";
  const lShin = "M68,306 C66,318 64,330 64,342 C64,352 66,358 68,362 L92,362 C94,358 92,352 92,342 C92,330 92,318 92,306 Z";
  const rShin = "M132,306 C134,318 136,330 136,342 C136,352 134,358 132,362 L108,362 C108,358 108,352 108,342 C108,330 108,318 108,306 Z";
  const lFoot = "M66,362 C64,366 62,370 62,374 C64,380 72,382 80,382 C86,382 92,380 94,376 C96,374 94,370 90,366 L88,364 L70,362 Z";
  const rFoot = "M134,362 C136,366 138,370 138,374 C136,380 128,382 120,382 C114,382 108,380 106,376 C104,374 106,370 110,366 L112,364 L130,362 Z";
  const attr = { fill: SK, stroke: SKS, strokeWidth: '1.2', strokeLinejoin: 'round' };

  return (
    <g>
      {/* Neck */}
      <path d="M91,57 C89,60 89,64 90,70 L110,70 C111,64 111,60 109,57 Z" {...attr} />
      {/* Torso */}
      <path d={f ? torsoF : torsoM} {...attr} />
      {/* Collar bones */}
      {!back && <g fill="none" stroke={SKD} strokeWidth="0.85" opacity="0.55">
        <path d="M90,70 C82,72 72,76 62,82" />
        <path d="M110,70 C118,72 128,76 138,82" />
      </g>}
      {/* Breast contour (female front) */}
      {f && !back && <g fill="none" stroke={SKD} strokeWidth="1" opacity="0.5">
        <path d="M62,102 C58,112 60,122 66,128 C72,134 80,134 86,128" />
        <path d="M138,102 C142,112 140,122 134,128 C128,134 120,134 114,128" />
      </g>}
      {/* Spine (back) */}
      {back && <path d="M100,70 Q99,108 100,140 Q101,172 100,210" fill="none" stroke={SKD} strokeWidth="0.8" opacity="0.45" strokeDasharray="3,3" />}
      {/* Shoulder blades (back) */}
      {back && <g fill="none" stroke={SKD} strokeWidth="0.9" opacity="0.5">
        <path d="M66,84 C62,94 60,106 62,116 C64,122 68,126 72,124" />
        <path d="M134,84 C138,94 140,106 138,116 C136,122 132,126 128,124" />
      </g>}
      {/* Arms */}
      <path d={lArm} {...attr} />
      <path d={rArm} {...attr} />
      {/* Elbows */}
      <ellipse cx="37" cy="163" rx="9"  ry="7" {...attr} />
      <ellipse cx="163" cy="163" rx="9" ry="7" {...attr} />
      {/* Forearms */}
      <path d={lFore} {...attr} />
      <path d={rFore} {...attr} />
      {/* Wrists */}
      <ellipse cx="35"  cy="216" rx="7" ry="5" {...attr} />
      <ellipse cx="165" cy="216" rx="7" ry="5" {...attr} />
      {/* Hands */}
      <ellipse cx="35"  cy="228" rx="8" ry="12" {...attr} />
      <ellipse cx="165" cy="228" rx="8" ry="12" {...attr} />
      {/* Thighs */}
      <path d={f ? lThighF : lThighM} {...attr} />
      <path d={f ? rThighF : rThighM} {...attr} />
      {/* Knee caps (front) */}
      {!back && <ellipse cx="80"  cy="308" rx="12" ry="9" {...attr} />}
      {!back && <ellipse cx="120" cy="308" rx="12" ry="9" {...attr} />}
      {/* Shins */}
      <path d={lShin} {...attr} />
      <path d={rShin} {...attr} />
      {/* Ankle bumps */}
      <ellipse cx="68"  cy="362" rx="8" ry="6" {...attr} />
      <ellipse cx="132" cy="362" rx="8" ry="6" {...attr} />
      {/* Feet */}
      <path d={lFoot} {...attr} />
      <path d={rFoot} {...attr} />
    </g>
  );
}

/* ── Muscles: front ───────────────────────────────────────── */
function MusclesFront() {
  const a = 0.36;
  const m = (col, extra = 0) => `rgba(${col},${a + extra})`;
  const violet = '114,77,208', blue = '20,130,255', aqua = '2,187,181', mint = '85,215,127', teal = '1,196,162';
  return (
    <g>
      {/* Sternocleidomastoid */}
      <path d="M95,57 C93,61 91,66 90,70 L94,70 C95,65 97,60 100,57 Z" fill={m(violet)} />
      <path d="M105,57 C107,61 109,66 110,70 L106,70 C105,65 103,60 100,57 Z" fill={m(violet)} />
      {/* Trapezius (upper, front visible) */}
      <path d="M90,70 C84,72 74,76 62,84 L58,92 C70,86 84,78 90,74 Z" fill={m(violet, 0.04)} />
      <path d="M110,70 C116,72 126,76 138,84 L142,92 C130,86 116,78 110,74 Z" fill={m(violet, 0.04)} />
      {/* Anterior deltoid */}
      <ellipse cx="52"  cy="90" rx="14" ry="17" fill={m(violet)} />
      <ellipse cx="148" cy="90" rx="14" ry="17" fill={m(violet)} />
      {/* Pectoralis major */}
      <path d="M62,82 C58,90 56,102 58,114 C60,122 66,128 72,128 C78,128 84,124 88,118 L88,86 C80,84 70,82 62,82 Z" fill={m(blue)} />
      <path d="M138,82 C142,90 144,102 142,114 C140,122 134,128 128,128 C122,128 116,124 112,118 L112,86 C120,84 130,82 138,82 Z" fill={m(blue)} />
      {/* Biceps brachii */}
      <path d="M36,106 C32,116 32,130 34,140 C36,148 40,152 44,150 L44,122 C40,116 38,110 36,106 Z" fill={m(aqua, 0.06)} />
      <path d="M164,106 C168,116 168,130 166,140 C164,148 160,152 156,150 L156,122 C160,116 162,110 164,106 Z" fill={m(aqua, 0.06)} />
      {/* Brachialis */}
      <path d="M32,136 C30,144 30,152 34,158 L40,160 C38,154 36,146 36,138 Z" fill={m(aqua)} />
      <path d="M168,136 C170,144 170,152 166,158 L160,160 C162,154 164,146 164,138 Z" fill={m(aqua)} />
      {/* Brachioradialis */}
      <path d="M30,154 C28,164 28,176 30,186 L38,186 C36,176 36,166 36,156 Z" fill={m(teal)} />
      <path d="M170,154 C172,164 172,176 170,186 L162,186 C164,176 164,166 164,156 Z" fill={m(teal)} />
      {/* Rectus abdominis – 3 pairs of segments */}
      {[0,1,2].map(i => <g key={i}>
        <rect x="72" y={130+i*16} width="11" height="13" rx="3" fill={m(teal, 0.06)} />
        <rect x="117" y={130+i*16} width="11" height="13" rx="3" fill={m(teal, 0.06)} />
      </g>)}
      <path d="M100,128 L100,178" fill="none" stroke={`rgba(${teal},0.35)`} strokeWidth="1.5" />
      {/* External oblique */}
      <path d="M56,116 C54,128 56,142 60,154 C62,164 64,174 64,184 L70,186 C70,176 68,166 66,154 C62,142 60,128 60,118 Z" fill={m(teal, -0.06)} />
      <path d="M144,116 C146,128 144,142 140,154 C138,164 136,174 136,184 L130,186 C130,176 132,166 134,154 C138,142 140,128 140,118 Z" fill={m(teal, -0.06)} />
      {/* Hip flexors */}
      <path d="M72,192 C68,202 68,214 70,222 L82,222 C82,214 82,204 78,194 Z" fill={m(mint)} />
      <path d="M128,192 C132,202 132,214 130,222 L118,222 C118,214 118,204 122,194 Z" fill={m(mint)} />
      {/* Rectus femoris */}
      <path d="M76,228 L86,228 L88,282 L74,282 Z" fill={m(mint, 0.06)} />
      <path d="M114,228 L124,228 L126,282 L112,282 Z" fill={m(mint, 0.06)} />
      {/* Vastus lateralis */}
      <path d="M64,234 C60,248 60,262 64,274 C66,282 70,286 74,282 L76,260 C74,250 70,240 68,232 Z" fill={m(mint)} />
      <path d="M136,234 C140,248 140,262 136,274 C134,282 130,286 126,282 L124,260 C126,250 130,240 132,232 Z" fill={m(mint)} />
      {/* Vastus medialis (teardrop) */}
      <path d="M84,264 C82,272 82,282 86,288 C88,292 92,290 94,286 C96,282 94,272 90,266 Z" fill={m(mint, 0.1)} />
      <path d="M116,264 C118,272 118,282 114,288 C112,292 108,290 106,286 C104,282 106,272 110,266 Z" fill={m(mint, 0.1)} />
      {/* Tibialis anterior */}
      <path d="M70,310 C68,322 68,336 70,346 L82,346 L80,322 L74,310 Z" fill={m(blue)} />
      <path d="M130,310 C132,322 132,336 130,346 L118,346 L120,322 L126,310 Z" fill={m(blue)} />
    </g>
  );
}

/* ── Muscles: back ────────────────────────────────────────── */
function MusclesBack() {
  const a = 0.36;
  const m = (col, extra = 0) => `rgba(${col},${a + extra})`;
  const violet = '114,77,208', blue = '20,130,255', aqua = '2,187,181', mint = '85,215,127', teal = '1,196,162';
  return (
    <g>
      {/* Trapezius – kite */}
      <path d="M100,57 C96,63 84,70 70,80 C60,88 56,100 58,112 C60,120 66,124 74,122 C82,120 90,112 96,108 L100,106 L104,108 C110,112 118,120 126,122 C134,124 140,120 142,112 C144,100 140,88 130,80 C116,70 104,63 100,57 Z" fill={m(violet, 0.06)} />
      {/* Infraspinatus / teres */}
      <ellipse cx="74"  cy="110" rx="14" ry="11" fill={m(violet, 0.08)} />
      <ellipse cx="126" cy="110" rx="14" ry="11" fill={m(violet, 0.08)} />
      {/* Posterior deltoid */}
      <ellipse cx="52"  cy="90" rx="14" ry="17" fill={m(violet, 0.05)} />
      <ellipse cx="148" cy="90" rx="14" ry="17" fill={m(violet, 0.05)} />
      {/* Triceps (3 heads) */}
      <path d="M50,88 C44,100 40,114 40,128 C40,140 42,150 44,158 L52,158 C52,150 52,140 52,128 C52,116 54,104 56,94 Z" fill={m(aqua, 0.06)} />
      <path d="M150,88 C156,100 160,114 160,128 C160,140 158,150 156,158 L148,158 C148,150 148,140 148,128 C148,116 146,104 144,94 Z" fill={m(aqua, 0.06)} />
      {/* Latissimus dorsi */}
      <path d="M58,98 C54,112 52,128 54,144 C56,156 60,166 64,174 C66,182 66,190 66,198 L76,200 C76,192 74,182 72,174 C70,166 66,156 64,144 C62,128 62,114 64,102 Z" fill={m(blue)} />
      <path d="M142,98 C146,112 148,128 146,144 C144,156 140,166 136,174 C134,182 134,190 134,198 L124,200 C124,192 126,182 128,174 C130,166 136,156 136,144 C138,128 138,114 136,102 Z" fill={m(blue)} />
      {/* Erector spinae */}
      <rect x="88"  y="100" width="9"  height="88" rx="4" fill={m(teal)} />
      <rect x="103" y="100" width="9"  height="88" rx="4" fill={m(teal)} />
      {/* Rhomboids */}
      <path d="M84,96 C88,100 92,108 92,116 L100,118 L108,116 C108,108 112,100 116,96 C108,94 100,92 84,96 Z" fill={m(violet, -0.04)} />
      {/* Gluteus maximus */}
      <path d="M68,224 C64,234 62,248 66,258 C68,264 74,268 80,266 C88,264 92,258 92,250 L90,230 Z" fill={m(mint, 0.08)} />
      <path d="M132,224 C136,234 138,248 134,258 C132,264 126,268 120,266 C112,264 108,258 108,250 L110,230 Z" fill={m(mint, 0.08)} />
      {/* Biceps femoris (outer hamstring) */}
      <path d="M64,260 C62,272 62,284 66,294 C68,300 72,302 74,298 L74,276 C70,268 66,262 64,260 Z" fill={m(mint)} />
      <path d="M136,260 C138,272 138,284 134,294 C132,300 128,302 126,298 L126,276 C130,268 134,262 136,260 Z" fill={m(mint)} />
      {/* Semitendinosus */}
      <path d="M82,258 C80,270 80,284 84,294 C86,300 90,302 92,296 L92,272 C88,264 84,260 82,258 Z" fill={m(mint, -0.04)} />
      <path d="M118,258 C120,270 120,284 116,294 C114,300 110,302 108,296 L108,272 C112,264 116,260 118,258 Z" fill={m(mint, -0.04)} />
      {/* Gastrocnemius (diamond calf) */}
      <path d="M68,308 C66,320 66,332 70,340 L78,340 C78,332 78,320 76,310 Z" fill={m(aqua, 0.06)} />
      <path d="M92,308 C94,320 92,332 88,340 L80,340 C80,332 80,320 82,310 Z" fill={m(aqua, 0.06)} />
      <path d="M108,308 C106,320 108,332 112,340 L120,340 C120,332 120,320 118,310 Z" fill={m(aqua, 0.06)} />
      <path d="M132,308 C134,320 134,332 130,340 L122,340 C122,332 122,320 124,310 Z" fill={m(aqua, 0.06)} />
      {/* Soleus */}
      <path d="M68,340 L92,340 L92,360 L68,360 Z" fill={m(aqua, -0.08)} />
      <path d="M108,340 L132,340 L132,360 L108,360 Z" fill={m(aqua, -0.08)} />
    </g>
  );
}

/* ── Organs: front ────────────────────────────────────────── */
function OrgansFront({ gender }) {
  const f = gender === 'female';
  return (
    <g opacity="0.92">
      {/* Brain */}
      <ellipse cx="100" cy="26" rx="16" ry="15" fill="#FFD0C8" stroke="#E89888" strokeWidth="0.9" />
      <path d="M88,22 C84,22 82,26 84,30 C86,34 92,36 100,36 C108,36 114,34 116,30 C118,26 116,22 112,22" fill="none" stroke="#E89888" strokeWidth="0.7" />
      {/* Trachea */}
      <rect x="97" y="58" width="6" height="20" rx="3" fill="#D0ECF8" stroke="#90C0E0" strokeWidth="0.7" />
      {/* Left lung */}
      <path d="M58,82 C54,90 52,102 52,116 C52,130 54,142 58,150 C60,156 64,160 68,158 C70,158 72,156 74,154 L74,88 C70,84 64,80 58,82 Z" fill="#A8CCEE" stroke="#7098CC" strokeWidth="0.9" />
      <path d="M65,90 C63,102 63,118 66,130" fill="none" stroke="#7098CC" strokeWidth="0.6" opacity="0.6" />
      {/* Right lung */}
      <path d="M142,82 C146,90 148,102 148,116 C148,130 146,142 142,150 C140,156 136,160 132,158 C130,158 128,156 126,154 L126,88 C130,84 136,80 142,82 Z" fill="#A8CCEE" stroke="#7098CC" strokeWidth="0.9" />
      <path d="M135,90 C137,102 137,118 134,130" fill="none" stroke="#7098CC" strokeWidth="0.6" opacity="0.6" />
      {/* Heart */}
      <path d="M84,94 C80,92 76,94 76,100 C76,106 80,112 88,118 C92,122 96,124 100,128 L102,126 C104,122 108,118 112,112 C118,106 122,100 120,94 C116,90 112,92 108,96 C106,98 104,102 100,106 L96,100 C92,96 88,94 84,94 Z" fill="#E84848" stroke="#C02020" strokeWidth="0.9" />
      {/* Liver */}
      <path d="M76,134 C70,136 64,140 62,148 C60,154 62,162 68,166 C72,170 80,172 88,170 C96,168 102,164 104,158 C106,152 104,144 100,140 C96,136 88,132 76,134 Z" fill="#B85830" stroke="#904020" strokeWidth="0.8" />
      <path d="M78,138 C74,144 74,152 78,156" fill="none" stroke="#904020" strokeWidth="0.6" opacity="0.5" />
      {/* Gallbladder */}
      <ellipse cx="70" cy="170" rx="6" ry="8" fill="#82AA36" stroke="#5C8020" strokeWidth="0.7" />
      {/* Stomach */}
      <path d="M88,130 C84,134 82,142 84,150 C86,158 92,164 98,164 C104,164 110,160 112,154 C114,148 112,140 108,134 C104,128 96,126 88,130 Z" fill="#EEC858" stroke="#C0A038" strokeWidth="0.8" />
      {/* Spleen */}
      <ellipse cx="54" cy="150" rx="10" ry="14" fill="#9858A8" stroke="#763896" strokeWidth="0.8" />
      {/* Pancreas */}
      <path d="M66,164 C72,162 82,162 92,164 C98,166 106,166 112,164 L110,170 C104,172 96,172 90,170 C80,168 70,168 64,170 Z" fill="#E8A858" stroke="#C08038" strokeWidth="0.7" />
      {/* Kidneys (shown faint – posterior) */}
      <ellipse cx="62" cy="152" rx="8"  ry="12" fill="#C06840" stroke="#904828" strokeWidth="0.7" opacity="0.38" />
      <ellipse cx="138" cy="152" rx="8" ry="12" fill="#C06840" stroke="#904828" strokeWidth="0.7" opacity="0.38" />
      {/* Small intestine – coiled */}
      <g fill="#EAC898" stroke="#C0A068" strokeWidth="0.8">
        <path d="M72,174 C68,178 68,186 74,190 C78,192 84,190 86,186 L86,178 C82,174 76,172 72,174 Z" />
        <path d="M86,172 C90,170 96,172 100,176 C102,182 100,188 96,190 L88,190 C86,186 86,180 86,172 Z" />
        <path d="M76,190 C72,194 72,202 78,206 C82,208 88,206 90,202 L90,196 C86,192 80,190 76,190 Z" />
        <path d="M90,188 C94,186 100,186 104,190 C106,196 104,202 100,204 L92,204 C90,200 88,194 90,188 Z" />
        <path d="M76,206 C72,210 74,218 80,220 C84,220 88,218 88,214 L88,208 Z" />
        <path d="M90,204 C94,202 100,204 102,210 C102,216 98,220 90,220 L82,218 Z" />
      </g>
      {/* Large intestine frame */}
      <g fill="none" stroke="#C08060" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
        <path d="M126,220 C128,210 128,196 124,180 C120,166 114,158 108,156" />
        <path d="M108,156 C102,152 94,150 84,150 C76,150 68,152 62,158" />
        <path d="M62,158 C58,164 56,178 58,192 C60,206 64,214 66,220" />
        <path d="M66,220 C72,224 82,224 92,220 C100,218 108,222 114,224 C118,224 122,222 124,220" />
      </g>
      {/* Bladder */}
      <path d="M90,212 C88,216 88,222 92,226 C96,230 104,230 108,226 C112,222 112,216 110,212 C108,208 104,206 100,206 C96,206 92,208 90,212 Z" fill="#CCEA88" stroke="#8CB050" strokeWidth="0.8" />
      {/* Uterus + ovaries (female) */}
      {f && <g>
        <path d="M92,198 C88,200 86,204 86,208 C86,214 90,218 94,220 C98,222 102,222 106,220 C110,218 114,214 114,208 C114,204 112,200 108,198 C104,196 100,194 100,194 C100,194 96,196 92,198 Z" fill="#F0A0C4" stroke="#C07898" strokeWidth="0.8" />
        <ellipse cx="80"  cy="200" rx="7" ry="6" fill="#F0B0CC" stroke="#C07898" strokeWidth="0.7" />
        <ellipse cx="120" cy="200" rx="7" ry="6" fill="#F0B0CC" stroke="#C07898" strokeWidth="0.7" />
      </g>}
    </g>
  );
}

/* ── Hotspot layer ─────────────────────────────────────────── */
function HotspotLayer({ hotspots, selected, onToggle, accent }) {
  const sel = selected instanceof Set ? selected : new Set();
  return (
    <g>
      {hotspots.map(h => {
        const active = sel.has(h.id);
        return (
          <g key={h.id} onClick={() => onToggle && onToggle(h.id)} style={{ cursor: 'pointer' }}>
            <circle cx={h.cx} cy={h.cy} r="14" fill="transparent" />
            {active && <circle cx={h.cx} cy={h.cy} r="13" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.32" />}
            <circle cx={h.cx} cy={h.cy} r={active ? 8.5 : 6.5}
              fill={active ? accent : 'rgba(255,255,255,0.88)'}
              stroke={active ? 'none' : '#9A9990'} strokeWidth="1.5"
              style={{ transition: 'r 0.12s, fill 0.12s' }}
            />
          </g>
        );
      })}
    </g>
  );
}

/* ── Legend chips ──────────────────────────────────────────── */
const MUSCLE_LEGEND = [
  { c: 'rgba(114,77,208,0.7)',  en: 'Shoulder',    ar: 'كتف'   },
  { c: 'rgba(20,130,255,0.7)',  en: 'Chest/Back',  ar: 'صدر/ظهر'},
  { c: 'rgba(2,187,181,0.7)',   en: 'Arms',        ar: 'ذراع'  },
  { c: 'rgba(1,196,162,0.7)',   en: 'Core',        ar: 'جذع'   },
  { c: 'rgba(85,215,127,0.7)',  en: 'Legs',        ar: 'ساق'   },
];
const ORGAN_LEGEND = [
  { c: '#E84848', en: 'Heart',      ar: 'قلب'  },
  { c: '#A8CCEE', en: 'Lungs',      ar: 'رئة'  },
  { c: '#B85830', en: 'Liver',      ar: 'كبد'  },
  { c: '#EEC858', en: 'Stomach',    ar: 'معدة' },
  { c: '#EAC898', en: 'Intestines', ar: 'أمعاء'},
  { c: '#C06840', en: 'Kidneys',    ar: 'كلى'  },
];

/* ── Main BodyMap component ────────────────────────────────── */
function BodyMap({ selected, onToggle, color, initialGender, showControls = true }) {
  const { lang } = useApp();
  const [view,   setView]   = useState('front');
  const [layer,  setLayer]  = useState('surface');
  const gender  = (initialGender === 'male' || initialGender === 'female') ? initialGender : 'female';
  const accent  = color || 'var(--app-accent)';
  const sel     = selected instanceof Set ? selected : new Set();
  const hotspots = view === 'front' ? HP_FRONT : HP_BACK;
  const activeLabels = hotspots.filter(h => sel.has(h.id)).map(h => h.label[lang]);
  const allLabels    = HP_ALL.filter(h => sel.has(h.id)).map(h => h.label[lang]);

  const btnStyle = (on) => ({
    height: 34, padding: '0 13px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
    border: `1.5px solid ${on ? accent : 'var(--balsm-border)'}`,
    background: on ? 'var(--app-accent-50)' : '#fff',
    color: on ? accent : 'var(--fg2)',
    fontFamily: lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-body)',
    fontSize: 'var(--pt-xs)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {showControls && (<>
        {/* Row 1: Front/Back */}
        <div style={{ display: 'flex', gap: 5 }}>
          {[['front', lang === 'ar' ? 'أمامي' : 'Front'], ['back', lang === 'ar' ? 'خلفي' : 'Back']].map(([id, lbl]) => (
            <button key={id} style={btnStyle(view === id)}
              onClick={() => { setView(id); if (id === 'back' && layer === 'organs') setLayer('surface'); }}>
              {lbl}
            </button>
          ))}
        </div>
        {/* Row 2: Layer chips */}
        <div style={{ display: 'flex', gap: 5 }}>
          {Object.entries(LAYER_CFG).map(([id, cfg]) => {
            const disabled = id === 'organs' && view === 'back';
            return (
              <button key={id} disabled={disabled} style={{ ...btnStyle(layer === id && !disabled), opacity: disabled ? 0.4 : 1, cursor: disabled ? 'default' : 'pointer' }}
                onClick={() => !disabled && setLayer(id)}>
                <Icon name={cfg.icon} size={12} />{cfg.label[lang]}
              </button>
            );
          })}
        </div>
      </>)}

      {/* Location label */}
      <div style={{ fontSize: 'var(--pt-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: sel.size > 0 ? 'var(--fg2)' : 'var(--fg4)', minHeight: 16, textAlign: 'center', lineHeight: 1.4 }}>
        {sel.size === 0
          ? (lang === 'ar' ? 'انقر لتحديد الموقع' : 'Tap to mark location')
          : (allLabels.join(' · '))}
      </div>

      {/* SVG figure */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg viewBox="0 0 200 384" width="100%" height="auto" style={{ display: 'block', maxHeight: 360, maxWidth: 190 }} aria-label="Anatomy diagram">
          <HeadSVG back={view === 'back'} />
          <BodySVG gender={gender} back={view === 'back'} />
          {layer === 'muscles' && (view === 'back' ? <MusclesBack /> : <MusclesFront />)}
          {layer === 'organs' && view === 'front' && <OrgansFront gender={gender} />}
          <HotspotLayer hotspots={hotspots} selected={sel} onToggle={onToggle} accent={accent} />
        </svg>
      </div>

      {/* Legend */}
      {layer !== 'surface' && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(layer === 'muscles' ? MUSCLE_LEGEND : ORGAN_LEGEND).map(item => (
            <span key={item.en} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', color: 'var(--fg3)', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: item.c, flexShrink: 0, display: 'inline-block' }} />
              {item[lang] || item.en}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { BodyMap, HP_FRONT, HP_BACK, HP_ALL, HOTSPOTS, LAYER_CFG });
