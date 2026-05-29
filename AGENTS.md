# AI Agent Instructions for `cerebria-web`

## Purpose
This repository is a small frontend web application built with React and Vite. Use this file to understand the project layout, common commands, and key conventions before making code changes.

## Key facts
- Framework: React 19
- Bundler: Vite 8
- JavaScript flavor: ESM, no TypeScript
- CSS: plain `.css` files under `src/style`
- No backend code or tests are present in this repository

## Important files
- `package.json` - project scripts and dependencies
- `vite.config.js` - Vite configuration
- `eslint.config.js` - linting rules
- `index.html` - application HTML shell
- `src/main.jsx` - React entry point
- `src/App.jsx` - top-level app component
- `src/components/` - UI components
- `src/style/` - component styling

## Usual commands
Use the package scripts from `package.json`.
- `npm install` - install dependencies
- `npm run dev` - start Vite development server
- `npm run build` - produce production build in `dist/`
- `npm run preview` - preview production build
- `npm run lint` - run ESLint across the project

## Editing guidance
- Keep the project structure simple and frontend-only.
- Prefer updates in `src/components/*` and `src/style/*` for UI changes.
- Avoid introducing new full-stack/backend concepts unless explicitly requested.
- When suggesting terminal actions, use the defined `npm run ...` scripts.

## Notes for terminal-integrated suggestions
- Recommend commands that exist in `package.json`.
- If a task requires validation, prefer `npm run lint` or `npm run build`.
- Do not propose backend or test commands not supported by this repo.

## General conventions
- This app uses React component files with `.jsx`.
- Styling is managed through separate CSS files, not CSS-in-JS.
- Keep dependencies aligned with the existing Vite/React setup.
