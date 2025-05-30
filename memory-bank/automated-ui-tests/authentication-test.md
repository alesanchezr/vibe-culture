# Vibe Culture - Automated Authentication automated ui testing Plan

## 1. Objective

To automatically verify the core functionality and robustness of the VibeCulture application's user authentication system using automated scripts, token-based authentication, and interactions with a running instance of the application. This plan leverages the procedures outlined in the `automated-user-testing` guidelines.

## 2. Test Executor

*   Automated test scripts and supporting Node.js utility scripts (`scripts/create-test-user.js`, `scripts/get-test-token.js`).

## 3. Test Environment & Prerequisites

*   **Application URL:** The application should be running locally, e.g., `http://localhost:3001` (as per `vercel dev --listen=3001`). The base URL for tests should be configurable.
*   **Node.js Environment:** Required to execute test scripts and utility scripts.
*   **Environment Variables:** A `.env.local` file must be present in the project root and correctly configured with:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY` (for `create-test-user.js`)
    *   `TEST_EMAIL` (for the dedicated test user)
    *   `TEST_PASSWORD` (for the dedicated test user)
*   **Test User Existence:** The `scripts/create-test-user.js` script must be run successfully before test execution to ensure the test user account (defined by `TEST_EMAIL` and `TEST_PASSWORD`) exists in Supabase.
*   **Test User Token Generation:** The `scripts/get-test-token.js` script must be runnable to obtain a JWT access token for the test user.
*   **Browser Automation Tool:** A browser automation tool (e.g., Playwright, Puppeteer) will be used by the test scripts to interact with the application.
*   **Supabase MCP Tools:** May be used for database assertions where applicable.

## 4. Test Automation Workflow Overview

1.  **Setup:**
    *   Ensure all environment variables in `.env.local` are correctly set.
    *   Execute `node scripts/create-test-user.js` to ensure the test user exists or is created.
    *   Execute `node scripts/get-test-token.js` to obtain a JWT access token for the test user. This token will be captured by the test runner.
2.  **Execution:**
    *   Automated test scripts will use the captured JWT token to simulate an authenticated user by appending it as a query parameter to the navigation URL (e.g., `http://localhost:3001/profile?token=CAPTURED_ACCESS_TOKEN`).
    *   The application's `AuthProvider` is expected to detect this token, authenticate the session, and then remove the token from the URL.
    *   Scripts will perform actions as defined in the test scenarios (navigation, interaction with elements where applicable).
3.  **Verification:**
    *   Assertions will be made based on UI changes (e.g., presence of user-specific elements, redirection).
    *   Where necessary, Supabase MCP tools can be used to verify data state changes in the database.
4.  **Reporting:**
    *   Test results (pass/fail), logs, and any error messages will be recorded.

## 5. Test Scenarios & Tasks

### 5.1. Test User & Token Management Scripts

| Task ID | Description                                                                                                | Expected Outcome                                                                                                                                                              | Actual Outcome | Pass/Fail | Notes/Issues |
| :------ | :--------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------- | :----------- |
| SU-01   | Run `node scripts/create-test-user.js` when the test user (defined by `TEST_EMAIL`) does not yet exist.    | The script successfully creates the test user in Supabase. Console output indicates user creation. No errors.                                                                 |                |           |              |
| SU-02   | Run `node scripts/create-test-user.js` when the test user already exists.                                  | The script confirms that the user already exists. Console output indicates user existence. No errors.                                                                         |                |           |              |
| SU-03   | Run `node scripts/get-test-token.js` with correct `TEST_EMAIL` and `TEST_PASSWORD` in `.env.local`.          | The script successfully authenticates and outputs a valid JWT access token to the console. No errors.                                                                       |                |           |              |
| SU-04   | (Requires manual setup) Temporarily modify `TEST_PASSWORD` in `.env.local` to an incorrect value. Run `node scripts/get-test-token.js`. | Token generation fails. The script outputs an appropriate error message from Supabase (e.g., "Invalid login credentials"). Restore correct password afterwards. |                |           |              |
| SU-05   | (Requires manual setup) Temporarily modify `TEST_EMAIL` in `.env.local` to a non-existent email. Run `node scripts/get-test-token.js`. | Token generation fails. The script outputs an appropriate error message from Supabase (e.g., "User not found" or "Invalid login credentials"). Restore correct email afterwards. |                |           |              |

### 5.2. User Authentication via Token

| Task ID | Description                                                                                               | Expected Outcome                                                                                                                                                                                             | Actual Outcome | Pass/Fail | Notes/Issues |
| :------ | :-------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------- | :----------- |
| LI-01   | Automated script obtains a valid token, then navigates to a protected route (e.g., `/profile`) using the URL `http://localhost:3001/profile?token=VALID_TOKEN`. | The application's `AuthProvider` detects the token, authenticates the session. User is granted access to `/profile`. The token is removed from the URL. UI reflects an authenticated state (e.g., user icon, profile information visible). |                |           |              |
| LI-02   | Automated script navigates to a protected route (e.g., `/profile`) with an *invalid* or *malformed* JWT token in the URL. | Authentication fails. User is redirected to the login page or an appropriate error page/message is displayed. Access to `/profile` is denied.                                                            |                |           |              |
| LI-03   | Automated script navigates to a protected route (e.g., `/profile`) with an *expired* JWT token in the URL (if testable). | Authentication fails. User is redirected to the login page or an appropriate error page/message is displayed. Access to `/profile` is denied.                                                            |                |           |              |

### 5.3. Session Management & Logout (Automated)

| Task ID | Description                                                                                                  | Expected Outcome                                                                                                                                                                                             | Actual Outcome | Pass/Fail | Notes/Issues |
| :------ | :----------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------- | :----------- |
| SM-01   | After successful token-based authentication (LI-01), script navigates to other pages (e.g., Home, Discover) without re-appending the token. | User remains logged in due to the established session (likely a session cookie). The user icon/profile link persists. Access to other protected routes is maintained.                                          |                |           |              |
| SM-02   | While authenticated, script triggers the logout mechanism (e.g., navigates to a logout endpoint or clicks a logout button if testing UI interaction for logout). | User is successfully logged out. Session is invalidated. UI reverts to an unauthenticated state (e.g., "Sign In" button appears).                                                                    |                |           |              |
| SM-03   | After logging out (SM-02), script attempts to access a protected page (e.g., `/profile`) directly via URL without a token. | Access is denied. User is redirected to the login page or shown an "unauthorized" message/home page.                                                                                                         |                |           |              |

### 5.4. Access to Protected Routes (Automated)

| Task ID | Description                                                                                               | Expected Outcome                                                                                                                                                                                            | Actual Outcome | Pass/Fail | Notes/Issues |
| :------ | :-------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------- | :----------- |
| PR-01   | Script (without a token, simulating an anonymous user) attempts to navigate to `/profile` directly via URL. | Access is denied. User is redirected to the login page or shown an "unauthorized" message/home page.                                                                                                        |                |           |              |
| PR-02   | Script (without a token) attempts to navigate to `/submit` (Submit Event page) directly via URL.          | Access is denied. User is redirected to the login page or shown an "unauthorized" message/home page.                                                                                                        |                |           |              |
| PR-03   | After successful token-based authentication (as in LI-01), script navigates to `/profile`.                | Access is granted. The profile page is displayed correctly. Script can assert the presence of user-specific elements.                                                                                       |                |           |              |
| PR-04   | After successful token-based authentication, script navigates to `/submit`.                                 | Access is granted. The event submission form is displayed. Script can assert the presence of form elements.                                                                                               |                |           |              |

## 6. Data to Collect (Automated)

For each test scenario/task, the automated test framework should record:
*   **Test Case ID & Description.**
*   **Execution Status (Pass/Fail):** Whether all assertions for the test case passed.
*   **Logs:** Detailed logs from the test script execution, including navigation steps, actions performed, and assertion checks.
*   **Error Messages:** Any error messages or stack traces from the application or test scripts if a test fails.
*   **Screenshots/Snapshots on Failure (Optional but Recommended):** If the automation tool supports it, capture screenshots or page snapshots when assertions fail.
*   **Timings (Optional):** Duration of each test case or the entire suite.

---
This plan provides a structured way to automatically test the core authentication features using the defined token-based authentication strategy.
It should be adapted and expanded as the application and its automated testing capabilities evolve. 