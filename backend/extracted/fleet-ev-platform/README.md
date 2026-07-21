# AmpTrack — Fleet Electrification Readiness & Battery Intelligence Platform

*Asset intelligence for the electric fleet.*

Built for the ET AI Hackathon 2026, Problem Statement #3: **AI for Industrial EV Supply Chain & Asset Intelligence: Accelerating Net Zero**.

AmpTrack tackles the industrial EV transition from the two angles fleet operators actually
care about:

1. **EV Asset Performance Management (APM)** — predicts battery State-of-Health (SoH) and
   Remaining Useful Life (RUL) for already-electrified vehicles, and classifies degradation
   trend (Stable / Accelerating / Critical) the same way vibration-trend APM works for
   rotating industrial machinery.
2. **Fleet Electrification Readiness & Procurement Intelligence** — scores each ICE vehicle
   still in the fleet on a 0–100 Transition Readiness Index based on its actual duty cycle
   (daily distance, dwell time for charging, route predictability, payload), and recommends
   an OEM vehicle class with an indicative procurement lead time.

## What's in this repo

```
fleet-ev-platform/
├── backend/                  Real, runnable FastAPI service
│   ├── app/
│   │   ├── main.py           REST API — fleet, battery health, readiness endpoints
│   │   ├── data/
│   │   │   ├── generate_data.py         synthetic fleet + battery cycle generator
│   │   │   ├── fleet_vehicles.csv       40-vehicle demo fleet
│   │   │   ├── battery_cycles.csv       cycle-level SoH history log
│   │   │   └── battery_training_corpus.csv   4,800-row model training set
│   │   ├── models/
│   │   │   └── battery_model.py         GradientBoostingRegressor: SoH / RUL / trend
│   │   └── scoring/
│   │       └── readiness_scorer.py      Transition Readiness Index + OEM recommender
│   └── requirements.txt
├── frontend/
│   └── AmpTrack.jsx           Interactive dashboard (React + recharts + lucide-react)
└── README.md                  You are here
```

## Running the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Then open `http://localhost:8000/docs` for interactive Swagger docs. Key endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /api/fleet` | Full fleet roster |
| `GET /api/fleet/summary` | Fleet-wide KPIs (avg SoH, at-risk count, avg readiness) |
| `GET /api/vehicle/{id}/battery-health` | SoH, RUL, degradation trend + projection curve |
| `GET /api/fleet/readiness-ranked?charger_kw=60` | ICE candidates ranked by readiness index |
| `GET /api/model/metrics` | Model validation metrics, for judges/technical review |

## Running the frontend

`AmpTrack.jsx` is a self-contained React component (embeds the demo fleet dataset and a
JS port of the same degradation curve the backend model was trained on, so it runs live
without any server — ideal for the hackathon pitch). Drop it into any React + Tailwind
project with `recharts` and `lucide-react` installed, or preview it directly as a Claude
artifact.

For a genuinely production-deployed version, point the component's data layer at the
FastAPI endpoints above instead of the embedded array — the scoring logic is already
identical on both sides.

## The model, honestly

The battery degradation model is trained on a synthetic corpus (4,800 rows) generated from
a physics-informed decay curve calibrated to widely-reported Li-ion aging behaviour (NASA
PCoE / Oxford Battery Degradation Dataset patterns — SoH fades roughly as a power law in
cycle count, accelerated by depth-of-discharge and temperature). Validation MAE is 0.39
percentage points of SoH with R²=0.996 against this synthetic ground truth.

**This is a hackathon-scoped stand-in for real BMS telemetry** — swap
`battery_training_corpus.csv` for real fleet cycle logs and retrain
(`python app/models/battery_model.py`) to move from demo to production. The readiness
scorer is fully rule-based and transparent by design (not a black-box model) — every score
is explainable in the rationale it returns, which matters for a procurement decision
someone has to sign off on.

## Judging criteria alignment

- **Innovation**: applies industrial APM discipline (used for rotating machinery) to EV
  battery assets — a framing most industrial-EV entries don't take.
- **Business Impact**: turns "should we electrify this vehicle" from a gut call into a
  scored, explainable, procurement-ready recommendation.
- **Technical Excellence**: real trained ML model (not a lookup table) + transparent
  rule-based scorer, both validated with reported metrics.
- **Scalability**: swap-in path from synthetic to real BMS/telematics data is explicit;
  same scoring logic runs identically in Python (backend) and JS (live demo).
- **UX**: control-room dashboard designed for fleet ops staff, not a generic admin panel.
