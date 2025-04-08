Here's your **full updated `README.md`** including:

- ✅ `pnpm` installation
- ✅ Monorepo setup
- ✅ Frontend & backend instructions
- ✅ Sample API route
- ✅ Project structure

---

### 📄 Copy-paste `README.md`

````md
# 🧠 Anime Recommendation App (Monorepo)

Welcome to the **Anime Recommendation App**, a full-stack TypeScript monorepo using:

- 📱 **React Native + Expo Router** (`apps/mobile`)
- 🔙 **Node.js + Express + TypeScript** (`apps/backend`)
- 🚀 **pnpm + workspace monorepo** structure

---

## 📦 Prerequisites

Make sure you have **Node.js (v18+ recommended)** installed.

### Install `pnpm` (if not already installed)

```bash
npm install -g pnpm
```
````

Learn more at: [https://pnpm.io](https://pnpm.io)

---

## 🧰 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

This installs all workspaces: `apps/backend`, `apps/mobile`, etc.

---

### 2. Start both frontend & backend (dev)

```bash
pnpm dev
```

> This runs both `expo start` and the Express API in parallel.

---

## 📱 Mobile App (Expo)

To start only the mobile app:

```bash
pnpm --filter mobile dev
```

Open the app in:

- [Expo Go](https://expo.dev/go)
- Android emulator
- iOS simulator
- Web browser (`w` key)

Expo uses file-based routing from the `app/` directory.

---

## 🔙 Backend API (Express + TypeScript)

To start just the backend server:

```bash
pnpm --filter backend start:ts
```

Server runs on: [http://localhost:3000](http://localhost:3000)

### Example Route:

```
GET /animes
```

Response:

```json
[
  { "id": 1, "title": "Attack on Titan" },
  { "id": 2, "title": "Jujutsu Kaisen" },
  { "id": 3, "title": "Demon Slayer" }
]
```

---

## 📦 Project Structure

```
apps/
├── mobile/    # React Native (Expo)
└── backend/   # Node.js + Express

packages/      # (optional) Shared types/utilities
pnpm-workspace.yaml
```
