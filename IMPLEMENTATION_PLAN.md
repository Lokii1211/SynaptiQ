# SkillTen Frontend Implementation Plan — Bible Part 2

## Phase 1: Foundation (FE-01) — Project Architecture ✅ CURRENT
- [ ] Install required packages (framer-motion, zustand, @monaco-editor/react)
- [ ] Update tailwind.config.ts with SkillTen design tokens
- [ ] Update layout.tsx with SkillTen branding + Inter font
- [ ] Create globals.css with design system variables
- [ ] Create API client pointing to Python backend (lib/api/client.ts)
- [ ] Create API modules: auth, assessment, coding, jobs, ai, profile
- [ ] Create Zustand stores: auth, assessment, ui
- [ ] Create utility files: india.ts, dates.ts, scoring.ts
- [ ] Create route constants
- [ ] Create UI components: Button, Card, Badge, Input, Modal, Progress, Skeleton, Toast

## Phase 2: Core Components (FE-02/FE-03) — Assessment
- [ ] Build QuestionCard component with auto-advance
- [ ] Build ProgressRing component
- [ ] Build TypewriterText component
- [ ] Build ResultsReveal with phased animation
- [ ] Build RadarChart (4D viz, SVG-based)
- [ ] Build CareerMatchCard
- [ ] Build assessment/page.tsx (full flow)
- [ ] Build results/page.tsx

## Phase 3: Layout & Navigation
- [ ] Build BottomNav (mobile)
- [ ] Build SideNav (desktop)
- [ ] Build TopBar
- [ ] Build PageWrapper
- [ ] Create (auth) route group layout
- [ ] Create (main) route group layout

## Phase 4: Feature Pages (FE-04/FE-05)
- [ ] Coding Arena with Monaco Editor
- [ ] Landing page (rebrand to SkillTen)
- [ ] Dashboard (connect to Python backend)
- [ ] Chat page (AI career advisor)
- [ ] Jobs page
- [ ] Career explorer pages
- [ ] Public profile page

## Phase 5: Polish
- [ ] Login/Signup pages (connect to backend)
- [ ] All remaining pages
- [ ] PWA manifest
- [ ] SEO optimization
