# DDU Smart Classroom Management System

A frontend-only prototype for a smart classroom coordination experience at Deen Dayal Upadhyaya Gorakhpur University (DDUGU). The prototype demonstrates role-based interfaces and classroom/schedule workflows using mock data.

> **Prototype notice:** This repository currently contains a frontend demonstration only. It is **not connected to a production backend, database, campus SSO, or live academic timetable service**. Authentication, dashboard data, and classroom/catalog data are mock implementations. Do not use it for real classroom allocation, official scheduling, or sensitive student/faculty information.

## Contents

- [Overview](#overview)
- [Prototype scope](#prototype-scope)
- [Technology stack](#technology-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Run locally](#run-locally)
- [Demo accounts](#demo-accounts)
- [How to use the prototype](#how-to-use-the-prototype)
- [Project status and limitations](#project-status-and-limitations)
- [Build and quality checks](#build-and-quality-checks)
- [Configuration](#configuration)
- [Suggested next steps](#suggested-next-steps)
- [Disclaimer](#disclaimer)

## Overview

The DDU Smart Classroom Management System is intended to help campus stakeholders coordinate classroom usage and academic activities. Its product goal is to make it easier for faculty to locate suitable rooms, help administrators coordinate classroom resources, and help students stay informed about their schedules and room changes.

This version is a **functional UI prototype**. It is suitable for demonstrations, design review, usability feedback, and frontend workflow evaluation.

## Prototype scope

The prototype uses local/mock data and mock service adapters to demonstrate the intended experience. Depending on the implemented screens, this may include:

- Role-based demo entry for student, faculty, and administrator users.
- Student-facing dashboard and timetable-oriented views.
- Faculty-facing schedule, classroom discovery, and booking-oriented views.
- Administrator-facing classroom, user, schedule, and booking-management views.
- Notification and status displays.
- Sample classroom/catalog data and a landing page.

Some interactions may update only temporary frontend state or mock data. A successful-looking action in the interface does **not** mean that a real booking has been saved or that a real timetable has changed.

## Technology stack

The project is built with the following frontend technologies (confirm exact versions in `package.json`):

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Component/UI libraries and utilities installed in the project
- Mock service/adaptor modules for prototype data and interactions

No production backend is included in this prototype.

## Requirements

Install the following before starting:

- Node.js LTS (Node.js 20 or later is recommended)
- npm (included with Node.js)
- Git, if cloning the repository

Check your versions:

```bash
node --version
npm --version
```

## Installation

1. Clone the repository:

   ```bash
   git clone <YOUR_GITHUB_REPOSITORY_URL>
   ```

2. Enter the project directory:

   ```bash
   cd <YOUR_PROJECT_DIRECTORY>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. If the project includes an environment example file, copy it and fill in only the values documented by the project:

   **Windows PowerShell**
   ```powershell
   Copy-Item .env.example .env.local
   ```

   **macOS / Linux**
   ```bash
   cp .env.example .env.local
   ```

   A mock-only run may not require environment variables. Do not add real secrets to a frontend environment file. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Run locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Stop the server with `Ctrl + C`.

## Demo accounts

Use the following accounts for local demonstration, as shown in the prototype's demo sign-in information:

| Role | Email | Password |
|---|---|---|
| Student | `student@ddugu.ac.in` | `Student@1234` |
| Faculty | `faculty@ddugu.ac.in` | `Faculty@1234` |
| Admin | `admin@ddugu.ac.in` | `Admin@1234` |

**Demo credentials are public prototype credentials, not real campus accounts.** They must never be reused for production or connected to real personal information.

## How to use the prototype

1. Start the application with `npm run dev`.
2. Open `http://localhost:3000`.
3. Use one of the demo accounts above on the sign-in page.
4. Explore the role-specific navigation and available screens.
5. Try the sample classroom, schedule, booking, and notification interactions that are present in the UI.
6. Sign out and repeat with another role to compare the different experiences.

The exact features available depend on the current implementation. Treat all displayed people, rooms, schedules, booking statuses, and notifications as sample data unless independently verified.

## Project status and limitations

This release is a **frontend-only prototype**. The following are known limitations:

- Dashboard, admin, and authentication adapters are mock implementations behind factories. They need to be replaced with real services before production use.
- `src/services/classroom-service.ts` and related homepage `MOCK_*` imports contain mock/catalog seed data; they are not connected to a live backend.
- There is no production database or persistent server-side storage. Changes may be temporary, reset on refresh, or limited to the current browser session.
- There is no campus SSO or production-grade authentication/session system.
- The current `proxy()` does not validate cookies. Client-side navigation or hidden menu items are not security controls.
- The admin-header notification bell did not expand during one automated click check; the dedicated notifications page was reported to work. Verify the bell manually if demonstrating it.
- Classroom availability and conflict prevention are not authoritative. A real system must validate all bookings on the server and prevent overlapping reservations transactionally.
- No real-time timetable feed, email/SMS delivery, or guaranteed push-notification service is included unless separately implemented and connected.

### Production-readiness checklist

Before using this system operationally, implement and verify:

- Secure backend authentication, campus SSO or an approved identity provider.
- Server-side authorization for every protected API and resource.
- HTTP-only, Secure, SameSite session cookies and proper CSRF/session protections as applicable.
- A real academic data source and approved student/faculty records.
- Persistent database storage and audit trails.
- Server-side booking conflict detection with concurrency-safe transactions/constraints.
- Authoritative timetable and classroom availability APIs.
- Notification delivery, retry handling, and delivery status.
- Input validation, rate limiting, logging, monitoring, backups, and security testing.
- Privacy review and approval from the university before processing real personal data.

## Build and quality checks

Run the available project checks:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Start the production build locally after a successful build:

```bash
npm run start
```

If a command is missing from `package.json`, inspect the scripts section and use the scripts that are actually defined by this repository. The expected development URL is `http://localhost:3000`.

## Configuration

This prototype may run without a backend or environment configuration. Check `.env.example`, `package.json`, and the service modules before adding configuration.

Do not commit:

- `.env.local` or other files containing secrets
- private keys, API tokens, or real credentials
- real student/faculty personal data

Ensure `.env.local` is ignored by Git.

## Suggested next steps

1. Replace mock authentication with approved campus SSO or a secure backend session flow.
2. Replace mock service adapters with typed API clients.
3. Connect approved classroom, faculty, student, and timetable data.
4. Implement server-authoritative availability checks and conflict-safe booking operations.
5. Add integration tests, accessibility checks, and security review.
6. Obtain university approval before any real deployment or collection of personal data.

## Disclaimer

This project is provided as an academic/demo prototype. It is not an official university scheduling system and must not be treated as a source of truth for classroom assignments, timetables, or academic announcements. All sample data and demo credentials are for demonstration only.
