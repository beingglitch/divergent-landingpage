# Divergent Classes marketing site

Next.js (App Router, TypeScript). Pages live in `src/app`, one folder per route.

- `src/app/styles.css`: every style on the site
- `src/lib/config.ts`: prices, dates, approvals, the app URL and the 75-day bundle slugs
- `src/data/courses.json`: the course cards, rendered by `src/components/CourseCards.tsx`
- `src/lib/site.ts`: nav, side dots, reveals, FAQs, videos, gallery, "Book a free call" scrolling
- `src/lib/home.ts`: home page prices, countdowns, tabs, hero dots and sticky bar
- `src/components/LeadForm.tsx`: the free call form on the home page (`/#book`)
- `public/assets`: images, videos, logo and favicon

Set `NEXT_PUBLIC_APP_URL` to point leads and checkout at another app (default https://app.divergentclasses.com).

```
npm install
npm run dev     # http://localhost:3000
npm run build
```

Add `?preview-date=2026-11-07` to the home page to see it on another day.
