# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**gcp-emulator-gui** is a cross-platform desktop application providing a GUI for Google Cloud Platform emulators. Currently focused on PubSub emulator with plans for Firestore, Datastore, Bigtable, and Spanner.

Tech stack: Tauri 2 (Rust backend) + React 19 + TypeScript + Material UI + Tailwind CSS + Vite

## Common Commands

```bash
# Development
npm run dev              # Vite dev server only (web)
npm run tauri dev        # Full desktop app with hot reload

# Building
npm run build            # TypeScript check + Vite production build
npm run tauri build      # Production desktop app

# Code Quality
npm run lint             # ESLint (max-warnings=0)
npm run format           # Prettier

# Testing
npm run test:e2e         # Playwright E2E tests (headless)
npm run test:e2e:ui      # Playwright with interactive UI
```

## Architecture

### Frontend (`src/`)

- **Entry**: `main.tsx` → React 19 with StrictMode, BrowserRouter, MUI ThemeProvider
- **State**: React Context API (`contexts/emulators.tsx`) for global emulator connection settings; local state for component data
- **Routing**: React Router v7 in `App.tsx` with PageLayout wrapper
- **API Layer**: `api/common.ts` provides `apiCall()` with retry logic and `ApiError` class; endpoint-specific files for topics, subscriptions, schemas

### Backend (`src-tauri/`)

- Minimal Rust backend—currently just `check_connection(host, port)` Tauri command using TCP
- Configuration in `src-tauri/tauri.conf.json`

### Component Organization

```
components/
├── pubsub/       # Domain components (Topic, Subscription, Schema with Create/List variants)
├── ui/           # Reusable UI (Title, ConfirmationDialog, CopyableSyntaxHighlighter)
├── navigation/   # Nav, NavItem
└── emulator/     # Settings form
pages/            # Route-level components (Home, Pubsub, etc.)
```

### Key Patterns

- All API requests go through `apiCall()` which handles retries, timeouts, and error wrapping
- Forms use React Hook Form with MUI TextField components
- MUI Tabs organize PubSub resources (Topics, Subscriptions, Schemas)
- Settings (host, port, project_id) flow from EmulatorContext down to components

## Testing

E2E tests in `tests/e2e/` using Playwright:
- Tests run against Chromium
- Fixtures in `pubsub.fixtures.ts`
- Run single test: `npx playwright test tests/e2e/homepage.spec.ts`

## Styling

- Tailwind CSS for layout/utility classes
- MUI components with custom theme (`src/theme.ts`): primary blue[800], secondary lightGreen[600]
- Roboto Variable font

## Docker

`docker-compose.yml` provides local GCP PubSub emulator for development testing.
