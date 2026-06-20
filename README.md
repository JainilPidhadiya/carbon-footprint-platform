# 🌱 EcoTrack – Carbon Footprint Awareness Platform

> Helping individuals understand, track, and reduce their environmental impact through personalized insights, sustainability challenges, and actionable recommendations.

![Dashboard Screenshot](./screenshots/dashboard.png)

---

# Problem Statement

Many people want to live sustainably but struggle to understand how their daily habits contribute to carbon emissions.

Existing carbon calculators often provide a one-time result without helping users take meaningful action afterward.

Users need a simple way to:

* Measure their carbon footprint
* Track progress over time
* Understand major emission sources
* Receive actionable sustainability guidance
* Stay motivated through goals and achievements

---

# Solution

EcoTrack transforms carbon awareness into actionable behavior change.

The platform enables users to:

* Calculate their carbon footprint
* Track sustainability progress
* Receive personalized recommendations
* Complete weekly environmental challenges
* Earn achievement badges
* Improve their Eco Score
* Forecast future emission reductions

The application is designed to be lightweight, accessible, mobile-friendly, and fully client-side.

---

# Key Features

## 🧮 Carbon Footprint Calculator

Calculate emissions from:

* Transportation
* Electricity Usage
* Food Consumption
* Waste Management

---

## 📊 Dashboard Analytics

Visual insights including:

* Total Carbon Emissions
* Category Breakdown
* Weekly Trends
* Goal Progress
* Reduction Performance

## 🤖 Sustainability Advisor

Provides personalized recommendations based on:

* Emission patterns
* Lifestyle habits
* Reduction opportunities
* Sustainability goals

## 🎯 Goal Tracking

Users can:

* Set emission reduction targets
* Track progress
* Monitor improvements over time

## 🏆 Gamification System

Includes:

* Weekly Sustainability Challenges
* Achievement Badges
* Sustainability Streaks
* XP Progress

## 🌍 Eco Score

A dynamic score that reflects:

* Emission performance
* Goal achievement
* Sustainability habits
* Challenge participation

---

# Screenshots

## Dashboard

![Dashboard](./screenshots/dashboard.png)

## Carbon Calculator

![Calculator](./screenshots/calculator.png)

## Sustainability Advisor

![Advisor](./screenshots/advisor.png)

## Challenges & Achievements

![Gamification](./screenshots/gamification.png)

---

# Architecture

![alt text](<Carbon Calculator Ecosystem-2026-06-20-043833.png>)

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## State Management

* Zustand
* Zustand Persist Middleware

## Forms & Validation

* React Hook Form
* Zod

## Charts

* Recharts

## Testing

* Vitest
* React Testing Library

---

# Core Algorithms

## Carbon Calculation

```text
Total Emission =
Transportation +
Electricity +
Food +
Waste
```

---

## Eco Score

Inputs:

* Carbon Emissions
* Goal Progress
* Challenge Completion

Outputs:

* Score (0–100)
* Rating
* Improvement Suggestions

---

## Forecast Engine

Projects future emissions using:

* Current Trends
* Goal Progress
* Challenge Participation

---

# Accessibility

The application follows accessibility-first principles:

* Semantic HTML
* Keyboard Navigation
* Screen Reader Support
* ARIA Labels
* Focus Management
* Responsive Design
* WCAG 2.1 AA Considerations

---

# Security

Implemented security measures include:

* Input Validation
* Strong TypeScript Typing
* Defensive State Management
* Error Handling
* Safe Local Persistence
* Sanitized User Inputs

---

# Testing

Unit tests cover:

* Carbon Calculations
* Eco Score Engine
* Achievement Logic
* Forecast Engine
* Sustainability Advisor

Testing tools:

* Vitest
* React Testing Library

---

# Performance Optimizations

* Zustand Lightweight Store
* Local Persistence
* Lazy Loading
* Efficient Re-Renders
* Optimized Bundles

---

# Project Structure

```text
src

components

features
 ├── calculator
 ├── dashboard
 ├── ecoAdvisor
 ├── gamification
 └── history

services
 ├── carbon.service.ts
 ├── ecoScore.service.ts
 ├── achievement.service.ts
 ├── challenge.service.ts
 ├── advisor.service.ts

store
types
utils
tests
```

---

# Installation

```bash
git clone <repository-url>

npm install

npm run dev
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

---

# Future Enhancements

* Real AI Integration
* Utility Bill Integration
* Carbon Offset Marketplace
* Community Challenges
* Regional Emission Benchmarks
* Smart Device Integrations

---

# Challenge Evaluation Alignment

| Criteria        | Implementation                             |
| --------------- | ------------------------------------------ |
| Code Quality    | Modular Architecture, TypeScript, Services |
| Security        | Validation, Safe Persistence               |
| Efficiency      | Client-Side Architecture, Zustand          |
| Testing         | Unit Tests & Service Validation            |
| Accessibility   | Keyboard Navigation, ARIA Labels           |
| User Experience | Dashboard, Forecasts, Gamification         |

---

# Impact

EcoTrack helps transform carbon awareness into measurable action by combining analytics, personalized recommendations, and behavioral motivation in a single accessible platform.
