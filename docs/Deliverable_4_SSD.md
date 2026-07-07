### ⚠ JURY EVALUATION REQUIREMENT: AI GENERATION PROMPT

**The following markdown prompt was used to generate this deliverable via the AI Assistant:**

> **Prompt:**
> Act as a Technical Product Manager. Generate Deliverable 4: Story-to-Spec Decomposition (SSD) for the "Telecom Plan Management Portal".
> Decompose the requirements defined in the FRD into logical modules, epics, user stories, workflows, business rules, validation rules, and implementation-ready specification units as strictly required by the SDLC rubric. Present the decomposition in a highly structured, scannable format.

---

# Deliverable 4: Story-to-Spec Decomposition (SSD)

**Project Name:** AI-Driven Telecom Plan Management Portal  
**Date:** July 2026  
**Document Owner:** SDLC Engineering Team

## 1. Logical Modules & Epics

The application is decomposed into three primary logical modules to ensure separation of concerns and maintainability[cite: 3]:

- **Module A: Authentication & Routing** (Epic 1)
- **Module B: Customer Portal** (Epic 2)
- **Module C: Administrator Portal** (Epic 3)

---

## 2. Decomposition Matrix

### Module A: Authentication & Routing

| Element               | Specification Details                                                                                                                                                                                      |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Epic**              | Epic 1: Authentication & Role Management                                                                                                                                                                   |
| **User Story**        | **US-1.1:** As a User, I want to select my role (Customer or Admin) so that I am routed to the correct dashboard.                                                                                          |
| **Workflow**          | 1. User visits `/` (Landing Page).<br>2. Clicks "Login as Customer" or "Login as Admin".<br>3. System sets local auth state/cookie.<br>4. Router redirects to `/customer/dashboard` or `/admin/dashboard`. |
| **Business Rules**    | **BR-01:** Unauthenticated users attempting to access `/customer/*` or `/admin/*` must be redirected to `/`.                                                                                               |
| **Validation Rules**  | None (Mock authentication assumes successful token generation for the selected role).                                                                                                                      |
| **Spec Units (Tech)** | **UI:** `app/page.tsx` (Landing view with 2 buttons).<br>**Routing:** Next.js `useRouter` for client-side navigation.                                                                                      |

---

### Module B: Customer Portal

| Element               | Specification Details                                                                                                                                              |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Epic**              | Epic 2: Customer Self-Service Experience                                                                                                                           |
| **User Story**        | **US-2.1:** As a Customer, I want to view my current active plan and available plans.                                                                              |
| **Workflow**          | 1. User accesses `/customer/dashboard`.<br>2. UI fires `GET /api/user/plan` and `GET /api/plans`.<br>3. UI renders "Current Plan" card and "Available Plans" grid. |
| **Business Rules**    | **BR-02:** Only plans with `status='ACTIVE'` in the master database should be displayed in the available grid.                                                     |
| **Validation Rules**  | Session ID must be valid before returning user data.                                                                                                               |
| **Spec Units (Tech)** | **UI:** `components/CustomerDashboard.tsx`.<br>**API:** `app/api/plans/route.ts` (GET).                                                                            |

| Element               | Specification Details                                                                                                                                                                                                                        |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Epic**              | Epic 2: Customer Self-Service Experience                                                                                                                                                                                                     |
| **User Story**        | **US-2.2:** As a Customer, I want to switch my subscription plan.                                                                                                                                                                            |
| **Workflow**          | 1. User clicks "Switch to this Plan".<br>2. Clicks "Confirm" in modal.<br>3. UI fires `POST /api/subscriptions`.<br>4. API validates request.<br>5. Service Layer executes SQL transaction.<br>6. UI shows success alert and refreshes data. |
| **Business Rules**    | **BR-03 (IDOR):** API must verify `requestedUserId === auth.userId`.<br>**BR-04 (ACID):** Database must execute `UPDATE` (old plan), `INSERT` (new plan), and `INSERT` (audit log) inside a strict `BEGIN/COMMIT` block.                     |
| **Validation Rules**  | Payload must match Zod schema: `requestedUserId` (UUID), `newPlanId` (UUID), `planName` (String, max 100).                                                                                                                                   |
| **Spec Units (Tech)** | **API:** `app/api/subscriptions/route.ts` (POST).<br>**Service:** `services/subscriptionService.ts`.<br>**Schema:** Zod `planChangeSchema`.                                                                                                  |

---

### Module C: Administrator Portal

| Element               | Specification Details                                                                                                                                                            |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Epic**              | Epic 3: Administrator Operations                                                                                                                                                 |
| **User Story**        | **US-3.1:** As an Admin, I want full CRUD capabilities for telecom plans.                                                                                                        |
| **Workflow**          | 1. Admin accesses `/admin/dashboard`.<br>2. Clicks "+ Create New Plan".<br>3. Fills out form and submits.<br>4. UI fires `POST /api/plans`.<br>5. Table refreshes with new plan. |
| **Business Rules**    | **BR-05:** Price must be > 0. Data Limit must be > 0. <br>**BR-06:** Cannot DELETE a plan if active subscriptions exist (Foreign Key constraint).                                |
| **Validation Rules**  | Payload schema: `planName` (String), `price` (Number), `dataLimit` (Number).                                                                                                     |
| **Spec Units (Tech)** | **UI:** `components/AdminDashboard.tsx` (Table + Modal).<br>**API:** `app/api/plans/route.ts` (POST, DELETE).                                                                    |

| Element               | Specification Details                                                                                                                                                                      |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Epic**              | Epic 3: Administrator Operations                                                                                                                                                           |
| **User Story**        | **US-3.2:** As an Admin, I want to view and export a secure audit log.                                                                                                                     |
| **Workflow**          | 1. Admin scrolls to "Audit Logs" section on dashboard.<br>2. UI fires `GET /api/logs`.<br>3. Table populates with chronological history.<br>4. Admin clicks "Export CSV" to download file. |
| **Business Rules**    | **BR-07:** Audit logs are immutable (no UPDATE or DELETE APIs exist for the `audit_logs` table).                                                                                           |
| **Validation Rules**  | None for retrieval.                                                                                                                                                                        |
| **Spec Units (Tech)** | **API:** `app/api/logs/route.ts` (GET).<br>**UI:** Client-side CSV generation utility function.                                                                                            |
