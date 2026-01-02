<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Impostor by Carpaneta (Vite + Cloudflare Pages)

Juego tipo “impostor” construido con React 19 y Vite, listo para desplegarse en Cloudflare Pages (frontend estático + Pages Functions para el endpoint `/api/hint`).

## Requisitos
- Node.js 18 o 20
- npm

## Desarrollo local
1. Instala dependencias: `npm install`
2. (Opcional) Coloca `GEMINI_API_KEY` en tu entorno o en `.env` para probar el endpoint.
3. Arranca la UI: `npm run dev`
   - El endpoint `/api/hint` vive en `functions/api/hint.ts` y se ejecuta en Cloudflare Pages. Para probarlo en local usa `npx wrangler pages dev` (o añade un proxy manual) apuntando al directorio `dist` tras hacer `npm run build`.

## Despliegue en Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Functions folder: `functions/`
- Variables de entorno: define `GEMINI_API_KEY` en Pages para que `/api/hint` funcione.
- No se usa `wrangler deploy`; Pages se encarga del despliegue automático.
