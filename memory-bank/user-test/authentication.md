# VibeCulture - Authentication User Testing Plan

## 1. Objective

To verify the functionality, usability, and robustness of the VibeCulture application's user authentication system. This includes user registration (signup), login, logout, session management, and access to protected routes.

## 2. Target Testers

*   New users unfamiliar with the platform.
*   (Optional) Users attempting to use previously created test accounts (if applicable).

## 3. Test Environment & Prerequisites

*   **URL:** [VibeCulture Vercel Deployment Link](https://vibe-culture-alesanchezr-alejandro-sanchezs-projects-c67b22b3.vercel.app?_vercel_share=HidPSblIMuXHTtTMtBSWaHByGGhPA6xd)
*   **Browser:** A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
*   **Device:** Desktop or Laptop.
*   Testers should have a valid email address they can use for creating an account.
*   Testers should clear any existing site data/cookies for VibeCulture before starting, or use an incognito/private browsing window to simulate a first-time visit.

## 4. Test Scenarios & Tasks

### 4.1. User Registration (Signup)

| Task ID | Description                                                                                                | Expected Outcome                                                                                                                                     | Actual Outcome | Pass/Fail | Notes/Issues |
| :------ | :--------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------- | :----------- |
| SU-01   | Navigate to the application. Locate and click the "Sign In" button (or equivalent signup mechanism).       | A signup form or option is presented (e.g., fields for email, password, name OR "Create Account" link/tab).                                          |                |           |              |
| SU-02   | Attempt to create a new account with a valid, unique email address and a secure password. Fill all required fields. | Account creation is successful. User is likely redirected to the home page, profile page, or shown a success message. The "Sign In" button may change to a user icon/profile link. |                |           |              |
| SU-03   | Attempt to create an account with an email address that is already registered.                             | An appropriate error message is displayed (e.g., "Email already in use"). User is not registered.                                                    |                |           |              |
| SU-04   | Attempt to create an account with an invalid email format (e.g., "test@domain", "testdomain.com").           | An appropriate error message is displayed (e.g., "Invalid email format"). User is not registered.                                                    |                |           |              |
| SU-05   | Attempt to create an account with a weak password (if password strength rules are implemented).              | An appropriate error message regarding password requirements is displayed. User is not registered.                                                 |                |           |              |
| SU-06   | Attempt to create an account leaving a required field blank.                                               | An appropriate error message is displayed indicating the required field. User is not registered.                                                     |                |           |              |

### 4.2. User Login

| Task ID | Description                                                                                               | Expected Outcome                                                                                                                                         | Actual Outcome | Pass/Fail | Notes/Issues |
| :------ | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------- | :----------- |
| LI-01   | Navigate to the application. Locate and click the "Sign In" button. Access the login form/mechanism.        | A login form is presented (e.g., fields for email and password).                                                                                         |                |           |              |
| LI-02   | Log in using the credentials of the account created in SU-02 (or a provided valid test account).          | Login is successful. User is redirected to the home page or profile page. The "Sign In" button changes to a user icon/profile link. The user menu should show user details. |                |           |              |
| LI-03   | Attempt to log in with a valid email address but an incorrect password.                                   | Login fails. An appropriate error message is displayed (e.g., "Invalid credentials," "Incorrect password").                                                |                |           |              |
| LI-04   | Attempt to log in with an email address that is not registered.                                           | Login fails. An appropriate error message is displayed (e.g., "User not found," "Invalid credentials").                                                   |                |           |              |
| LI-05   | Attempt to log in leaving the email field blank.                                                          | Login fails. An appropriate error message for the required field is displayed.                                                                           |                |           |              |
| LI-06   | Attempt to log in leaving the password field blank.                                                       | Login fails. An appropriate error message for the required field is displayed.                                                                           |                |           |              |

### 4.3. Session Management & Logout

| Task ID | Description                                                                                                  | Expected Outcome                                                                                                                                       | Actual Outcome | Pass/Fail | Notes/Issues |
| :------ | :----------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------- | :----------- |
| SM-01   | After a successful login (LI-02), navigate to different pages (e.g., Home, Discover).                        | User remains logged in. The user icon/profile link persists in the navigation bar.                                                                     |                |           |              |
| SM-02   | After a successful login, close the browser tab/window, then reopen it and navigate back to the application. | User remains logged in (if "remember me" or persistent session is implemented). If not, the user should be logged out or prompted to log in again.       |                |           |              |
| SM-03   | While logged in, locate and click the "Log out" button (usually in the user dropdown menu).                  | User is successfully logged out. The user icon/profile link reverts to "Sign In". User may be redirected to the home page or a logout confirmation page. |                |           |              |
| SM-04   | After logging out (SM-03), try to access a protected page (e.g., `/profile`, `/submit`) directly via URL.      | Access is denied. User is redirected to the login page or shown an "unauthorized" message.                                                             |                |           |              |

### 4.4. Access to Protected Routes

| Task ID | Description                                                                                       | Expected Outcome                                                                                                           | Actual Outcome | Pass/Fail | Notes/Issues |
| :------ | :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------- | :------------- | :-------- | :----------- |
| PR-01   | Before logging in (as an anonymous user), attempt to navigate to `/profile` directly via URL.     | Access is denied. User is redirected to the login page or shown an "unauthorized" message/home page.                         |                |           |              |
| PR-02   | Before logging in, attempt to navigate to `/submit` (Submit Event page) directly via URL.         | Access is denied. User is redirected to the login page or shown an "unauthorized" message/home page.                         |                |           |              |
| PR-03   | After logging in successfully, navigate to `/profile` using the user menu or by typing the URL.   | Access is granted. The profile page is displayed correctly with user-specific information.                                   |                |           |              |
| PR-04   | After logging in successfully, navigate to `/submit` using the navigation link or by typing the URL. | Access is granted. The event submission form is displayed.                                                                 |                |           |              |

## 5. Data to Collect

For each test scenario/task, testers should record:
*   **Actual Outcome:** A brief description of what happened.
*   **Pass/Fail:** Whether the actual outcome matched the expected outcome.
*   **Notes/Issues:** Any unexpected behavior, error messages (verbatim if possible), usability problems, or suggestions for improvement. Screenshots are highly encouraged for any issues.
*   **Time Taken (Optional):** How long it took to complete the task.

## 6. Post-Test Qualitative Feedback

After completing all scenarios, testers can provide feedback on the following:
1.  How easy or difficult was it to understand how to sign up?
2.  How easy or difficult was it to log in?
3.  Were the error messages (if any encountered) clear and helpful?
4.  Was the process of logging out straightforward?
5.  Did you feel secure while using the authentication system?
6.  Any other comments or suggestions regarding the authentication experience?

---
This plan provides a structured way to test the core authentication features. 