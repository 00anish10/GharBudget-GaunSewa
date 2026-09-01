# GharBudget & GaunSewa

A household budget, savings goals, remittance tracker, and community job & service marketplace tailored for Nepal.

![GharBudget & GaunSewa](https://via.placeholder.com/1200x475/F8FAF9/005B48?text=GharBudget+GaunSewa)

## Hey there! 👋

Welcome to **GharBudget & GaunSewa** — a project built to make everyday life a little easier for Nepalese households and communities. Whether you're trying to keep track of where your money goes, saving up for something special, or looking to pick up some extra work locally, this tool was designed with you in mind.

## What it does

**GharBudget** is your personal finance companion. It helps you:

- Record income and expenses without the headache
- Set savings goals and actually track progress toward them
- Look back at your spending patterns over time
- Keep tabs on remittances coming in from abroad

**GaunSewa** is the community side of things. It lets you:

- Post and browse local jobs and services
- Share your skills and availability with neighbors
- Connect with people in your area who need help or can help you

## The tech behind it

We're using some modern tools under the hood:

- **React 19 + TypeScript** for a fast, type-safe interface
- **Vite 6** for lightning-fast development
- **Tailwind CSS 4** for styling that doesn't hurt your eyes
- **Google Gen AI integration** for the smart bits
- **Express** on the backend

## Getting started (the easy part)

### What you'll need

- Node.js 18+ and your preferred package manager (npm/yarn)
- A Gemini API key if you want to try out the AI features

### Installation

```bash
npm install
```

### Environment setup

Copy the example env file and fill in your details:

```bash
cp .env.example .env.local
# Then edit .env.local with your GEMINI_API_KEY
```

### Run it locally

```bash
npm run dev
```

This starts the dev server at `http://localhost:3000`. Open it up and poke around!

### Build & preview

```bash
npm run build    # builds the app
npm run preview  # preview the built version
```

## Project structure (quick overview)

```
src/
├── components/     # UI bits — budget views under gharbudget/, marketplace under gaunsewa/
├── context/        # React context for auth and app state
├── types/          # TypeScript definitions
├── utils/          # Helper functions you might need
└── App.tsx         # The main app component
```

## License

MIT