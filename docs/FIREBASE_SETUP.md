# Firebase setup — The Crucible

Account owner: **mezuai000@gmail.com**

## 1. Create the project

1. Sign in at [Firebase Console](https://console.firebase.google.com) with **mezuai000@gmail.com**
2. **Add project** → name: `the-crucible` (or `the-crucible-app`)
3. Disable Google Analytics if you want a lean setup (optional)

## 2. Enable Authentication

1. **Build → Authentication → Get started**
2. **Sign-in method → Anonymous** → Enable
3. **Sign-in method → Google** → Enable
   - Support email: **mezuai000@gmail.com**
   - Download updated config if prompted

## 3. Register the web app

1. Project overview → **Web** (`</>`)
2. App nickname: `The Crucible Web`
3. Copy the `firebaseConfig` object values into Cloudflare Pages **Environment variables** (Production):

| Variable | Example |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `the-crucible.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `the-crucible` |
| `VITE_FIREBASE_APP_ID` | `1:...:web:...` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `FIREBASE_WEB_API_KEY` | same as `VITE_FIREBASE_API_KEY` |

4. **Rebuild and redeploy** Pages after setting `VITE_*` vars (they bake in at build time)

## 4. Authorized domains

**Authentication → Settings → Authorized domains** — add:

- `localhost`
- `the-crucible-d1d.pages.dev`
- Any custom domain you attach later

## 5. Cloudflare secrets (server-side pool)

In Cloudflare Pages → Settings → Environment variables:

| Secret | Purpose |
|---|---|
| `CURSOR_API_KEY` | Multi-pass deep readings |
| `CURSOR_MODEL` | Optional, default `composer-2.5` |
| `GEMINI_API_KEY` | Compass / research (backend only) |
| `FIREBASE_WEB_API_KEY` | Verify user ID tokens on `/api/deep-reading` |

Users never enter these keys.

## 6. Local development

Copy `.env.example` to `.env.local` and fill Firebase + optional API keys:

```bash
npm run dev
```

Sign in on the **You** tab → Continue as guest or Google.

## 7. OAuth consent (Google sign-in)

If Google sign-in fails in production:

1. [Google Cloud Console](https://console.cloud.google.com) → project linked to Firebase
2. **APIs & Services → OAuth consent screen** → add **mezuai000@gmail.com** as test user or publish app
3. Ensure **Authorized JavaScript origins** include your Pages URL

## 8. Subscription tier (future)

The app reserves tier `subscriber` (500 deep reads/day). Promote users via Firebase custom claims or Firestore `users/{uid}.tier` when billing ships.
