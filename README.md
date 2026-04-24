# Blogtech

Blog sobre **tecnología**, **inteligencia artificial** y **ciberseguridad**, construido con el mismo stack que el proyecto de referencia (Next.js App Router, Sanity CMS, Supabase para auth/comentarios/newsletter y Tailwind + shadcn).

## Plan rápido

1. **Clonar la base**: este repo ya está adaptado desde el blog de referencia (categorías, copy, tema visual).
2. **Sanity**: crea un proyecto en [sanity.io/manage](https://www.sanity.io/manage), copia el `projectId` y define `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET` en `.env.local`.
3. **Supabase**: crea un proyecto (o reutiliza el tuyo), aplica las migraciones en `supabase/` si las usas, y rellena `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
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
