# PipeTrainer - Workout Plan Generator

## Overview

Automated workout plan image and PDF generator for PipeTrainer (PT) fitness coaching brand. The system takes structured exercise data through a web form and generates branded training plan images identical to the PT design (black background, lime green `#CCFF00` accents, PT logo).

## Brand Identity

- **Primary Background**: `#0a0a0a` (near-black)
- **Accent Color**: `#CCFF00` (lime green/yellow-green)
- **Secondary Background**: `#1a1a1a` (dark gray for cards)
- **Text Primary**: `#FFFFFF` (white)
- **Text Secondary**: `#a0a0a0` (gray)
- **Border Color**: `#333333` (subtle borders)
- **Font**: Inter or system sans-serif, bold headings, clean tables
- **Logo**: "PT" stylized mark (top-left)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI**: React 19 (no manual memoization, named imports)
- **Image Generation**: htmlcsstoimage.com API
- **PDF Generation**: jsPDF or @react-pdf/renderer
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm

## Data Model

### WorkoutPlan

```typescript
interface WorkoutWeek {
  weekNumber: number;
  days: WorkoutDay[];
}

interface WorkoutDay {
  dayNumber: number;
  dayLabel: string; // "Dia 1", "Dia 2", etc.
  muscleGroup: string; // Custom name: "PIERNA", "PECHO", "ESPALDA", etc.
  exercises: Exercise[];
  cardio: CardioBlock;
}

interface Exercise {
  name: string;
  series: number; // 1-6
  reps: number; // 1-30
  restTime: string; // "1 MIN", "2 MIN", "1-2 MIN", "2-3 MIN"
  rir: number; // 0-5 (Reps In Reserve)
  rpe: number; // 1-10 (Rate of Perceived Exertion)
}

interface CardioBlock {
  description: string; // e.g. "caminadora 5 minutos velocidad 8"
  note: string; // e.g. "No te saltes el cardio..."
}
```

## Features (Tasks)

### Phase 1: Project Setup

- [ ] 1.1 Initialize Next.js 15 project with TypeScript, Tailwind 4, pnpm
- [ ] 1.2 Configure project structure following App Router conventions
- [ ] 1.3 Set up Vitest with React Testing Library
- [ ] 1.4 Create TypeScript types and const patterns for workout data model
- [ ] 1.5 Create cn() utility and Tailwind theme with PT brand colors
- [ ] 1.6 Create environment variables setup for htmlcsstoimage API keys

### Phase 2: Workout Plan Template (HTML/CSS)

- [ ] 2.1 Build the workout day card component matching the exact PT design
  - Black background (#0a0a0a)
  - PT logo top-left
  - "PLAN DE ENTRENAMIENTO" title in lime green
  - "SEMANA X" subtitle
  - Day label bar: "Dia X" + muscle group name
  - Exercise table with lime green header row
  - Columns: EJERCICIOS | SERIES | REPS | TIEMPO DESCANSO | RIR | RPE
  - White text on dark rows with subtle borders
  - Cardio section at bottom with glowing "CARDIO" title
  - Cardio description box with dashed border
  - "NOTA:" text at the very bottom
- [ ] 2.2 Build the workout day card as a standalone HTML template for image generation
- [ ] 2.3 Write tests for the workout day card component rendering
- [ ] 2.4 Create responsive preview that shows the card at correct aspect ratio

### Phase 3: Form UI (Data Input)

- [ ] 3.1 Create the main plan builder page layout
- [ ] 3.2 Build week selector (number of weeks: 1-4)
- [ ] 3.3 Build day configurator with:
  - Day number (auto-incremented)
  - Custom muscle group name input (free text)
  - Exercise rows with:
    - Exercise name (text input with autocomplete suggestions)
    - Series (dropdown: 1-6)
    - Reps (dropdown: 1-30)
    - Rest time (dropdown: "30 SEG", "1 MIN", "1-2 MIN", "2 MIN", "2-3 MIN", "3 MIN")
    - RIR (dropdown: 0-5)
    - RPE (dropdown: 1-10)
  - Add/remove exercise row buttons
  - Cardio description (text input)
  - Cardio note (text input with default value)
- [ ] 3.4 Build "Add Day" / "Remove Day" functionality (max 5 days per week)
- [ ] 3.5 Build week tabs/navigation for multi-week plans
- [ ] 3.6 Add live preview panel showing the branded card as you type
- [ ] 3.7 Write tests for form state management and validation
- [ ] 3.8 Add form validation (minimum 1 exercise per day, required fields)

### Phase 4: Image Generation (htmlcsstoimage.com API)

- [ ] 4.1 Create API route handler for image generation (`/api/generate-image`)
- [ ] 4.2 Build HTML template string builder that converts WorkoutDay data to the branded HTML
- [ ] 4.3 Integrate with htmlcsstoimage.com API (POST /v1/image)
  - API endpoint: https://hcti.io/v1/image
  - Auth: Basic auth with User ID + API Key
  - Send HTML + CSS, receive image URL
- [ ] 4.4 Add loading states and error handling for image generation
- [ ] 4.5 Add "Generate All Days" batch functionality
- [ ] 4.6 Add individual image download button per day
- [ ] 4.7 Write tests for the API route and template builder

### Phase 5: PDF Generation

- [ ] 5.1 Create PDF generation service that compiles multiple day images into a single PDF
- [ ] 5.2 Each page = one day card image (portrait, full page)
- [ ] 5.3 Add cover page with PT branding, plan title, week range
- [ ] 5.4 Support multi-week PDF (e.g., 2 weeks = 10 pages + cover)
- [ ] 5.5 Add "Download PDF" button that generates the complete plan
- [ ] 5.6 Write tests for PDF generation

### Phase 6: Polish and UX

- [ ] 6.1 Add plan save/load functionality (localStorage for now)
- [ ] 6.2 Add plan duplication (copy week 1 to week 2 with edit ability)
- [ ] 6.3 Add exercise name suggestions/autocomplete from common exercises list
- [ ] 6.4 Add keyboard shortcuts for faster data entry
- [ ] 6.5 Add responsive design for mobile form entry
- [ ] 6.6 Add toast notifications for generation success/failure

## Image Specification

Each generated image should be:
- **Width**: 1080px (Instagram story width)
- **Height**: auto / ~1920px (Instagram story height)
- **Format**: PNG
- **DPI**: 2x for retina quality

## Design Reference

The exact layout from top to bottom:
1. **Header**: PT logo (left) + "PLAN DE ENTRENAMIENTO" (center, lime green, italic bold) + "SEMANA X" (center, lime green)
2. **Day Bar**: "Dia X" (left, black bg) + Muscle group name (center, lime green bg, black text, bold)
3. **Exercise Table**:
   - Header row: lime green bg, black bold text
   - Data rows: transparent bg, white text, centered values
   - Subtle row separators
4. **Cardio Section**:
   - "CARDIO" text (glowing white, bold, centered)
   - Description box (dashed white border)
5. **Note**: "NOTA:" text at the bottom

## API Integration Details

### htmlcsstoimage.com

```
POST https://hcti.io/v1/image
Authorization: Basic base64(USER_ID:API_KEY)
Content-Type: application/json

{
  "html": "<div>...</div>",
  "css": "body { ... }",
  "google_fonts": "Inter",
  "viewport_width": 1080,
  "viewport_height": 1920,
  "device_scale": 2
}

Response: { "url": "https://hcti.io/v1/image/xxxxx" }
```

### Environment Variables

```
HCTI_USER_ID=01KGV92WVZD3DXZCJZYF595RVN
HCTI_API_KEY=019c3691-737f-7fdb-90c5-5776f1afc7d8
```

## Non-Goals (Out of Scope for V1)

- User authentication / multi-user
- Database storage (using localStorage for V1)
- Deployment to production (local dev only for now)
- Client management portal
- Payment integration
- WhatsApp/email delivery
