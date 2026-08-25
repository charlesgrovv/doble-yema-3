# Doble Yema

Site da Doble Yema — projeto Vite com duas páginas:

- `index.html` — página principal
- `primer-drop.html` — página da loja (drop limitado)
- `styles.css` — estilos compartilhados
- `script.js` — interação do menu e formulário
- `vite.config.js` — build multipágina (as duas páginas entram no `dist/`)

## Como rodar

```bash
npm install
npm run dev
```

O servidor sobe em `http://localhost:5173` (se a porta estiver ocupada, o Vite avança para 5174+).

## Build de produção

```bash
npm run build
```

Saída em `dist/`: as duas páginas + assets com hash. Para preview do build:

```bash
npm run preview
```
