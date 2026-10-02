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

## Design System
Tokens live in the `@theme inline` block of `app/globals.css`. Figma is the
source of truth for layout; tokens are the source of truth for values.
- Style with token utilities: type (`text-title-l`, `text-body-m`,
  `text-label-l`… — each one sets size, line-height and weight together),
  colors (`text-text-primary`, `bg-surface`, `border-border-default`…),
  radius (`rounded-card`, `rounded-pill`…).
- Never add raw hex colors (`#4f4f4f`) or arbitrary values (`text-[14px]`,
  `gap-[12px]`, `bg-[#d6d6d6]`) in new or edited code.
- If Figma MCP returns a raw value, snap it to the nearest existing token
  and say which token you chose. If no token is close, stop and ask before
  adding one; never invent a new token silently.
- When you touch a file that already has raw values, convert them to
  tokens only if asked. Don't mix a cleanup into an unrelated change.
- Legacy aliases (`ink`, `ink-secondary`, `hairline`, `tfam-*`) still work
  but don't use them in new code.

## Motion
- All transition timing and easing comes from `lib/motion.ts` (`PEER`,
  `TAB_BOUNCE`, `DEEPER`, `LIFT`, `SHEET`, `MODE`, `STATE`). Never retype a
  duration or ease inline.
- Every animation must respect `prefers-reduced-motion`.
- Measure motion end to end: what matters is time from tap to a usable
  screen, not the length of one animation.
- The WebGL splash (`components/SplashScreen.tsx`) is raw WebGL with inline
  GLSL, no library. Its handoff to Home is coordinated with the
  `data-splash` attribute set in `app/layout.tsx` and styles in
  `globals.css`. Change these three together, never one alone.
- Explore new motion in a separate sandbox first; port into this repo only
  as a reviewed diff.

## Workflow
- Never work directly on `main`. Create a branch for every feature or
  experiment (`feat/...`, `fix/...`, `exp/...`).
- Commit messages follow Conventional Commits with a scope, e.g.
  `fix(i18n): ...`, `feat(motion): ...`. Reference usability findings by ID
  (F01) when a change fixes one.
- For bugs: report the root cause before changing any file.

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

## Known gaps
- About 140 raw hex colors and ~570 arbitrary Tailwind values still exist in
  `components/` from before the design system (heaviest: `ChooseDateClient`,
  `NotificationsClient`, `ConfirmBookingClient`). Clean up per screen, on a
  branch, only when asked.
- Overlapping gray tokens need a decision: `border-input` (`#d9d9d9`),
  `border-card` (`#d6d6d6`), `border-default` (`#dddddd`), `tfam-border`
  (`#e5e5e5`), and two near-blacks (`tfam-dark` `#111111`, `text-primary`
  `#0a0a0a`). Until decided, use `border-default` and `text-primary`.
- No ESLint or tests yet (see Definition of Done).
- Resolved 2026-08-31: Map room labels now render as real, translated text
  via `RoomLabel` (commit `e34b627`).
