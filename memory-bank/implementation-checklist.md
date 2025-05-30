# VibeCulture MVP TODOs and Checklist

## Phase 0: Initial Codebase Review & Deployment
- [X] **0.1 Vercel Project Setup**
- [X] **0.2 Configure Vercel Environment Variables (Initial)**
- [X] **0.3 Deploy Current Codebase**
- [X] **Action: Deploy current codebase to Vercel.**

## Phase 1: Supabase Project Setup, Client Config & Core Schema
- [X] **1.1 Supabase Project Identification**
    - [X] Identify/Confirm Supabase project.
    - [X] If new, User creates project and provides Org ID.
    - [X] Confirmed `project_id`: `mhzcyixvauzvlbfjghba`
    - [X] MVP City: `miami`
    - [X] Fetch Project URL and anon key.
- [X] **1.2 Client-Side Supabase Configuration**
    - [X] Install Supabase Client (`pnpm add @supabase/supabase-js`)
    - [X] Create Supabase client utility file (`lib/supabaseClient.ts`)
    - [X] Initialize client with env variables (User created `.env.local` manually)
- [X] **1.3 Core Table Schema - `event_categories`**
    - [X] Apply migration `create_event_categories_table`
    - [X] Seed initial categories
- [X] **1.4 Core Table Schema - `events`**
    - [X] Apply migration `create_events_table`
- [X] **1.5 Basic App Shell & Home Page (Frontend Task - User/Gemini)**
    - [X] Main layout (`app/layout.tsx`) with header/nav and main content.
    - [X] `app/page.tsx` (Home Page) with welcome and upcoming events.
- [X] **1.6 Event Listing Page (`app/events/page.tsx`) (Frontend Task - User/Gemini)**
    - [X] Server component to fetch and display approved events.
    - [X] Card format: `title`, `event_date`, `venue_name`, `category_name`, `price_info`.
    - [X] Link to event detail page.
- [X] **1.7 Event Detail Page (`app/events/[eventId]/page.tsx`) (Frontend Task - User/Gemini)**
    - [X] Dynamic route server component to fetch single event.
    - [X] Display all relevant event details.
- [X] **1.8 Vercel Deployment (Core Event Display)**
    - [X] Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel.
    - [X] Trigger a deployment.
- [X] **Action: Deploy to Vercel.**

## Phase 2: User Authentication & Profile Schema
- [X] **2.1 Authentication Setup (Frontend Task - Gemini)**
    - [X] Auth UI: `app/auth/signup/page.tsx`, `app/auth/login/page.tsx`.
    - [X] User Session Management: `AuthProvider` (`components/providers/AuthProvider.tsx`) wrapping `app/layout.tsx`.
    - [X] Logout functionality in navigation (`components/header.tsx`).
    - [X] Navigation bar updates for auth state (`components/header.tsx`).
- [X] **2.2 Supabase Schema - `user_profiles` table**
    - [X] Applied migration `create_user_profiles_table` (with "Miami" as default city).
- [X] **2.3 Supabase Schema - `user_interests` table**
    - [X] Applied migration `create_user_interests_table`.
- [X] **2.4 User Profile Page (`app/profile/page.tsx`) (Frontend Task - Gemini)**
    - [X] Protected route (via middleware).
    - [X] Display current user's `full_name` and `selected_city`.
    - [X] Allow users to select/update their interests. Store selections in `user_interests` table.
- [X] **2.5 Protected Routes Implementation (Frontend Task - Gemini)**
    - [X] Use Next.js Middleware (`middleware.ts`) to protect `/profile` and `/submit-event`.
- [X] **Action: Deploy User Authentication & Profile features to Vercel.**

## Phase 2.5: Token-Based Authentication via Query String
- [X] **2.5.1 Token Authentication Logic (Frontend Task - You):**
    - [X] Implement logic to check for a `token` query string parameter.
    - [X] Authenticate with Supabase using the token.
    - [X] Handle successful authentication (redirect/update state).
    - [X] Handle failed authentication gracefully.
    - [X] **FIXED:** Resolved async cookie handling in `lib/supabase/server.ts`
    - [X] **FIXED:** Added Suspense boundaries to all client components using AuthProvider
    - [X] **FIXED:** Build now passes successfully
- [X] **2.5.2 Secure Token Handling (Considerations - You):**
    - [X] Implemented short-lived token usage (tokens are removed from URL after processing)
    - [X] Added error handling for invalid/expired tokens
    - [X] Created automated token generation script for testing
- [X] **2.5.3 Vercel Deployment (Token Auth):**
    - [X] Build passes successfully - ready for deployment
- [X] **Action: Deploy Token Authentication feature to Vercel.** (Ready for deployment)

## Phase 3: Event Submission & Moderation Flow
- [X] **3.1 Event Submission Page (`app/submit-event/page.tsx`) (Frontend Task - Gemini)**
    - [X] Protected route for authenticated users.
    - [X] Form with fields for `events` table. `created_by` to current user ID, `is_approved` to `false`.
- [ ] **3.2 Supabase RLS for `events` table (Refinement)**
    - [ ] Confirm RLS policies for user submissions are working.
    - [ ] Admin/Moderator approval (manual via Supabase Studio for MVP).
- [ ] **3.3 Basic Moderation (Manual - Supabase Studio)**
    - [ ] Admin manually reviews and approves events.
- [ ] **Action: Deploy Event Submission features to Vercel.** (Awaiting User)

## Phase 4: Search, Filter & Basic Personalization (Frontend Heavy)
- [ ] **4.1 Enhance `events` Table (Optional - Discussion)**
    - [ ] Consider adding `tags TEXT[]`. If yes, apply migration.
    - [ ] Ensure `event_date`, `category_id`, `city` are indexed.
- [ ] **4.2 Search & Filter UI on Event Listing Page (`app/events/page.tsx`) (Frontend Task - User)**
    - [ ] UI for search (text), date range, category, price. Update URL query params.
- [ ] **4.3 Backend Logic for Filtering & Searching (Frontend Task - User)**
    - [ ] Modify Supabase query in `app/events/page.tsx` for filters.
- [ ] **4.4 Personalized Event Feed on Home Page (`app/page.tsx`) (Frontend Task - User)**
    - [ ] "For You" section if user logged in & has interests.
- [ ] **Action: Deploy Search, Filter, and Personalization features to Vercel.** (Awaiting User)

## Phase 5: Community Validation & Event Actionability Schema
- [ ] **5.1 Supabase Schema - `event_upvotes` table**
    - [ ] Apply migration `create_event_upvotes_table`.
- [ ] **5.2 Supabase Schema - `event_comments` table**
    - [ ] Apply migration `create_event_comments_table`.
- [ ] **5.3 Upvote & Comment Functionality (Frontend Task - User)**
    - [ ] UI on `app/events/[eventId]/page.tsx` for upvoting/commenting.
- [ ] **5.4 "Community Pick" Badge (Frontend Task - User)**
    - [ ] Logic for highly upvoted events.
- [ ] **5.5 Event Detail Page - Actionability Enhancements (Frontend Task - User)**
    - [ ] Map integration, Ticket/RSVP link, Save to Calendar, Share links.
- [ ] **Action: Deploy Community Validation & Actionability features to Vercel.** (Awaiting User)

## Phase 6: "Surprise Me" Feature & Final Touches (Frontend Heavy)
- [ ] **6.1 "Surprise Me" Feature (Frontend Task - User)**
    - [ ] Button and logic for random relevant event.
- [ ] **6.2 Styling & UI Polish (Dark Mode First) (Frontend Task - User)**
    - [ ] Thorough review and refinement.
- [ ] **6.3 Responsiveness Testing (Frontend Task - User)**
    - [ ] Test on all screen sizes.
- [ ] **6.4 Enhanced User Feedback and Error Handling (Frontend Task - User)**
    - [ ] Global toasts, form loading/validation.
- [ ] **6.5 Code Review, Refinement & Performance (Frontend/Backend)**
    - [ ] Review codebase.
    - [ ] Check Supabase query performance, suggest/apply index migrations.
- [ ] **6.6 Final MVP Deployment to Vercel**
    - [ ] Perform final build (`pnpm build`) and deployment.
    - [ ] Comprehensive testing on production. 