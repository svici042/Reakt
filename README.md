# MATERIJA Creative Studio

MATERIJA is a responsive, multilingual portfolio website for a creative studio in Vilnius and Bergen. It presents selected artwork, an open-studio section, and a parallax journal with localized essays.

## Features

- Deep multi-layer parallax effects driven by pointer and scroll position
- Responsive layouts for desktop, tablet, phone, narrow, and landscape screens
- Lithuanian, English, and Norwegian interface translations
- Filterable artwork gallery
- Full-size artwork preview modals
- Localized essay modals for the studio journal
- Keyboard and touch-friendly controls
- Reduced-motion support through `prefers-reduced-motion`
- Local image assets with no third-party runtime requests

## Technology

- React 19
- React DOM 19
- Vite 7
- esbuild
- Plain CSS

## Requirements

- Node.js compatible with Vite 7
- npm

## Installation

Install the project dependencies:

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

The command first compiles `js/app.jsx` into the browser-compatible `js/app.js` bundle and then starts Vite.

Open the local URL printed by Vite. Do not open `index.html` directly from the file system.

## Production build

Create an optimized production build:

```bash
npm run build
```

The generated website is placed in `dist`. The custom Vite plugin also copies all source images into `dist/images` so absolute `/images/...` paths continue to work after deployment.

Preview the production build locally:

```bash
npm run preview
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run bundle` | Compiles React JSX into `js/app.js` with esbuild. |
| `npm run dev` | Compiles the React source and starts the development server. |
| `npm run build` | Compiles the React source and generates the production build. |
| `npm run preview` | Serves the generated `dist` build locally. |

## Project structure

```text
.
├── images/            # Original WebP artwork and background images
├── js/
│   ├── app.jsx        # Main React source, components, translations, and essays
│   └── app.js         # Generated browser bundle; do not edit manually
├── dist/              # Generated production build
├── index.html         # Application document and React mount point
├── style.css          # Global styles, parallax layers, and media queries
├── vite.config.js     # Vite configuration and production image copying
└── package.json       # Scripts and project dependencies
```

## Editing the website

Make JavaScript and React changes in `js/app.jsx`, not in `js/app.js`. The latter is generated automatically and will be overwritten by `npm run bundle`, `npm run dev`, or `npm run build`.

Styles and responsive breakpoints are defined in `style.css`. The current layout includes dedicated media queries for 1280 px, 1024 px, 800 px, 600 px, and 420 px widths, plus short landscape screens.

## Localization

Interface translations are stored in the `translations` object inside `js/app.jsx`. Full journal essays are stored separately in `blogEssays` under the following language keys:

- `lt` — Lithuanian
- `en` — English
- `no` — Norwegian

When adding interface copy or an essay, update all three languages to keep the experience consistent.

## Images

The website uses local WebP files from `images`. When adding a new image:

1. Place it in `images`.
2. Reference it with an absolute path such as `/images/example.webp`.
3. Run `npm run build` and verify that it appears in `dist/images`.

## Accessibility

- Semantic sections and navigation labels are included.
- Modals can be closed with the `Escape` key.
- Interactive controls support keyboard navigation.
- The document language changes with the selected site language.
- Motion-heavy transforms are disabled when the user requests reduced motion.

## Security notes

- The site does not use cookies or persistent browser storage.
- There are no third-party runtime requests.
- React renders all dynamic interface content without raw HTML injection.
- Run `npm audit` regularly when updating dependencies.
- Production security headers such as CSP, HSTS, and `X-Content-Type-Options` should be configured at the hosting or web-server level.

## Credits

© 2026 MATERIJA creative studio by LovLaus Media.
