# DecisionIQ — AI Decision Intelligence for Inventory Planning
### Final Locked Project Brief — Gen AI Academy APAC, Problem Statement 1

---

## 1. One-Sentence Definition
An AI Decision Intelligence platform that helps a small grocery store owner simulate multiple inventory purchasing strategies, compare trade-offs, and choose the best one before ordering — not a chatbot, not a dashboard, a decision simulator.

## 2. Why This Domain
- Every judge instantly understands groceries, spoilage, profit, and waste — zero jargon risk.
- All recommendation factors (demand, weather, events, shelf-life) are concretely explainable — no "trust the AI" gap.
- No ethical/fairness ambiguity (unlike resource-allocation domains).
- Not the exact worked example used in the livestream (that was a generic "restocking" speed example for PS2, not this product).

## 3. Core Product Loop (this IS the Decision Intelligence architecture — do not simplify away from this)
```
User opens app
  ↓
System has mocked: last 4 weeks sales, current stock, shelf-life,
tomorrow's weather, one local event flag (all in BigQuery)
  ↓
Gemini analyzes context
  ↓
User sets priority slider: Profit ↔ Waste Reduction
  ↓
Gemini generates 3 purchasing scenarios:
   A. Conservative (low waste, lower revenue upside)
   B. Aggressive (higher revenue upside, higher waste risk)
   C. AI Recommended (balanced, optimized for current slider position)
  ↓
Scenarios re-rank LIVE as slider moves
  ↓
Gemini explains WHY the top scenario is best, in plain language,
tracing back to specific data points (never invented numbers)
  ↓
Owner picks a strategy
```
**The slider + live re-rank + explanation is the non-negotiable "wow" moment. Do not cut this for time — it's what separates this from a plain forecasting dashboard.**

## 4. Data (mocked, in BigQuery)
One table, ~20–30 rows, covering 5–6 perishable product categories:
- `product_name`, `category`
- `avg_weekly_sales_units`
- `current_stock_units`
- `shelf_life_days`
- `unit_cost`, `unit_price`
- `weather_sensitivity` (e.g. "high" for umbrellas-style logic, low for staples)
- `local_event_flag` (boolean, e.g. a festival happening tomorrow)

Rule: **every number Gemini states in its explanation must trace back to a column in this table.** No invented dollar figures, no invented percentages. If Gemini wants to say "70% chance," that must come from a defined formula over the mocked data, not asserted.

## 5. Architecture (Google Cloud, credits-covered — no NVIDIA required)
- **Frontend:** React (Antigravity-generated) — data view, slider, 3 scenario cards, expandable "why" explanation.
- **Backend:** Cloud Run — orchestrates requests, holds session state.
- **Gemini API (Vertex AI):** (1) reads context + slider position, (2) generates 3 scenarios, (3) generates the "why" explanation.
- **BigQuery:** the single mocked data table described above.
- **Cloud Storage:** any static assets, uploaded CSV if you support upload instead of pure mock.

## 6. Modularity for optional future NVIDIA extension (only if free GPU credits are confirmed AND PS1 is fully done first)
Isolate scenario computation in one function/module:
```
Decision Engine
   ↓ (today)
   pandas / DuckDB / SQL
   ↓ (only if GPU access confirmed, only as a stretch goal)
   cuDF / RAPIDS — same inputs/outputs, no other module changes
```
If added: frame it as "faster refresh means the owner can test more scenarios during a single morning meeting" — never as a raw benchmark number alone.

## 7. Demo Script (under 3 minutes)
1. (0:00–0:30) Problem: "A grocery owner has to guess tomorrow's order every night, guessing wrong either wastes food or loses sales."
2. (0:30–1:15) Show the app: mocked data loaded (rain forecast + nearby event), Gemini generates 3 scenarios.
3. (1:15–2:15) **The wow moment:** drag the Profit ↔ Waste slider live, watch scenarios re-rank, click into Gemini's explanation — show it citing specific data points.
4. (2:15–3:00) Owner picks the AI-recommended strategy. Close on impact: "Less waste, better margins, decided in seconds instead of guesswork."

## 8. Submission Checklist (per official rules)
- [ ] Presentation deck (PPT)
- [ ] Working prototype link
- [ ] Public GitHub repo
- [ ] Demo video, **under 3 minutes**
- [ ] Solution description

## 9. Non-Negotiable Discipline for Remaining Time
- Do not change domain, product, or scope again.
- Do not let Gemini state a hard number that isn't traceable to the BigQuery table.
- Reserve the last several hours strictly for the 5 submission assets above — no new features once that window starts.
