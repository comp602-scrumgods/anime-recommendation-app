# Anime Recommendation App 🎬

Hi team! This is our **Anime Recommendation App**! It has:

- 🌐 **Backend**: Node.js API with anime data (e.g., `Attack on Titan`).
- 📱 **Frontend**: React Native/Expo app showing the anime list in a browser.

We use **pnpm** to run it. Let’s get it going in a browser! 🚀

# 🛠️ Quick Setup

1. **Install Tools**:

   - **Node.js** (v20): [Download](https://nodejs.org) (LTS version).
     - Check: `node --version`
   - **pnpm**: Run `npm install -g pnpm`.
     - Check: `pnpm --version`
   - **Expo CLI**: Run `pnpm add -g expo-cli`.
     - Check: `expo --version`

2. **Get the Code**:

   ```bash
   git clone https://github.com/comp602-scrumgods/anime-recommendation-app.git
   cd anime-recommendation-app
   ```

3. **Install Dependencies**:

   ```bash
   pnpm install
   ```

# 🚀 Run the App

**Start Backend**:

```bash
pnpm dev:backend
```

- See: 🚀 Server is running at `http://localhost:3000`
- Test: Open [http://localhost:3000/animes](http://localhost:3000/animes) in a browser.
- Shows: `[{ "id": 1, "title": "Attack on Titan" }, ...]`

# 🖌️ Edit the App

- **Backend**: Edit `apps/backend/src/index.ts`.
  - Add a new API route, e.g., `/hello`.
- **Frontend**: Edit `apps/mobile/app/HomeScreen.tsx`.
  - Change colors or add buttons.
- Changes show up in the browser instantly! ✨

# 🐛 Fix Problems

### Backend Error

- If `dist/index.js` missing:

  ```bash
  pnpm --filter backend build
  pnpm dev:backend
  ```

### Frontend Error

- If web doesn’t load:

  ```bash
  cd apps/mobile
  pnpm dev:mobile:web --clear
  rm -rf .expo
  cd ../..
  pnpm install
  ```

### Anime List Not Showing

- Ensure backend is running (`pnpm dev:backend`).
- Check browser console (F12) for errors.
