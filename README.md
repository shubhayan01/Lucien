# Lucien Academy — Website

A static multi-page marketing site. No build step required.

## Pages
| File | URL | Purpose |
|------|-----|---------|
| `index.html` | `/` | Home |
| `about.html` | `/about.html` | About Us + program overview + approach |
| `programs.html` | `/programs.html` | The 5 core programs, outcomes, workshops |
| `classes.html` | `/classes.html` | Curriculum, bilingual instruction, FAQ |
| `franchise.html` | `/franchise.html` | Partnership + animated partner-logo roller |
| `contact.html` | `/contact.html` | Contact info, form, newsletter |

Shared assets: `styles.css` (all styling), `script.js` (nav, modal, forms, FAQ, reveals), `logo.svg` (logo).

## Deploy to Vercel
1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket), **or** run the Vercel CLI.
2. In Vercel, **New Project → Import** the repo.
3. Framework preset: **Other** (it's plain static HTML — no build command, output directory `.`).
4. Deploy. `vercel.json` sets sensible asset caching.

CLI alternative:
```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

## Notes
- **Logo:** the site ships with `logo.svg`. To use your own raster logo, drop `logo.png` in this folder and change `logo.svg` → `logo.png` in the `<img>` tags (nav + footer). The logo uses `object-fit: contain` so it is never cropped.
- **Contact form** opens the visitor's email client (`mailto:`) addressed to `lucienacademy@gmail.com`. For server-side submission, wire the form to a service (Formspree, Vercel Functions, etc.).
- Only social links (Instagram, Facebook) point off-site; all other navigation is internal.
