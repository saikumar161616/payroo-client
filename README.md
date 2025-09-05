# Payroo Mini Payrun — Client

A React + TypeScript frontend for the Payroo Mini Payrun assessment.  
This app allows you to manage employees, enter timesheets, run payruns, and view payslips.

---

## 🚀 Features

- **Employees:** List, add, and edit employees.
- **Timesheets:** Enter weekly timesheets for employees.
- **Payrun:** Run payroll for a selected period and employees.
- **Payslips:** View and download payslips.
- **Accessibility:** Labeled forms, keyboard navigation, accessible tables.
- **API Integration:** Uses REST API endpoints as per OpenAPI spec.
- **React Query:** For efficient data fetching and caching.
- **Validation:** Client-side validation for forms.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20.9.0 recommended) : v18+
- npm or yarn

### Installation

1. **Clone the repo:**

   git clone https://github.com/saikumar161616/payroo-client.git
   cd payroo-client


2. **Install dependencies:**
   
   npm install
 

3. **Start the app:**

   npm start

   The app runs at http://localhost:3000.

---

## ⚙️ Configuration

- API base URL is set in [`src/config/config.ts`](src/config/config.ts).
- By default, it points to `http://localhost:5000/api`.

---




## 📝 Notes

- This is a demo app for assessment purposes.
- Backend API must be running for full functionality.

---