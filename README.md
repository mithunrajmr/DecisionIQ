# DecisionIQ — AI Decision Intelligence for Inventory Planning

> **Google Gen AI Academy APAC Hackathon · Problem Statement 1**

An AI Decision Intelligence platform that helps small grocery store owners **simulate multiple inventory purchasing strategies, compare trade-offs, and choose the best one** before placing an order.

It is **not** a chatbot, a dashboard, or a forecasting tool — it is a **decision simulator**.

---

## ✨ The Wow Moment

Move the **Profit ↔ Waste Reduction** slider and watch three AI-generated strategies re-rank live. Click into Gemini's explanation to see exactly *why* the recommended strategy is best — every number traced back to your BigQuery inventory data.

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
│   │   ├── components/     # Header, Footer, Cards, Slider, Panel, Skeletons
│   │   ├── pages/          # Dashboard, About
│   │   ├── services/       # inventoryApi, contextApi, decisionApi, explanationApi
│   │   └── hooks/          # useFetch, useDashboard
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
# Open http://localhost:5173
```

---

## 🌐 REST API

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/health`             | Liveness probe                           |
| GET    | `/inventory`          | Inventory summary from BigQuery          |
| GET    | `/context`            | Tomorrow's weather + local event         |
| POST   | `/generate-scenarios` | 3 ranked strategies `{ priority: 0–100 }`|
| POST   | `/explanation`        | Gemini explanation `{ scenario, priority }`|

---

## ☁️ Cloud Run Deployment

```bash
# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT/decisioniq-backend

# Deploy
gcloud run deploy decisioniq-backend \
  --image gcr.io/YOUR_PROJECT/decisioniq-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_PROJECT,VERTEX_LOCATION=us-central1
```

---

## 🔒 Data Transparency

Every number Gemini cites in its explanation traces directly to a column in the BigQuery `inventory_data` table. No figures are invented or assumed by the AI.

---

## 📋 BigQuery Schema

| Column                   | Type    | Description                      |
|--------------------------|---------|----------------------------------|
| `product_name`           | STRING  | Product display name             |
| `category`               | STRING  | Product category                 |
| `avg_weekly_sales_units` | INTEGER | Average units sold per week      |
| `current_stock_units`    | INTEGER | Current on-hand inventory        |
| `shelf_life_days`        | INTEGER | Days before expiry               |
| `unit_cost`              | FLOAT   | Cost price per unit              |
| `unit_price`             | FLOAT   | Retail price per unit            |
| `weather_sensitivity`    | STRING  | `high` or `low`                  |
| `local_event_flag`       | BOOLEAN | Event happening tomorrow?        |

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18 · Vite · Tailwind CSS · React Router · Axios |
| Backend     | FastAPI · Pydantic v2 · Python 3.11 |
| AI          | Vertex AI · Gemini 2.5 Flash        |
| Data        | Google BigQuery                     |
| Deployment  | Cloud Run · Docker                  |

---

*Built for the Google Gen AI Academy APAC Hackathon 2025.*
