# DecisionIQ — AI Decision Intelligence for Inventory Planning

> **Google Gen AI Academy APAC Hackathon · Problem Statement 1**

An AI Decision Intelligence platform that helps small grocery store owners **simulate multiple inventory purchasing strategies, compare trade-offs, and choose the best one** before placing an order.

It is **not** a chatbot, a dashboard, or a forecasting tool — it is a **decision simulator**.

---

## ✨ Key Features & The Wow Moment

1. **Purchasing Priority Slider** — Move the **Profit ↔ Waste Reduction** slider and watch three AI-generated strategies re-rank live.
2. **AI Explanation Panel** — Click into Gemini's explanation to see exactly *why* the recommended strategy is best — every number traced back to your BigQuery inventory data.
3. **AI Suggested Next Actions** — Displays 3 data-grounded immediate action items under the explanation to guide the store owner.
4. **Decision History Drawer** — Collapsible panel saving the last **5 confirmed decisions** to `localStorage`, displaying a history timeline of confirmed strategies.
5. **Modern Neo-Brutalist UI** — Clean, premium enterprise Neo-Brutalist interface with strong borders, offsets, and harmonised status badges.

---

## 🏗️ Architecture

```
Frontend (React + Vite + Tailwind)
        │
        │  REST API (Axios)
        ▼
Backend (FastAPI on Cloud Run)
        │
        ├──► BigQuery  ─── inventory_data table
        │
        └──► Vertex AI Gemini 2.5 Flash
                 │
                 ├── Generate 3 scenarios (Conservative / Aggressive / AI Recommended)
                 └── Explain recommendation in plain English
```

---

## 📁 Project Structure

```
decisioniq/
├── frontend/               # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/     # Header, Footer, Cards, Slider, Panel, Skeletons, DecisionHistory, ActionSuggestions
│   │   ├── pages/          # Dashboard, About
│   │   ├── services/       # inventoryApi, contextApi, decisionApi, explanationApi
│   │   └── hooks/          # useFetch, useDashboard, useDecisionHistory
│   └── package.json
│
├── backend/                # FastAPI
│   ├── api/                # Route handlers (health, inventory, context, scenarios, explanation)
│   ├── services/           # BigQueryService, GeminiService, DecisionService, ExplanationService
│   ├── prompts/            # Gemini prompt builders
│   ├── models/             # Pydantic schemas
│   ├── utils/              # Validators, inventory helpers
│   └── main.py
│
├── data/
│   └── seed_bigquery.sql   # BigQuery table + seed data
│
├── Dockerfile              # Cloud Run-ready multi-stage build
├── .env.example            # Environment variable template
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Google Cloud project with BigQuery, Vertex AI APIs enabled

---

### 1. Clone & configure environment

```bash
cp .env.example backend/.env
# Fill in your GOOGLE_CLOUD_PROJECT, DATASET_NAME, TABLE_NAME, VERTEX_LOCATION
```

### 2. Seed BigQuery

```bash
# In BigQuery console or via bq CLI:
bq query --use_legacy_sql=false < data/seed_bigquery.sql
```

### 3. Run the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> **No Google Cloud credentials?** The backend falls back to built-in mock data and rule-based scenario generation automatically.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will start on [http://localhost:5173](http://localhost:5173). The API is proxy-configured via Vite to route to `localhost:8000/api`.

---

## ☁️ Production Deployment (Cloud Run)

The project includes a multi-stage `Dockerfile` optimised for Cloud Run.

### 1. Build and push image
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/decisioniq-backend
```

### 2. Deploy backend to Cloud Run
```bash
gcloud run deploy decisioniq-backend \
  --image gcr.io/YOUR_PROJECT_ID/decisioniq-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,VERTEX_LOCATION=us-central1,ALLOW_ALL_ORIGINS=true
```

### 3. Deploy frontend
Set the `VITE_API_URL` inside your frontend `.env` to point to the newly generated Cloud Run service URL:
```env
VITE_API_URL=https://decisioniq-backend-xxxxxx.run.app
```
Build the production build:
```bash
npm run build
```
The static files in `dist/` can be hosted using Firebase Hosting, Cloud Storage, or any static provider.
