# DecisionIQ — AI Decision Intelligence for Inventory Planning

> **Google Gen AI Academy APAC Hackathon · Cohort 2**
>
> Developer: **Mithun Raj M R** (Software Engineer, Wipro)

DecisionIQ is an AI-powered **Decision Intelligence platform** designed to help small-to-medium grocery store owners simulate purchasing strategies, analyze cost-benefit trade-offs, and make data-driven inventory orders before committing capital.

Unlike typical chatbots or descriptive dashboards, DecisionIQ functions as an interactive **decision simulator**. It leverages **Vertex AI Gemini** and live **Google BigQuery** data to evaluate risks (spoilage, stockouts, waste value) under varying weather conditions and local event foot traffic.

---

## 🎨 Modern Neo-Brutalist Design
DecisionIQ features a custom-built **Neo-Brutalist Design System** that provides a premium, high-impact enterprise visual experience.
*   **Vibrant, curated color palettes** (no generic reds or blues) tailored per strategy type.
*   **High-contrast offsets** and thick ink borders (`border-2 border-ink`, custom neomorphic box shadows).
*   **Micro-animations and slide-up transitions** for responsive user interactions.
*   **Pure CSS distribution charts** for light, lightning-fast rendering without loading bulky third-party chart libraries.

---

## ✨ Key Features

1.  **Dynamic Purchasing Priority Slider**
    *   Interactively adjust the target trade-off: **Waste Minimization ↔ Profit Maximization** (0 to 100).
    *   Watch three distinct strategy profiles—**Conservative**, **Aggressive**, and **AI Recommended**—re-rank and recalculate their suggested orders in real time.
2.  **AI Explanation & Insights Panel**
    *   Gemini models analyze stock levels, average weekly sales, weather sensitivity, and event flags to explain *exactly why* a strategy is recommended.
    *   Outputs **Key Inventory Factors**, **Expected Business Impact**, and **Top Risks** (e.g. spoilage or lost sales).
3.  **Data-Grounded Next Actions**
    *   Generates 3 immediate, concrete action items mapping directly to identified inventory risks.
4.  **Persistent Decision History Timeline**
    *   Allows confirming and logging strategies locally to `localStorage` (no database writes required for history).
    *   Displays a vertical history timeline with weather/event context badges.
    *   **Detail Modals:** Click any history entry to open an overlay displaying the confirmed strategy metrics, weather/event tags, top ordered products, and the original AI explanation text.
    *   **View All History:** Click "View All" to explore the full chronological list of confirmed actions.
5.  **Interactive Inventory Management Dashboard**
    *   Live connection status panel displaying current BigQuery tables and Vertex AI connectivity status.
    *   Stat cards displaying high-level KPIs (Total Products, Units, Avg Weekly Sales, Value) and Health Alerts (Low Stock, High Spoilage Risk, Weather-Sensitive, Event-Sensitive).
    *   Distribution charts summarizing inventory composition by category, stock level, and remaining shelf life.
    *   Full inline CRUD (Create, Read, Update, Delete) interface executing live BigQuery queries.

---

## 🏗️ Technical Architecture

```
                 +-----------------------------------+
                 |      Frontend (React + Vite)      |
                 |      Neo-Brutalist UI Theme       |
                 +-----------------+-----------------+
                                   |
                                   | REST API (Axios)
                                   v
                 +-----------------+-----------------+
                 |  Backend (FastAPI on Cloud Run)   |
                 |  Dockerized Multi-Stage Container |
                 +--------+-----------------+--------+
                          |                 |
                          | Read/Write DML  | Vertex AI SDK
                          v                 v
                 +--------+--------+ +------+--------+
                 |  Google BigQuery| |  Vertex AI    |
                 |  (Inventory DB) | | (Gemini 2.5)  |
                 +-----------------+ +---------------+
```

*   **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router.
*   **Backend**: FastAPI, Uvicorn, Pydantic v2, Python-dotenv.
*   **Google Cloud Native Integration**:
    *   **Google BigQuery**: Serves as the primary operational datastore for inventory items. Includes live transaction updates (INSERT/UPDATE/DELETE).
    *   **Vertex AI (Gemini 2.5 Flash)**: Generates ranked strategies and plain-English trade-off explanations.
    *   **Google Cloud Run**: Hosts the containerized FastAPI backend with automatic scaling and dynamic port allocation.
    *   **Application Default Credentials (ADC)**: The backend automatically uses the attached service account credentials on Google Cloud, avoiding the need for hardcoded local service keys in production.

---

## 📁 Repository Structure

```
decisioniq/
├── backend/                    # Python FastAPI API Services
│   ├── api/                    # Route endpoints (health, inventory, context, scenarios, explanation)
│   ├── credentials/            # Local service keys (ignored in Git)
│   ├── models/                 # Pydantic schema definitions
│   ├── prompts/                # Configurable Gemini system prompts
│   ├── services/               # BigQuery, Vertex AI, and Scenario Logic singletons
│   ├── utils/                  # Safe validators and logging formatters
│   ├── .env.example            # Backend env template
│   ├── main.py                 # FastAPI application router & CORS configuration
│   └── requirements.txt        # Managed Python dependencies
│
├── frontend/                   # React SPA
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Neo-Brutalist modular components (Header, Footer, Cards, Modals)
│   │   ├── hooks/              # Custom React hooks (useFetch, useDashboard, useDecisionHistory)
│   │   ├── pages/              # Page layouts (Dashboard, Inventory, About)
│   │   ├── services/           # Axios endpoints matching backend routes
│   │   └── App.jsx             # React routing & core layout
│   ├── .env.example            # Frontend env template
│   ├── vite.config.js          # Dev proxy and server settings
│   └── package.json            # Managed frontend dependencies
│
├── data/
│   └── seed_bigquery.sql       # BigQuery schema setup & seed rows
│
├── Dockerfile                  # Production multi-stage Docker build
├── .dockerignore               # Docker build exclusions
├── .gitignore                  # Git repository exclusion rules
├── .env.example                # Root-level configuration template
└── README.md                   # Technical documentation
```

---

## ⚙️ Environment Variables

### Backend `.env` Variables
Create `backend/.env` based on `backend/.env.example`:
```env
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
PROJECT_ID=your-gcp-project-id

VERTEX_LOCATION=us-central1
VERTEX_MODEL=gemini-2.5-flash

DATASET_NAME=decisioniq
TABLE_NAME=inventory_data

# CORS Config (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:5173

# Allowed fallback for local sandbox testing
ALLOW_ALL_ORIGINS=false

LOG_LEVEL=INFO
```

### Frontend `.env` Variables
Create `frontend/.env` based on `frontend/.env.example`:
```env
# Leave empty in development to automatically use the Vite proxy (/api -> localhost:8000)
VITE_API_URL=
```

---

## 🚀 Setup & Execution

### 1. BigQuery Setup
Run the SQL seed script in your BigQuery console to create the dataset and seed inventory data:
```sql
-- Create table and seed data
-- (See details inside data/seed_bigquery.sql)
```

### 2. Local Backend Run
1. Install virtual environment and activate it:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   source .venv/bin/activate # Unix
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The backend will automatically fallback to local mock data if no GCP credentials are set.*

### 3. Local Frontend Run
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to interact with the application.

---

## ☁️ Cloud Run Deployment

### 1. Build and Push backend Docker image:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/decisioniq-backend .
```

### 2. Deploy Backend to Cloud Run:
```bash
gcloud run deploy decisioniq-backend \
  --image gcr.io/YOUR_PROJECT_ID/decisioniq-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,VERTEX_LOCATION=us-central1,ALLOW_ALL_ORIGINS=true
```

### 3. Deploy Frontend (Firebase Hosting):
1. In `frontend/.env`, set `VITE_API_URL` to point to your deployed Cloud Run URL:
   ```env
   VITE_API_URL=https://decisioniq-backend-xxxxxx.run.app
   ```
2. Run the production build command:
   ```bash
   npm run build
   ```
3. Host the compiled `dist/` folder using Firebase Hosting or any CDN provider.

---

## 🔌 API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Container liveness check |
| `/context` | `GET` | Fetches tomorrow's simulated weather & event context |
| `/inventory` | `GET` | Returns aggregated statistics and item details from BigQuery |
| `/inventory` | `POST` | Adds a new product to BigQuery |
| `/inventory/{product_name}` | `PUT` | Updates details of a product in BigQuery |
| `/inventory/{product_name}` | `DELETE` | Deletes a product from BigQuery |
| `/generate-scenarios` | `POST` | Generates 3 ranked scenarios using Gemini or rule-based engine |
| `/explanation` | `POST` | Generates a plain-English explainable AI summary for a selected strategy |

---

## 🗺️ Future Roadmap
1. **Dynamic ERP integrations**: Direct connections to SAP, Oracle, and Shopify systems.
2. **Supplier APIs**: Automate purchase order submittals directly through supplier API catalogs.
3. **Autonomous purchasing agents**: Authorize AI to make micro-purchases under strict cost caps.
4. **Predictive demand forecasting**: Incorporate historical multi-year seasonal sales history.

---

## 📄 License
This project is proprietary and built strictly as part of the Google Gen AI Academy Hackathon submission.
