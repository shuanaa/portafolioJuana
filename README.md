# Portfolio — Juana Monteagudo

Portfolio personal de Juana Monteagudo, Full Stack Developer / AI & Automation Engineer.

🔗 **Live:** https://shuanaa.github.io/portafolioJuana/

Basado en el sistema de diseño de [kodaiWeb](https://github.com/shuanaa/kodaiWeb) (HTML5, CSS3 con variables, JavaScript vanilla), adaptado a un portfolio individual.

## Cómo verlo localmente

No requiere build ni dependencias. Se recomienda levantarlo con un servidor estático (para que las rutas relativas funcionen bien):

```bash
npx serve .
```

Abrí `http://localhost:3000` — carga `index.html` (loader animado) y redirige a `main.html` (el sitio).

## Deploy (GitHub Pages)

1. En GitHub: **Settings → Pages → Build and deployment → Source** → `Deploy from a branch`.
2. Elegí la rama `main` y la carpeta `/ (root)`, guardá.
3. GitHub publica el sitio en `https://shuanaa.github.io/portafolioJuana/` (puede tardar 1-2 min tras cada push a `main`).

No hace falta build step: es HTML/CSS/JS estático, GitHub Pages lo sirve tal cual.

## Estructura

- `index.html` — pantalla de carga animada, redirige a `main.html`
- `main.html` — sitio principal (Sobre mí, Proyectos, Softwares, Contacto)
- `assets/css/intro.css` — sistema de diseño original de kodaiWeb (sin modificar)
- `assets/css/personal.css` — ajustes propios sobre ese sistema
- `script.js`, `script-meta.js`, `uc-scroll-reactive.js` — interacciones
- `script-contact.js` — animación de scroll (fade-up) de la sección de contacto
- `public/images/` — fotos, capturas de proyectos y PDFs

La sección de contacto no usa formulario: el botón lleva directo al [LinkedIn de Juana](https://www.linkedin.com/in/juana-monteagudo-6a81321b8/).

## Pendiente antes de publicar

- [ ] Revisar/actualizar la tarjeta "Proyecto Tres" en la sección de Proyectos (está marcada como "EN DESARROLLO") con datos reales cuando el proyecto esté listo
