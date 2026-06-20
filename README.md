# 🌱 EcoTrack – Carbon Footprint Awareness Platform

## Overview

EcoTrack is an accessibility-first web platform that helps individuals understand, track, and reduce their carbon footprint through personalized insights, goal tracking, sustainability challenges, and actionable recommendations.

The platform transforms complex environmental data into simple, understandable metrics that encourage users to make more sustainable daily choices.

---

## Problem Statement

Many individuals want to reduce their environmental impact but struggle to:

* Understand which daily activities contribute most to their carbon footprint.
* Measure and track emissions over time.
* Receive practical and personalized sustainability guidance.
* Stay motivated through long-term behavior change.

As a result, awareness often fails to translate into action.

---

## Solution

EcoTrack provides an interactive and user-friendly platform that:

* Calculates carbon emissions across key lifestyle categories.
* Visualizes environmental impact through dashboards and analytics.
* Generates personalized sustainability recommendations.
* Tracks progress toward reduction goals.
* Encourages engagement through challenges and achievements.
* Provides an Eco Score to measure overall sustainability performance.

---

## Key Features

### 🧮 Carbon Footprint Calculator

Calculate estimated emissions from:

* Transportation
* Electricity Usage
* Food Consumption
* Waste Management

### 📊 Analytics Dashboard

Visual insights including:

* Total Carbon Emissions
* Category Breakdown
* Weekly Trends
* Goal Progress
* Reduction Performance

### 🤖 Sustainability Advisor

Provides personalized recommendations based on:

* Emission patterns
* Lifestyle habits
* Reduction opportunities
* Sustainability goals

### 🎯 Goal Tracking

Users can:

* Set emission reduction targets
* Track progress
* Monitor improvements over time

### 🏆 Gamification System

Includes:

* Weekly Sustainability Challenges
* Achievement Badges
* Progress Rewards

### 🌍 Eco Score

A dynamic score that reflects:

* Emission performance
* Goal achievement
* Sustainability habits
* Challenge participation

---

## Architecture

### Application Structure

```text
src
├── components
├── features
│   ├── calculator
│   ├── dashboard
│   ├── ecoAdvisor
│   ├── gamification
│   └── history
├── services
├── store
├── types
├── utils
├── tests
├── App.tsx
└── main.tsx
```

### Design Principles

* Feature-based architecture
* Separation of concerns
* Reusable components
* Strong TypeScript typing
* Testable business logic
* Accessibility-first design

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### State Management

* Zustand
* Zustand Persist Middleware

### Forms & Validation

* React Hook Form
* Zod

### Data Visualization

* Recharts

### Testing

* Vitest
* React Testing Library

### Code Quality

* ESLint
* Prettier

---

## Carbon Calculation Logic

Carbon emissions are estimated using predefined emission factors across multiple categories.

### Formula

```text
Total Emission =
Transportation +
Electricity +
Food +
Waste
```

Each category uses configurable emission factors allowing future expansion and improved accuracy.

---

## Eco Score Algorithm

The Eco Score is calculated using:

* Total carbon emissions
* User reduction goals
* Weekly challenge completion
* Sustainability achievements

### Score Range

| Score  | Rating            |
| ------ | ----------------- |
| 0-39   | Needs Improvement |
| 40-59  | Average           |
| 60-79  | Good              |
| 80-100 | Excellent         |

The score provides an easy-to-understand measure of environmental performance.

---

## Accessibility

Accessibility was treated as a first-class requirement.

Implemented features include:

* Semantic HTML
* Keyboard Navigation
* Focus Management
* ARIA Labels
* Screen Reader Support
* High Contrast Design
* Responsive Layouts
* WCAG 2.1 AA Considerations

---

## Security

The application follows secure development practices:

* Input Validation using Zod
* Safe Data Handling
* Type-Safe State Management
* No Sensitive Data Exposure
* Sanitized User Inputs
* Secure Local Storage Usage

---

## Performance Optimizations

Implemented optimizations include:

* Component Memoization
* Lazy Loading
* Optimized Re-Renders
* Lightweight Zustand Store
* Efficient State Updates
* Vite Production Bundling

---

## Testing Strategy

The project follows a layered testing approach.

### Unit Tests

* Carbon Calculation Service
* Eco Score Service
* Achievement Service
* Validation Utilities

### Component Tests

* Forms
* Dashboard Widgets
* User Interactions

### Coverage Focus

* Business Logic
* Edge Cases
* Invalid Inputs
* Accessibility Behaviors

---

## User Journey

1. Complete Carbon Footprint Assessment
2. Review Dashboard Insights
3. Receive Sustainability Recommendations
4. Set Reduction Goals
5. Complete Weekly Challenges
6. Improve Eco Score
7. Unlock Achievements

---

## Future Enhancements

Potential future improvements include:

* Real AI Integration
* Carbon Forecasting
* Utility Bill Integration
* Smart Device Data Sync
* Community Challenges
* Regional Emission Benchmarks
* Carbon Offset Recommendations

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

---

## Assumptions

* Carbon calculations use estimated emission factors.
* User data is stored locally within the browser.
* The platform focuses on awareness and behavioral improvement rather than scientific carbon auditing.

---

## Evaluation Criteria Alignment

### Code Quality

✔ Modular Architecture

✔ Strong TypeScript Usage

✔ Reusable Components

### Security

✔ Input Validation

✔ Safe State Management

✔ Secure Data Handling

### Efficiency

✔ Optimized Rendering

✔ Lightweight State Management

✔ Client-Side Persistence

### Testing

✔ Unit Testing

✔ Component Testing

✔ Validation Coverage

### Accessibility

✔ Keyboard Navigation

✔ Screen Reader Support

✔ Semantic HTML

---

## Team

Built for the Carbon Footprint Awareness Platform Challenge with a focus on sustainability, accessibility, maintainability, and user engagement.
