# GharBudget & GaunSewa

A household budget, savings goals, remittance tracker, and community job & service marketplace tailored for Nepal.

![GharBudget & GaunSewa](https://via.placeholder.com/1200x475/F8FAF9/005B48?text=GharBudget+GaunSewa)

## Overview

**GharBudget** helps Nepalese households track income, expenses, savings goals, and financial health. **GaunSewa** connects local communities with job opportunities and service providers.

## Features

- **Household Budget Tracking**: Record income and expenses with categories
- **Savings Goals**: Set and track financial goals with deposit tracking
- **Transaction History**: View past transactions and spending patterns
- **Remittance Tracking**: Monitor money received from abroad
- **Job Marketplace**: Post and browse local jobs and services
- **User Status**: Share your skills and availability with the community
- **Authentication**: Login/Signup system

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Google Gen AI integration
- Express (backend)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Gemini API key (for AI features)

### Installation

```bash
npm install
```

### Environment

Copy the example environment file and add your Gemini API key:

```bash
cp .env.example .env.local
# Edit .env.local with your GEMINI_API_KEY
```

### Run Locally

```bash
npm run dev
```

This starts the development server at `http://localhost:3000`.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # UI components
│   ├── gharbudget/ # Budget tracking views
│   └── gaunsewa/   # Community marketplace views
├── context/        # React context (auth, app state)
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
└── App.tsx         # Main application component
```

## License

MIT