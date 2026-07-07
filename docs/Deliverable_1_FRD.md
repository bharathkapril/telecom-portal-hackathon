### ⚠ JURY EVALUATION REQUIREMENT: AI GENERATION PROMPT

**The following markdown prompt was used to generate this deliverable via the AI Assistant:**

> **Prompt:**
> Act as a Senior Business Analyst. Generate Deliverable 1: Functional Requirements Document (FRD) & User Stories for our "Telecom Plan Management Portal".
> The system must support two personas (Customer and Administrator). Customers can view and switch their telecom data plans. Administrators can create, read, update, and delete (CRUD) plans, and view a system-wide audit log of customer plan changes.
> Ensure the FRD covers: functional and non-functional requirements, personas, user journeys, business rules, screen-level requirements, acceptance criteria, assumptions, constraints, and downstream development inputs as required by our hackathon SDLC rubric.

---

# Deliverable 1: Functional Requirements Document (FRD)

**Project Name:** AI-Driven Telecom Plan Management Portal  
**Date:** July 2026  
**Document Owner:** SDLC Engineering Team

## 1. Personas

1. **The Customer:** A telecom subscriber who wants a self-service portal to view their current data plan usage and seamlessly upgrade or downgrade to a new plan without calling customer support.
2. **The Administrator:** A backend operations manager who needs to adjust plan offerings, update pricing, and monitor a secure audit trail of all customer plan changes for compliance.

## 2. User Stories & Acceptance Criteria

**Epic 1: Authentication & Role Management**

- **US-1.1:** As a User, I want to select my role (Customer or Admin) so that I am routed to the correct dashboard.
  - _Acceptance Criteria:_ User is presented with a clear role selection screen. Selecting a role routes to the respective protected dashboard.

**Epic 2: Customer Self-Service Experience**

- **US-2.1:** As a Customer, I want to view my current active plan and its details so I know what I am paying for.
  - _Acceptance Criteria:_ Dashboard displays the active plan name, monthly price, and a visual representation of data limits.
- **US-2.2:** As a Customer, I want to view a list of available alternative plans and switch my subscription so that I can manage my own account.
  - _Acceptance Criteria:_ System displays all active plans fetched from the database. User can click "Switch Plan", view a confirmation modal, and execute the change. The database `subscriptions` and `audit_logs` tables must update atomically.

**Epic 3: Administrator Operations**

- **US-3.1:** As an Admin, I want full CRUD (Create, Read, Update, Delete) capabilities for telecom plans so that I can manage the business offerings.
  - _Acceptance Criteria:_ Admin can view all plans in a data table. Admin can add a new plan, edit existing plan pricing/data limits, and delete plans.
- **US-3.2:** As an Admin, I want to view a secure audit log of all customer plan changes so that I can ensure billing compliance.
  - _Acceptance Criteria:_ Dashboard displays a chronological table of all `audit_logs` including timestamp, User ID, and action taken. Includes a CSV export function.

## 3. Screen-Level Requirements

- **Screen 1: Landing/Login View**
  - Elements: System Title, "Login as Customer" button, "Login as Administrator" button.
- **Screen 2: Customer Dashboard**
  - Elements: "Your Current Plan" hero card (shows active data). "Available Plans" grid (maps 3+ plans dynamically). "Switch Plan" confirmation modal (calculates new price).
- **Screen 3: Admin Dashboard**
  - Elements: "Manage Plans" Table (Columns: Name, Price, Data Limit, Actions). "+ Create New Plan" form modal. "Audit Logs" Table (Columns: Date, Customer ID, Action). "Export CSV" button.

## 4. Business & Validation Rules

- **BR-01 (IDOR Security):** A customer cannot pass an arbitrary User ID in the request body to change another user's plan. The system must validate the requested action against the securely authenticated session ID.
- **BR-02 (Transactional Integrity):** When a plan is switched, the system must utilize explicit SQL Transactions (`BEGIN`, `COMMIT`, `ROLLBACK`). The old subscription must be set to 'INACTIVE' and the new one to 'ACTIVE' within the exact same transaction block.
- **BR-03 (Input Validation):** All API payload inputs (User ID, Plan ID, Plan Name) must be strictly validated against a predefined schema (e.g., Zod) before executing database queries.
- **BR-04 (Foreign Key Constraints):** An Admin cannot delete a plan if it is currently tied to an active customer subscription.

## 5. Non-Functional Requirements (NFRs)

- **Performance:** Frontend UI state must reflect database changes immediately without requiring a hard page refresh.
- **Security:** All database queries must use parameterized inputs to prevent SQL Injection attacks.
- **Maintainability:** Application backend must be separated into routing controllers and a dedicated Data Access/Service layer to ensure modularity.
- **Traceability:** Every plan change must generate an immutable record in the `audit_logs` table.

## 6. Assumptions & Constraints

- **Constraint 1:** The primary data store must be a relational database (PostgreSQL). No NoSQL or JSON data stores are permitted for primary records.
- **Constraint 2:** The user interface must be built using standard web frameworks (Next.js/React). Streamlit/Gradio are strictly reserved for the Deliverable 10 AI Code Quality Agent only.
- **Downstream Input:** This FRD directly informs the PostgreSQL ER Diagram (Deliverable 3) and the Story-to-Spec Decomposition (Deliverable 4).
