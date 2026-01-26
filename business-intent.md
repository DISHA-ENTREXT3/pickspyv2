## Product Overview

- Product Type: AI-Powered Market Intelligence Platform (SaaS)
- Primary Function: E-commerce product research and trend discovery using AI-driven sentiment and competitive analysis.
- Target Audience: Dropshippers, E-commerce entrepreneurs, and digital marketers.
- Monetization Model: Freemium / Tiered Subscription (Free, Pro, Business tiers detected in PLANS).
- Deployment Type: Web Application (React/Vite frontend + FastAPI/Python backend).

## Core Capabilities

- Feature 1: Multi-Platform Market Scraping (Real-time data from Amazon, eBay, Walmart, and Flipkart).
- Feature 2: AI-Powered Conviction Engine (Sentiment analysis from Reddit, TikTok, and Instagram to predict trend velocity).
- Feature 3: Deep AI Analyzer (Automated go/no-go viability scoring and risk assessment for specific product ideas).
- Feature 4: Competitor Intelligence (Live pricing tracking and marketplace comparison).

## Surface Classification

### Public Pages (Indexable Candidates)

| Route          | Purpose                                                             | Confidence |
| -------------- | ------------------------------------------------------------------- | ---------- |
| `/`            | Main landing page, platform overview, and trending product preview. | High       |
| `/product/:id` | Deep-dive intelligence for specific trending products.              | High       |
| `/pricing`     | Detailed breakdown of subscription tiers and features.              | High       |
| `/blog`        | Educational content and market trend reports.                       | High       |
| `/blog/:slug`  | Specific articles and guides.                                       | High       |
| `/privacy`     | Legal privacy policy.                                               | High       |
| `/terms`       | Legal terms of service.                                             | High       |
| `/cookies`     | Cookie usage policy.                                                | High       |

### Private / App Pages (Never Index)

| Route Pattern | Reason                                                                 | Confidence |
| ------------- | ---------------------------------------------------------------------- | ---------- |
| `/dashboard`  | User-specific state, saved products, and account management.           | High       |
| `/compare`    | Utility page for comparing user-selected items; high state dependency. | Medium     |
| `/login`      | Authentication gateway.                                                | High       |
| `/signup`     | Authentication gateway.                                                | High       |

## User Journey

- Entry Point: Educational blog content or direct landing page access.
- Core Interaction: Browsing the "Trending Products" grid and running AI analyses on specific items.
- Conversion Action: Upgrading to "Pro" for unlimited AI analysis and deep competitive data.
- Post-Conversion State: Accessing the personalized dashboard to track saved products and export reports.

## Content Signals

- Blog Detected: Yes (Routes `/blog` and `/blog/:slug` with dedicated components).
- FAQ Detected: Yes (Platform-wide FAQ on landing page and individual Product FAQs).
- Guides / Docs: Yes (Inferred from Blog content strategy).
- Trust Pages Detected: Privacy Policy, Terms of Service, Cookie Policy.

## SEO-Safe Assumptions

- What this product IS: A data-driven decision-making tool for e-commerce selection.
- What this product IS NOT: A product fulfillment service, a dropshipping supplier, or a retail marketplace.

## Confidence Summary

- Overall Confidence Score (0–1): 0.95
- High Confidence Areas: Core value proposition, public route mapping, monetization model, and data sourcing logic.
- Low Confidence Areas: Exact sourcing of supplier data (appears to be via external marketplace links).

## SEO Execution Constraints

- Routes that must never be indexed: `/dashboard`, `/login`, `/signup`, `/compare`.
- Routes safe for canonicalization: `/`, `/pricing`, `/blog`, `/privacy`, `/terms`.
- Areas requiring conservative SEO: Product detail pages (`/product/:id`) as data is dynamic and frequently updated.
