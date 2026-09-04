# Quartr SEC Filing Desk

A TypeScript full-stack application for exploring SEC EDGAR filings by ticker. The React/Vite client calls an Express REST API. The server validates request and environment input with Zod, resolves SEC CIKs, normalizes filings, and caches normalized filings and summaries in Redis.

**The repository is initialized by AI Assistant. Frontend is mostly built by AI as well due to time constraints.**
My contribution primarily involves setting up the project structure, backend API, and initial frontend components. I see some gaps and potential enhancements in the current implementation, especially in the frontend UI and additional features for the filings dashboard.

## Current Structure

```text
src/
├── api/client.ts                 Typed frontend API calls and endpoints
├── components/                  React UI components
│   ├── AppShell.tsx             Navigation and route composition
│   ├── FilingFilters.tsx        Ticker, form, and sort controls
│   ├── FilingsPage.tsx          Filing page state and data loading
│   ├── FilingsTable.tsx         Filing rows and pagination
│   ├── SummaryCard.tsx          Individual summary card
│   └── SummaryPage.tsx          Summary page state and data loading
├── constants/filings.ts         Preset and custom form types
├── types/api.ts                 Frontend response contracts
└── utils/format.ts              Shared date formatting

server/src/
├── app.ts                       Express app composition
├── index.ts                     Server bootstrap
├── controllers/                 Request parsing and response shaping
├── routes/                      Express routers
├── middleware/error-handler.ts  Centralized Zod/application errors
├── gateway/sec/                 SEC integration, normalization, and caching
├── gateway/cache/               Redis client and cache helpers
├── config/config.ts             Environment schema and runtime config
├── validation/index.ts          Request schemas
└── utils/                       Server utility functions
```

## Requirements

- Node.js 20 or newer
- npm
- Docker Desktop, if running the complete containerized stack

The server uses Node's built-in `fetch`, so no separate HTTP client package is required.

## Environment

Copy the example file before running Docker Compose:

```powershell
Copy-Item .env.example .env
```

Set a real descriptive SEC user agent in `.env`. SEC requires a company name and contact email:

```env
SEC_USER_AGENT=Sample Company Name AdminContact@samplecompany.com
```

Available settings are documented in [.env.example](.env.example). Do not commit `.env`; it is ignored by git.

Redis URLs depend on where the server runs:

```env
# Server running directly on Windows
REDIS_URL=redis://localhost:6379

# Server running inside Docker Compose
REDIS_URL=redis://redis:6379
```

## Local Development

Install dependencies for both workspaces:

```powershell
npm install
npm install --prefix server
```

Start the API and frontend in separate PowerShell terminals:

```powershell
npm run dev:server
npm run dev
```

Or start both through the root script:

```powershell
npm run dev:all
```

The frontend is available at `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:3001`.

## Docker Compose

Copy `.env.example` to `.env`, set `SEC_USER_AGENT`, then build and start all services:

```powershell
docker compose up --build
```

Compose starts:

- React client served by Nginx at `http://localhost:5173`
- Express API on the internal Compose network at port `3001`
- Redis 7 with a persistent `redis-data` volume

Stop the services:

```powershell
docker compose down
```

Remove the Redis volume as well:

```powershell
docker compose down -v
```

The Dockerfiles and Compose file use explicit image versions rather than floating `latest` tags. Update versions deliberately, rebuild, and run the checks below.

## API Endpoints

```text
GET /api/health
GET /api/companies/:ticker/filings?page=1&limit=20&formType=10-K&order=desc
GET /api/filings/summary?tickers=AAPL,SPOT,JPM
```

Filing responses contain normalized `accessionNumber`, `filingDate`, `form`, `primaryDocument`, `primaryDocDescription`, `reportDate`, and a direct SEC `documentUrl`.

`formType` supports preset values such as `10-K`, `10-Q`, and `8-K`, as well as custom SEC form types. Omitting the parameter or sending an empty value returns all forms.

The API returns structured `400` errors for invalid tickers and query parameters. SEC failures and request timeouts are also returned as JSON errors.

## Verification

Run the frontend checks:

```powershell
npm run build
npm run lint
```

Run the server TypeScript build:

```powershell
npm --prefix server run build
```

Validate the Compose configuration without starting containers:

```powershell
docker compose config
```
