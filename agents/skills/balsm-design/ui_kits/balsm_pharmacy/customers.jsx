/* customers.jsx — Customers view: search + grid of customer cards */

const CUSTOMERS = [
  { name: 'Mona Hassan',      phone: '+20 10 1234 5678', initials: 'MH', tone: 'b1', visits: 6, last: '12/05', spend: 'LE 1,240', tags: [{tone:'danger', label:'Penicillin allergy'},{tone:'info', label:'Hypertension'}] },
  { name: 'Ahmed Ibrahim',    phone: '+20 11 9988 7766', initials: 'AI', tone: 'b2', visits: 2, last: '07/05', spend: 'LE 320',   tags: [{tone:'controlled', label:'Schedule II on file'}] },
  { name: 'Salma Mostafa',    phone: '+20 12 4455 6677', initials: 'SM', tone: 'b3', visits: 14, last: '21/05', spend: 'LE 3,890', tags: [{tone:'info', label:'Diabetes type 2'},{tone:'expiring', label:'Rx renewal due'}] },
  { name: 'Youssef Khaled',   phone: '+20 10 2233 4455', initials: 'YK', tone: 'b4', visits: 1, last: '20/05', spend: 'LE 95',    tags: [{tone:'neutral', label:'Walk-in · first visit'}] },
  { name: 'Layla AbdelRahman', phone: '+20 11 1234 9876', initials: 'LA', tone: 'b1', visits: 8, last: '18/05', spend: 'LE 2,140', tags: [{tone:'danger', label:'Sulfa allergy'}] },
  { name: 'Omar Saleh',       phone: '+20 12 6677 8899', initials: 'OS', tone: 'b2', visits: 3, last: '15/05', spend: 'LE 470',   tags: [{tone:'info', label:'Asthma'}] },
];

function CustomerCard({ c, dir }) {
  return (
    <div className="customer-card">
      <div className="head">
        <Avatar initials={c.initials} tone={c.tone} />
        <div className="who">
          <div className="name">{c.name}</div>
          <div className="phone">{c.phone}</div>
        </div>
        <IconBtn icon="more-horizontal" />
      </div>
      <div className="row">
        {c.tags.map((t, i) => <Pill key={i} tone={t.tone}>{t.label}</Pill>)}
      </div>
      <div className="stats">
        <span>{dir==='rtl' ? 'الزيارات' : 'Visits'} <span className="num">{c.visits}</span></span>
        <span>{dir==='rtl' ? 'آخر زيارة' : 'Last'} <span className="num">{c.last}</span></span>
        <span>{dir==='rtl' ? 'الإجمالي' : 'Spend'} <span className="num">{c.spend}</span></span>
      </div>
    </div>
  );
}

function CustomersView({ dir }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{dir==='rtl' ? 'العملاء' : 'Customers'}</h1>
          <div className="sub">{dir==='rtl' ? '٦ عملاء · ربط بحساب بلسم متاح في الشريحة ٣' : '6 customers · link to Balsm patient account available in Slice 3'}</div>
        </div>
        <div className="actions">
          <Btn variant="secondary" icon="search">{dir==='rtl' ? 'بحث متقدم' : 'Advanced search'}</Btn>
          <Btn variant="primary" icon="user-plus">{dir==='rtl' ? 'عميل جديد' : 'New customer'}</Btn>
        </div>
      </div>

      <div className="customers-grid">
        {CUSTOMERS.map((c, i) => <CustomerCard key={i} c={c} dir={dir} />)}
      </div>
    </div>
  );
}

Object.assign(window, { CustomerCard, CustomersView });
