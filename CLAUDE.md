# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Node.js/Express)
```bash
cd backend
npm install          # Install dependencies
npm start            # Start production server on port 3001
npm run dev          # Start development server with auto-restart (nodemon)
```

### Frontend
- Open `frontend/index.html` directly in a browser
- No build process required - uses vanilla HTML/CSS/JavaScript

## Architecture Overview

This is a "forkable" AI image processing application with a simple two-tier architecture:

### Backend (`/backend`)
- **Express.js server** on port 3001
- **Single core concept**: The entire app behavior is controlled by changing one line in `server.js:14` (the `geminiPrompt` variable)
- **Main endpoint**: `POST /api/process-image` - accepts Base64 image data, sends to Gemini API
- **Key files**:
  - `server.js` - Main server file with the forkable prompt configuration
  - `.env` - Environment variables (requires `GEMINI_API_KEY`)
  - `env.template` - Template for environment setup

### Frontend (`/frontend`)
- **Vanilla JavaScript** - no framework dependencies
- **Files**:
  - `index.html` - Complete UI with embedded CSS
  - `app.js` - ImageProcessor class handles file upload and API communication
- **Features**: Drag-drop upload, image preview, progress indicators

### Key Integration Points
- Frontend communicates with backend via `http://localhost:3001/api/process-image`
- Images are processed as Base64 data (max 10MB)
- Backend uses Google Gemini Vision API for image analysis/modification

## Forkable Architecture Pattern

The core "forkable" concept:
- **Line 14 in `backend/server.js`** contains the `geminiPrompt` string
- Changing this single line creates an entirely different image processing app
- Examples: sketch converter, vintage filter, cartoon transformer, etc.

## Environment Setup

1. Get Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `backend/env.template` to `backend/.env`
3. Add your API key: `GEMINI_API_KEY=your_key_here`

## Database
- `mydatabase.db` - SQLite database file (purpose unclear from current analysis)

## No Build Process
- Backend: Direct Node.js execution
- Frontend: Static files served directly from filesystem
- No bundling, transpilation, or compilation steps required