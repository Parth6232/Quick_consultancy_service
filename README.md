# Quick Consulting Services — React

React (Vite) rebuild of the original static site, styled with Tailwind (glossy/glassmorphism), animated with Framer Motion, and structured like the provided `dist.zip` scaffold (features/pages/router/store/common/constant).

## Setup

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Structure

- `src/common/` — Header, TopBar, Footer, Button, Reveal (scroll-in animation), useCounter hook
- `src/features/<section>/<Section>Container.jsx` — Hero, Stats, About, Process, Carousel, Services, Testimonials, FAQ, Contact, Chat
- `src/pages/HomePage.jsx` — assembles all sections
- `src/router/AppRoutes.jsx` — react-router-dom routes
- `src/store/reduxStore.js` + `src/store/redux/slices/` — theme, FAQ accordion, services filter, chat (Redux Toolkit)
- `src/constant/siteData.js` — all real site content (services, testimonials, FAQs, contact details)
- `src/utils/iconMap.jsx` — react-icons lookup used across components

## Notes

- Dark mode persists via `localStorage`, same behavior as the original `theme.js`.
- The consultation form uses `react-hook-form` + `zod` and reproduces the original mailto / WhatsApp / call logic.
- Replace the placeholder video reel section (not yet ported) and swap in real testimonials/photos when ready.
- To deploy: `npm run build`, then host the `dist/` folder (Vercel, Netlify, etc.) — a starter `vercel.json` from the scaffold can be added if you deploy to Vercel.
