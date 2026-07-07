### ⚠ JURY EVALUATION REQUIREMENT: AI GENERATION PROMPT
**The following markdown prompt was used to generate this deliverable via the AI Assistant:**
> **Prompt:**
> Act as a Lead QA Automation Engineer. Generate Deliverable 8: Functional Test Scripts for the "Telecom Plan Management Portal". 
> Output the test scripts in a tabular format suitable for CSV export. The test suite must include Positive, Negative, Boundary, Exception, and Security (Anti-IDOR) test cases as strictly required by the SDLC rubric.

***

# Deliverable 8: Functional Test Scripts

| Test ID | Req ID | Test Type | Scenario Description | Action / Payload | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-001** | US-1.1 | Positive | User navigates to Landing Page and selects Customer. | Click "Login as Customer". | UI routes to `/customer/dashboard` and auth state is set. |
| **TC-002** | US-2.1 | Positive | Customer Dashboard fetches active plans. | API GET `/api/plans`. | Returns HTTP 200 with an array of plans where `status = 'ACTIVE'`. |
| **TC-003** | US-2.2 | Security | IDOR Protection on Plan Switch. | API POST `/api/subscriptions` with a `requestedUserId` that does NOT match the logged-in session ID. | Returns HTTP 403 Forbidden. Database transaction aborted. |
| **TC-004** | US-2.2 | Positive | Successful Plan Switch (ACID Transaction). | API POST `/api/subscriptions` with valid matching user ID and new Plan ID. | Returns HTTP 200 OK. Old plan set to INACTIVE, new plan ACTIVE, Audit Log created. |
| **TC-005** | US-3.1 | Negative | Admin attempts to create a plan with negative price. | API POST `/api/plans` with `price: -10`. | Zod Validation throws HTTP 400 Bad Request. |
| **TC-006** | US-3.1 | Boundary | Admin creates plan with exact max length name (50 chars). | API POST `/api/plans` with 50-character `planName`. | Returns HTTP 201 Created. Plan successfully saved. |
| **TC-007** | US-3.1 | Exception | Database connection failure during plan creation. | API POST `/api/plans` while DB server is manually shut down. | Returns HTTP 500 Internal Server Error. Graceful UI error toast. |
| **TC-008** | US-3.2 | Positive | Admin exports Audit Logs to CSV. | Click "Export to CSV" on Admin Dashboard. | Browser downloads `audit_logs.csv` containing timestamped historical data. |
