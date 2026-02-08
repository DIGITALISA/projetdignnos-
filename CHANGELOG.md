# Changelog - CareerUpgrade Platform

## [Unreleased] - 2026-02-08

### New Features & Enhancements

#### 1. MongoDB Migration (Major)

- **Progress Tracking**: Migrated all assessment progress tracking from `localStorage` to **MongoDB**. This ensures user progress is saved persistently across sessions and devices.
- **Schema Update**: Updated `Diagnosis` and `User` models to store comprehensive assessment data including interview answers, role suggestions, and generated documents.
- **New API**: Implement `/api/user/progress` to fetch and sync user progress securely.

#### 2. Expert Diagnostic Report

- **AI Analysis**: Added a new AI function `generateExpertDiagnosticReport` to generate detailed reports for career coaches/experts based on the user's full assessment journey.
- **API Endpoint**: Created `/api/expert/diagnostic-report` to generate and retrieve these reports.

#### 3. Subscription Plans (Admin)

- **Simplified Plans**: Removed "Elite Full Pack" from the new user registration dropdown in the Admin Panel. Only **"Free Trial"** and **"Pro Essential"** remain.

#### 4. Access Control & Trial Logic (Dashboard)

- **Strict Access Control**: Implemented strict redirects in `layout.tsx` to prevent unauthorized access to premium features.
- **3-Hour Free Trial Logic**:
  - **Phase 1 (First 3 Hours)**: Access restricted to **Diagnosis & Audit** ONLY.
  - **Phase 2 (After 3 Hours OR Diagnosis Complete)**:
    - **Diagnosis & Audit**: Locked 🔒 (Cannot be redone).
    - **Simulations & Workshops**: Unlocked ✅ (The core value for free users).
    - **Other Features**: Locked 🔒 (Require Pro).
- **UI Updates**: Updated the Sidebar to visually reflect locked/unlocked states with lock icons.

### Bug Fixes & Refactoring

- Reference to `localStorage` made secondary/backup only.
- Fixed linting errors in `lib/deepseek.ts` (replaced `any` with specific types).
- Corrected ESLint warnings in `layout.tsx`.
