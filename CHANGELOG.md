# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.5.8] - 2026-08-23

- Add a security audit job to the CI, blocking the release chain (npm audit and cargo audit)
- Add a Dependabot configuration for weekly npm, Cargo and GitHub Actions updates
- Update every GitHub Action to a Node.js 24 runtime, clearing the Node.js 20 deprecation
  warnings (checkout 7, setup-node 7, upload-artifact 7, github-script 9, cache 6,
  tauri-action 1.0.0)
- Update @tanstack/react-query to 5.102.1 and react-hook-form to 7.86.0
- Update Rust dependencies (cc, crc32fast, icu_provider, log, swift-rs, uuid, zerovec-derive)

Maintenance release: no security advisory was open at the time of writing. npm audit,
cargo audit and Dependabot all reported zero open vulnerabilities.

## [0.5.7] - 2026-08-20

- Fix 8 npm security vulnerabilities (react-router, vite, postcss, js-yaml, nanoid, brace-expansion, @babel/core)
- Update react-router-dom to 7.18.2 (RCE via turbo-stream, CSRF, open redirect and DoS advisories)
- Update Vite to 8.2.2 (server.fs.deny bypass and NTLMv2 hash disclosure advisories)
- Fix 2 Rust security vulnerabilities: quick-xml 0.38.4 to 0.41.0 (memory-exhaustion DoS and quadratic run time)
- Update Rust dependencies (Tauri 2.11.5, tauri-build 2.6.3)
- Update @tauri-apps/api to 2.11.1 and @tauri-apps/cli to 2.11.4 to match the Tauri Rust crate
- Update all remaining JavaScript dependencies to latest minor/patch versions
- Update MUI 7 packages to 7.3.11, @mui/lab to 7.0.1-beta.25 and @mui/x-data-grid to 8.29.2
- Update React and React DOM to 19.2.8, react-hook-form to 7.85.0 and @tanstack/react-query to 5.101.4
- Update Tailwind CSS to 4.3.3
- Update ESLint to 9.39.5, typescript-eslint to 8.67.0, TypeScript to 6.0.3 and Prettier to 3.9.6
- Update Playwright to 1.62.1
- Update Docker Google Cloud SDK image from 558.0.0 to 581.0.0

## [0.5.6] - 2026-04-14

- Update all JavaScript dependencies to latest minor/patch versions
- Update TypeScript to 6.0.2
- Update Vite to 8 and @vitejs/plugin-react to 6
- Update @mui/x-data-grid to 8.28.2 and other MUI 7 packages to latest 7.x
- Update @tanstack/react-query to 5.99.0
- Update Playwright to 1.59.1
- Update Rust dependencies (Tauri 2.10.3, tauri-build 2.5.6)

## [0.5.5] - 2026-03-01

- Update all JavaScript dependencies to latest minor/patch versions
- Update ESLint and @eslint/js to 9.39.3
- Update Tailwind CSS to 4.2.1
- Update Rust dependencies (22 crates updated)
- Fix 3 npm security vulnerabilities (ajv, minimatch, rollup)
- Update Docker Google Cloud SDK image from 518.0.0 to 558.0.0

## [0.5.4] - 2026-02-19

- Update all JavaScript dependencies to latest minor/patch versions
- Update Rust dependencies (Tauri 2.10.2, tauri-build 2.5.5, tauri-plugin-shell 2.3.5)
- Fix flaky E2E tests: isolate test files with unique project IDs and fix missing awaits in cleanup
- Migrate from fetch/useState to React Query (TanStack Query) for data fetching and mutations

## [0.5.3] - 2026-01-13

- Update all dependencies

## [0.5.2] - 2025-12-22

 - Update all dependencies

## [0.5.1] - 2025-04-26

 - Improve app icon
 - Update all dependancies

## [0.5.0] - 2025-04-21

 - Add end-to-end tests for pubsub emulator
 - Update CI to launch tests before create new release
 - New App icon
 - Update all dependancies 

## [0.4.1] - 2025-04-03

 - Update library / security advisory

## [0.4.0] - 2025-03-08

- New Subscription messages view.
- Add Schema support for Topics.
- Add Topic details view.
- Add GCP API documentation link for each Pub/Sub components.
- Improve UX & Code.
- Update all libraies to latest versions (Rect 19, Tauri 2.3, Tailwind Css 4, Material UI, etc..).

## [0.3.0] - 2024-09-28

- Update dependencies.
- Add button to refresh topics & subscriptions list.
