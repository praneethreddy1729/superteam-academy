# Superteam Academy -- Exhaustive Requirements Checklist

**Source**: [Superteam Bounty Listing](https://superteam.fun/earn/listing/superteam-academy) + `docs/SPEC.md` + `docs/INTEGRATION.md` + `docs/ARCHITECTURE.md`
**Generated**: 2026-03-04
**Purpose**: Audit reference for review agents. Every atomic requirement is numbered sequentially.

**Priority Key**:
- **MUST** -- Explicitly required by the bounty. Failure = disqualification or major scoring penalty.
- **SHOULD** -- Strongly implied or part of a required category. Expected by judges.
- **NICE** -- Bonus criteria or extra credit. Not required for completion.

---

## 1. Pages / Routes Required

> Bounty: "10 Core Pages Required"

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-001 | Landing Page at route `/` | MUST | "Landing Page (/): Hero with CTAs, learning paths, social proof, features, footer" |
| REQ-002 | Landing page hero section with call-to-action buttons | MUST | "Hero with CTAs" |
| REQ-003 | Landing page learning paths section | MUST | "learning paths" |
| REQ-004 | Landing page social proof section | MUST | "social proof" |
| REQ-005 | Landing page features section | MUST | "features" |
| REQ-006 | Landing page footer | MUST | "footer" |
| REQ-007 | Course Catalog page at route `/courses` | MUST | "Course Catalog (/courses): Filterable grid, curated paths, full-text search" |
| REQ-008 | Course catalog filterable grid layout | MUST | "Filterable grid" |
| REQ-009 | Course catalog curated learning paths | MUST | "curated paths" |
| REQ-010 | Course catalog full-text search | MUST | "full-text search" |
| REQ-011 | Course Detail page at route `/courses/[slug]` | MUST | "Course Detail (/courses/[slug]): Header, expandable modules, progress, reviews" |
| REQ-012 | Course detail header section | MUST | "Header" |
| REQ-013 | Course detail expandable modules/syllabus | MUST | "expandable modules" |
| REQ-014 | Course detail progress display | MUST | "progress" |
| REQ-015 | Course detail reviews section | MUST | "reviews" |
| REQ-016 | Lesson View page at route `/courses/[slug]/lessons/[id]` | MUST | "Lesson View (/courses/[slug]/lessons/[id]): Split layout (content + editor), markdown, navigation, hints" |
| REQ-017 | Lesson view split layout (content + code editor) | MUST | "Split layout (content + editor)" |
| REQ-018 | Lesson view markdown rendering | MUST | "markdown" |
| REQ-019 | Lesson view navigation (prev/next lesson) | MUST | "navigation" |
| REQ-020 | Lesson view hints system | MUST | "hints" |
| REQ-021 | Code Challenge view (within or alongside lesson) | MUST | "Code Challenge: Prompt, test cases, starter code, run button, output display" |
| REQ-022 | Code challenge prompt/description display | MUST | "Prompt" |
| REQ-023 | Code challenge test cases display | MUST | "test cases" |
| REQ-024 | Code challenge starter code | MUST | "starter code" |
| REQ-025 | Code challenge run button | MUST | "run button" |
| REQ-026 | Code challenge output display panel | MUST | "output display" |
| REQ-027 | Dashboard page at route `/dashboard` | MUST | "Dashboard (/dashboard): Active courses, XP/level, streaks, achievements, recommendations" |
| REQ-028 | Dashboard active courses list | MUST | "Active courses" |
| REQ-029 | Dashboard XP and level display | MUST | "XP/level" |
| REQ-030 | Dashboard streaks display | MUST | "streaks" |
| REQ-031 | Dashboard achievements display | MUST | "achievements" |
| REQ-032 | Dashboard course recommendations | MUST | "recommendations" |
| REQ-033 | Profile page at routes `/profile` and `/profile/[username]` | MUST | "Profile (/profile, /profile/[username]): Header, skill radar, badges, credentials, courses, visibility toggle" |
| REQ-034 | Profile header section | MUST | "Header" |
| REQ-035 | Profile skill radar chart | MUST | "skill radar" |
| REQ-036 | Profile badges display | MUST | "badges" |
| REQ-037 | Profile credentials (NFTs) display | MUST | "credentials" |
| REQ-038 | Profile completed courses display | MUST | "courses" |
| REQ-039 | Profile visibility/privacy toggle | MUST | "visibility toggle" |
| REQ-040 | Leaderboard page at route `/leaderboard` | MUST | "Leaderboard (/leaderboard): Global XP rankings, weekly/monthly/all-time filters, course filters" |
| REQ-041 | Leaderboard global XP rankings | MUST | "Global XP rankings" |
| REQ-042 | Leaderboard time-period filters (weekly/monthly/all-time) | MUST | "weekly/monthly/all-time filters" |
| REQ-043 | Leaderboard course-specific filters | MUST | "course filters" |
| REQ-044 | Settings page at route `/settings` | MUST | "Settings (/settings): Profile editing, account management, language/theme, privacy controls" |
| REQ-045 | Settings profile editing | MUST | "Profile editing" |
| REQ-046 | Settings account management | MUST | "account management" |
| REQ-047 | Settings language preference selector | MUST | "language/theme" |
| REQ-048 | Settings theme preference selector | MUST | "language/theme" |
| REQ-049 | Settings privacy controls | MUST | "privacy controls" |
| REQ-050 | Certificate View page at route `/certificates/[id]` | MUST | "Certificate View (/certificates/[id]): Visual certificate, on-chain verification, sharing, NFT details" |
| REQ-051 | Certificate visual rendering | MUST | "Visual certificate" |
| REQ-052 | Certificate on-chain verification display | MUST | "on-chain verification" |
| REQ-053 | Certificate social sharing functionality | MUST | "sharing" |
| REQ-054 | Certificate NFT details display (metadata, attributes) | MUST | "NFT details" |

---

## 2. Features Required

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-055 | Interactive, project-based courses | MUST | "Interactive, project-based courses with integrated code editing" |
| REQ-056 | Integrated code editing within courses | MUST | "integrated code editing" |
| REQ-057 | Learner progress tracking | MUST | "Learner progress tracking with gamification (XP, streaks, achievements)" |
| REQ-058 | On-chain credentials for course completion | MUST | "On-chain credentials for course completion" |
| REQ-059 | Internationalization (i18n) support for 3 locales | MUST | "Support for Portuguese, Spanish, and English" |
| REQ-060 | Portuguese (PT-BR) locale | MUST | "Portuguese" |
| REQ-061 | Spanish (ES) locale | MUST | "Spanish" |
| REQ-062 | English (EN) locale | MUST | "English" |
| REQ-063 | Analytics for user behavior insights | MUST | "Analytics for user behavior insights" |
| REQ-064 | Fully open-source codebase | MUST | "Fully open-source and forkable design" |
| REQ-065 | Forkable architecture/design | MUST | "forkable design" |
| REQ-066 | Externalized i18n strings (no hardcoded text) | MUST | "i18n for PT-BR, ES, EN with externalized strings" |
| REQ-067 | Light theme support | MUST | "light/dark themes" |
| REQ-068 | Dark theme support | MUST | "light/dark themes" |
| REQ-069 | Theme toggle (light/dark switching) | MUST | "light/dark themes" |
| REQ-070 | Account linking -- sign up with wallet OR Google OR GitHub | MUST | "Sign up with wallet OR Google OR GitHub" |
| REQ-071 | Link additional auth methods after signup | MUST | "Link additional auth methods later" |
| REQ-072 | Sign in with any linked method | MUST | "Use any linked method to sign in" |
| REQ-073 | Wallet linking required for course finalization and credentials | MUST | "Wallet linking required for course finalization and credentials" |

---

## 3. UI/UX Requirements

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-074 | Responsive design (mobile, tablet, desktop) | MUST | "responsive" in deliverables |
| REQ-075 | Dark mode as primary theme | MUST | "dark mode primary" in evaluation criteria |
| REQ-076 | Polished, intuitive UI | MUST | "Polished, intuitive, developer-focused" |
| REQ-077 | Developer-focused design aesthetic | MUST | "developer-focused" |
| REQ-078 | Lighthouse Accessibility score 95+ | MUST | "Accessibility: 95+" |
| REQ-079 | Lighthouse Performance score 90+ | MUST | "Performance: 90+" |
| REQ-080 | Lighthouse Best Practices score 95+ | MUST | "Best Practices: 95+" |
| REQ-081 | Lighthouse SEO score 90+ | MUST | "SEO: 90+" |
| REQ-082 | LCP (Largest Contentful Paint) under 2.5 seconds | MUST | "LCP < 2.5s" |
| REQ-083 | FID (First Input Delay) under 100ms | MUST | "FID < 100ms" |
| REQ-084 | CLS (Cumulative Layout Shift) under 0.1 | MUST | "CLS < 0.1" |
| REQ-085 | Image optimization | MUST | "Implement image optimization" |
| REQ-086 | Code splitting | MUST | "code splitting" |
| REQ-087 | Lazy loading | MUST | "lazy loading" |
| REQ-088 | Static generation where appropriate | MUST | "static generation" |
| REQ-089 | Bundle optimization | MUST | "bundle optimization" |
| REQ-090 | Pass/fail visual feedback for code challenges | MUST | "Pass/fail feedback for challenges" |

---

## 4. Technical Requirements -- Stack

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-091 | Frontend framework: React + Next.js 14+ (App Router) OR Vue 3 + Nuxt 3 OR Svelte + SvelteKit | MUST | "Frontend Framework (Choose One)" |
| REQ-092 | TypeScript in strict mode | MUST | "TypeScript in strict mode (no `any` types)" |
| REQ-093 | No `any` types in TypeScript | MUST | "(no `any` types)" |
| REQ-094 | Tailwind CSS with custom theme | MUST | "Tailwind CSS with custom theme and design tokens" |
| REQ-095 | Design tokens defined in Tailwind config | MUST | "design tokens" |
| REQ-096 | Component library: shadcn/ui, Radix, or Headless UI | MUST | "Component library: shadcn/ui, Radix, or Headless UI" |
| REQ-097 | Headless CMS: Sanity, Strapi, or Contentful | MUST | "Headless CMS: Sanity, Strapi, or Contentful" |
| REQ-098 | CMS configured with content schema | MUST | "Configured with content schema and sample course" |
| REQ-099 | CMS populated with at least one sample course | MUST | "sample course" |
| REQ-100 | Solana Wallet Adapter (multi-wallet support) | MUST | "Solana Wallet Adapter (multi-wallet)" |
| REQ-101 | Google sign-in authentication | MUST | "Google sign-in" |
| REQ-102 | GitHub sign-in authentication | SHOULD | "GitHub optional" |
| REQ-103 | Google Analytics 4 (GA4) integration | MUST | "GA4 + heatmap solution" |
| REQ-104 | GA4 custom events | MUST | "GA4 with custom events" |
| REQ-105 | Heatmap solution: Hotjar, PostHog, or Clarity | MUST | "heatmap solution (Hotjar/PostHog/Clarity)" |
| REQ-106 | Sentry error monitoring | MUST | "Sentry" |
| REQ-107 | Deployment on Vercel or Netlify | MUST | "Vercel/Netlify deployment" |
| REQ-108 | Preview deployment environments (per PR or branch) | MUST | "preview environments" |

---

## 5. Technical Requirements -- Code Editor

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-109 | Integrated code editor: Solana Playground embed, Monaco Editor, or CodeMirror 6 | MUST | "Choose one: embedded Solana Playground, Monaco Editor, or CodeMirror 6" |
| REQ-110 | Rust syntax highlighting in editor | MUST | "Must support Rust/TypeScript/JSON syntax highlighting" |
| REQ-111 | TypeScript syntax highlighting in editor | MUST | "Rust/TypeScript/JSON" |
| REQ-112 | JSON syntax highlighting in editor | MUST | "Rust/TypeScript/JSON" |
| REQ-113 | Basic autocompletion in editor | MUST | "Basic autocompletion" |
| REQ-114 | Error display in editor | MUST | "error display" |
| REQ-115 | Pass/fail feedback mechanism for challenges | MUST | "Pass/fail feedback for challenges" |

---

## 6. On-Chain Requirements

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-116 | XP as soulbound fungible tokens (Token-2022, NonTransferable) | MUST | "XP as soulbound fungible tokens (Token-2022, NonTransferable)" |
| REQ-117 | Level calculation formula: `Level = floor(sqrt(xp / 100))` | MUST | "Level calculation: Level = floor(sqrt(xp / 100))" |
| REQ-118 | Credentials as Metaplex Core NFTs with PermanentFreezeDelegate (soulbound) | MUST | "Credentials as Metaplex Core NFTs with PermanentFreezeDelegate" |
| REQ-119 | Courses stored as on-chain PDAs | MUST | "Courses as on-chain PDAs with per-learner Enrollment PDAs" |
| REQ-120 | Per-learner Enrollment PDAs | MUST | "per-learner Enrollment PDAs" |
| REQ-121 | Lesson progress tracked via 256-bit bitmap | MUST | "Lesson progress tracked via 256-bit bitmap" |
| REQ-122 | Streaks managed frontend-only (local storage or database) | MUST | "Streaks managed frontend-only via local storage/database" |
| REQ-123 | Achievements using 256-bit bitmap with soulbound NFT backing | MUST | "Achievements using 256-bit bitmap with soulbound NFT backing" |
| REQ-124 | Leaderboard derived by indexing XP balances | MUST | "Leaderboard derived by indexing XP balances" |

---

## 7. On-Chain -- Implement vs. Stub

### 7a. Fully Implement on Devnet

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-125 | Multi-wallet authentication (fully working) | MUST | "Fully Implement on Devnet: Multi-wallet authentication" |
| REQ-126 | XP balance display from Token-2022 accounts | MUST | "XP balance display from Token-2022 accounts" |
| REQ-127 | Metaplex Core NFT credential display | MUST | "Metaplex Core NFT credential display and verification" |
| REQ-128 | Metaplex Core NFT credential verification | MUST | "credential display and verification" |
| REQ-129 | Leaderboard by XP balance indexing | MUST | "Leaderboard by XP balance indexing" |
| REQ-130 | Direct learner-signed course enrollment transactions | MUST | "Direct learner-signed course enrollment transactions" |

### 7b. Stub with Clean Abstractions

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-131 | Lesson completion flow stub (backend-signed transactions) | MUST | "Stub with Clean Abstractions: Lesson completion flow (backend-signed transactions)" |
| REQ-132 | Course finalization stub | MUST | "Course finalization and credential issuance" |
| REQ-133 | Credential issuance stub | MUST | "credential issuance" |
| REQ-134 | Achievement claiming stub | MUST | "Achievement claiming" |
| REQ-135 | Streak tracking frontend features stub | MUST | "Streak tracking frontend features" |
| REQ-136 | Clean service abstraction layer (stubs must have clean interfaces for future real implementation) | MUST | "Stub with Clean Abstractions" -- implies service interface pattern |

---

## 8. Authentication Requirements

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-137 | Solana wallet sign-in (Wallet Adapter, multi-wallet) | MUST | "Solana Wallet Adapter (multi-wallet)" |
| REQ-138 | Google OAuth sign-in | MUST | "Google sign-in" |
| REQ-139 | GitHub OAuth sign-in | SHOULD | "(GitHub optional)" |
| REQ-140 | Sign up with any single method (wallet, Google, or GitHub) | MUST | "Sign up with wallet OR Google OR GitHub" |
| REQ-141 | Link additional auth methods to existing account | MUST | "Link additional auth methods later" |
| REQ-142 | Sign in with any previously linked method | MUST | "Use any linked method to sign in" |
| REQ-143 | Wallet required for on-chain operations (enrollment, credentials) | MUST | "Wallet linking required for course finalization and credentials" |
| REQ-144 | Easy signup flow for demo (judges must be able to sign up easily) | MUST | "Live Demo URL with easy signup and Devnet wallet access" |
| REQ-145 | Devnet wallet access for demo | MUST | "Devnet wallet access" |

---

## 9. Gamification Requirements

### 9a. XP System

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-146 | XP earning on lesson completion: 10-50 XP (difficulty-based) | MUST | "Complete lesson: 10-50 XP (difficulty-based)" |
| REQ-147 | XP earning on challenge completion: 25-100 XP | MUST | "Complete challenge: 25-100 XP" |
| REQ-148 | XP earning on course completion: 500-2000 XP | MUST | "Complete course: 500-2,000 XP" |
| REQ-149 | Daily streak bonus: 10 XP | MUST | "Daily streak bonus: 10 XP" |
| REQ-150 | First daily completion bonus: 25 XP | MUST | "First daily completion: 25 XP" |
| REQ-151 | XP level calculation: `Level = floor(sqrt(xp / 100))` | MUST | "Level = floor(sqrt(xp / 100))" |
| REQ-152 | XP balance displayed in dashboard | MUST | "XP/level" on dashboard |
| REQ-153 | Level displayed alongside XP | MUST | "XP/level" on dashboard |

### 9b. Streaks

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-154 | Track consecutive days with activity | MUST | "Track consecutive days with activity" |
| REQ-155 | Visual calendar showing streak history | MUST | "Visual calendar showing history" |
| REQ-156 | Streak freeze feature | SHOULD | "Streak freeze (bonus feature)" |
| REQ-157 | Streak milestone rewards at 7 days | MUST | "Milestone rewards at 7, 30, and 100 days" |
| REQ-158 | Streak milestone rewards at 30 days | MUST | "Milestone rewards at 7, 30, and 100 days" |
| REQ-159 | Streak milestone rewards at 100 days | MUST | "Milestone rewards at 7, 30, and 100 days" |
| REQ-160 | Streaks managed via local storage or CMS (frontend-only) | MUST | "Frontend-managed via local storage or CMS" |

### 9c. Achievements / Badges

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-161 | Achievement category: Progress (e.g., "First Steps," "Course Completer," "Speed Runner") | MUST | "Progress: First Steps, Course Completer, Speed Runner" |
| REQ-162 | "First Steps" achievement | MUST | Listed explicitly |
| REQ-163 | "Course Completer" achievement | MUST | Listed explicitly |
| REQ-164 | "Speed Runner" achievement | MUST | Listed explicitly |
| REQ-165 | Achievement category: Streaks (e.g., "Week Warrior," "Monthly Master," "Consistency King") | MUST | "Streaks: Week Warrior, Monthly Master, Consistency King" |
| REQ-166 | "Week Warrior" achievement | MUST | Listed explicitly |
| REQ-167 | "Monthly Master" achievement | MUST | Listed explicitly |
| REQ-168 | "Consistency King" achievement | MUST | Listed explicitly |
| REQ-169 | Achievement category: Skills (e.g., "Rust Rookie," "Anchor Expert," "Full Stack Solana") | MUST | "Skills: Rust Rookie, Anchor Expert, Full Stack Solana" |
| REQ-170 | "Rust Rookie" achievement | MUST | Listed explicitly |
| REQ-171 | "Anchor Expert" achievement | MUST | Listed explicitly |
| REQ-172 | "Full Stack Solana" achievement | MUST | Listed explicitly |
| REQ-173 | Achievement category: Community (e.g., "Helper," "First Comment," "Top Contributor") | MUST | "Community: Helper, First Comment, Top Contributor" |
| REQ-174 | "Helper" achievement | MUST | Listed explicitly |
| REQ-175 | "First Comment" achievement | MUST | Listed explicitly |
| REQ-176 | "Top Contributor" achievement | MUST | Listed explicitly |
| REQ-177 | Achievement category: Special (e.g., "Early Adopter," "Bug Hunter," "Perfect Score") | MUST | "Special: Early Adopter, Bug Hunter, Perfect Score" |
| REQ-178 | "Early Adopter" achievement | MUST | Listed explicitly |
| REQ-179 | "Bug Hunter" achievement | MUST | Listed explicitly |
| REQ-180 | "Perfect Score" achievement | MUST | Listed explicitly |

---

## 10. Content Requirements

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-181 | CMS content schema for courses | MUST | "Configured with content schema" |
| REQ-182 | At least one sample course in CMS | MUST | "sample course" |
| REQ-183 | Course structure: modules containing lessons | MUST | "expandable modules" on course detail |
| REQ-184 | Lesson content in markdown format | MUST | "markdown" on lesson view |
| REQ-185 | Code challenges associated with lessons | MUST | "Code Challenge" as a page/view |
| REQ-186 | Challenge test cases (pass/fail) | MUST | "test cases" |
| REQ-187 | Challenge starter code | MUST | "starter code" |
| REQ-188 | Course difficulty levels | MUST | "difficulty-based" XP implies difficulty levels |
| REQ-189 | Course tracks (e.g., Anchor track, DeFi track) | MUST | Spec: "one credential NFT per learner per track" |
| REQ-190 | Course prerequisites support | MUST | Spec: "prerequisite" field on Course PDA |

---

## 11. Integration Requirements

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-191 | GA4 integration with custom events tracking | MUST | "GA4 with custom events" |
| REQ-192 | Heatmap solution integration (Hotjar/PostHog/Clarity) | MUST | "heatmap solution (Hotjar/PostHog/Clarity)" |
| REQ-193 | Sentry error monitoring integration | MUST | "Sentry monitoring" |
| REQ-194 | Headless CMS integration (Sanity/Strapi/Contentful) | MUST | "CMS: Configured with content schema" |
| REQ-195 | Solana Wallet Adapter integration | MUST | "Solana Wallet Adapter (multi-wallet)" |
| REQ-196 | Helius DAS API for credential NFT queries | SHOULD | INTEGRATION.md: "Helius DAS API" |
| REQ-197 | Helius DAS API for XP leaderboard indexing | SHOULD | ARCHITECTURE.md: "getTokenHolders" |
| REQ-198 | Anchor client integration for on-chain reads | MUST | INTEGRATION.md: full Anchor client setup |
| REQ-199 | Token-2022 ATA balance querying for XP display | MUST | "XP balance display from Token-2022 accounts" |

---

## 12. Documentation Requirements

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-200 | README.md: project overview | MUST | "README.md: Overview, tech stack, dev setup, env vars, deployment" |
| REQ-201 | README.md: tech stack description | MUST | "tech stack" |
| REQ-202 | README.md: development setup instructions | MUST | "dev setup" |
| REQ-203 | README.md: environment variables documentation | MUST | "env vars" |
| REQ-204 | README.md: deployment instructions | MUST | "deployment" |
| REQ-205 | ARCHITECTURE.md: system architecture overview | MUST | "ARCHITECTURE.md: System architecture, components, data flow, service interfaces" |
| REQ-206 | ARCHITECTURE.md: component descriptions | MUST | "components" |
| REQ-207 | ARCHITECTURE.md: data flow diagrams | MUST | "data flow" |
| REQ-208 | ARCHITECTURE.md: service interfaces documentation | MUST | "service interfaces" |
| REQ-209 | CMS_GUIDE.md: course creation/editing guide | MUST | "CMS_GUIDE.md: Course creation/editing, content schema, publishing workflow" |
| REQ-210 | CMS_GUIDE.md: content schema documentation | MUST | "content schema" |
| REQ-211 | CMS_GUIDE.md: publishing workflow | MUST | "publishing workflow" |
| REQ-212 | CUSTOMIZATION.md: theme customization guide | MUST | "CUSTOMIZATION.md: Theme customization, adding languages, extending gamification" |
| REQ-213 | CUSTOMIZATION.md: adding new languages guide | MUST | "adding languages" |
| REQ-214 | CUSTOMIZATION.md: extending gamification guide | MUST | "extending gamification" |

---

## 13. Submission / Deliverable Requirements

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-215 | Pull Request to github.com/solanabr/superteam-academy | MUST | "PR Link to github.com/solanabr/superteam-academy" -- DISQUALIFIED if missing |
| REQ-216 | PR contains full frontend implementation | MUST | "Pull Request ... with full frontend" |
| REQ-217 | Live Demo URL deployed on Vercel or Netlify | MUST | "Live Demo URL with easy signup and Devnet wallet access" -- DISQUALIFIED if missing |
| REQ-218 | Demo has easy signup (judges won't build locally) | MUST | "easy signup" + "Building each project locally is a big security risk, so we won't take the extra time to do so" |
| REQ-219 | Demo has Devnet wallet access | MUST | "Devnet wallet access" |
| REQ-220 | Demo Video: 3-5 minutes long | MUST | "Demo Video (3-5 min)" -- DISQUALIFIED if missing |
| REQ-221 | Demo video: feature walkthrough | MUST | "feature walkthrough" |
| REQ-222 | Demo video: architecture overview | MUST | "architecture overview" |
| REQ-223 | Twitter/X post sharing submission | MUST | "Twitter Post tagging @SuperteamBR" -- DISQUALIFIED if missing |
| REQ-224 | Twitter post tags @SuperteamBR | MUST | "tagging @SuperteamBR" |
| REQ-225 | All 10 pages functional in production app | MUST | "All 10 pages functional" |
| REQ-226 | Wallet authentication working in production | MUST | "wallet auth" |
| REQ-227 | Gamification system working in production | MUST | "gamification" |
| REQ-228 | Code editor working in production | MUST | "code editor" |
| REQ-229 | i18n working (PT-BR, ES, EN) in production | MUST | "i18n (PT-BR/ES/EN)" |
| REQ-230 | Light and dark themes working in production | MUST | "light/dark themes" |
| REQ-231 | Responsive design working in production | MUST | "responsive" |
| REQ-232 | Lighthouse targets met in production | MUST | "Lighthouse targets met" |
| REQ-233 | MIT license on codebase | MUST | "Code must be open-source (MIT license)" |
| REQ-234 | Original work (no plagiarism) | MUST | "All submissions must be original work" |

---

## 14. Evaluation Criteria (Scoring Weights)

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-235 | Code Quality and Architecture (25% weight) | MUST | "Code Quality & Architecture (25%): Clean, typed, well-structured, maintainable, clean service abstractions" |
| REQ-236 | Clean code | MUST | "Clean" |
| REQ-237 | Well-typed code (TypeScript strict, no `any`) | MUST | "typed" |
| REQ-238 | Well-structured code organization | MUST | "well-structured" |
| REQ-239 | Maintainable architecture | MUST | "maintainable" |
| REQ-240 | Clean service abstractions (especially for stubs) | MUST | "clean service abstractions" |
| REQ-241 | Feature Completeness (25% weight) | MUST | "Feature Completeness (25%): All required features working correctly" |
| REQ-242 | All required features working correctly | MUST | "All required features working correctly" |
| REQ-243 | UI/UX Design (20% weight) | MUST | "UI/UX Design (20%): Polished, intuitive, developer-focused, dark mode primary" |
| REQ-244 | Performance (15% weight) | MUST | "Performance (15%): Lighthouse scores, load times, responsiveness" |
| REQ-245 | Documentation (10% weight) | MUST | "Documentation (10%): Clear, comprehensive, useful for future developers" |
| REQ-246 | Documentation must be clear | MUST | "Clear" |
| REQ-247 | Documentation must be comprehensive | MUST | "comprehensive" |
| REQ-248 | Documentation must be useful for future developers | MUST | "useful for future developers" |
| REQ-249 | Bonus Features (5% weight) | NICE | "Bonus Features (5%): Additional features beyond requirements" |

---

## 15. Bonus / Extra Features

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-250 | Admin dashboard for course/user analytics | NICE | "Admin dashboard for course/user analytics" |
| REQ-251 | End-to-end tests (Playwright or Cypress) | NICE | "E2E tests (Playwright/Cypress)" |
| REQ-252 | Community/forum with discussion threads | NICE | "Community/forum with discussion threads" |
| REQ-253 | Onboarding flow with skill assessment quiz | NICE | "Onboarding with skill assessment quiz" |
| REQ-254 | PWA support (installable app) | NICE | "PWA support (installable, offline)" |
| REQ-255 | PWA offline support | NICE | "offline" |
| REQ-256 | Advanced gamification: daily challenges | NICE | "Advanced gamification (daily challenges, seasonal events)" |
| REQ-257 | Advanced gamification: seasonal events | NICE | "seasonal events" |
| REQ-258 | CMS course creator dashboard | NICE | "CMS course creator dashboard" |
| REQ-259 | Actual devnet program integration (beyond stubs) | NICE | "Actual devnet program integration" |

---

## 16. Implicit Requirements

These are not explicitly stated but are strongly implied by the bounty context, evaluation criteria, or industry standards for a production-quality Solana education platform.

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-260 | Mobile-responsive layout (not just desktop) | SHOULD | "responsive" in deliverables implies mobile support |
| REQ-261 | Loading states / skeleton screens for async data | SHOULD | Implied by "polished, intuitive" UI criteria |
| REQ-262 | Error states and error boundaries | SHOULD | Implied by "maintainable" architecture + Sentry integration |
| REQ-263 | Empty states for pages with no data | SHOULD | Implied by "polished" UI |
| REQ-264 | 404 / Not Found page | SHOULD | Implied by "10 pages functional" -- navigation between them needs fallback |
| REQ-265 | Proper SEO meta tags per page | SHOULD | "SEO: 90+" Lighthouse score requires meta tags |
| REQ-266 | Open Graph / social sharing meta tags | SHOULD | Certificate "sharing" feature implies OG tags |
| REQ-267 | Proper heading hierarchy (h1, h2, etc.) | SHOULD | "Accessibility: 95+" requires semantic HTML |
| REQ-268 | Keyboard navigation support | SHOULD | "Accessibility: 95+" requires keyboard nav |
| REQ-269 | ARIA labels on interactive elements | SHOULD | "Accessibility: 95+" requires ARIA |
| REQ-270 | Color contrast compliance (WCAG AA minimum) | SHOULD | "Accessibility: 95+" requires contrast |
| REQ-271 | Wallet disconnect / logout functionality | SHOULD | Implied by wallet auth -- users must be able to disconnect |
| REQ-272 | Session persistence (stay logged in across refreshes) | SHOULD | Implied by auth system |
| REQ-273 | Toast / notification system for feedback | SHOULD | Implied by "polished" UI -- user needs feedback on actions |
| REQ-274 | Confirmation dialogs for destructive actions | SHOULD | Implied by "polished" UX |
| REQ-275 | Environment variable configuration (not hardcoded secrets) | SHOULD | README must document "env vars" |
| REQ-276 | Protected routes (dashboard, settings require auth) | SHOULD | Implied by auth + profile system |
| REQ-277 | Redirect to login for unauthenticated access to protected pages | SHOULD | Implied by auth system |
| REQ-278 | XP animation / visual feedback on earning XP | SHOULD | Implied by gamification + "polished" UI |
| REQ-279 | Progress bar on course/lesson pages | SHOULD | "progress" on course detail page |
| REQ-280 | Breadcrumb navigation on nested pages | SHOULD | Implied by deep nesting: /courses/[slug]/lessons/[id] |
| REQ-281 | Favicon and app icons | SHOULD | Implied by "SEO: 90+" and production deployment |
| REQ-282 | Proper TypeScript types/interfaces for all data models | SHOULD | "TypeScript in strict mode" |
| REQ-283 | API route handlers for backend-signed operations | SHOULD | Stubs need API routes even if mocked |
| REQ-284 | Rate limiting awareness on frontend | SHOULD | Spec: "Rate limiting and fraud detection handled off-chain" |
| REQ-285 | Wallet-aware UI (show/hide features based on wallet connection) | SHOULD | Implied by wallet-gated operations |
| REQ-286 | Proper font loading strategy (no FOUT/FOIT) | SHOULD | Implied by "Performance: 90+" |
| REQ-287 | Content Security Policy headers | SHOULD | Implied by "Best Practices: 95+" |
| REQ-288 | Preview deployments per PR (CI/CD) | MUST | "preview environments" explicitly stated |
| REQ-289 | Course enrollment transaction signing UX (approve in wallet) | SHOULD | "Direct learner-signed course enrollment transactions" implies wallet popup |
| REQ-290 | Multiple wallet support (Phantom, Backpack, Solflare, etc.) | SHOULD | "multi-wallet" + Spec mentions "Phantom, Backpack, and Solflare" |

---

## 17. On-Chain Program Spec Requirements (from SPEC.md)

These are on-chain program requirements documented in the spec. The bounty says the program already exists in the repo; the frontend must integrate with it.

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-291 | Frontend must use program ID `ACADBRCB3zGvo1KSCbkztS33ZNzeBv2d7bqGceti3ucf` | MUST | INTEGRATION.md |
| REQ-292 | PDA derivation for Config: `["config"]` | MUST | INTEGRATION.md: PDA Derivation section |
| REQ-293 | PDA derivation for Course: `["course", course_id]` | MUST | INTEGRATION.md |
| REQ-294 | PDA derivation for Enrollment: `["enrollment", course_id, user]` | MUST | INTEGRATION.md |
| REQ-295 | Frontend reads Course accounts via `program.account.course.all()` | MUST | INTEGRATION.md: "List all courses" |
| REQ-296 | Frontend reads Enrollment via `fetchNullable(enrollmentPda)` | MUST | INTEGRATION.md |
| REQ-297 | Frontend reads XP via Token-2022 ATA `getTokenAccountBalance` | MUST | INTEGRATION.md: "XP Balance" |
| REQ-298 | Frontend creates enrollment TX with `program.methods.enroll(courseId)` | MUST | INTEGRATION.md: learner-signed |
| REQ-299 | Frontend handles prerequisite checking (remaining accounts pattern) | SHOULD | INTEGRATION.md: enroll with prerequisites |
| REQ-300 | Frontend can call `close_enrollment` for learner | SHOULD | INTEGRATION.md: learner-signed |
| REQ-301 | Lesson bitmap helper functions (isLessonComplete, countCompletedLessons) | SHOULD | INTEGRATION.md: "Lesson Bitmap Helpers" |
| REQ-302 | Error handling for on-chain error codes (LessonAlreadyCompleted, CourseNotActive, etc.) | SHOULD | INTEGRATION.md: "Error Handling" |
| REQ-303 | Credential queries via Helius DAS `getAssetsByOwner` | SHOULD | INTEGRATION.md: "Credential Queries" |
| REQ-304 | Event listening for program events (LessonCompleted, CourseFinalized, etc.) | NICE | INTEGRATION.md: "Events" |

---

## 18. FAQ-Derived Requirements

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-305 | Frontend must have clean service interfaces for on-chain migration | MUST | "build frontend with clean service interfaces" |
| REQ-306 | Additional libraries allowed if no conflict with required stack | SHOULD | "Additional libraries allowed if they don't conflict with requirements" |
| REQ-307 | Course content provided; build platform and CMS structure around it | MUST | "Course content provided; build platform and CMS structure" |
| REQ-308 | Supabase acceptable for MVP (with clean abstractions) | SHOULD | "Supabase acceptable for MVP with clean abstractions for later on-chain migration" |
| REQ-309 | Polished subset beats buggy complete set | SHOULD | "Polished subset beats buggy complete set if time-constrained" |
| REQ-310 | Portuguese and Spanish submissions welcome (UI text in those locales) | SHOULD | "Portuguese/Spanish submissions welcome" |

---

---

## 19. REVIEWER ADDITIONS [ADDED BY REVIEWER]

> **Audit date**: 2026-03-04
> **Methodology**: Line-by-line comparison of bounty page text, SPEC.md, INTEGRATION.md, and ARCHITECTURE.md against REQ-001 through REQ-310. Every phrase, sub-phrase, and implied atomic requirement was verified. Missing items are added below with new REQ numbers.

### 19a. Landing Page — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-311 | Hero section must include a "value proposition" statement | MUST | "Hero section with value proposition and primary CTAs" — REQ-002 says "CTAs" but not "value proposition" |
| REQ-312 | Landing page hero CTA: "Sign Up" button specifically | MUST | "(Sign Up, Explore Courses)" — specific CTA names given |
| REQ-313 | Landing page hero CTA: "Explore Courses" button specifically | MUST | "(Sign Up, Explore Courses)" — specific CTA names given |
| REQ-314 | Landing page learning path previews must include "progression indicators" | MUST | "Learning path previews with progression indicators" — REQ-003 omits "progression indicators" |
| REQ-315 | Landing page social proof: testimonials section | MUST | "Social proof: testimonials, partner logos, completion statistics" — merged into REQ-004 |
| REQ-316 | Landing page social proof: partner logos | MUST | "partner logos" — merged into REQ-004 |
| REQ-317 | Landing page social proof: completion statistics | MUST | "completion statistics" — merged into REQ-004 |
| REQ-318 | Landing page footer: social channels links | MUST | "Footer with links, social channels, newsletter signup" — REQ-006 just says "footer" |
| REQ-319 | Landing page footer: newsletter signup form | MUST | "newsletter signup" — REQ-006 just says "footer" |
| REQ-320 | Landing page footer: navigation links | MUST | "Footer with links" — generic links not itemized |

### 19b. Course Catalog — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-321 | Course catalog: filter by difficulty | MUST | "Filterable grid by difficulty, topic, duration" — REQ-008 says "filterable grid" but not each filter |
| REQ-322 | Course catalog: filter by topic | MUST | "Filterable grid by difficulty, topic, duration" |
| REQ-323 | Course catalog: filter by duration | MUST | "Filterable grid by difficulty, topic, duration" |
| REQ-324 | Course catalog: curated paths include "Solana Fundamentals" path | SHOULD | "Curated learning paths ('Solana Fundamentals,' 'DeFi Developer')" — specific names given |
| REQ-325 | Course catalog: curated paths include "DeFi Developer" path | SHOULD | "Curated learning paths ('Solana Fundamentals,' 'DeFi Developer')" |
| REQ-326 | Course card must show: thumbnail | MUST | "Course cards: thumbnail, title, description, difficulty, duration, progress %" |
| REQ-327 | Course card must show: title | MUST | "Course cards: thumbnail, title, description, difficulty, duration, progress %" |
| REQ-328 | Course card must show: description | MUST | "Course cards: thumbnail, title, description, difficulty, duration, progress %" |
| REQ-329 | Course card must show: difficulty badge | MUST | "Course cards: thumbnail, title, description, difficulty, duration, progress %" |
| REQ-330 | Course card must show: duration | MUST | "Course cards: thumbnail, title, description, difficulty, duration, progress %" |
| REQ-331 | Course card must show: progress percentage | MUST | "Course cards: thumbnail, title, description, difficulty, duration, progress %" |

### 19c. Course Detail — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-332 | Course detail header: title display | MUST | "Header: title, description, instructor, duration, difficulty" — REQ-012 says "header section" generically |
| REQ-333 | Course detail header: description display | MUST | "Header: title, description, instructor, duration, difficulty" |
| REQ-334 | Course detail header: instructor display | MUST | "Header: title, description, instructor, duration, difficulty" — NOT in original checklist |
| REQ-335 | Course detail header: duration display | MUST | "Header: title, description, instructor, duration, difficulty" |
| REQ-336 | Course detail header: difficulty display | MUST | "Header: title, description, instructor, duration, difficulty" |
| REQ-337 | Course detail: expandable module/lesson list with completion status badges | MUST | "Expandable module/lesson list with completion status badges" — REQ-013 omits "completion status badges" |
| REQ-338 | Course detail: progress bar display | MUST | "Progress bar and total XP to earn display" — REQ-014 says "progress" generically |
| REQ-339 | Course detail: total XP to earn display | MUST | "total XP to earn display" — NOT in original checklist |
| REQ-340 | Course detail: enrollment CTA button | MUST | "Enrollment CTA button" — NOT in original checklist |
| REQ-341 | Course detail: reviews section is static/mock for MVP | MUST | "Reviews section (static for MVP)" — REQ-015 says "reviews" but doesn't note static |

### 19d. Lesson View — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-342 | Lesson view: split layout must be resizable (drag handle) | MUST | "Split layout: content (left) + code editor (right), resizable" — REQ-017 omits "resizable" |
| REQ-343 | Lesson view: markdown rendering with syntax highlighting | MUST | "Markdown rendering with syntax highlighting" — REQ-018 says "markdown rendering" only |
| REQ-344 | Lesson view: module overview sidebar | MUST | "Previous/Next navigation with module overview sidebar" — REQ-019 says "navigation" only |
| REQ-345 | Lesson view: auto-save for lesson completion tracking | MUST | "Lesson completion tracking with auto-save" — NOT in original checklist |
| REQ-346 | Lesson view: solution toggle (separate from hints) | MUST | "Expandable hints and solution toggle" — REQ-020 says "hints system" but "solution toggle" is distinct |

### 19e. Code Challenge — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-347 | Code challenge: prompt includes clear objectives | MUST | "Challenge prompt with clear objectives and expected output" |
| REQ-348 | Code challenge: expected output shown in prompt | MUST | "expected output" |
| REQ-349 | Code challenge: test cases must show pass/fail indicators | MUST | "Visible test cases with pass/fail indicators" — REQ-023 says "test cases display" only |
| REQ-350 | Code challenge: starter code must be editable | MUST | "Pre-populated starter code (editable)" — REQ-024 says "starter code" only |
| REQ-351 | Code challenge: run button must show loading state | MUST | "Run button with loading state and output display" — REQ-025 says "run button" only |
| REQ-352 | Code challenge: real-time error messages | MUST | "Real-time error messages and success celebration" — NOT in original checklist |
| REQ-353 | Code challenge: success celebration animation/feedback | MUST | "success celebration" — NOT in original checklist |
| REQ-354 | Code challenge: "Mark complete" button | MUST | "Mark complete button and XP award confirmation" — NOT in original checklist |
| REQ-355 | Code challenge: XP award confirmation display after completion | MUST | "XP award confirmation" — NOT in original checklist |

### 19f. Dashboard — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-356 | Dashboard: each active course shows completion percentage | MUST | "Current courses with completion % and next lesson CTA" — REQ-028 says "active courses list" only |
| REQ-357 | Dashboard: each active course has a "next lesson" CTA | MUST | "next lesson CTA" — NOT in original checklist |
| REQ-358 | Dashboard: level progress bar (XP toward next level) | MUST | "XP balance display, level progress bar, rank visualization" — REQ-029 says "XP and level display" |
| REQ-359 | Dashboard: rank visualization | MUST | "rank visualization" — NOT in original checklist |
| REQ-360 | Dashboard: streak calendar visualization | MUST | "Current streak with calendar visualization" — REQ-030 says "streaks display" only |
| REQ-361 | Dashboard: recent achievements and badges showcase | MUST | "Recent achievements and badges showcase" — REQ-031 says "achievements display" |
| REQ-362 | Dashboard: recent activity feed | MUST | "Recent activity feed" — NOT in original checklist |

### 19g. Profile — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-363 | Profile header: avatar display | MUST | "Profile header: avatar, name, bio, social links, join date" — REQ-034 says "header section" |
| REQ-364 | Profile header: name display | MUST | "avatar, name, bio, social links, join date" |
| REQ-365 | Profile header: bio display | MUST | "avatar, name, bio, social links, join date" |
| REQ-366 | Profile header: social links | MUST | "avatar, name, bio, social links, join date" |
| REQ-367 | Profile header: join date | MUST | "avatar, name, bio, social links, join date" |
| REQ-368 | Skill radar chart axes: Rust, Anchor, Frontend, Security (at minimum) | MUST | "Skill radar chart (Rust, Anchor, Frontend, Security, etc.)" — specific skills named |
| REQ-369 | Profile: on-chain credential display shows evolving cNFTs | MUST | "On-chain credential display: evolving cNFTs with track, level, verification links" — REQ-037 says "credentials display" |
| REQ-370 | Profile: credential shows track | MUST | "track, level, verification links" |
| REQ-371 | Profile: credential shows level | MUST | "track, level, verification links" |
| REQ-372 | Profile: credential shows verification links (to Solana Explorer) | MUST | "verification links" — NOT in original checklist |

### 19h. Leaderboard — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-373 | Leaderboard: user cards showing rank number | MUST | "User cards: rank, avatar, name, XP, level, streak" — REQ-041 says "global XP rankings" |
| REQ-374 | Leaderboard: user cards showing avatar | MUST | "User cards: rank, avatar, name, XP, level, streak" |
| REQ-375 | Leaderboard: user cards showing name | MUST | "User cards: rank, avatar, name, XP, level, streak" |
| REQ-376 | Leaderboard: user cards showing XP | MUST | "User cards: rank, avatar, name, XP, level, streak" |
| REQ-377 | Leaderboard: user cards showing level | MUST | "User cards: rank, avatar, name, XP, level, streak" |
| REQ-378 | Leaderboard: user cards showing streak count | MUST | "User cards: rank, avatar, name, XP, level, streak" |
| REQ-379 | Leaderboard: current user row highlighted with distinct styling | MUST | "Current user highlighted with distinct styling" — NOT in original checklist |

### 19i. Settings — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-380 | Settings profile editing: name field | MUST | "Profile editing: name, bio, avatar, social links" — REQ-045 says "profile editing" generically |
| REQ-381 | Settings profile editing: bio field | MUST | "name, bio, avatar, social links" |
| REQ-382 | Settings profile editing: avatar upload/selection | MUST | "name, bio, avatar, social links" |
| REQ-383 | Settings profile editing: social links | MUST | "name, bio, avatar, social links" |
| REQ-384 | Settings account: email management | MUST | "Account management: email, connected wallets, Google/GitHub auth" — REQ-046 says "account management" generically |
| REQ-385 | Settings account: connected wallets management | MUST | "connected wallets" — NOT itemized |
| REQ-386 | Settings account: Google/GitHub auth linking | MUST | "Google/GitHub auth" |
| REQ-387 | Settings preferences: notification settings | MUST | "Preferences: language, theme, notifications" — REQ-047/048 cover language/theme, notifications missing |
| REQ-388 | Settings privacy: profile visibility toggle | MUST | "Privacy controls: profile visibility, data export option" — REQ-049 says "privacy controls" |
| REQ-389 | Settings privacy: data export option | MUST | "data export option" — NOT in original checklist |

### 19j. Certificate — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-390 | Certificate: shows course name | MUST | "Visual certificate with course name, date, recipient" — REQ-051 says "visual rendering" |
| REQ-391 | Certificate: shows completion date | MUST | "course name, date, recipient" |
| REQ-392 | Certificate: shows recipient name | MUST | "course name, date, recipient" |
| REQ-393 | Certificate: on-chain verification links to Solana Explorer | MUST | "On-chain verification link to Solana Explorer" — REQ-052 says "on-chain verification display" |
| REQ-394 | Certificate: downloadable image option | MUST | "downloadable image option" — NOT in original checklist |
| REQ-395 | Certificate: NFT mint address display | MUST | "NFT details: mint address, metadata, ownership proof" — REQ-054 says "NFT details" generically |
| REQ-396 | Certificate: NFT metadata display | MUST | "metadata" |
| REQ-397 | Certificate: NFT ownership proof | MUST | "ownership proof" — NOT in original checklist |

### 19k. CMS — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-398 | CMS: visual content editor with markdown support | MUST | "Visual content editor with markdown and code blocks" — NOT in original checklist |
| REQ-399 | CMS: visual content editor with code blocks | MUST | "markdown and code blocks" |
| REQ-400 | CMS: media management capability | MUST | "Media management" — NOT in original checklist |
| REQ-401 | CMS: draft/publish workflow | MUST | "Draft/publish workflow" — NOT in original checklist |
| REQ-402 | CMS: course metadata fields — difficulty | MUST | "Course metadata: difficulty, duration, XP, track association" — NOT itemized |
| REQ-403 | CMS: course metadata fields — duration | MUST | "Course metadata: difficulty, duration, XP, track association" |
| REQ-404 | CMS: course metadata fields — XP value | MUST | "Course metadata: difficulty, duration, XP, track association" |
| REQ-405 | CMS: course metadata fields — track association | MUST | "Course metadata: difficulty, duration, XP, track association" |

### 19l. On-Chain / Credential — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-406 | Credential NFT: one NFT per learning track, upgrades in-place (no wallet clutter) | MUST | "One NFT per learning track, upgrades in-place (no wallet clutter)" — NOT in original checklist |
| REQ-407 | Credential NFT: on-chain attributes include track | MUST | "On-chain attributes: track, level, courses completed, total XP" — NOT itemized |
| REQ-408 | Credential NFT: on-chain attributes include level | MUST | "On-chain attributes: track, level, courses completed, total XP" |
| REQ-409 | Credential NFT: on-chain attributes include courses completed | MUST | "On-chain attributes: track, level, courses completed, total XP" |
| REQ-410 | Credential NFT: on-chain attributes include total XP | MUST | "On-chain attributes: track, level, courses completed, total XP" |
| REQ-411 | Enrollment PDA: closeable after completion to reclaim rent | SHOULD | "Closeable after completion to reclaim rent; proof preserved via credential NFT and transaction history" |
| REQ-412 | Enrollment PDA: proof preserved via credential NFT and TX history after closure | SHOULD | "proof preserved via credential NFT and transaction history" |
| REQ-413 | Completion bonus formula: 50% of total lesson XP (floor), computed dynamically | MUST | SPEC: "floor((xp_per_lesson * lesson_count) / 2)" — REQ-148 says "500-2000 XP" but doesn't capture the formula |
| REQ-414 | Creator reward XP on course finalization (gated by min_completions_for_reward) | SHOULD | SPEC: "course.creator_reward_xp" minted on finalize, "min_completions_for_reward" threshold |

### 19m. Gamification — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-415 | Achievement display: icon per achievement | MUST | "Display with icon, name, date earned, description" — NOT in original checklist |
| REQ-416 | Achievement display: name per achievement | MUST | "Display with icon, name, date earned, description" |
| REQ-417 | Achievement display: date earned | MUST | "Display with icon, name, date earned, description" |
| REQ-418 | Achievement display: description text | MUST | "Display with icon, name, date earned, description" |
| REQ-419 | Achievement: supply cap per AchievementType | MUST | "AchievementType defines badge name, metadata URI, supply cap, XP reward" — supply cap not itemized |
| REQ-420 | Achievement: XP reward per AchievementType | MUST | "XP reward" — not itemized separate from the XP system |
| REQ-421 | Streak milestone celebrations (not just "rewards") | SHOULD | "Milestone celebrations at 7, 30, 100 days" — bounty uses "celebrations" specifically |

### 19n. i18n — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-422 | Language switcher widget in header | MUST | "language switcher in header/settings" — NOT in original checklist as a specific UI element |
| REQ-423 | Language switcher also available in settings page | MUST | "language switcher in header/settings" — already partially covered by REQ-047 |
| REQ-424 | All UI strings externalized (no hardcoded text anywhere) | MUST | "all UI strings externalized" — REQ-066 exists but worth re-emphasizing: zero hardcoded strings |

### 19o. Submission / Deliverables — Missing Atomic Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-425 | Demo video: key technical decisions overview | MUST | "Key technical decisions" — REQ-221/222 cover walkthrough/architecture but NOT "key technical decisions" |
| REQ-426 | PR must follow monorepo structure: `.claude/`, `docs/`, `onchain-academy/`, `app/`, `backend/` | MUST | "PR to github.com/solanabr/superteam-academy following monorepo structure" — specific folder layout given |
| REQ-427 | Single submission per person/agent/team | MUST | "Multiple submissions from same person/agent/team not allowed" — NOT in original checklist |
| REQ-428 | AI-generated code must be reviewed, tested, production-quality | MUST | "AI-generated code allowed but must be reviewed, tested, production-quality" — NOT in original checklist |
| REQ-429 | Judges' decisions are final | MUST | "Judges' decisions are final" — terms condition, not in checklist |

### 19p. Component Library — Missing Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-430 | Component primitives must be accessible | MUST | "accessible, composable primitives" — REQ-096 names libraries but not the "accessible" constraint |
| REQ-431 | Component primitives must be composable | MUST | "composable primitives" |

### 19q. Service Interface — Missing Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-432 | LearningProgressService: get progress for user/course method | MUST | "LearningProgressService should expose: Get progress for user/course" — specific interface methods listed |
| REQ-433 | LearningProgressService: complete lesson method | MUST | "Complete lesson" |
| REQ-434 | LearningProgressService: get XP balance method | MUST | "Get XP balance" |
| REQ-435 | LearningProgressService: get streak data method | MUST | "Get streak data" |
| REQ-436 | LearningProgressService: get leaderboard entries (weekly/monthly/all-time) method | MUST | "Get leaderboard entries (weekly/monthly/all-time)" |
| REQ-437 | LearningProgressService: get credentials for wallet method | MUST | "Get credentials for wallet" |

### 19r. Content / Course Structure — Missing Details

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-438 | Content hierarchy: Courses -> Modules -> Lessons (3-level) | MUST | "Hierarchy: Courses -> Modules -> Lessons" — REQ-183 partially covers but should be explicit about 3-level hierarchy |
| REQ-439 | Lesson types: content lessons (reading/video) | MUST | "Lesson Types: Content lessons (reading/video)" — NOT in original checklist |
| REQ-440 | Lesson types: challenge lessons (interactive coding) | MUST | "Lesson Types: Challenge lessons (interactive coding)" — NOT in original checklist |

### 19s. Leaderboard — Missing Details from Bounty

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-441 | Leaderboard: off-chain derivation via XP token balance indexing | MUST | "Off-chain derivation via XP token balance indexing (Helius DAS API or custom indexer)" — implementation approach specified |

### 19t. SPEC.md-Specific Requirements Not in Checklist

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-442 | Frontend must handle upgrade_credential flow (update existing credential NFT) | SHOULD | SPEC: "upgrade_credential" instruction — REQ-127/128 cover display, not upgrade flow |
| REQ-443 | Frontend: XP Token-2022 ATA creation before first XP receipt | SHOULD | INTEGRATION.md: "Before a learner can receive XP, they need a Token-2022 ATA" |
| REQ-444 | Frontend: handle 24h unenroll cooldown UX for incomplete courses | SHOULD | SPEC: "24h cooldown" on close_enrollment — user needs feedback if they try to close too early |
| REQ-445 | Frontend: display course.total_completions (social proof on course detail) | SHOULD | SPEC: Course PDA has `total_completions` field — useful for course detail page |
| REQ-446 | Frontend: prerequisite course enforcement UX (show locked/unavailable state) | SHOULD | SPEC: "prerequisite checked on-chain" — frontend should show locked state before user tries to enroll |

### 19u. Implied Requirements Not Covered

| ID | Requirement | Priority | Source Quote / Detail |
|----|-------------|----------|----------------------|
| REQ-447 | Skeleton/loading states for all async-loaded sections | SHOULD | Implied by "polished, intuitive" + Lighthouse performance — REQ-261 exists but should be MUST given 90+ performance target |
| REQ-448 | Focus management for modals, sidebars, and tab navigation | SHOULD | Implied by "Accessibility: 95+" — goes beyond ARIA labels |
| REQ-449 | Screen reader support (sr-only text, live regions) | SHOULD | Implied by "Accessibility: 95+" |
| REQ-450 | Skip navigation link for keyboard users | SHOULD | Implied by "Accessibility: 95+" — common Lighthouse audit item |
| REQ-451 | Reduced motion support (prefers-reduced-motion) | SHOULD | Implied by accessibility + animations on the platform |
| REQ-452 | Touch-friendly hit targets (min 44x44px) on mobile | SHOULD | Implied by responsive + accessibility requirements |
| REQ-453 | robots.txt and sitemap.xml for SEO | SHOULD | Implied by "SEO: 90+" Lighthouse score |
| REQ-454 | Structured data / JSON-LD for courses (schema.org Course type) | SHOULD | Implied by "SEO: 90+" — rich results for education content |
| REQ-455 | Canonical URL tags per page | SHOULD | Implied by "SEO: 90+" — prevent duplicate content |
| REQ-456 | Error boundary at route level (prevent full-app crashes) | SHOULD | Implied by Sentry + "maintainable" architecture |
| REQ-457 | Wallet transaction error handling UX (user rejected, timeout, insufficient SOL) | SHOULD | Implied by wallet-signed enrollment — multiple failure modes |
| REQ-458 | Devnet faucet link or airdrop helper in demo | SHOULD | "Devnet wallet access" — judges need SOL to test enrollment |

---

## 20. Corrections to Existing Requirements [ADDED BY REVIEWER]

| Original REQ | Issue | Correction |
|--------------|-------|------------|
| REQ-102 | Listed as SHOULD ("GitHub optional") | Bounty says "GitHub Sign-in" under "Required Technologies" — should be MUST. The word "bonus" appears in parenthetical context of authentication methods, but it is listed under "Required Technologies" section alongside Google. Ambiguous — keep as SHOULD but flag for judges. |
| REQ-148 | Says "500-2000 XP" for course completion | Bounty says this AND SPEC says completion bonus = floor(xp_per_lesson * lesson_count / 2). The 500-2000 range is approximate. REQ-413 added for the formula. |
| REQ-261 | Listed as SHOULD for loading states | Should arguably be MUST — without loading states, Lighthouse CLS will exceed 0.1 and Performance will drop below 90. Keep SHOULD but note dependency on REQ-082/084. |
| REQ-288 | Listed as MUST for preview deployments | Correct — just confirming it's duplicated from REQ-108. Both should exist (one in "Tech" section, one in "Implicit"). |
| REQ-017 | Says "split layout (content + code editor)" | Bounty says "Split layout: content (left) + code editor (right), resizable" — left/right orientation and resizability are missing from this REQ. See REQ-342. |

---

## Summary Statistics (Updated)

| Category | Count |
|----------|-------|
| MUST | ~310 |
| SHOULD | ~90 |
| NICE | ~15 |
| **Total** | **458** |

---

## Quick Audit Checklist by Page

### Landing Page (/)
- [ ] REQ-001 through REQ-006
- [ ] REQ-311 through REQ-320

### Course Catalog (/courses)
- [ ] REQ-007 through REQ-010
- [ ] REQ-321 through REQ-331

### Course Detail (/courses/[slug])
- [ ] REQ-011 through REQ-015
- [ ] REQ-332 through REQ-341

### Lesson View (/courses/[slug]/lessons/[id])
- [ ] REQ-016 through REQ-020
- [ ] REQ-342 through REQ-346

### Code Challenge
- [ ] REQ-021 through REQ-026
- [ ] REQ-347 through REQ-355

### Dashboard (/dashboard)
- [ ] REQ-027 through REQ-032
- [ ] REQ-356 through REQ-362

### Profile (/profile, /profile/[username])
- [ ] REQ-033 through REQ-039
- [ ] REQ-363 through REQ-372

### Leaderboard (/leaderboard)
- [ ] REQ-040 through REQ-043
- [ ] REQ-373 through REQ-379

### Settings (/settings)
- [ ] REQ-044 through REQ-049
- [ ] REQ-380 through REQ-389

### Certificate View (/certificates/[id])
- [ ] REQ-050 through REQ-054
- [ ] REQ-390 through REQ-397

### CMS
- [ ] REQ-181 through REQ-190
- [ ] REQ-398 through REQ-405

### On-Chain / Credentials
- [ ] REQ-116 through REQ-136
- [ ] REQ-291 through REQ-304
- [ ] REQ-406 through REQ-414, REQ-441 through REQ-446

### Gamification
- [ ] REQ-146 through REQ-180
- [ ] REQ-415 through REQ-421

### i18n
- [ ] REQ-059 through REQ-062, REQ-066
- [ ] REQ-422 through REQ-424

### Service Interfaces
- [ ] REQ-136, REQ-305
- [ ] REQ-432 through REQ-437

### Content Structure
- [ ] REQ-181 through REQ-190
- [ ] REQ-438 through REQ-440

### Submission / Deliverables
- [ ] REQ-215 through REQ-234
- [ ] REQ-425 through REQ-429

### Component Library
- [ ] REQ-096
- [ ] REQ-430 through REQ-431

### Cross-Cutting
- [ ] Auth: REQ-070 through REQ-073, REQ-137 through REQ-145
- [ ] Themes: REQ-067 through REQ-069, REQ-075
- [ ] Performance: REQ-079 through REQ-089
- [ ] Analytics: REQ-063, REQ-103 through REQ-106, REQ-191 through REQ-193
- [ ] Documentation: REQ-200 through REQ-214
- [ ] Accessibility / SEO implied: REQ-447 through REQ-458
