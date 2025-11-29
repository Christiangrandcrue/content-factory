# Content Factory /// Hybrid

## Project Overview
- **Name**: content-factory-app
- **Goal**: AI-powered image transformation and animation utility.
- **Status**: Active (Restored & Upgraded)

## Features
- **Hybrid Interface**: Minimalist "Swiss Style" UI focused on content.
- **Edge-Native**: Built on Cloudflare Pages + Hono for sub-second global latency.
- **Input**: Accepts Image URL + Text Prompt.
- **Output**: Simulates animation generation (Ready for AI Model integration).

## URLs
- **Production**: https://content-factory-app.pages.dev
- **Preview**: https://main.content-factory-app.pages.dev

## Tech Stack
- **Framework**: Hono (Edge-first)
- **Platform**: Cloudflare Pages
- **Styling**: Tailwind CSS (via CDN for speed)
- **Design System**: Monochromatic, Space Mono + Inter typography.

## Usage
1. Enter a valid Image URL.
2. Enter a transformation prompt.
3. Click "Execute".
4. System processes request (currently simulated for MVP).

## Development
```bash
# Install dependencies
npm install

# Run local dev server
npm run dev

# Build for production
npm run build

# Deploy
npm run deploy
```
