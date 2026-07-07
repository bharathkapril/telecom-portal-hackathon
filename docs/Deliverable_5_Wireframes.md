### ⚠ JURY EVALUATION REQUIREMENT: AI GENERATION PROMPT

**The following markdown prompt was used to generate this deliverable via the AI Assistant:**

> **Prompt:**
> Act as a UI/UX Designer. Generate Deliverable 5: Wireframes / User Interface Design for the "Telecom Plan Management Portal".
> Since we have already developed the working software (Deliverable 7), structure this document to use screenshots of our actual Next.js application to demonstrate the Landing/Login View, Customer Dashboard, and Admin Dashboard. Include a brief description of the layout and UI elements for each view to satisfy the design specifications in the SDLC rubric.

---

# Deliverable 5: Wireframes / User Interface Design

**Project Name:** AI-Driven Telecom Plan Management Portal  
**Date:** July 2026  
**Document Owner:** SDLC Engineering Team

## 1. Landing & Role Selection View

**Design Rationale:** A clean, minimal landing page that acts as the primary authentication gate, forcing the user to select their persona (Customer or Administrator) to ensure secure routing.

**UI Elements:**

- Centered System Title / Logo
- "Login as Customer" Action Button
- "Login as Administrator" Action Button

_(Take a screenshot of your `http://localhost:3000` homepage and place it below)_

> **[ INSERT SCREENSHOT OF LOGIN PAGE HERE ]**

## 2. Customer Self-Service Dashboard

**Design Rationale:** A user-centric, read-heavy dashboard that immediately displays the customer's current billing state, followed by clear calls-to-action for upgrading or downgrading.

**UI Elements:**

- **Hero Card:** Displays "Your Current Plan", Active Price, and Data Limit.
- **Grid Layout:** Displays dynamically fetched "Available Plans".
- **Action Modal:** A confirmation pop-up when "Switch Plan" is clicked, preventing accidental database writes.

![CUSTOMER DASHBOARD](<localhost_3000_ (3).png>)

## 3. Administrator Operations Dashboard

**Design Rationale:** A data-dense, functional layout designed for backend operations. It prioritizes data tables for CRUD actions and compliance tracking.

**UI Elements:**

- **Manage Plans Table:** Columns for Plan Name, Price, and Data Limit, with inline Action Buttons (Edit/Delete).
- **Creation Form:** A modal triggered by a "+ Create New Plan" button for inputting validated plan data.
- **Audit Logs Section:** A chronological data table displaying the history of customer plan changes, complete with an "Export to CSV" button.

![ADMIN DASHBOARD](<localhost_3000_ (4).png>)
