# SagaForms - Dynamic Form Builder SaaS

> **Built for the Full-Stack Engineering Hackathon**

SagaForms is a production-grade, highly secure, and dynamic form builder SaaS. It enables creators to design custom forms with advanced validation, publish them to the public or keep them unlisted, and collect rich analytics. 

This project was built from the ground up using the provided Turborepo starter, strictly adhering to the functional and non-functional requirements provided by the judges.

---

## 🚀 Quick Links & Demo

- **Live Application:** [`https://typeform-web-swart.vercel.app/`]
- **API Documentation (Scalar):** [Insert Vercel Link Here]/docs *(or `https://typeform-ckmt.onrender.com/docs` locally)*

### 🔑 Demo Credentials (Judge Review)
We have prepared a fully seeded demo environment so you can review the product instantly. The database has been pre-populated with **3 sample forms** (Movies, Startups, Gaming) and **48 realistic user responses** for analytics.

- **Email:** `demo@sagaforms.com`
- **Password:** `demo1234`
*(Note: You can also just click the "Log in as Demo User" button on the Sign-In page!)*

---

## 🏗️ Folder Structure

SagaForms uses a **Turborepo** monorepo architecture to cleanly separate concerns while sharing types and utilities across the stack.

```text
sagaforms/
├── apps/
│   ├── api/                # Express backend server, Rate Limiting, Scalar API Docs setup
│   └── web/                # Next.js 15 frontend, TailwindCSS, React Hook Form UI
├── packages/
│   ├── database/           # Drizzle ORM, PostgreSQL schema models, and Seed Scripts
│   ├── logger/             # Shared Winston logger utility
│   ├── services/           # Core business logic (Auth, Forms, Fields, Emails, Submissions)
│   ├── trpc/               # tRPC router definitions, Zod validation schemas, API middlewares
│   ├── eslint-config/      # Shared linting rules
│   └── typescript-config/  # Shared tsconfig definitions
└── package.json            # Turborepo workspace configuration
```

---

## 🔄 Application User Flow

How does a user interact with SagaForms? Here is the complete end-to-end journey of a Creator and a Respondent.

### 1. Authentication & Onboarding
1. A **Creator** visits the beautifully animated Landing Page.
2. They navigate to the Login/Signup page and enter their email and password.
3. The `apps/web` frontend sends a tRPC mutation to the backend.
4. The backend securely hashes the password using a generated salt and `crypto.createHmac`.
5. A secure JWT is generated and attached to the Creator's session via an `HTTP-Only`, `SameSite=Strict` cookie.
6. The Creator is redirected to their protected **Dashboard**.

### 2. Form Creation & Management
1. Inside the Dashboard, the Creator clicks **"Create Form"**.
2. They enter a Title, Description, and select a Visibility mode (`Public` or `Unlisted`). 
3. The form is saved to the database in a `draft` status.
4. The Creator is taken to the **Form Builder**, where they can dynamically add Fields (Short Text, Email, Rating, Select, Yes/No, etc.).
5. **Drag-and-Drop Reordering:** Creators can seamlessly drag fields up and down to reorder them in real-time, powered by `@dnd-kit`.
6. Once satisfied, they click **Publish**, generating a shareable link.

### 3. Public Response Collection
1. A **Respondent** clicks the shareable link (no login required).
2. If the form is `Unlisted`, it can only be accessed directly via this link. If it is `Public`, it also appears on the public Explore page.
3. **Conditional Logic:** Forms adapt dynamically! Fields automatically show or hide based on the respondent's previous answers (e.g., if a user selects a specific dropdown option).
4. The Respondent fills out the dynamically generated UI. The frontend validates their input against advanced Zod schemas.
5. Upon submission, the backend verifies the form hasn't expired and hasn't hit its response limit.
6. The backend records an irreversible `ipHash` for the Respondent to prevent spam without storing their actual IP.
7. Transactional emails are dispatched to both the Creator (New Response Alert) and the Respondent (Thank You Receipt).

### 4. Analytics
1. The Creator returns to their Dashboard and clicks on the form.
2. They view a real-time table of recent submissions and a **Time-Series Chart** plotting form submissions over the last 30 days.

### 📊 Flow Diagram

```mermaid
sequenceDiagram
    participant C as Creator
    participant F as Frontend (Next.js)
    participant B as Backend (tRPC)
    participant DB as Database (Postgres)
    participant R as Respondent

    C->>F: Visits Landing Page & Signs Up
    F->>B: POST /trpc/auth.createUser
    B->>DB: Hash Password & Insert User
    B-->>F: Set HTTP-Only JWT Cookie
    F-->>C: Redirect to Dashboard

    C->>F: Creates Form & Adds Fields
    F->>B: POST /trpc/form.createForm
    B->>DB: Insert Form (Status: Draft)
    F->>B: POST /trpc/formField.create
    B->>DB: Insert Dynamic Fields (Text, Rating)
    
    C->>F: Clicks "Publish"
    F->>B: PATCH /trpc/form.updateForm
    B->>DB: Set Status to Published
    F-->>C: Provide Shareable Link

    R->>F: Opens Form Link
    F->>B: GET /trpc/form.getFormById
    B->>DB: Fetch Form & Fields
    B-->>F: Return Form Data
    
    R->>F: Fills Form & Submits
    F->>B: POST /trpc/form.submitForm
    B->>B: Verify Rate Limit & Expiry
    B->>DB: Insert Form Response
    B-->>R: Show Success Confirmation
    
    C->>F: Opens Dashboard Analytics
    F->>B: GET /trpc/form.getSubmissions
    B-->>F: Return Live Analytics Data
```

---

## 🛡️ Security & Best Practices
A form builder deals with sensitive user data. This application was built with enterprise-level security in mind:

- **Strict Rate Limiting:** The backend utilizes `express-rate-limit` to prevent API abuse, DDoS attacks, and spam on public form submissions.
- **Advanced Authentication:** 
  - Custom JWT-based authentication system using HTTP-only cookies.
  - Passwords are never stored in plaintext. We generate a unique 16-byte cryptographically secure salt and hash passwords using HMAC-SHA256 (`crypto.createHmac`).
- **Duplicate Submission Protection:** Public form submissions generate an irreversible `ipHash` on the backend to prevent the same user from spamming a form, while keeping their actual IP anonymous.
- **Visibility Enforcement:** The backend strictly verifies if a form is `public`, `unlisted`, or `draft`. If a form is unpublished or expired (via `expiresAt`), the tRPC router entirely rejects the submission.

---

## ✅ Hackathon Requirements Checklist

### Core Features (Completed)
- [x] **Monorepo Structure:** Frontend and backend run as separate apps, sharing types and schemas.
- [x] **Creator Dashboard:** Secure authentication and management UI.
- [x] **Dynamic Form Builder:** Add, edit, and configure fields dynamically.
- [x] **Rich Field Types:** Supports Text, Email, Number, Select, Textarea, Rating, Yes/No, and more.
- [x] **Visibility Modes:** Supports `Public` (shows on Explore page) and `Unlisted` (hidden, link-only).
- [x] **Public Submissions:** Respondents can fill forms without logging in.
- [x] **Analytics:** Dashboard shows recent submissions and time-series response tracking.
- [x] **Email Notifications:** Integrated with `Resend` to send transactional emails to both Creators and Respondents upon submission.
- [x] **Scalar API Docs:** Fully interactive API reference deployed alongside the backend.

### Bonus Features Implemented 🌟
- [x] **Advanced Zod Validation:** Implemented Min/Max lengths, Min/Max values, and powerful Regex pattern matching for field inputs on top of standard required/optional states.
- [x] **Drag-and-Drop UX:** Integrated `@dnd-kit` in the form builder allowing creators to easily drag fields to reorder them visually.
- [x] **Conditional Logic:** Built dynamic evaluation logic that evaluates user input (`equals`, `contains`, `is_empty`) to conditionally hide/show subsequent fields in the public form.
- [x] **Password Protected Forms:** Creators can lock forms with a password.
- [x] **Response Limits & Expiry:** Forms automatically close when they hit a date or submission limit.
- [x] **Public Explore Page:** A template gallery showing all public forms.
- [x] **Better UX States:** Framer Motion animations, glassmorphism UI, and polished loading/error states.

---

## 💻 Local Setup Instructions

If you wish to run the project locally to review the source code:

**1. Clone & Install Dependencies**
```bash
git clone https://github.com/priyanshupandey12/typeform
cd sagaforms
pnpm install
```

**2. Environment Variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sagaforms"
JWT_SECRET="your_super_secret_jwt_key_here"
RESEND_API_KEY="re_your_api_key"
PORT=8000
```

**3. Database Setup & Seeding**
```bash
# Generate and push the Drizzle schema
pnpm --filter @repo/database db:generate
pnpm --filter @repo/database db:migrate

# Seed the database with the Demo User and 3 Themed Forms
pnpm --filter @repo/database db:seed
```

**4. Start the Application**
```bash
pnpm dev
```
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http:localhost:8000`
- **Scalar Docs:** `http:localhost:8000/docs`

---
*Built with ❤️ for the Hackathon.*
