# ⚡ VoltIQ

### Intelligence Behind Every Electric Mile.

**VoltIQ** is an AI-powered EV Fleet Intelligence platform designed to help fleet operators monitor battery health, predict maintenance needs, evaluate fleet readiness, and make data-driven decisions.

Built for the **Economic Times AI Hackathon 2026** by **Team Ctrl Freaks**.

---

## 🚗 The Problem

EV fleets generate large amounts of battery and vehicle data, but turning that data into actionable decisions can be difficult.

VoltIQ brings **battery health, predictive maintenance, fleet readiness, alerts, analytics, and AI-driven recommendations** together in one platform.

---

## ✨ Key Features

* 🔋 **Battery Health Prediction** — Monitor and predict battery State of Health (SOH).
* ⏳ **RUL Estimation** — Estimate Remaining Useful Life and visualize degradation.
* 🛠️ **Predictive Maintenance** — Identify vehicles that may require maintenance.
* 🚦 **Fleet Readiness** — Evaluate the operational readiness of vehicles and fleets.
* 🤖 **AI Insights** — Generate actionable and explainable recommendations.
* 🗺️ **Interactive Dashboard** — View fleet KPIs, vehicle locations, alerts, and health metrics.
* 📊 **Analytics** — Visualize battery degradation and fleet-level trends.
* 📥 **Data Export** — Export fleet information for further analysis.

---

## 🧠 How It Works

```text
Vehicle / Battery Data
        ↓
   FastAPI Backend
        ↓
 AI / ML Predictions
        ↓
 Fleet Intelligence
        ↓
 React Dashboard
        ↓
 Actionable Insights
```

The frontend communicates with dedicated backend APIs for battery prediction, fleet analysis, maintenance intelligence, and readiness scoring.

> The current dashboard uses structured demo fleet telemetry to demonstrate the complete product experience, while the backend provides integration points for predictive services.

---

## 🛠️ Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* React Router
* Recharts
* Framer Motion
* React Hook Form + Zod
* Lucide React

### Backend & AI/ML

* Python
* FastAPI
* Scikit-learn

---

## 📁 Project Structure

```text
VoltIQ/
├── aim
```
