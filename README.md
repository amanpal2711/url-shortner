# URL Shortener

A full-stack URL shortener application with analytics dashboard.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + React Router
- **Backend:** Node.js + Express + TypeScript (tsx)
- **Database:** SQLite (via better-sqlite3)

## Features

- Shorten URLs with random 6-character codes
- Custom alias support
- Link expiry date setting
- Click tracking
- Dashboard with all shortened URLs
- Copy to clipboard
- Toast notifications
- Custom 404 page for missing/expired links
- Responsive dark-mode UI

## Project Structure

```
url-shortener/
├── package.json          # Root package with concurrent dev script
├── server/               # Node.js + Express API (TypeScript)
│   ├── src/
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   ├── database.ts   # SQLite database
│   │   └── index.ts      # API routes
│   ├── package.json
│   └── tsconfig.json
├── client/               # React + Vite (TypeScript)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # Toast context
│   │   ├── services/     # API calls
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed

### Install All Dependencies

```bash
npm run install:all
```

Or manually:

```bash
# Root dependencies (concurrently)
npm install

# Server dependencies
cd server && npm install

# Client dependencies
cd client && npm install
```

## Running the Application

### Development (Single Command)

```bash
npm run dev
```

This starts both server (port 3001) and client (port 5173) concurrently.

### Production

```bash
npm run build    # Build client
npm run start    # Start production server
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create short URL `{ longUrl, customAlias?, expiresAt? }` |
| GET | `/api/urls` | List all URLs |
| DELETE | `/api/urls/:code` | Delete a URL by code |
| GET | `/:code` | Redirect to original URL |
| GET | `/api/health` | Health check |

## Database Schema

SQLite database (`urls.db`) auto-created with:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PRIMARY KEY | Auto-increment ID |
| `code` | TEXT UNIQUE | Short code (6 chars) |
| `long_url` | TEXT | Original URL |
| `clicks` | INTEGER DEFAULT 0 | Click counter |
| `created_at` | DATETIME | Creation timestamp |
| `expires_at` | DATETIME | Optional expiry |

## Usage

1. Run `npm run dev` from the root directory
2. Open `http://localhost:5173` in your browser
3. Enter a long URL and click "Shorten URL"
4. Optionally set a custom alias or expiry date
5. Copy the generated short URL
6. Visit `http://localhost:3001/{code}` to be redirected
7. View all URLs and click counts in the dashboard
