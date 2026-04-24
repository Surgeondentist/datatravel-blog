# Redshell

Blog sobre **tecnología**, **inteligencia artificial** y **ciberseguridad** (Next.js App Router, Sanity CMS, Supabase y Tailwind + shadcn).

## Plan rápido

1. **Dominio apex**: en Vercel añade **`redshell.cloud`** (y certificado). En DNS del dominio, apunta al proyecto según las instrucciones de Vercel. Opcional: redirige `www.redshell.cloud` → apex o al revés, una sola versión canónica.
2. **Variable de sitio**: `NEXT_PUBLIC_SITE_URL=https://redshell.cloud` en Vercel y en `.env.local` de producción.
3. **Sanity**: [sanity.io/manage](https://www.sanity.io/manage) → `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` + CORS con `https://redshell.cloud` (y localhost en dev).
4. **Supabase**: **Settings → API** → URL y anon key en `.env.local`. En **SQL Editor** ejecuta `supabase/sql/redshell_full_setup.sql` (tablas, RLS, Storage). Opcional: `SUPABASE_SERVICE_ROLE_KEY` en el servidor.
5. **Auth**: en Supabase **URL configuration**, Site URL y redirects con `https://redshell.cloud/auth/callback` (y `http://localhost:3000/auth/callback` para dev).
6. **Google / AdSense**: `ads.txt` en `public/`; variables `NEXT_PUBLIC_ADSENSE_*`, `NEXT_PUBLIC_GA_*`, verificación GSC si aplica.

## Desarrollo local

```bash
cp .env.example .env.local
# Edita .env.local con tus claves

npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y el CMS en [http://localhost:3000/studio](http://localhost:3000/studio).

## Opcional

- **Google Analytics**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- **AdSense**: `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, slots en `NEXT_PUBLIC_ADSENSE_SLOT_*`.
- **Search Console**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

## Scripts

| Comando     | Descripción              |
|------------|---------------------------|
| `npm run dev`   | Servidor de desarrollo   |
| `npm run build` | Build de producción     |
| `npm run start` | Servidor tras el build  |
| `npm run lint`  | ESLint                    |
