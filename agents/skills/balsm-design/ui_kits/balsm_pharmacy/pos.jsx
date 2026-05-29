/* pos.jsx — Pharmacy POS view: product grid + basket + checkout */

const PRODUCTS = [
  { id: 'p1', name: 'Paracetamol 500 mg',  form: 'Pain · Tablet · 20 ct',   price: 18.50,  stock: 142, sku: 'BLM-PAR-500' },
  { id: 'p2', name: 'Amoxicillin 250 mg',  form: 'Antibiotic · Capsule',    price: 42.00,  stock: 12,  sku: 'BLM-AMX-250', flag: 'low' },
  { id: 'p3', name: 'Ibuprofen 400 mg',    form: 'Pain · Tablet · 30 ct',   price: 24.75,  stock: 88,  sku: 'BLM-IBU-400' },
  { id: 'p4', name: 'Vitamin D₃ 1000 IU',  form: 'Supplement · Capsule',    price: 95.00,  stock: 64,  sku: 'BLM-VTD-1K' },
  { id: 'p5', name: 'Tramadol 100 mg',     form: 'Schedule II · Tablet',    price: 68.00,  stock: 38,  sku: 'BLM-TRM-100', flag: 'controlled' },
  { id: 'p6', name: 'Loratadine 10 mg',    form: 'Antihistamine · Tablet',  price: 32.00,  stock: 56,  sku: 'BLM-LOR-10' },
  { id: 'p7', name: 'Insulin Glargine',    form: 'Diabetes · Vial · Cold',  price: 320.00, stock: 0,   sku: 'BLM-INS-GLG', flag: 'out' },
  { id: 'p8', name: 'Omeprazole 20 mg',    form: 'GI · Capsule · 28 ct',    price: 56.00,  stock: 23,  sku: 'BLM-OMP-20' },
  { id: 'p9', name: 'Salbutamol Inhaler',  form: 'Respiratory · 200 dose',  price: 78.00,  stock: 41,  sku: 'BLM-SLB-INH' },
  { id: 'p10',name: 'Diazepam 5 mg',       form: 'Schedule IV · Tablet',    price: 54.00,  stock: 22,  sku: 'BLM-DZP-5',   flag: 'controlled' },
  { id: 'p11',name: 'ORS Sachet',          form: 'Rehydration · Sachet',    price: 6.50,   stock: 280, sku: 'BLM-ORS-1' },
  { id: 'p12',name: 'Cetirizine 10 mg',    form: 'Antihistamine · Tablet',  price: 28.00,  stock: 78,  sku: 'BLM-CET-10' },
];

const CATEGORIES_EN = ['All', 'Pain relief', 'Antibiotics', 'Cardio', 'Diabetes', 'Respiratory', 'GI', 'Vitamins'];
const CATEGORIES_AR = ['الكل', 'مسكنات', 'مضاد حيوي', 'قلب', 'سكر', 'تنفسي', 'هضمي', 'فيتامينات'];

function ProductCard({ p, onAdd, dir }) {
  const stockTone = p.flag === 'out' ? 'out' : p.flag === 'low' ? 'low' : '';
  const stockLabel = p.flag === 'out' ? (dir==='rtl'?'نفد':'Out of stock')
                   : p.flag === 'low' ? `${p.stock} ${dir==='rtl'?'·منخفض':'· low'}`
                   : `${p.stock} ${dir==='rtl'?'متاح':'in stock'}`;
  return (
    <div className="product" onClick={() => p.flag !== 'out' && onAdd(p)}>
      {p.flag === 'controlled' && <span className="badge"><Pill tone="controlled" dot={false} icon="shield-alert">{dir==='rtl'?'مراقب':'Controlled'}</Pill></span>}
      {p.flag === 'low' && <span className="badge"><Pill tone="warn">{dir==='rtl'?'منخفض':'Low'}</Pill></span>}
      {p.flag === 'out' && <span className="badge"><Pill tone="danger">{dir==='rtl'?'نفد':'Out'}</Pill></span>}
      <div className="name">{p.name}</div>
      <div className="form">{p.form}</div>
      <div className="row">
        <span className="price">LE {p.price.toFixed(2)}</span>
        <span className={`stock ${stockTone}`}>{stockLabel}</span>
      </div>
    </div>
  );
}

function ProductGrid({ products, onAdd, dir }) {
  return <div className="product-grid">{products.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} dir={dir} />)}</div>;
}

function BasketRow({ row, onQty, onRemove }) {
  return (
    <div className="basket-row">
      <div>
        <div className="name">{row.name}</div>
        <div className="meta">LE {row.price.toFixed(2)} · {row.sku}</div>
      </div>
      <div className="qty">
        <button onClick={() => onQty(row.id, Math.max(1, row.qty - 1))}>−</button>
        <span className="n">{row.qty}</span>
        <button onClick={() => onQty(row.id, row.qty + 1)}>+</button>
      </div>
      <div className="line">LE {(row.qty * row.price).toFixed(2)}</div>
    </div>
  );
}

function BasketPanel({ basket, customer, onQty, onRemove, onCheckout, onPickCustomer, dir }) {
  const subtotal = basket.reduce((s, r) => s + r.qty * r.price, 0);
  const vat = subtotal * 0.14;
  const total = subtotal + vat;
  const hasControlled = basket.some(r => r.flag === 'controlled');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="basket-head">
        <h2>{dir === 'rtl' ? 'سلة البيع' : 'Current sale'}</h2>
        <span className="count">{basket.length} {dir === 'rtl' ? 'بنود' : 'items'}</span>
      </div>
      <div className="basket-customer">
        {customer ? (
          <>
            <Avatar initials={customer.initials} tone={customer.tone} />
            <div className="who">
              <div className="name">{customer.name}</div>
              <div className="phone">{customer.phone}</div>
            </div>
            <IconBtn icon="x" onClick={() => onPickCustomer(null)} />
          </>
        ) : (
          <>
            <Avatar initials="?" tone="b3" />
            <div className="empty">{dir === 'rtl' ? 'بدون عميل (بيع مباشر)' : 'No customer (walk-in)'}</div>
            <Btn variant="ghost" size="sm" icon="user-plus" onClick={() => onPickCustomer({ name: 'Mona Hassan', phone: '+20 10 1234 5678', initials: 'MH', tone: 'b1' })}>{dir==='rtl'?'إضافة':'Link'}</Btn>
          </>
        )}
      </div>
      {basket.length === 0 ? (
        <div className="basket-empty" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="ico"><Icon name="shopping-basket" size={56} stroke={1.2} /></div>
          {dir === 'rtl' ? 'ابدأ بمسح أو اختيار دواء' : 'Scan or tap a medication to start'}
        </div>
      ) : (
        <>
          {hasControlled && (
            <div className="basket-controlled-banner" style={{ marginTop: 12 }}>
              <Icon name="shield-alert" size={18} />
              <div>
                <b>{dir==='rtl'?'مادة خاضعة للرقابة':'Controlled substance'}</b>
                {dir==='rtl'?'يلزم توقيع الصيدلي وتسجيلها في سجل المخدرات.':'Pharmacist sign-off and narcotics-register entry required.'}
              </div>
            </div>
          )}
          <div className="basket-list">
            {basket.map(r => <BasketRow key={r.id} row={r} onQty={onQty} onRemove={onRemove} />)}
          </div>
        </>
      )}
      <div className="basket-totals">
        <div className="row"><span>{dir==='rtl'?'المجموع الفرعي':'Subtotal'}</span><span className="num">LE {subtotal.toFixed(2)}</span></div>
        <div className="row"><span>{dir==='rtl'?'ض. القيمة المضافة (14٪)':'VAT (14%)'}</span><span className="num">LE {vat.toFixed(2)}</span></div>
        <div className="row total"><span>{dir==='rtl'?'الإجمالي':'Total'}</span><span className="num">LE {total.toFixed(2)}</span></div>
      </div>
      <div className="basket-actions">
        <Btn variant="primary" size="lg" block icon="check-circle-2" disabled={!basket.length} onClick={onCheckout}>
          {dir==='rtl'?'إتمام البيع':'Complete sale'} · LE {total.toFixed(2)}
        </Btn>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" block icon="pause">{dir==='rtl'?'تأجيل':'Hold'}</Btn>
          <Btn variant="ghost" block icon="x">{dir==='rtl'?'إلغاء':'Cancel'}</Btn>
        </div>
      </div>
    </div>
  );
}

function CompleteSaleDialog({ basket, total, onClose, dir }) {
  const [step, setStep] = useState('pay'); // pay → done
  const [method, setMethod] = useState('cash');
  return (
    <div className="scrim" onClick={onClose}>
      <div className={`modal ${step === 'done' ? 'confirm' : ''}`} onClick={e => e.stopPropagation()}>
        {step === 'pay' ? (
          <>
            <div className="modal-head">
              <h2>{dir==='rtl'?'إتمام البيع':'Complete sale'}</h2>
              <p>{dir==='rtl'?'اختر طريقة الدفع':'Choose a payment method'}</p>
            </div>
            <div className="modal-body">
              <div className="pay-grid">
                {[
                  { v: 'cash', label: dir==='rtl'?'نقدي':'Cash', icon: 'banknote' },
                  { v: 'card', label: dir==='rtl'?'بطاقة':'Card', icon: 'credit-card' },
                  { v: 'credit', label: dir==='rtl'?'آجل':'On account', icon: 'wallet' },
                ].map(opt => (
                  <label key={opt.v} className={method===opt.v?'checked':''}>
                    <input type="radio" name="pm" checked={method===opt.v} onChange={() => setMethod(opt.v)} />
                    <Icon name={opt.icon} size={22} />{opt.label}
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 18, padding: '12px 14px', background: 'var(--balsm-cream-100)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: 'var(--fg3)', fontSize: 13 }}>{dir==='rtl'?'الإجمالي':'Total due'}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--balsm-ink-900)' }}>LE {total.toFixed(2)}</span>
              </div>
            </div>
            <div className="modal-foot">
              <Btn variant="ghost" onClick={onClose}>{dir==='rtl'?'إلغاء':'Cancel'}</Btn>
              <Btn variant="primary" icon="check-circle-2" onClick={() => setStep('done')}>{dir==='rtl'?'تأكيد الدفع':'Confirm payment'}</Btn>
            </div>
          </>
        ) : (
          <>
            <div className="modal-body" style={{ paddingTop: 28 }}>
              <div className="success-icon"><Icon name="check" size={28} stroke={2.4} /></div>
              <h2 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--balsm-ink-900)' }}>{dir==='rtl'?'تم البيع':'Sale completed'}</h2>
              <p style={{ margin: 0, color: 'var(--fg3)', fontSize: 13 }}>{dir==='rtl'?'حُفظ محلياً. سيتم المزامنة عند الاتصال.':'Saved locally. Will sync when you reconnect.'}</p>
              <div className="receipt">
                <div className="row"><span>{dir==='rtl'?'الفاتورة':'Invoice'}</span><span>#0247-A</span></div>
                <div className="row"><span>{dir==='rtl'?'الطريقة':'Method'}</span><span>{method.toUpperCase()}</span></div>
                <div className="row"><span>{dir==='rtl'?'البنود':'Items'}</span><span>{basket.length}</span></div>
                <hr/>
                <div className="row total"><span>{dir==='rtl'?'الإجمالي':'Total'}</span><span>LE {total.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="modal-foot" style={{ justifyContent: 'center' }}>
              <Btn variant="secondary" icon="printer">{dir==='rtl'?'طباعة':'Print'}</Btn>
              <Btn variant="primary" icon="plus" onClick={onClose}>{dir==='rtl'?'بيع جديد':'New sale'}</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function POSView({ dir }) {
  const [basket, setBasket] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [cat, setCat] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  function add(p) {
    setBasket(prev => {
      const ex = prev.find(r => r.id === p.id);
      if (ex) return prev.map(r => r.id === p.id ? { ...r, qty: r.qty + 1 } : r);
      return [...prev, { ...p, qty: 1 }];
    });
  }
  function setQty(id, qty) { setBasket(prev => prev.map(r => r.id === id ? { ...r, qty } : r)); }
  function remove(id)      { setBasket(prev => prev.filter(r => r.id !== id)); }

  const subtotal = basket.reduce((s, r) => s + r.qty * r.price, 0);
  const total = subtotal * 1.14;
  const categories = dir === 'rtl' ? CATEGORIES_AR : CATEGORIES_EN;

  return (
    <div className="pos">
      <div className="pos-left">
        <div className="pos-search">
          <div className="field">
            <Icon name="search" size={18} />
            <input placeholder={dir==='rtl' ? 'مسح أو ابحث بالاسم…' : 'Scan barcode or search by name…'} autoFocus />
          </div>
          <Btn variant="secondary" icon="scan-barcode">{dir==='rtl'?'مسح':'Scan'}</Btn>
          <Btn variant="secondary" icon="file-text">{dir==='rtl'?'وصفة ورقية':'Rx photo'}</Btn>
        </div>

        <div className="section-head">
          <h2>{dir==='rtl'?'الفئات':'Categories'}</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {categories.map((c, i) => (
            <span key={i} className={`chip-filter ${i === cat ? 'active' : ''}`} onClick={() => setCat(i)}>{c}</span>
          ))}
        </div>

        <div className="section-head">
          <h2>{dir==='rtl'?'الأكثر مبيعاً':'Most-sold'}</h2>
          <span className="meta">{PRODUCTS.length} {dir==='rtl'?'منتج':'medications'}</span>
        </div>
        <ProductGrid products={PRODUCTS} onAdd={add} dir={dir} />
      </div>

      <div className="pos-right">
        <BasketPanel
          basket={basket}
          customer={customer}
          onQty={setQty}
          onRemove={remove}
          onCheckout={() => setShowCheckout(true)}
          onPickCustomer={setCustomer}
          dir={dir}
        />
      </div>

      {showCheckout && (
        <CompleteSaleDialog
          basket={basket}
          total={total}
          dir={dir}
          onClose={() => { setShowCheckout(false); setBasket([]); setCustomer(null); }}
        />
      )}
    </div>
  );
}

Object.assign(window, { POSView, ProductCard, ProductGrid, BasketPanel, BasketRow, CompleteSaleDialog });
