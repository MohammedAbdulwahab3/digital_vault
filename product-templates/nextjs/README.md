# __PRODUCT_NAME__ — Next.js Edition

__PRODUCT_DESCRIPTION__

Purchased on PixelVault · Commercial license included (see LICENSE.txt).

## Requirements

- Node.js 18.18+ (20+ recommended)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll see the full template running with sample
data from `src/lib/data.ts`.

## Structure

```
src/
  app/
    layout.tsx        # Root layout, fonts, theme tokens
    page.tsx          # Main screen composed from components
    globals.css       # Design tokens — recolor the whole template here
  components/         # Sidebar, stat cards, chart, table
  lib/data.ts         # Sample data — replace with your API calls
```

## Rebrand in 2 minutes

All colors flow from CSS variables in `src/app/globals.css`:

```css
--brand:   __PRIMARY__;
--accent:  __ACCENT__;
```

Change those two values and every component follows.

## Production build

```bash
npm run build && npm start
```

---
© __YEAR__ PixelVault buyer license — use freely in commercial projects,
do not resell the source as a template.
