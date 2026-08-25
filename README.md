# Doble Yema

<p align="center">
	<img src="assets/hero-egg.svg" alt="Doble Yema egg mark" width="180" />
</p>

<p align="center"><strong>Si lo encuentras, tuviste suerte.</strong></p>

Doble Yema is a limited-edition commerce experience inspired by the rarity of finding a double-yolk egg. The site presents the first drop as a small, considered collection and guides visitors from discovery to a direct WhatsApp order.

## About the project

This is a lightweight Vite landing page with an editorial visual direction, warm product photography, and a focused shopping flow. There is no backend or payment gateway in the project: orders are collected through WhatsApp after the visitor reviews the product, quantity, and total.

### Main features

- Hero landing page for the Doble Yema first drop
- Six numbered limited-edition pieces at `R$ 149` each
- Complete-drop bundle at `R$ 799`
- Cart with quantity controls and stock limits
- Empty-cart, checkout, and enlarged-image modals
- WhatsApp order summary with product quantities and totals
- Responsive navigation and mobile-friendly product grid
- Placeholder links for Instagram, Discord, and WhatsApp communities
- SVG favicon and compact brand mark at `assets/hero-egg.svg`
- Optional egg sound retained in the code but disabled by default

## Project structure

- `index.html` - main landing page
- `styles.css` - shared visual and responsive styles
- `script.js` - menu, cart, modals, image preview, and WhatsApp checkout
- `assets/hero-egg.svg` - SVG favicon with the Doble Yema mark
- `assets/hero-egg.png` - hero artwork
- `assets/piece-1.png` through `assets/piece-6.png` - product artwork
- `vite.config.js` - multi-page build configuration

The social links are intentionally placeholders until the final community URLs are available.

## Run locally

```bash
npm install
npm run dev
```

The server runs at `http://localhost:5173`. If that port is occupied, Vite automatically selects the next available port.

## Production build

```bash
npm run build
```

The compiled pages and hashed assets are written to `dist/`. To preview the production build locally:

```bash
npm run preview
```
