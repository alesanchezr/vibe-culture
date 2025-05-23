## VibeCulture MVP Implementation Plan

Below are the actionable steps to build the VibeCulture MVP, focusing on a hyper-local cultural event discovery platform for one city initially. I will be handling Supabase setup (schema, RLS, initial data) using Supabase MCP tools.

### Phase 0: Initial Codebase Review & Deployment

*   **0.1 Vercel Project Setup:**
    *   Ensure your Git repository is connected to a Vercel project. If not, create one.
*   **0.2 Configure Vercel Environment Variables (Initial):**
    *   Set up any essential environment variables that your current codebase requires to build and run on Vercel (e.g., `NEXT_PUBLIC_...` variables, even if they are placeholders for now if full backend integration isn't complete in the current code).
*   **0.3 Deploy Current Codebase:**
    *   Trigger a deployment of the current, existing application state from your main branch to Vercel.
*   **Action: Deploy current codebase to Vercel.**
*   **Stop and wait for me to deploy and test the current app in production. Review its state before proceeding with new feature development.**

### Phase 1: Supabase Project Setup, Client Config & Core Schema

*   **1.1 Supabase Project Identification:**
    *   I will attempt to list your Supabase projects to identify the one for VibeCulture. You may need to confirm which one to use or provide the Project ID if it's already known.
    *   If a new project is needed, you will need to create it (e.g., via [database.new](https://database.new)) and provide me with your Supabase Organization ID so I can assist further if required (e.g., cost estimation, though project creation itself is manual for you).
    *   Once the `project_id` is confirmed, I will fetch its URL and anon key.
*   **1.2 Client-Side Supabase Configuration:**
    *   Define the MVP focus city (e.g., "San Francisco"). Please confirm or provide your chosen city.
    *   Install Supabase Client: In your project's terminal, run `pnpm add @supabase/supabase-js` (if not already done).
    *   You will then create/confirm a Supabase client utility file (e.g., `lib/supabaseClient.ts`).
    *   You will initialize the Supabase client in this file using the Project URL and anon key I provide. These should be stored as environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`) and also configured in Vercel.
*   **1.3 Core Table Schema - `event_categories`:**
    *   I will apply a migration to create the `event_categories` table.
        *   **Migration Name:** `create_event_categories_table`
        *   **SQL:**
            ```sql
            CREATE TABLE event_categories (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL
            );
            ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Public can read event categories" ON event_categories FOR SELECT USING (true);
            ```
    *   I will then seed initial categories into `event_categories`.
        *   **SQL (executed directly, not as migration):**
            ```sql
            INSERT INTO event_categories (name) VALUES
            ('Music'), ('Art'), ('Theater'), ('Festival'), ('Workshop'), ('Community');
            ```
*   **1.4 Core Table Schema - `events`:**
    *   I will apply a migration to create the `events` table.
        *   **Migration Name:** `create_events_table`
        *   **SQL:**
            ```sql
            CREATE TABLE events (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title TEXT NOT NULL,
                description TEXT,
                event_date DATE NOT NULL,
                start_time TIME,
                end_time TIME,
                venue_name TEXT,
                address TEXT,
                city TEXT NOT NULL, -- To be set to MVP city initially
                latitude DECIMAL(9,6),
                longitude DECIMAL(9,6),
                category_id INT REFERENCES event_categories(id),
                price_info TEXT, -- e.g., "Free", "$10-$20", "Varies"
                is_free BOOLEAN DEFAULT false,
                organizer_name TEXT,
                organizer_contact TEXT,
                source_url TEXT, -- link to original event page/tickets
                image_url TEXT,
                created_by UUID REFERENCES auth.users(id) NULL, -- for user submissions
                is_approved BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
            ALTER TABLE events ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Public can read approved events" ON events FOR SELECT USING (is_approved = true);
            CREATE POLICY "Users can insert their own events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);
            CREATE POLICY "Users can view their own submitted events" ON events FOR SELECT USING (auth.uid() = created_by);
            -- Admin/moderator update policy will be handled separately or refined later
            ```
*   **1.5 Basic App Shell & Home Page (Frontend Task - You):**
    *   Ensure your main layout (`app/layout.tsx`) includes a header/navigation area and a main content area.
    *   `app/page.tsx` (Home Page): Display a welcome message and a section to browse upcoming events.
*   **1.6 Event Listing Page (`app/events/page.tsx`) (Frontend Task - You):**
    *   Create a server component to fetch all `is_approved = true` events from the `events` table for the MVP city, ordered by `event_date` (using the configured Supabase client).
    *   Display events in a card format (use ShadCN `Card`): show `title`, `event_date`, `venue_name`, `category_name`, `price_info`.
    *   Each card should link to the individual event detail page.
*   **1.7 Event Detail Page (`app/events/[eventId]/page.tsx`) (Frontend Task - You):**
    *   Create a dynamic route server component to fetch a single event by `eventId` from Supabase.
    *   Display all relevant event details.
*   **1.8 Vercel Deployment (Core Event Display):**
    *   Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel.
    *   Trigger a deployment.
*   **Action: Deploy to Vercel.**
*   **Stop and wait for me to deploy and test the app with basic event display in production before proceeding.**

### Phase 2: User Authentication & Profile Schema

*   **2.1 Authentication Setup (Frontend Task - You):**
    *   Auth UI: `app/auth/signup/page.tsx`, `app/auth/login/page.tsx`. Use client components for forms.
    *   User Session Management: `AuthProvider` (e.g., `components/providers/AuthProvider.tsx`) wrapping `app/layout.tsx`.
    *   Logout functionality in navigation.
    *   Navigation bar updates to show auth state (Login/Signup vs. Profile/Logout links).
*   **2.2 Supabase Schema - `user_profiles` table:**
    *   I will apply a migration to create the `user_profiles` table.
        *   **Migration Name:** `create_user_profiles_table`
        *   **SQL:**
            ```sql
            CREATE TABLE user_profiles (
                user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                full_name TEXT,
                selected_city TEXT, -- Default to be set based on confirmed MVP city
                created_at TIMESTAMPTZ DEFAULT now()
            );
            ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
            CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
            CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
            -- Optional: Trigger to auto-create profile on new user signup
            CREATE OR REPLACE FUNCTION public.handle_new_user() 
            RETURNS trigger AS $$
            BEGIN
              INSERT INTO public.user_profiles (user_id, selected_city) 
              VALUES (new.id, '[MVP_CITY_NAME_PLACEHOLDER]'); -- This placeholder will be replaced with actual MVP city
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;

            CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
            ```
            *(Note: The `[MVP_CITY_NAME_PLACEHOLDER]` will be replaced with your chosen MVP city when I apply the migration.)*
*   **2.3 Supabase Schema - `user_interests` table:**
    *   I will apply a migration to create the `user_interests` table.
        *   **Migration Name:** `create_user_interests_table`
        *   **SQL:**
            ```sql
            CREATE TABLE user_interests (
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                category_id INT REFERENCES event_categories(id) ON DELETE CASCADE,
                PRIMARY KEY (user_id, category_id)
            );
            ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Users can manage their own interests" ON user_interests FOR ALL USING (auth.uid() = user_id);
            ```
*   **2.4 User Profile Page (`app/profile/page.tsx`) (Frontend Task - You):**
    *   Protected route.
    *   Display current user's `full_name` and `selected_city`.
    *   Allow users to select/update their interests (checkboxes/multi-select for `event_categories`). Store selections in `user_interests` table.
*   **2.5 Protected Routes Implementation (Frontend Task - You):**
    *   Use Next.js Middleware (`middleware.ts`) to protect routes like `/profile` and `/submit-event`.
*   **Action: Deploy User Authentication & Profile features to Vercel.**
*   **Stop and wait for me to deploy and test these features in production before proceeding.**

### Phase 3: Event Submission & Moderation Flow

*   **3.1 Event Submission Page (`app/submit-event/page.tsx`) (Frontend Task - You):**
    *   Protected route for authenticated users.
    *   Form with fields for `events` table. `created_by` should be set to the current user's ID, `is_approved` to `false`.
*   **3.2 Supabase RLS for `events` table (Refinement):**
    *   The RLS policies for `events` created in Phase 1.4 already cover user submissions. We will confirm they are working as expected.
    *   Admin/Moderator approval: For MVP, this is manual via Supabase Studio. An admin role with `UPDATE` rights on `events.is_approved` would be needed for a programmatic solution (deferred).
*   **3.3 Basic Moderation (Manual - Supabase Studio):**
    *   An admin manually reviews events in Supabase Studio where `is_approved = false` and updates to `true`.
*   **Action: Deploy Event Submission features to Vercel.**
*   **Stop and wait for me to deploy and test event submission and manual moderation flow.**

### Phase 4: Search, Filter & Basic Personalization (Frontend Heavy)

*   **4.1 Enhance `events` Table (Optional - Discussion):**
    *   Consider adding `tags TEXT[]`. If yes, I will apply a migration.
    *   Ensure `event_date`, `category_id`, `city` are indexed. (I will check and apply migrations if needed).
*   **4.2 Search & Filter UI on Event Listing Page (`app/events/page.tsx`) (Frontend Task - You):**
    *   Implement UI for search (text), date range, category, price. Update URL query params.
*   **4.3 Backend Logic for Filtering & Searching (Frontend Task - You):**
    *   Modify Supabase query in `app/events/page.tsx` to use filters from URL.
*   **4.4 Personalized Event Feed on Home Page (`app/page.tsx`) (Frontend Task - You):**
    *   If user logged in & has interests, show "For You" section.
*   **Action: Deploy Search, Filter, and Personalization features to Vercel.**
*   **Stop and wait for me to deploy and test these features.**

### Phase 5: Community Validation & Event Actionability Schema

*   **5.1 Supabase Schema - `event_upvotes` table:**
    *   I will apply a migration to create the `event_upvotes` table.
        *   **Migration Name:** `create_event_upvotes_table`
        *   **SQL:**
            ```sql
            CREATE TABLE event_upvotes (
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                event_id UUID REFERENCES events(id) ON DELETE CASCADE,
                created_at TIMESTAMPTZ DEFAULT now(),
                PRIMARY KEY (user_id, event_id)
            );
            ALTER TABLE event_upvotes ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Users can manage their own upvotes" ON event_upvotes FOR ALL USING (auth.uid() = user_id);
            ```
*   **5.2 Supabase Schema - `event_comments` table:**
    *   I will apply a migration to create the `event_comments` table.
        *   **Migration Name:** `create_event_comments_table`
        *   **SQL:**
            ```sql
            CREATE TABLE event_comments (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                event_id UUID REFERENCES events(id) ON DELETE CASCADE,
                comment_text TEXT NOT NULL CHECK (char_length(comment_text) > 0 AND char_length(comment_text) <= 280),
                created_at TIMESTAMPTZ DEFAULT now()
            );
            ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Users can manage their own comments" ON event_comments FOR ALL USING (auth.uid() = user_id);
            CREATE POLICY "Public can read comments" ON event_comments FOR SELECT USING (true);
            ```
*   **5.3 Upvote & Comment Functionality (Frontend Task - You):**
    *   Implement UI on `app/events/[eventId]/page.tsx` for upvoting and commenting.
*   **5.4 "Community Pick" Badge (Frontend Task - You):**
    *   Logic to identify and display highly upvoted events.
*   **5.5 Event Detail Page - Actionability Enhancements (Frontend Task - You):**
    *   Map integration, Ticket/RSVP link, Save to Calendar, Share links.
*   **Action: Deploy Community Validation & Actionability features to Vercel.**
*   **Stop and wait for me to deploy and test these features.**

### Phase 6: "Surprise Me" Feature & Final Touches (Frontend Heavy)

*   **6.1 "Surprise Me" Feature (Frontend Task - You):**
    *   Implement button and logic to fetch and display a random relevant event.
*   **6.2 Styling & UI Polish (Dark Mode First) (Frontend Task - You):**
    *   Thorough review and refinement.
*   **6.3 Responsiveness Testing (Frontend Task - You):**
    *   Test on all screen sizes.
*   **6.4 Enhanced User Feedback and Error Handling (Frontend Task - You):**
    *   Global toasts, form loading/validation.
*   **6.5 Code Review, Refinement & Performance (Frontend/Backend):**
    *   Review codebase.
    *   I will check Supabase query performance and suggest/apply index migrations if necessary.
*   **6.6 Final MVP Deployment to Vercel:**
    *   Perform a final build (`pnpm build`) and deployment.
    *   Conduct comprehensive testing on the production environment.

This completes the VibeCulture MVP implementation. Future iterations can explore scaling to more cities, advanced recommendation algorithms, organizer dashboards, API integrations, etc.
