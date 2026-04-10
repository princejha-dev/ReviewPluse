# ReviewPulse — Restaurant Feedback Analysis

AI-powered customer feedback analysis built specifically for restaurants. Upload your reviews CSV and get instant sentiment analysis, issue detection, and strength identification.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Recharts |
| Backend | FastAPI, SQLAlchemy, Uvicorn |
| Database | PostgreSQL |
| AI | Groq (via `groq` SDK) |

---

## Prerequisites

- **Python 3.11+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **PostgreSQL** — [Download](https://www.postgresql.org/download/) (or use pgAdmin4)
- **Groq API Key** — [Get from Groq](https://groq.com/)

---

## Setup Guide

### 1. Clone / Download the Project

```powershell
cd "c:\Users\Prince\Desktop\Surf Project"
```

### 2. Create PostgreSQL Database

Open **pgAdmin4** and create a new database:
```
Database name: feedback_analysis_db
User: postgres
Password: <your password
Port: 5432
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/feedback_analysis_db
GROQ_API_KEY=your_actual_groq_api_key_here
```

> ⚠️ Replace `your_actual_groq_api_key_here` with your real API key from [Groq](https://groq.com/)

### 4. Setup Python Virtual Environment & Install Backend Dependencies

```powershell
python -m venv myenv
myenv/scripts/activate
pip install -r requirements.txt
pip install groq
```

### 5. Install Frontend Dependencies

```powershell
cd frontend-v2
npm install
cd ..
```

---

## Running the Application

### Start Backend (Terminal 1)

```powershell
cd "c:\Users\Prince\Desktop\Surf Project"
myenv/scripts/activate
uvicorn backend.main:app --reload
```

Backend runs at: **http://127.0.0.1:8000**

### Start Frontend (Terminal 2)

```powershell
cd "c:\Users\Prince\Desktop\Surf Project\frontend-v2"
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## How to Use

1. Open **http://localhost:3000**
2. Scroll to **"Get Started"** section
3. Upload a CSV file with a `review_text` column (and optional `rating` column)
4. Click **"Upload & Analyze"**
5. AI processes reviews in batches of 15 (with 5s delay between batches)
6. You are redirected to the **Dashboard** with real results

---

## CSV File Format

Your CSV must have a `review_text` column. `rating` is optional.

```csv
review_text,rating
"The food was amazing and fresh!",5
"Waited 45 minutes for our order",2
"Staff was incredibly friendly and attentive",5
"The restrooms were not clean",1
"Beautiful ambience, perfect for a date night",4
```

---

## Hardcoded Categories

The app analyzes feedback across **5 restaurant categories**:

| Category | What It Covers |
|----------|---------------|
| `staff` | Service quality, friendliness, professionalism |
| `food_quality` | Taste, freshness, presentation, portions |
| `ambience` | Atmosphere, decor, music, lighting, seating |
| `wait_time` | Wait for food, service, or table |
| `hygiene` | Cleanliness, sanitation, washrooms |

- **Positive sentiment** → category = **Strength** 💪
- **Negative sentiment** → category = **Issue** ⚠️
- **Neutral sentiment** → category = **Observation** 📝

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/upload` | Upload CSV, auto-processes in batches of 15 |
| `GET` | `/api/summary` | Dashboard stats (strengths vs issues) |
| `GET` | `/api/feedback` | List all feedbacks with analysis |
| `GET` | `/api/trend` | Sentiment trend by date |
| `GET` | `/api/insights` | Issue/strength breakdown + KPIs |
| `GET` | `/api/alerts` | Dynamic alerts (spikes, repeated complaints) |

---

## Project Structure

```
Surf Project/
├── requirements.txt              # Python dependencies
├── backend/
│   ├── main.py                   # FastAPI app entry point
│   ├── db/
│   │   ├── database.py           # PostgreSQL connection
│   │   ├── models.py             # SQLAlchemy models 
│   │   └── crud.py               # Database operations 
│   ├── routes/
│   │   ├── auth.py               # Authentication endpoints
│   │   └── feedback.py           # API endpoints
│   ├── services/
│   │   ├── ai_service.py         # AI integration
│   │   └── batch_processor.py    # Batch processing
│   └── utils/
│       └── csv_parser.py         # CSV validation
│
├── frontend-v2/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── dashboard/            # Dashboard pages
│   │   │   └── (auth)/               # Login & Signup pages
│   │   ├── components/               # React components (charts, layout)
│   │   └── context/                  # React context (Auth)
│   └── package.json
```

---

## Rate Limiting

The Groq free tier has rate limits (~15 requests per minute). The app handles this with:
- **5-second delay** between batch processing
- **Exponential backoff retry** on 429 errors (10s → 20s → 30s, max 3 retries)

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| `ImportError: attempted relative import` | Run uvicorn from project root: `uvicorn backend.main:app --reload` |
| `Turbopack is not supported` | Already fixed — uses `next dev --webpack` |
| `429 Too Many Requests` | Wait a minute and retry. Free tier has rate limits |
| `GOOGLE_API_KEY not valid` | Get a new key from [AI Studio](https://aistudio.google.com/app/apikey) and update `.env` |
| `Database connection failed` | Ensure PostgreSQL is running and `.env` credentials are correct |
