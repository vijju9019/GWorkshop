# Implementation Plan - Google Machine

Google Machine is a cloud-powered virtual workspace platform designed to look and feel like a lightweight ChromeOS or VirtualBox environment. It allows users to manage virtual workspaces and access Google apps without local storage constraints.

## User Review Required

> [!IMPORTANT]
> **Tech Stack Confirmation**: I will be using React + Vite + TypeScript for the frontend, and Node.js + Express for the backend (as requested). I will use **Supabase** for Auth, Database, and Cloud Storage for a faster and more integrated experience.
> **Draggable Windows**: I'll use `react-rnd` for the virtual window management to ensure a premium, desktop-like feel.

## Proposed Changes

### 1. Project Setup
- [NEW] Initialize Vite project with React and TypeScript in `client/`.
- [NEW] Initialize Node.js Express server in `server/`.
- [NEW] Configure TailwindCSS with Google-inspired design tokens (Inter font, specific HSL colors).

### 2. Frontend Components (Client)
#### UI/UX System
- `index.css`: Define core design system (Google-blue: `#1a73e8`, surfaces: `#f8f9fa`, shadows, rounded corners).
- Layout components for Dashboard and Desktop.

#### Pages & Views
- **Login Page**: Minimalist card UI with Google OAuth integration.
- **Dashboard**: Main hub with sidebar navigation, storage status, and workspace overview.
- **Workspace Manager**: Interface to create/delete workspaces and view their status.
- **Virtual Desktop**: The "OS" experience.
    - `Taskbar`: Persistent bottom bar with launcher and system info.
    - `WindowManager`: Handles window stacking (z-index), minimizing, and maximizing.
    - `AppWindow`: Wrapper for apps using `react-rnd`.
    - `FileExplorer`: Integrated cloud storage viewer.
- **Performance Monitor**: Real-time (simulated) analytics for RAM, CPU, and Storage.

### 3. Backend (Server)
- **API Routes**:
    - `/api/workspaces`: CRUD operations for virtual workspaces.
    - `/api/storage`: Metadata management for cloud files.
    - `/api/performance`: Simulated resource metrics.
- **Supabase Integration**: Middleware for authentication and database syncing.

### 4. Features & Integrations
- **Google App Integration**: Using `<iframe>` containers to render Google Docs, Drive, YouTube, etc. within virtual windows.
- **Cloud Storage**: 500MB limit enforcement, upload/download functionality.

## Verification Plan

### Automated Tests
- `npm test` for core logic (storage calculation, workspace state).
- Browser-based verification of draggable window behavior and z-index stacking.

### Manual Verification
- Verify Google OAuth flow.
- Test "Create Workspace" and "Launch" flow.
- Verify 500MB storage limit UI.
- Test multi-window multitasking on the virtual desktop.
