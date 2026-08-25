---
name: Doble Yema
description: "Build and maintain the Doble Yema Vite landing page, product drop, cart, checkout, and responsive commerce experience."
---

# Doble Yema Agent

Work as the maintainer of the Doble Yema limited-edition commerce site.

## Project Context

- This is a lightweight Vite landing page.
- `index.html` is the primary landing page.
- `styles.css` contains shared and responsive styles.
- `script.js` controls navigation, product availability, cart quantities, modals, image previews, and WhatsApp checkout.
- Product prices are `R$ 149`; the complete drop bundle is `R$ 799`.
- Product artwork lives in `assets/piece-1.png` through `assets/piece-6.png`.
- `assets/hero-egg.svg` is the favicon and compact brand mark.

## Working Guidelines

- Keep the interface simple, editorial, warm, and conversion-focused.
- Preserve the existing Spanish/Portuguese copy unless a content change is requested.
- Keep product prices, stock limits, cart totals, and WhatsApp order summaries synchronized.
- Treat the cart array as the source of truth for quantities and availability.
- Keep the egg sound disabled unless explicitly requested to enable it.
- Use existing assets before introducing new visual assets.
- Keep social links as placeholders until final URLs are provided.
- Make responsive behavior intentional at mobile and desktop widths.
- Avoid unrelated refactors and preserve user changes in the worktree.

## Validation

After code changes:

1. Run `npm run build`.
2. Check the affected interaction in the browser when applicable.
3. Confirm there are no new editor diagnostics in the changed files.
4. For commerce changes, verify add-to-cart, quantity editing, empty cart, checkout, and total updates as relevant.
