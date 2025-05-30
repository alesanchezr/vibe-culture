# User Test: Event Submission

**Objective:** To verify that a logged-in user can successfully submit a new event through the platform's UI, and that the event is correctly stored with `is_approved = false`.

**Preconditions:**

1.  The application is running.
2.  The user has an existing account or can create one.
3.  The user is logged into the application.
    *   Alternatively, if testing the token-based authentication flow for direct access, a valid access token for a test user is available.

**Test Steps:**

1.  **Navigate to Event Submission Page:**
    *   **Action:** Click on the "Submit Event" link/button in the navigation bar or relevant section of the site.
    *   **Expected Result:** The user is taken to the event submission form page (e.g., `/submit-event`).
    *   *(If using token-based direct access for testing)*:
        *   **Action:** Construct the URL `http://localhost:3000/submit-event?token=YOUR_ACCESS_TOKEN` (replace with a valid token).
        *   **Action:** Open this URL in the browser.
        *   **Expected Result:** The event submission form page loads, and the user is treated as authenticated.

2.  **Fill Out Event Details:**
    *   **Action:** Enter a valid **Event Title** (e.g., "Community Art Fair").
    *   **Action:** Enter a **Description** (e.g., "A vibrant display of local artists and crafts.").
    *   **Action:** Select an **Event Date** using the date picker (e.g., a future date).
    *   **Action:** (Optional) Select a **Start Time** and **End Time**.
    *   **Action:** Enter a **Venue Name** (e.g., "City Park Pavilion").
    *   **Action:** Enter an **Address** (e.g., "123 Main St, Miami, FL").
    *   **Action:** The **City** field should ideally be pre-filled or easily selectable (default to MVP city: Miami).
    *   **Action:** Select an **Event Category** from the dropdown (e.g., "Art").
    *   **Action:** Enter **Price Information** (e.g., "Free", "$15", "$10 - $25").
    *   **Action:** Check the **Is Free?** checkbox if applicable.
    *   **Action:** (Optional) Enter **Organizer Name** (e.g., "Local Arts Council").
    *   **Action:** (Optional) Enter **Organizer Contact** (e.g., "contact@localarts.org").
    *   **Action:** (Optional) Enter a **Source URL** (e.g., a link to the official event page).
    *   **Action:** (Optional) Enter an **Image URL** for the event banner/image.
    *   **Expected Result:** All fields accept valid input. Required fields are clearly indicated.

3.  **Submit the Form:**
    *   **Action:** Click the "Submit Event" or "Create Event" button on the form.
    *   **Expected Result:**
        *   A success message is displayed (e.g., "Event submitted successfully! It will be reviewed by our team.").
        *   The user might be redirected to a confirmation page, their list of submitted events, or the home page.

4.  **Verify Event in Supabase (Manual Check for Testers/Admins):**
    *   **Action:** Access the Supabase Studio for the project.
    *   **Action:** Navigate to the `events` table.
    *   **Expected Result:**
        *   A new row exists in the `events` table corresponding to the submitted event details.
        *   The `title`, `description`, `event_date`, `category_id`, etc., match the submitted information.
        *   The `created_by` column matches the `user_id` of the logged-in user who submitted the event.
        *   The `is_approved` column is `false`.
        *   The `city` column is correctly set (e.g., "Miami").

**Postconditions:**

*   The submitted event is present in the database awaiting moderation.

**Notes/Variations:**

*   **Form Validation:** Test submitting the form with missing required fields. Expected: Appropriate error messages should be displayed, and the form should not submit.
*   **Invalid Data:** Test submitting the form with invalid data types (e.g., text in a date field if not prevented by UI). Expected: Graceful error handling or UI prevention.
*   **Unauthenticated User:** Attempt to navigate directly to `/submit-event` without being logged in (and without a token). Expected: User should be redirected to the login page. 