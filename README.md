# Digital Heroes Platform — Level 1 Trainee Submission

> A subscription-driven web platform combining golf performance tracking (Stableford format), charity fundraising, and monthly draw-based prize pools. Built to embody an emotional, modern giving experience ("*Feel, not fairway*").

---

## 📌 Features & Architecture Overview

### 1. Rolling 5-Score Engine (§ 05)
* **Score limits**: Strictly between 1 and 45 points (Stableford format).
* **Date validation**: Exactly 1 score allowed per calendar date (duplicate dates rejected).
* **Automatic Rolling Retention**: Only the latest 5 scores are kept. Adding a 6th score automatically drops the oldest entry by date.
* **Ordering**: Displayed in reverse chronological order (newest first).

### 2. Draw & Reward Engine (§ 06 & § 07)
* **Modes**:
  * **Algorithmic**: Numbers are weighted by score frequency across all active golfers.
  * **Standard Random**: 5 uniform unique integers from 1 to 45.
* **Prize Pool Distribution**:
  * **5-Number Match (40% Share)**: **Jackpot with Rollover**. If nobody wins, the pool carries forward to next month's jackpot.
  * **4-Number Match (35% Share)**: Split equally among winners; no rollover.
  * **3-Number Match (25% Share)**: Split equally among winners; no rollover.
* **Admin Simulation**: Live simulation feature allows testing winner numbers and prize allocations before publishing.

### 3. Charity Contribution Model (§ 08)
* Direct at least 10% of subscription fees to a selected grassroots cause.
* Users can voluntarily increase their charity allocation (e.g. 15%, 25%, 50%).
* Searchable charity directory with event calendars and direct selection.

### 4. Winner Verification Workflow (§ 09)
* Eligible winners receive claim tickets in status `pending_proof`.
* Winners upload a screenshot/photo of their official golf scorecard or golf app record.
* Admin reviews the submission on the Admin Panel and marks as `Approved` or `Paid`.

---

## 🛠 Tech Stack

* **Frontend**: React.js (Vite), Tailwind CSS, Lucide icons.
* **Backend**: Node.js, Express.js.
* **Database**: PostgreSQL / Supabase (`supabase_schema.sql` included).
* **Testing**: Comprehensive logic test suite verifying all 8 core PRD mathematical and business constraints.

---

## 🚀 Getting Started Locally

### 1. Run the Logic Test Suite
Verify that all algorithms and edge cases pass:
```bash
npm run test
# OR
cd server && npm test
```

### 2. Start the Backend API
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:5000`.

### 3. Start the Frontend
In a new terminal:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🗄 Database Setup (Supabase PostgreSQL)

A complete, production-ready schema is located at `supabase_schema.sql`.

1. Open your [Supabase Dashboard](https://supabase.com).
2. Create a new project.
3. Open the **SQL Editor** tab.
4. Copy and paste the contents of `supabase_schema.sql` and click **Run**.
5. All 5 tables (`users`, `scores`, `charities`, `draws`, `winner_claims`), constraints, and initial seed data will be created instantly.

---

## 🔑 Test Credentials (For Evaluation Checklist)

* **Subscriber Account**:
  * Name: Alex Turner
  * Plan: Active Monthly
  * Scores: 5 loaded Stableford rounds
  * Charity: Youth Fairways & Dreams (15% contribution)
* **Admin Account**:
  * Accessible directly from the top navigation bar via the **Admin Panel** button.
  * Provides access to all 5 control surfaces (§ 11): Draw simulation & publishing, winner proof review, charity management, and KPI analytics.
