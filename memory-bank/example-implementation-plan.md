I want to build a **Learning Management System (LMS) - First Iteration (MVP)**.

<!-- General Project Description -->
<project_description>
The overall goal is to create a platform where instructors can create and manage basic courses, and students can enroll in these courses to learn and track their initial progress. This is the first iteration, focusing on core functionality.
</project_description>

<!-- Target Audience -->
<target_audience>
Our primary target audience for this MVP is **college students (18-22 years old)** who are looking for supplementary learning materials and are very comfortable with modern web and mobile interfaces. A secondary audience is **independent instructors** who need a simple platform to share their knowledge.
</target_audience>

<!-- Technologies -->
<technologies>
- **Frontend:** React with Vite, using ShadCN/ui and Tailwind CSS for components and styling. <!-- VRSS Stack -->
- **Backend & Database:** Supabase (for user authentication, database, and potentially storage later).
- **Deployment:** Vercel for the frontend and Supabase for the backend services.
</technologies>

<!-- Functionality Description - MVP -->
<functionalities_mvp>
**Key User Roles for MVP:**
1.  **Student:** Can sign up, log in, browse/enroll in courses, view text/video lesson content, and manually mark lessons as complete.
2.  **Instructor:** Can sign up, log in, create/edit basic courses (title, description), add lessons with text and video links, and publish/unpublish courses.

**Core Functionalities for this MVP iteration:**
*   **User Authentication:** Student and Instructor signup, login, logout. (Defer password recovery for next iteration if it complicates MVP).
*   **Course Creation (Instructor):** Ability to create courses with a title and description. Organize content into simple modules and lessons (text content and YouTube video embeds initially).
*   **Course Enrollment & Consumption (Student):** Students can see a list of published courses, enroll in a course, and view its lessons. They can manually mark lessons as 'complete'.
*   **No Quizzes or advanced progress tracking in this MVP.** <!-- Explicitly deferring features -->
</functionalities_mvp>

<!-- Front-end Best Practices -->
<frontend_practices>
- **Overall Style:** Modern, clean, and minimalist design. Prioritize a **dark mode first** aesthetic 🌙, ensuring it's sleek and user-friendly for our target audience of college students.
- **Responsiveness:** The application must be fully responsive 📱💻, looking great on mobile, tablet, and desktop. Use ShadCN/ui components with Tailwind CSS to ensure this, focusing on a mobile-first approach for core structure.
- **Navigation:** For the MVP, a simple top navigation bar using ShadCN/ui's `NavigationMenu` with links like 'Courses' and user profile/login/logout.
</frontend_practices>

<!-- API and Deployment Strategy -->
<api_and_deployment>
We will host the frontend on **Vercel** and use **Supabase** for the database and authentication.

Write a markdown file with the **implementation plan** for this LMS MVP. Do not include any code examples in the plan itself. Split the implementation plan into small, actionable steps and save it into `./memory-bank/implementation.md`.

**Crucially, prioritize the plan with steps to sync and deploy to Vercel as often as possible.** For example, include a step specifically to deploy a basic "Hello World" or a minimal app shell to production (Vercel) right after the initial project setup and a few foundational steps. After each significant feature set (like user auth, then course creation basics), include a step to deploy and explicitly state: **"Stop and wait for me to deploy and test the app in production before proceeding."** <!-- This ensures iterative feedback and reduces risk -->
</api_and_deployment>