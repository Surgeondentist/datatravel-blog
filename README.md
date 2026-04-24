# Blogtech

Blog sobre **tecnología**, **inteligencia artificial** y **ciberseguridad**, construido con el mismo stack que el proyecto de referencia (Next.js App Router, Sanity CMS, Supabase para auth/comentarios/newsletter y Tailwind + shadcn).

## Plan rápido

1. **Clonar la base**: este repo ya está adaptado desde el blog de referencia (categorías, copy, tema visual).
2. **Sanity**: crea un proyecto en [sanity.io/manage](https://www.sanity.io/manage), copia el `projectId` y define `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET` en `.env.local`.
3. **Supabase** (proyecto *datatravel* u otro): en el dashboard → **Settings → API**, copia **Project URL** y **anon public** key a `.env.local`. Luego en **SQL Editor** ejecuta el script único `supabase/sql/datatravel_full_setup.sql` (tablas `profiles`, `subscribers`, `comments`, `reports`, RLS y bucket **avatars** en Storage). Opcional: `SUPABASE_SERVICE_ROLE_KEY` (solo servidor) para que el listado de suscriptores en admin no dependa solo de RLS.
4. **Contenido**: entra a `/studio`, publica artículos con las categorías *Tecnología*, *Inteligencia artificial*, *Ciberseguridad* y *Guías y herramientas*.
5. **Producción**: despliega en Vercel (o similar), configura variables de entorno y `NEXT_PUBLIC_SITE_URL` con tu dominio.

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
- **AdSense**: `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, `NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT`, y si quieres más ubicaciones, `NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE` y `NEXT_PUBLIC_ADSENSE_SLOT_MID`. Si no las defines, los bloques de anuncio no se renderizan.
- **Ads.txt**: cuando AdSense te dé la línea exacta, crea `public/ads.txt` en la raíz del sitio público.

## Scripts

| Comando     | Descripción              |
|------------|---------------------------|
| `npm run dev`   | Servidor de desarrollo   |
| `npm run build` | Build de producción     |
| `npm run start` | Servidor tras el build  |
| `npm run lint`  | ESLint                    |
