# Mi Portafolio Personal

¡Hola! 👋 Soy Andrés Uribe

_Este portafolio fue construido con Angular y está diseñado para mostrar mis habilidades y experiencia en el desarrollo web._

## Editar el contenido

El sitio es estático: no tiene base de datos ni CMS.

- **Proyectos, experiencia, skills, redes, contacto y CV:** `src/app/data/portfolio.ts`.
- **Textos en español e inglés:** `public/i18n/es.json` y `public/i18n/en.json`. En `portfolio.ts` los textos visibles son claves de estas traducciones (por ejemplo, `projects.items.beatridePlatform.title`).
- **Imágenes, íconos y CV:** `public/media/` y `public/cv/`. En `portfolio.ts` las rutas son relativas a `public/`.

Para verlo en local: `pnpm install` y `pnpm start`. Al hacer push a `main`, GitHub Actions lo publica en GitHub Pages.
