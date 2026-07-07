# AI-Driven SDLC Telecom Portal & Code Quality Checker

A full-stack, production-ready telecom plan management portal built using the App Router architecture, paired with a standalone Python AI Agent for automated code reviews. Developed under standard SDLC delivery metrics for the TCS Hackathon.

---

## 🏗️ Project Architecture & Deliverables

This repository is structured as a unified solution fulfilling all 9 required SDLC deliverables:

- **Deliverables 1-2:** Functional Requirements (FRD) & App Architecture Docs
- **Deliverables 3-4:** RDBMS PostgreSQL Schema Design & UI/UX Component Specifications
- **Deliverable 5:** Full-Stack Working Software (Next.js & TypeScript)
- **Deliverables 6-7:** Functional Test Scripts & Requirements Traceability Matrix (Excel formats)
- **Deliverable 8:** End User Help Manual
- **Deliverable 9:** Custom AI Code Quality Checker Agent (Python & Streamlit)

---

## 🚀 Getting Started

### 1. Database Setup (PostgreSQL)

1. Open **pgAdmin 4** or your preferred SQL terminal and create a database named `telecom_db`.
2. Open the **Query Tool**, paste the database schema and seed script located in the project's design docs, and execute (`F5`).

### 2. Full-Stack Web Portal Setup (Next.js)

Navigate to the frontend web directory, install the required packages, configure the database connection, and start the local development server:

```bash
# Navigate to the portal
cd telecom-portal

# Install production dependencies
npm install pg
npm install -D @types/pg

# Configure your environment variable
# Create a .env.local file and add your database URL:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/telecom_db"

# Start the full-stack server
npm run dev
```
