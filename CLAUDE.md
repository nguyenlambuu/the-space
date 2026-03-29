# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Space** is a 3D virtual museum experience for fashion designer Trinh Chau. Built with Next.js 14, React Three Fiber, and Supabase. It's a single-page app with no commerce — pure artistic presentation.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Critical: File Structure

**The source files are currently delivered as flat files with hyphenated prefixes, not organized into directories.** Before the project will run as a Next.js app, they must be moved into their proper locations:

| Current flat file | Target path |
|---|---|
| `app-layout.tsx` | `app/layout.tsx` |
| `app-page.tsx` | `app/page.tsx` |
| `app-globals.css` | `app/globals.css` |
| `components-Scene.tsx` | `app/components/Scene.tsx` |
| `components-3d-Lobby.tsx` | `app/components/3d/Lobby.tsx` |
| `components-3d-CollectionRoom.tsx` | `app/components/3d/CollectionRoom.tsx` |
| `components-UI-Navigation.tsx` | `app/components/UI/Navigation.tsx` |
| `components-UI-LookDetail.tsx` | `app/components/UI/LookDetail.tsx` |
| `components-UI-LoadingScreen.tsx` | `app/components/UI/LoadingScreen.tsx` |
| `lib-types.ts` | `app/lib/types.ts` |
| `lib-supabase.ts` | `app/lib/supabase.ts` |
| `lib-imageLoader.ts` | `app/lib/imageLoader.ts` |

## Architecture

Single-page app with three view states (`ViewState = 'lobby' | 'collection' | 'detail'`):

```
app/page.tsx              ← State root (ViewState, selected collection/look)
├── components/Scene.tsx  ← React Three Fiber Canvas + OrbitControls + lighting
│   ├── 3d/Lobby.tsx      ← 3D museum lobby with clickable doors (one per collection)
│   └── 3d/CollectionRoom.tsx  ← 3D gallery room with look displays on walls
├── UI/Navigation.tsx     ← Breadcrumb nav (Back to lobby)
├── UI/LookDetail.tsx     ← Detail modal (materials, inspiration, image)
└── UI/LoadingScreen.tsx  ← Suspense fallback
```

Data flows from Supabase → `app/lib/supabase.ts` (getCollections, getLooksByCollection, getLook) → `app/page.tsx` state → 3D scenes.

## Environment Setup

Create `.env.local` from `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Database schema is in `SUPABASE_SETUP.md`. Tables: `collections` (id, name, description, slug, order) and `looks` (id, collection_id, name, materials, inspiration, image_url, order). Both are public read-only with Supabase RLS.

## Design Tokens

Defined in `app/globals.css` and `tailwind.config.js`:
- `--color-bg: #F8F7F4` — warm off-white (UI background)
- `--color-bg-dark: #0F0F0D` — near-black (3D scene background)
- `--color-accent: #C8B89A` — warm sand
- Georgia serif font throughout

## Key Constraints

- **No commerce** — no cart, checkout, or buy buttons (by design)
- **Shakespearean/poetic language** in all UI copy
- Mobile-first 3D performance: DPR capped at 1–1.5 on mobile, simplified geometry on small screens
- All Supabase queries are read-only; no auth in MVP
