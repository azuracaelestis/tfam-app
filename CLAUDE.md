@AGENTS.md

# CLAUDE.md

## Project Overview
TFAM Audio Guide — a mobile web app for visitors to the Taipei Fine Arts
Museum. It lets visitors browse what's on, see activities and book them,
navigate a floor map, and play audio guides for artworks. The app is
bilingual (English / Chinese) and is designed mobile-first — assume a phone
screen, not a desktop, unless told otherwise.

## Tech Stack
- **Next.js 16 (App Router)** — the framework. NOTE: this version is newer
  than most training data. See AGENTS.md; check the docs before assuming APIs.
- **React 19** — UI library.
- **TypeScript (strict mode)** — every file is typed; `strict` is on.
- **Tailwind CSS v4** — all styling is utility classes, no separate CSS files
  except `app/globals.css`.
- **motion (Framer Motion v12)** — used for page transitions and animations.
- **Package manager: npm** — always use npm (there is a package-lock.json).
  Never introduce yarn/pnpm/bun.

## Commands
- Install:      `npm install`
- Dev server:   `npm run dev`      (opens at http://localhost:3000)
- Build:        `npm run build`    (this ALSO type-checks the whole project)
- Type-check:   `npx tsc --noEmit` (type-check without building)
- Start (prod): `npm start`

## Validation — Definition of Done
This project does NOT yet have tests or a linter. Until it does, a task is
complete ONLY when:
- [ ] `npx tsc --noEmit` passes with no type errors
- [ ] `npm run build` succeeds
- [ ] The affected screen has been checked in the browser (`npm run dev`)

> Growing this section is the top priority. When we add ESLint and tests,
> add their commands here and make them required. This is where the project
> gets safer over time — every check added here is one less thing a human
> has to catch by hand.

## Project Structure
The map, not every file:
- `app/`         — routes only. Each `page.tsx` is a THIN wrapper that renders
                   one component from `components/`. Keep pages tiny.
- `components/`  — all real UI and interaction logic. Files named `*Client.tsx`
                   are the main screens (e.g. `WhatsOnClient`, `MapClient`).
                   Smaller shared pieces (e.g. `BottomNav`, `ArtworkCard`) also
                   live here.
- `lib/`         — data and shared logic: content lists (`activities.ts`,
                   `artworks.ts`, `exhibitions.ts`, `mapData.ts`), all
                   translations (`translations.ts`), and hooks for language /
                   settings.
- `hooks/`       — reusable React hooks (`useAudio`, `useMockAudio`).
- `public/`      — static assets: images, icons (SVG), audio files.

## Conventions
- New screens follow the existing pattern: a thin `app/.../page.tsx` that
  renders a `SomethingClient.tsx` in `components/`. Do not put page logic
  inside `app/`.
- All user-facing text goes through the translation system in
  `lib/translations.ts` — never hard-code English (or Chinese) strings in a
  component. The app is bilingual; untranslated text is a bug.
- Style with Tailwind utility classes. Do not add new `.css` files.
- Use the `@/` import alias (e.g. `@/components/BottomNav`), not long
  relative paths like `../../../`.
- Design mobile-first.

## Patterns to AVOID
- Do NOT add a state-management library (Redux, Zustand, etc.). React state
  and props are enough for this app's size.
- Do NOT hard-code text strings in components — use translations.
- Do NOT switch package managers or add heavy dependencies without asking.
- Do NOT bloat `app/` pages with logic — that belongs in `components/`.

## Constraints / Guardrails
- Never commit secrets or API keys.
- Do not change `next.config.ts` or `tsconfig.json` without explaining why.
- Treat `package-lock.json` as managed by npm — don't hand-edit it.
