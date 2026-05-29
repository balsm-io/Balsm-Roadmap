/* inventory.jsx — Inventory view: stat cards + medications table */

const INVENTORY = [
  { name: 'Paracetamol 500 mg', meta: 'Pain relief · Tablet · 20 ct',  sku: 'BLM-PAR-500', stock: 142, expiry: '11/2027', tone: 'success', label: 'In stock' },
  { name: 'Amoxicillin 250 mg', meta: 'Antibiotic · Capsule',          sku: 'BLM-AMX-250', stock: 12,  expiry: '08/2026', tone: 'warn',    label: 'Low — reorder' },
  { name: 'Tramadol 100 mg',    meta: 'Schedule II · Tablet',          sku: 'BLM-TRM-100', stock: 38,  expiry: '03/2027', tone: 'controlled', label: 'Controlled' },
  { name: 'Insulin Glargine',   meta: 'Diabetes · Vial · Cold chain',  sku: 'BLM-INS-GLG', stock: 0,   expiry: '06/2026', tone: 'danger',  label: 'Out of stock' },
  { name: 'Ibuprofen 400 mg',   meta: 'Pain relief · Tablet · 30 ct',  sku: 'BLM-IBU-400', stock: 88,  expiry: '02/2028', tone: 'success', label: 'In stock' },
  { name: 'Omeprazole 20 mg',   meta: 'GI · Capsule · 28 ct',          sku: 'BLM-OMP-20',  stock: 23,  expiry: '07/2026', tone: 'expiring', label: 'Expires in 60 d' },
  { name: 'Vitamin D₃ 1000 IU', meta: 'Supplement · Capsule',          sku: 'BLM-VTD-1K',  stock: 64,  expiry: '01/2028', tone: 'success', label: 'In stock' },
  { name: 'Salbutamol Inhaler', meta: 'Respiratory · 200 dose',        sku: 'BLM-SLB-INH', stock: 41,  expiry: '12/2027', tone: 'success', label: 'In stock' },
  { name: 'Diazepam 5 mg',      meta: 'Schedule IV · Tablet',          sku: 'BLM-DZP-5',   stock: 22,  expiry: '04/2027', tone: 'controlled', label: 'Controlled' },
];

function Stat({ lab, val, delta, deltaTone = 'pos', accent = 'aqua' }) {
  const accentColor = ({
    aqua: 'var(--petal-aqua)',
    emerald: 'var(--petal-emerald)',
    blue: 'var(--petal-blue)',
    mint: 'var(--petal-mint)',
    violet: 'var(--petal-violet)',
    sun: 'var(--balsm-warning)',
    danger: 'var(--balsm-danger)',
  })[accent];
  return (
    <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: accentColor }} />
      <div style={{ flex: 1 }}>
        <div className="lab">{lab}</div>
        <div className="val">{val}</div>
        {delta && <div className={`delta ${deltaTone}`}>{delta}</div>}
      </div>
    </div>
  );
}

function InventoryTable({ rows, dir }) {
  return (
    <div className="data-card">
      <div className="data-card-head">
        <h3>{dir==='rtl' ? 'كل الأدوية' : 'All medications'}</h3>
        <div className="filters">
          <span className="chip-filter active">{dir==='rtl' ? 'الكل' : 'All'}</span>
          <span className="chip-filter">{dir==='rtl' ? 'منخفض' : 'Low stock'}</span>
          <span className="chip-filter">{dir==='rtl' ? 'منتهي قريباً' : 'Expiring'}</span>
          <span className="chip-filter">{dir==='rtl' ? 'مراقب' : 'Controlled'}</span>
        </div>
      </div>
      <table className="balsm">
        <thead>
          <tr>
            <th>{dir==='rtl' ? 'الدواء' : 'Medication'}</th>
            <th>{dir==='rtl' ? 'الكود' : 'SKU'}</th>
            <th>{dir==='rtl' ? 'المخزون' : 'Stock'}</th>
            <th>{dir==='rtl' ? 'الصلاحية' : 'Expiry'}</th>
            <th>{dir==='rtl' ? 'الحالة' : 'Status'}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>
                <div className="name">{r.name}</div>
                <div className="meta">{r.meta}</div>
              </td>
              <td className="mono">{r.sku}</td>
              <td className="num">{r.stock}</td>
              <td className="mono">{r.expiry}</td>
              <td><Pill tone={r.tone} icon={r.tone==='controlled'?'shield-alert':null} dot={r.tone!=='controlled'}>{r.label}</Pill></td>
              <td>
                <span className="row-actions">
                  <Icon name="pencil" size={16} />
                  <Icon name="more-horizontal" size={16} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InventoryView({ dir }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{dir==='rtl' ? 'المخزون' : 'Inventory'}</h1>
          <div className="sub">{dir==='rtl' ? '٩ أدوية · ٣ منخفضة · ١ منتهية الصلاحية قريباً' : '9 medications · 3 low · 1 expiring soon'}</div>
        </div>
        <div className="actions">
          <Btn variant="secondary" icon="upload">{dir==='rtl' ? 'استيراد' : 'Import'}</Btn>
          <Btn variant="secondary" icon="package-plus">{dir==='rtl' ? 'إدخال شراء' : 'Receive purchase'}</Btn>
          <Btn variant="primary" icon="plus">{dir==='rtl' ? 'دواء جديد' : 'New medication'}</Btn>
        </div>
      </div>

      <div className="stat-row">
        <Stat lab={dir==='rtl' ? 'إجمالي وحدات المخزون' : 'Stock units on hand'} val="2,418" delta={dir==='rtl' ? '+124 هذا الأسبوع' : '+124 this week'} accent="aqua" />
        <Stat lab={dir==='rtl' ? 'منخفض المخزون' : 'Low stock items'} val="3" delta={dir==='rtl' ? 'يحتاج إعادة طلب' : 'Reorder needed'} deltaTone="neg" accent="sun" />
        <Stat lab={dir==='rtl' ? 'مواد خاضعة للرقابة' : 'Controlled substances'} val="2" delta={dir==='rtl' ? 'سجل المخدرات محدث' : 'Narcotics register up to date'} accent="violet" />
        <Stat lab={dir==='rtl' ? 'منتهية قريباً (٩٠ يوم)' : 'Expiring (90 d)'} val="1" delta={dir==='rtl' ? 'Omeprazole · 07/2026' : 'Omeprazole · 07/2026'} deltaTone="neg" accent="danger" />
      </div>

      <InventoryTable rows={INVENTORY} dir={dir} />
    </div>
  );
}

Object.assign(window, { Stat, InventoryTable, InventoryView });
