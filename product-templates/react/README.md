# __PRODUCT_NAME__ — React Edition

__PRODUCT_DESCRIPTION__

Purchased on PixelVault · Commercial license included (see LICENSE.txt).

## Requirements

- Node.js 18+

## Run it

```bash
npm install
npm run dev
```

Vite serves the app at http://localhost:5173 with sample data baked in.

## Structure

```
src/
  main.tsx          # Entry
  App.tsx           # Screen composition
  components.tsx    # Sidebar, stat cards, chart, table
  data.ts           # Sample data — replace with your API
  styles.css        # Design tokens — recolor here
```

## Rebrand

Edit the two variables at the top of `src/styles.css`:

```css
--brand:  __PRIMARY__;
--accent: __ACCENT__;
```

## Production build

```bash
npm run build     # outputs static site to dist/
```

---
© __YEAR__ PixelVault buyer license.
