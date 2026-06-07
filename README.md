# LTFS AI Microloan Audio Extraction Platform

> **Larson Turbo Financial Services** — AI-Powered Rural Financial Profiling System  
> Built by **NobleCraft IT Solutions**

## Overview

A production-quality MVP that converts multilingual customer interview audio recordings into structured microloan application data using Google Gemini 2.5 Pro.

### How It Works

```
Audio Upload → Gemini 2.5 Pro Analysis → Full Transcript → Structured Extraction → Professional Application Form
```

### Key Features

- **Single AI Pipeline** — Gemini handles transcription and extraction in one pass
- **Evidence-Based Extraction** — Every field includes the exact transcript snippet as proof
- **Multilingual Support** — Hindi-English, Punjabi-English, and rural dialect handling
- **Structured Output** — Gemini returns validated JSON via response schema enforcement
- **Professional UI** — Premium dark-themed interface with ShadCN components

---

## Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **Python 3.12+**
- A valid **Google Gemini API key** with access to Gemini 2.5 Pro

### 1. Clone and Configure

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Start the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the Application

Visit [http://localhost:3000](http://localhost:3000)

---

## Docker Deployment

```bash
# Create .env with your GEMINI_API_KEY
cp .env.example .env

# Build and run
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ | — | Google Gemini API key |
| `GEMINI_MODEL` | ❌ | `gemini-2.5-pro` | Gemini model identifier |
| `NEXT_PUBLIC_API_URL` | ❌ | `http://localhost:8000` | Backend API URL for frontend |

---

## API Endpoints

### `POST /api/process-audio`

Upload an audio file for transcription and extraction.

**Request:** `multipart/form-data` with `file` field

**Supported formats:** MP3, WAV, M4A

**Max file size:** 50 MB

**Response:**
```json
{
  "status": "success",
  "data": {
    "name": { "value": "Ramesh Kumar", "evidence": "mera naam Ramesh Kumar hai" },
    "current_income": { "value": 15000, "evidence": "mahine ka 15000 milta hai" },
    "transcript": "Full conversation transcript..."
  },
  "raw_response": "..."
}
```

### `GET /api/health`

Health check endpoint.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, TailwindCSS v4, ShadCN UI |
| Backend | FastAPI, Python 3.12, Pydantic v2 |
| AI | Google Gemini 2.5 Pro (structured output) |
| Deployment | Docker, Docker Compose |

---

## Project Structure

```
ltfs-online/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # Pages and layout
│   │   ├── components/        # React components
│   │   │   ├── ui/            # ShadCN UI primitives
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── audio-upload.tsx
│   │   │   ├── processing-status.tsx
│   │   │   ├── application-form.tsx
│   │   │   ├── transcript-panel.tsx
│   │   │   ├── audio-player.tsx
│   │   │   └── developer-view.tsx
│   │   └── lib/               # Utilities and types
│   └── Dockerfile
├── backend/                   # FastAPI application
│   ├── app/
│   │   ├── main.py            # App entry point
│   │   ├── config.py          # Settings
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Gemini integration
│   │   ├── models/            # Pydantic schemas
│   │   └── prompts/           # AI prompts
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Extracted Fields

| Field | Type | Description |
|---|---|---|
| `name` | string | Applicant's full name |
| `current_income` | number | Monthly income (₹) |
| `type_of_employment` | string | Employment category |
| `family_members` | integer | Total family members |
| `members_above_18` | integer | Adults in household |
| `members_employed` | integer | Working members |
| `children_count` | integer | Number of children |
| `school_type` | string | Government / Private |
| `side_business` | boolean | Has side business |
| `business_type` | string | Type of side business |
| `owns_house` | boolean | Owns their house |
| `house_type` | string | Pucca / Semi-Pucca / Kaccha |
| `existing_loans` | boolean | Has active loans |
| `monthly_emi` | number | Current EMI amount (₹) |
| `farm_animals` | integer | Number of farm animals |
| `farm_land` | string | Land area with unit |
| `income_from_land` | number | Agricultural income (₹) |
| `cooking_fuel` | string | LPG / Wood / Biomass etc. |
| `one_time_expense` | string | Major one-time expense |

---

## License

Proprietary — Larson Turbo Financial Services × NobleCraft IT Solutions
