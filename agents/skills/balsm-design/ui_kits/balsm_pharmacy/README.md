# Balsm Pharmacy — UI Kit (Slice 1)

Pharmacy-first POS + inventory + admin recreation. This is the **walking-skeleton** product Balsm ships first — local server, offline-first, designed for Egyptian pharmacies. See `../../README.md` for context.

## What's here

- `index.html` — interactive shell. Loads colors_and_type.css from the root design system, the official logo, and the JSX components below. Click through: POS sale → checkout → switch to Inventory → switch to Customers → toggle Arabic (RTL).
- `app.jsx` — main `<App />` component + screen routing state.
- `shell.jsx` — `<Sidebar />`, `<TopBar />`, `<OfflineBanner />`, `<Flower />` mark.
- `pos.jsx` — `<POSView />`, `<ProductGrid />`, `<ProductCard />`, `<BasketPanel />`, `<BasketRow />`, `<CompleteSaleDialog />`.
- `inventory.jsx` — `<InventoryView />`, `<InventoryTable />`.
- `customers.jsx` — `<CustomersView />`, `<CustomerCard />`.
- `atoms.jsx` — small reusable atoms: `<Btn />`, `<IconBtn />`, `<Pill />`, `<Field />`, `<Avatar />`, `<Icon />`. Exposed on `window` so other JSX files can use them.

## Coverage

- ✅ Walk-in sale flow (search → add to basket → complete)
- ✅ Controlled-substance warning banner at POS
- ✅ Offline state + sync queue indicator
- ✅ Inventory list with stock / expiry / status pills
- ✅ Customer search + profile card
- ✅ Bilingual EN ⇄ AR (RTL toggle in top bar)
- ⛔ Doctor / clinical / patient app — out of scope for Slice 1; not built.
