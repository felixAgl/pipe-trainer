# PipeTrainer Admin Dashboard - Feature Plan

## Overview

Transform PipeTrainer from a single-page plan generator into a full coaching platform with:
- **Admin Dashboard**: Manage exercises, templates, and default configurations
- **Client Management**: Track multiple clients, their plans, and progress
- **Plan Builder**: Enhanced version using admin-configured data as dropdown sources
- **Progress Tracking**: Visual history of plans generated per client

## Architecture Decision

### Database: Supabase (PostgreSQL)
- Free tier covers initial needs (500MB DB, 1GB storage)
- Built-in auth (for admin login)
- Real-time subscriptions (for future features)
- Edge Functions for server-side logic if needed
- Row Level Security for data isolation

### Why NOT localStorage anymore
- Can't share across devices
- Can't track multiple clients
- No data persistence beyond browser
- Can't generate reports or analytics

---

## Database Schema

### Tables

```sql
-- Admin/Coach profile (single user for V1)
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand_name TEXT DEFAULT 'PipeTrainer',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Exercise library (admin populates these)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,       -- "PIERNA", "PECHO", "ESPALDA", etc.
  equipment TEXT,                    -- "Maquina", "Barra", "Mancuerna", "Polea", "Peso corporal"
  difficulty TEXT DEFAULT 'intermediate', -- "beginner", "intermediate", "advanced"
  video_url TEXT,                    -- Optional YouTube/IG link for exercise demo
  notes TEXT,                        -- Coach notes about form/technique
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Muscle groups (admin defines these)
CREATE TABLE muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                -- "PIERNA", "PECHO", "ESPALDA", "HOMBRO", "BRAZO"
  display_order INT DEFAULT 0,
  color TEXT,                        -- Optional accent color override
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Default configurations (admin sets these)
CREATE TABLE default_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  key TEXT NOT NULL,                 -- "default_rest_time", "default_cardio_note", etc.
  value TEXT NOT NULL,
  UNIQUE(coach_id, key)
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  goal TEXT,                         -- "Hipertrofia", "Fuerza", "Perdida de grasa", etc.
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workout Plans (linked to a client)
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft',       -- "draft", "active", "completed", "archived"
  weeks_count INT NOT NULL,
  days_per_week INT NOT NULL,
  start_date DATE,
  end_date DATE,
  plan_data JSONB NOT NULL,          -- Full WorkoutPlan JSON (weeks, days, exercises)
  generated_images JSONB,            -- Array of { weekNumber, dayNumber, url }
  pdf_url TEXT,                      -- URL to generated PDF in storage
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Plan history / progress log
CREATE TABLE plan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  day_number INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,                        -- Client feedback or coach notes
  actual_exercises JSONB             -- What the client actually did (optional tracking)
);
```

---

## Page Structure (App Router)

```
app/
├── page.tsx                         # Landing / redirect to dashboard
├── (auth)/
│   ├── login/page.tsx               # Supabase Auth login
│   └── callback/route.ts            # OAuth callback
├── dashboard/
│   ├── layout.tsx                   # Dashboard layout with sidebar
│   ├── page.tsx                     # Overview: stats, recent plans, quick actions
│   ├── exercises/
│   │   ├── page.tsx                 # Exercise library CRUD table
│   │   └── [id]/page.tsx            # Exercise detail/edit
│   ├── muscle-groups/
│   │   └── page.tsx                 # Muscle group management
│   ├── clients/
│   │   ├── page.tsx                 # Client list with search/filter
│   │   ├── [id]/page.tsx            # Client detail + plan history
│   │   └── new/page.tsx             # New client form
│   ├── plans/
│   │   ├── page.tsx                 # All plans list (filterable by client/status)
│   │   ├── new/page.tsx             # Plan builder (enhanced current builder)
│   │   └── [id]/page.tsx            # Plan detail + generated images
│   ├── generator/
│   │   ├── page.tsx                 # Workout Card Generator (current app, migrated)
│   │   └── preview/page.tsx         # Full-size card preview + download
│   └── settings/
│       └── page.tsx                 # Default configs, brand settings, API keys
```

---

## Tab: Workout Card Generator (dashboard/generator)

### Overview

The core product feature. Generates branded workout plan images (1080x1920px Instagram story format) with the PipeTrainer visual identity. This is the current app functionality, migrated into the dashboard as a dedicated tab.

### Current Implementation (Working - Deployed)

#### Brand Identity Applied
| Element | Value | Source |
|---------|-------|--------|
| Primary Color (accent) | `#DBFE53` | Brand manual |
| Secondary Color (gray) | `#8A9597` | Brand manual |
| Black | `#000000` | Brand manual |
| Title Font | Impact / Arial Black (bold condensed) | Reference matching |
| Logo | PT Isotipo (base64 embedded) | Brand manual |
| Canvas Size | 1080x1920px | Instagram Story format |

#### Card Layout Structure (top to bottom)
1. **PT Isotipo Logo** - 90px height, top-left aligned
2. **"PLAN DE ENTRENAMIENTO"** - Impact 48px, `#DBFE53`, green neon glow
3. **"SEMANA X"** - Impact 36px, `#DBFE53`, green neon glow
4. **Day Bar** - White "Dia X" section + Green muscle group with arrow chevron
   - White rect with `marginRight: -34` extends behind green
   - Green section: `clip-path: polygon(34px 0, 100% 0, 100% 100%, 34px 100%, 0 50%)`
   - Creates arrow/chevron pointing right on left edge of green
5. **Exercise Table** - 6-column grid with 3px white borders
   - Header: green bg (`#DBFE53`), black text, 20px
   - Columns: Ejercicios (2.5fr) | Series (1fr) | Reps (1fr) | Tiempo Descanso (1.5fr) | RIR (0.8fr) | RPE (0.8fr)
   - Rows: 22px white text, rest time in `#DBFE53` (green accent)
6. **Spacer** - `flex-1` pushes cardio to bottom
7. **"CARDIO"** - Impact 80px, white, white neon glow
8. **Cardio Description Box** - 220px min-height, 3px white border
9. **"NOTA:"** - 20px, muted gray text
10. **Watermark** - "Pipetrainer_11", 18px, `text-neutral-500`

#### Background
- **SVG feTurbulence texture** - Procedural concrete/stone wall
  - 3 noise layers: fine grain (0.65), large patches (0.03), mid detail (0.12)
  - Neutral gray tones (R=G=B) - no warm/cool tint
  - Base fills: `#1a1a1a` / `#2e2e2e`
- **Radial vignette overlay** - Fades edges to `#0a0a0a` black
  - `transparent 25% -> rgba(10,9,8,0.6) 55% -> rgba(10,9,8,0.95) 75% -> #0a0a0a 90%`

#### Glow Effects
- **Green glow** (titles): 5-layer `text-shadow`, `rgba(219,254,83)`, max spread 80px
- **White glow** (CARDIO): 4-layer `text-shadow`, `rgba(255,255,255)`, max spread 100px

#### Image Generation Pipeline
- `html-to-image` (toPng) with `pixelRatio: 1` for client-side DOM-to-PNG
- All assets embedded as base64 data URLs (CORS-compatible)
- `jsPDF` for PDF with JPEG MEDIUM compression
- No external API dependencies (previously HCTI, now replaced)

### Features for Generator Tab

- [ ] G.1 Migrate current `page.tsx` Plan Builder into `dashboard/generator/page.tsx`
- [ ] G.2 Client selector dropdown at top: "Generando plan para: [Client]"
- [ ] G.3 Exercise name autocomplete from exercises DB (filtered by selected muscle group)
- [ ] G.4 Live preview panel (current side-by-side view, responsive)
- [ ] G.5 "Generar Dia" button saves image to Supabase Storage
- [ ] G.6 "Generar Todo" generates all days, stores URLs in workout_plans record
- [ ] G.7 "Descargar PDF" compiles all generated images into downloadable PDF
- [ ] G.8 Save/Load plans to/from Supabase (replace localStorage)
- [ ] G.9 Plan history: list of previously generated plans with thumbnails
- [ ] G.10 Share plan: generate shareable link for client to view their plan
- [ ] G.11 Write tests for generator flow

### Key Files
| File | Purpose |
|------|---------|
| `src/components/workout/workout-day-card.tsx` | Card visual component (1080x1920) |
| `src/lib/brand-assets.ts` | PT isotipo base64 + concrete texture SVG |
| `src/lib/image-capture.ts` | html-to-image + jsPDF generation |
| `src/components/workout/plan-builder.tsx` | Builder form + controls |
| `src/types/workout.ts` | WorkoutDay, Exercise, CardioBlock types |
| `src/app/globals.css` | Brand CSS variables + Tailwind theme |

---

## Features by Phase

### Phase 1: Supabase Integration + Auth (Foundation)

- [ ] 1.1 Create Supabase project and run migrations
- [ ] 1.2 Install @supabase/supabase-js and @supabase/ssr
- [ ] 1.3 Create Supabase client utilities (browser + server)
- [ ] 1.4 Implement auth with email/password (single admin user)
- [ ] 1.5 Create auth middleware for protected routes
- [ ] 1.6 Seed initial coach profile on first login
- [ ] 1.7 Write tests for auth flow

### Phase 2: Exercise Library (Admin Dashboard Core)

- [ ] 2.1 Create exercise CRUD API (Server Actions)
- [ ] 2.2 Build exercise list page with table (sortable, filterable)
  - Filter by muscle group
  - Search by name
  - Toggle active/inactive
- [ ] 2.3 Build exercise create/edit form
  - Name (text)
  - Muscle group (dropdown from muscle_groups table)
  - Equipment (dropdown: Maquina, Barra, Mancuerna, Polea, Peso corporal)
  - Difficulty (dropdown: beginner, intermediate, advanced)
  - Video URL (optional)
  - Notes (textarea)
- [ ] 2.4 Build muscle group management page
  - CRUD for custom muscle groups
  - Drag-and-drop reordering
- [ ] 2.5 Bulk import exercises (CSV upload)
- [ ] 2.6 Seed default exercises from current exercise-suggestions.ts
- [ ] 2.7 Write tests for exercise CRUD operations

### Phase 3: Client Management

- [ ] 3.1 Create client CRUD API (Server Actions)
- [ ] 3.2 Build client list page with search and filter
  - Search by name
  - Filter by active/inactive
  - Filter by goal
- [ ] 3.3 Build client create/edit form
  - Name, email, phone, goal, notes
- [ ] 3.4 Build client detail page showing:
  - Client info
  - Plan history (all plans for this client)
  - Progress timeline
- [ ] 3.5 Write tests for client operations

### Phase 4: Enhanced Plan Builder

- [ ] 4.1 Modify PlanBuilder to read exercises from Supabase instead of hardcoded
- [ ] 4.2 Add client selector at top of plan builder
  - "Creating plan for: [Client Dropdown]"
- [ ] 4.3 Exercise name dropdown now queries DB, filtered by selected muscle group
- [ ] 4.4 Pre-populate defaults from default_configs table
- [ ] 4.5 Save plan to Supabase with client association
- [ ] 4.6 Store generated image URLs in the plan record
- [ ] 4.7 Store generated PDF URL in Supabase Storage
- [ ] 4.8 Write tests for enhanced plan builder

### Phase 5: Dashboard Overview

- [ ] 5.1 Build dashboard sidebar navigation
  - Logo + brand name
  - Overview
  - Generator (Workout Card Generator)
  - Exercises
  - Muscle Groups
  - Clients
  - Plans
  - Settings
- [ ] 5.2 Build overview page with stats cards:
  - Total clients (active)
  - Total plans generated (this month)
  - Plans in progress
  - Exercises in library
- [ ] 5.3 Recent activity feed (latest plans created/generated)
- [ ] 5.4 Quick actions: "New Plan", "New Client", "Add Exercise"
- [ ] 5.5 Write tests for dashboard components

### Phase 6: Progress Tracking

- [ ] 6.1 Build progress tracking UI per client
  - Calendar view showing completed days
  - Checkmarks per day/week
- [ ] 6.2 Coach can mark days as completed for a client
- [ ] 6.3 Progress summary per plan:
  - X/Y days completed
  - Percentage progress bar
  - Days remaining
- [ ] 6.4 Client progress comparison view (optional)
- [ ] 6.5 Write tests for progress tracking

### Phase 7: Settings and Configuration

- [ ] 7.1 Build settings page with:
  - Default cardio note text
  - Default rest times
  - Default RIR/RPE values
  - HCTI API credentials (migrate from localStorage)
  - Brand name and colors
- [ ] 7.2 Settings persist to default_configs table
- [ ] 7.3 Plan builder reads these defaults on load
- [ ] 7.4 Write tests for settings

---

## UI Components Needed

### Reusable (Dashboard-wide)
- `DataTable` - Sortable, filterable table with pagination
- `Sidebar` - Dashboard navigation sidebar
- `StatsCard` - Number + label card for overview
- `Modal` - Confirmation dialogs, quick forms
- `Toast` - Success/error notifications
- `SearchInput` - Debounced search with icon
- `Badge` - Status badges (active, draft, completed)
- `EmptyState` - "No data yet" placeholder with CTA

### Domain-specific
- `ExerciseForm` - Create/edit exercise
- `ClientForm` - Create/edit client
- `ClientCard` - Client summary in list view
- `PlanCard` - Plan summary with status badge
- `ProgressBar` - Plan completion percentage
- `ProgressCalendar` - Monthly calendar with completion marks

---

## Data Flow

```
Admin Dashboard                    Plan Builder
┌──────────────┐                  ┌──────────────┐
│ Exercises DB │──── feeds ──────>│ Dropdowns    │
│ Muscle Groups│──── feeds ──────>│ Autocomplete │
│ Defaults     │──── feeds ──────>│ Pre-fills    │
│ Clients      │──── feeds ──────>│ Client Select│
└──────────────┘                  └──────┬───────┘
                                         │
                                    saves to
                                         │
                                  ┌──────▼───────┐
                                  │ workout_plans│
                                  │ (Supabase)   │
                                  └──────┬───────┘
                                         │
                                  generates
                                         │
                                  ┌──────▼───────┐
                                  │ Images + PDF │
                                  │ (HCTI + R2)  │
                                  └──────────────┘
```

---

## Migration Strategy (from current state)

1. **Keep current app working** during migration
2. Add Supabase as a dependency, create client
3. Add auth layer (login page protects /dashboard)
4. Migrate exercise suggestions to DB (seed from current hardcoded data)
5. Add client management (new feature, no migration needed)
6. Update PlanBuilder to optionally read from DB (fallback to localStorage)
7. Once stable, make DB the primary source
8. Remove localStorage dependency for exercises (keep for offline cache)

---

## Deployment Considerations

- **Current**: GitHub Pages (static export) - WORKS for client-side only
- **With Supabase**: Still works on GitHub Pages since Supabase is accessed client-side
- **If we need Server Actions**: Move to Vercel or Cloudflare Pages
- **Recommendation**: Stay on GitHub Pages + Supabase client-side for V1 of dashboard
  - Move to Vercel when Server Actions become necessary (Phase 4+)

---

## Estimated Effort

| Phase | Description           | Complexity | Est. Time |
|-------|-----------------------|------------|-----------|
| 1     | Supabase + Auth       | Medium     | 4-6 hours |
| 2     | Exercise Library      | Medium     | 6-8 hours |
| 3     | Client Management     | Medium     | 4-6 hours |
| G     | Generator Tab Migration | Medium   | 3-4 hours |
| 4     | Enhanced Plan Builder | Hard       | 6-8 hours |
| 5     | Dashboard Overview    | Easy       | 3-4 hours |
| 6     | Progress Tracking     | Medium     | 4-6 hours |
| 7     | Settings              | Easy       | 2-3 hours |
| **Total** |                   |            | **32-45 hours** |

---

## Priority Order

1. Phase G (Generator Tab) - Migrate current working app into dashboard tab FIRST
2. Phase 2 (Exercise Library) - Admin manages exercise catalog
3. Phase 3 (Clients) - Core business need
4. Phase 1 (Auth) - Protect the dashboard
5. Phase 4 (Enhanced Plan Builder) - Connect exercises DB to generator dropdowns
6. Phase 5 (Dashboard) - Polish and overview
7. Phase 6 (Progress) - Track results
8. Phase 7 (Settings) - Configure defaults
