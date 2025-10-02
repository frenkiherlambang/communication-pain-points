# SIRENE - Communication Intelligence Platform

**SIRENE** (System for Intelligence Research & Engagement Analytics) is a comprehensive platform for monitoring and analyzing customer communication pain points. From pre-purchase inquiries to after-sales support, SIRENE helps identify frustrations, strengthen trust, and improve brand perception.

## 🎯 Platform Overview

SIRENE provides real-time monitoring and analysis of customer communications to:
- Detect pain points in customer service interactions
- Identify potential crisis triggers before they escalate
- Discover opportunities for communication improvements
- Generate actionable insights for content and campaign planning

## 🚀 Key Features

### Pain Point Detection
- Customer service frustration monitoring
- Product information confusion tracking
- Personalization gap identification
- Expectation vs. reality analysis

### Crisis Prevention
- Negative sentiment spike detection
- Viral complaint tracking
- Early warning system

### Opportunity Identification
- FAQ improvement insights
- Campaign messaging optimization
- Channel performance analysis

### Actionable Outputs
- Content plan inputs
- Campaign brief insights
- Communication recommendations
- Platform usage optimization

## 🛠️ Technology Stack

This project is built with:
- [Next.js](https://nextjs.org) - React framework
- TypeScript - Type-safe development
- Tailwind CSS - Styling
- Shadcn UI - Component library
- Recharts - Data visualization

## 📦 Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the SIRENE platform.

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard pages
│   │   ├── customer-feedbacks/
│   │   ├── topics/
│   │   └── layout.tsx
│   └── page.tsx             # Landing page
├── lib/                     # Utility functions and APIs
├── components/              # Reusable UI components
├── types/                   # TypeScript type definitions
└── docs/                    # Documentation
```

## 📊 Dashboard Features

### Home / Overview
- KPIs, trends, and insights digest
- Communication health metrics
- Sentiment analysis overview

### Inbox
- Unified feed of customer messages
- Multi-platform aggregation
- Real-time monitoring

### Topics
- Pain points ranked by priority
- Topic trend analysis
- Sentiment correlation

## 🎨 Customization

You can customize the SIRENE platform by:
- Modifying theme colors in `tailwind.config.ts`
- Updating component styles in the `components/` directory
- Adjusting data analysis logic in the `lib/` directory

## 📚 Documentation

For detailed documentation, see:
- `/docs/GOAL.md` - Platform goals and research focus
- `/docs/impl-dashboard.md` - Dashboard implementation details
- `/docs/MVP.md` - Minimum viable product specifications

## 🚢 Deployment

The easiest way to deploy SIRENE is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

© 2024 SIRENE - Communication Intelligence Platform. All rights reserved.
