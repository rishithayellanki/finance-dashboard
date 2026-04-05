# FinFlow — Personal Finance Dashboard

A clean, interactive finance dashboard built with React. Track income, expenses, and gain insights into spending patterns with role-based access control.

---

## Live Demo

> Deploy via [StackBlitz](https://stackblitz.com) or [CodeSandbox](https://codesandbox.io) by importing this repository, or run locally following the instructions below.

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn

### Local Development

```bash
# 1. Clone or unzip the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
finance-dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── TxRow.jsx
│   │   ├── TxModal.jsx
│   │   ├── BarChart.jsx
│   │   └── DonutChart.jsx
│   ├── context/
│   │   └── AppContext.jsx   # Global state (React Context)
│   ├── data/
│   │   └── transactions.js  # Mock transaction dataset
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── views/
│   │   ├── DashboardView.jsx
│   │   ├── TransactionsView.jsx
│   │   └── InsightsView.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
└── README.md
```

---

## Feature Overview

### 1. Dashboard Overview
The main overview page shows:
- **4 Summary Cards** — Total Balance, Monthly Income, Monthly Expenses, Net Savings — each with month-over-month percentage change
- **Expense Trend Bar Chart** — Visual comparison of spending across the last 3 months
- **Spending Donut Chart** — Categorical breakdown of all expenses with a legend
- **Recent Transactions** — The 5 most recent entries with category icons and color-coded amounts

### 2. Transactions Section
A fully filterable and sortable transaction list:
- **Search** — Real-time text search across description and category fields
- **Category Filter** — Dropdown to isolate a single spending category
- **Type Filter** — Toggle between income, expense, or all
- **Sorting** — Sort by date, amount, or category in ascending/descending order
- **Export** — One-click CSV download of the current filtered view
- **Admin Controls** — Edit and delete buttons appear when role is set to Admin

### 3. Role-Based UI
Roles are simulated on the frontend without any backend dependency:
- **Viewer** — Read-only access; all data is visible but no mutations are allowed
- **Admin** — Full access; can add new transactions, edit existing ones, and delete entries

Role switching is available via a dropdown in the sidebar and also in the header bar. The current role is clearly labeled throughout the UI. No page reload is required — the UI updates reactively.

### 4. Insights Section
Automatically derived observations from the transaction data:
- **Top Spending Category** — The category with the highest cumulative spend, with its share of total expenses
- **Month-over-Month Change** — Percentage change in spending from the previous month to the current one
- **Savings Rate** — Net savings divided by total income, expressed as a percentage with a health indicator
- **Category Breakdown** — Horizontal bar chart showing proportional spend per category
- **Monthly Comparison** — Side-by-side income vs expense bars for each recorded month
- **Quick Takeaways** — Plain-language observations derived from the data

### 5. State Management
State is managed using **React Context API** — a deliberate choice to avoid over-engineering for this scale of application.

The `AppContext` holds:
- `transactions` — Full transaction list (read/write)
- `role` — Current user role (`viewer` | `admin`)
- `darkMode` — Theme preference
- `filterCat`, `filterType`, `search` — Active filter state
- `sortBy`, `sortDir` — Sort configuration
- `showModal`, `editTx` — Modal open state and currently editing transaction

All state is persisted to `localStorage` so data survives page refreshes.

### 6. UI & UX
- **Typography** — DM Sans (UI) paired with DM Mono (numeric values) for visual clarity
- **Color coding** — Each spending category has a consistent color used across charts, icons, and badges
- **Responsive** — Sidebar collapses on mobile; grid layouts reflow to single-column; extraneous columns hide at small breakpoints
- **Dark mode** — Full dark theme with a toggle in the sidebar; preference is persisted
- **Empty states** — The transactions list shows a friendly message when filters return no results
- **Animations** — Smooth fade-in on tab changes, progress bars animate on mount, buttons have micro-interaction hover/press states

---

## Optional Enhancements Included

| Feature | Status |
|---|---|
| Dark mode | ✅ Implemented |
| Data persistence (localStorage) | ✅ Implemented |
| Export to CSV | ✅ Implemented |
| Animated transitions | ✅ Implemented |
| Advanced filtering | ✅ Implemented |

---

## Approach & Assumptions

**Framework:** React with Vite — fast, minimal setup, industry standard for SPAs.

**Styling:** Vanilla CSS-in-JS (inline styles + a scoped `<style>` block). No external CSS library was introduced to keep the bundle lean and demonstrate direct CSS control. In a production codebase, I would reach for Tailwind or CSS Modules.

**Data:** Fully static mock data representing 3 months of realistic transactions for an Indian household (INR currency). The data is stored in state and can be mutated at runtime by Admin users, with changes persisted via localStorage.

**Charts:** Custom-built SVG charts (donut, bar, progress bars) rather than a charting library. This keeps the dependency footprint small and demonstrates ability to work with raw geometry.

**Scalability:** The Context + custom hook pattern chosen here would cleanly migrate to Zustand or Redux Toolkit if the application grew significantly — the interface contract would remain the same.

---

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool and dev server
- **React Context API** — State management
- **LocalStorage** — Client-side persistence
- **DM Sans / DM Mono** — Google Fonts (typography)

---

## Author Notes

This project was designed to reflect how I think about frontend work: start with clear data contracts, build composable components, and prioritize readability for the user above all. The role-based UI is intentionally lightweight — the goal was to demonstrate the pattern, not simulate a full auth system.

All data is mock / fictional. No external APIs were called.
