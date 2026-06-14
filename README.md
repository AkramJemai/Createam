# Createam - Agency Management Platform

A full-stack web application for creative agencies to manage partnerships, clients, team members, and operations — with a public-facing portfolio and a private team dashboard.

---

## Overview

Createam serves two audiences simultaneously:

- **Public visitors** — Browse the agency's portfolio of partnerships, discover nearby projects on a map, view the agency profile and client directory, and submit a contact form.
- **Team members** — Log in to access a role-based dashboard for managing tasks, partnerships, meetings, AI tools, and more.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, TanStack Query v5 |
| Maps | Leaflet / React Leaflet |
| Backend | Laravel 9 (PHP 8.0+) |
| Auth | Laravel Sanctum (token-based) |
| Database | MySQL 8 |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Email | SMTP (Gmail) via Laravel Mail |

---

## Features

### Public
- Partnership gallery with category filters and search
- Nearby partnerships map (geolocation-based)
- Agency profile: timeline, team, statistics
- Client directory
- Contact / lead capture form
- User registration via invitation link
- Password reset flow

### Member Dashboard
- View assigned tasks and projects
- AI Prompt Generator — generates detailed image-generation prompts via Gemini
- Team member directory and notifications

### Chef / Admin Dashboard
- Full CRUD for partnerships (with image/video media)
- Client and contact/lead management
- Team invitations and member management
- Meeting scheduling and meeting-to-project conversion
- Task board with progress tracking
- Partnership category and job title management
- Agency info editor (branding, timeline, team, stats)
- Popular / trending partnerships view

---

## Project Structure

```
createam/
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/   # Auth, Agency, Partnership, Task, Meeting …
│   │   ├── Models/             # 15+ Eloquent models
│   │   └── Services/           # GeminiService (AI integration)
│   ├── database/migrations/    # 47+ schema migrations
│   ├── routes/api.php          # RESTful API routes
│   └── .env.example
│
└── frontend/         # React SPA
    └── src/
        ├── pages/              # Home, Partnership, Agency, Admin, Login …
        ├── components/
        │   ├── admin/          # Admin dashboard components
        │   ├── chef/           # Chef dashboard components
        │   └── member/         # Member dashboard + AI Prompt Generator
        └── services/           # API client and auth helpers
```

---

## Getting Started

### Prerequisites

- PHP 8.0+
- Composer
- MySQL 8.0+
- Node.js & npm

---

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Create a MySQL database named `createam`, then update `.env`:

```env
DB_DATABASE=createam
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run migrations and start the server:

```bash
php artisan migrate
php artisan serve        # http://localhost:8000
```

Optionally seed sample data:

```bash
php artisan db:seed
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start              # http://localhost:3000
```

---

### Environment Variables

**Backend — `backend/.env`**

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=createam
DB_USERNAME=root
DB_PASSWORD=

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your@email.com
```

**Frontend — `frontend/.env` (optional)**

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

---

## User Roles

| Role | Access |
|---|---|
| `admin` | Full access — all dashboard features |
| `chef` | Partnership and team management |
| `member` | Assigned tasks and AI tools only |

New users join via an invitation link sent by an admin.

---

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/partnerships` | List all partnerships |
| GET | `/api/partnerships/nearby` | Geolocation-based search |
| GET | `/api/agency` | Agency profile data |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/login` | Authenticate |
| POST | `/api/ai/generate-prompt` | Generate AI image prompt |
| POST | `/api/ai/summarize-nearby` | AI summary of nearby projects |

---

## Build for Production

```bash
# Frontend
cd frontend && npm run build

# Backend — configure your web server to point to backend/public/
```
