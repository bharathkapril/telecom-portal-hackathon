### ⚠ JURY EVALUATION REQUIREMENT: AI GENERATION PROMPT

**The following markdown prompt was used to generate this deliverable via the AI Assistant:**

> **Prompt:**
> Act as a Lead Systems Analyst. Generate Deliverable 6: SPECS / DSL in Markdown/YAML for our "Telecom Plan Management Portal".
> The rubric strictly requires structured specifications for each story component, including field definitions, screen behavior, validation rules, APIs, and a hierarchical file tree layout. Structure the data models and API specs in YAML block format for developer readability.

---

# Deliverable 6: SPECS / DSL (Domain Specific Language)

## 1. Hierarchical File Tree Layout

```text
TELECOM-PORTAL/
├── app/
│   ├── api/
│   │   ├── logs/route.ts              # GET: Fetch audit logs
│   │   ├── plans/route.ts             # POST, DELETE, GET: Plan CRUD
│   │   └── subscriptions/route.ts     # POST: Handle plan switching
│   ├── globals.css                    # Tailwind configurations
│   └── page.tsx                       # Main Application Wrapper
├── components/
│   ├── AdminDashboard.tsx             # Administrator UI Dashboard
│   └── CustomerDashboard.tsx          # Customer UI Dashboard
├── constants/
│   └── subscription.ts                # Enums (ACTIVE, INACTIVE)
├── lib/
│   └── db.ts                          # PostgreSQL pg pool configuration
├── services/
│   └── subscriptionService.ts         # Database transaction logic
├── types/
│   └── index.ts                       # Shared TypeScript interfaces
├── utils/
│   └── logger.ts                      # Structured logging utility
├── .env.local                         # Database connection string
└── package.json                       # Next.js & Zod dependencies
```

## 2. API & Data Model Specifications (YAML DSL)

### A. Subscription Management Spec

```yaml
Component: PlanSwitchingAPI
Endpoint: /api/subscriptions
Method: POST
Description: Handles customer requests to upgrade or downgrade telecom data plans.
Authentication: Required (Valid User Session Token)

Payload_Schema:
  requestedUserId:
    type: string
    format: uuid
    validation: "Must match auth.userId (Anti-IDOR)"
    required: true
  newPlanId:
    type: string
    format: uuid
    required: true
  planName:
    type: string
    validation: "min_length: 1, max_length: 100"
    required: true

Screen_Behavior:
  On_Click_Switch: "Open Confirmation Modal"
  On_Confirm: "Disable button -> Show Loading Spinner -> Fire POST request"
  On_Success: "Close Modal -> Show Green Toast -> Update Active Plan Card UI"
  On_Error: "Keep Modal Open -> Show Red Error Toast with message"

Database_Transaction_Rules:
  Isolation_Level: READ COMMITTED
  Steps:
    1: UPDATE subscriptions SET status = 'INACTIVE' WHERE user_id = $userId
    2: INSERT INTO subscriptions (user_id, plan_id, status) VALUES ($userId, $newPlanId, 'ACTIVE')
    3: INSERT INTO audit_logs (user_id, action_taken) VALUES ($userId, 'Upgraded/Downgraded')
  On_Failure: ROLLBACK all steps
```

### B. Plan Management Spec (Admin)

```yaml
Component: PlanCrudAPI
Endpoint: /api/plans
Method: POST
Description: Allows administrators to create new telecom plans.
Authentication: Required (Valid Admin Session Token)

Payload_Schema:
  planName:
    type: string
    validation: "min_length: 3, max_length: 50"
    required: true
  price:
    type: decimal
    validation: "Must be > 0"
    required: true
  dataLimitGb:
    type: integer
    validation: "Must be > 0"
    required: true

Validation_Rules:
  Sanitization: "Trim whitespace from planName. Prevent SQL injection via parameterized pg queries."
```
