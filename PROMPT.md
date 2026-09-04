@workspace I need to build a full-stack Web Application in TypeScript with a React frontend to fetch, process, and display SEC EDGAR filings for companies using their ticker symbols.

Please generate the project structure, backend API, and frontend UI following these specific requirements:

### 1. Technology Stack

- **Language:** TypeScript (Strict mode)
- **Frontend:** React (Vite + React Router + Tailwind CSS or Shadcn UI for fast styling)
- **Backend:** Node.js/Express or Bun/Elysia (REST API)
- **HTTP Client:** Fetch or Axios (Note: SEC API requires a custom `User-Agent` header in the format `Sample Company Name AdminContact@<sample company domain>.com`)

---

### 2. Backend API Requirements

#### A. CIK Resolution & Data Normalization

- Map ticker symbols (e.g., AAPL, SPOT, JPM) to 10-digit zero-padded CIK numbers using `https://www.sec.gov/files/company_tickers.json`.
- Fetch company submission history from `https://data.sec.gov/submissions/CIK{10-digit-CIK}.json`.
- Convert EDGAR’s columnar JSON format (`recent` object with arrays like `accessionNumber`, `filingDate`, `form`, `primaryDocument`, etc.) into an array of standardized filing objects.
- Construct the direct URL for each filing document on sec.gov (`https://www.sec.gov/Archives/edgar/data/{CIK}/{accessionNumber_without_hyphens}/{primaryDocument}`).

#### B. Endpoints to Implement

1. **`GET /api/companies/:ticker/filings`**
   - **Query Parameters:** `page` (default 1), `limit` (default 20), `formType` (optional filter, e.g., 10-K, 10-Q, 8-K), `sortBy` (filingDate), `order` (asc|desc).
   - **Response:** Paginated list of normalized filing objects with pagination metadata (total, page, limit, totalPages) and direct SEC document links.

2. **`GET /api/filings/summary`**
   - **Query Parameters:** `tickers` (comma-separated list, e.g., `tickers=AAPL,SPOT,JPM`).
   - **Response:** Summary object per company containing:
     - Number of filings per `form` type over the last 12 months.
     - The exact date of its most recent `10-K` filing.

---

### 3. Frontend UI Requirements

#### A. Interactive Filings Viewer

- **Company Switcher:** Search input or dropdown to select/enter company tickers (e.g., Apple, Spotify, JPMorgan Chase).
- **Filters & Sorting:** Controls to filter by form type (e.g., 10-K, 10-Q, 8-K) and sort by filing date (ascending/descending).
- **Data Table / List:** Display filing date, form type, report description/title, and a direct link to open the original SEC document in a new tab.
- **Pagination:** Next/Previous buttons and page indicators.

#### B. Summary View

- A dedicated dashboard/view that accepts a set of tickers and renders:
  - Form distribution over the last 12 months (e.g., via cards, simple bar charts, or summary tables).
  - Highlighted card showing the latest `10-K` filing date for each selected company.

---

### 4. Code & Setup Deliverables

1. Complete folder layout (e.g., `/client` and `/server` or unified monorepo).
2. Clean separation of API routing, SEC integration logic, and UI components.
3. Proper error handling for invalid tickers, missing SEC responses, and network timeouts.
4. Clear `README.md` containing instructions on how to install dependencies, run the backend and frontend, and test the endpoints.

Please start by outlining the recommended file structure, then provide the code step-by-step.
