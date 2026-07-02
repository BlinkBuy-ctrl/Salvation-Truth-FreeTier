# Salvation and Truth — Phase 1 Frontend

## Setup
```
npm install
npx expo start
```

Press `w` for web/PWA preview, or scan the QR with Expo Go for native.

## Structure
- `app/_layout.jsx` — root layout, global audio context, top header, bottom tabs
- `app/(tabs)/index.jsx` — home feed: live banner, announcements, pastor's feed, audio cards
- `app/(tabs)/bible.jsx` — Bible tab placeholder (Phase 2)
- `app/(tabs)/profile.jsx` — guest profile placeholder
- `components/CustomAudioPlayer.jsx` — sticky continuous-play mini player

## Phase 2 additions
- **Bible reader** (`app/(tabs)/bible.jsx`) — real 66-book/chapter navigation with correct chapter counts (`lib/bibleData.js`), verse-of-the-day, tap-to-highlight verses, prev/next chapter nav. Ships with real KJV (public-domain) text for John 3, Psalm 23, Romans 8, Genesis 1 — bundle the remaining chapters as JSON when ready (`getChapterText` is the only function that needs a real data source).
- **Reminders** (`app/reminders.jsx`) — real `expo-notifications` local scheduling (permission request, recurring weekday/daily triggers), persisted via `ReminderStore`. Toggle on/off actually cancels/reschedules the OS notification.
- **Hamburger drawer** (`components/HamburgerDrawer.jsx`) — real slide-in drawer wired to the header menu button. Give → opens a donation URL, Contact → opens mail client, Share → native share sheet, About/Settings → real routed screens.
- **About & Settings** (`app/about.jsx`, `app/settings.jsx`) — real routed screens, Settings persists toggles to AsyncStorage.

## Production status
- **Audio**: real `expo-av` playback (`lib/useAudioEngine.js`) — actual streaming, real buffering/seek/rate, background playback enabled (`staysActiveInBackground`), resumes last position via local storage. Not simulated.
- **Persistence**: `lib/storage.js` — AsyncStorage-backed reminders, saved voice notes, last playback position. Swap for a synced backend later without touching UI.
- **Offline**: `lib/useNetworkStatus.js` + `components/OfflineBanner.jsx` — real `NetInfo` detection, not a mock flag.
- **Crash safety**: `components/ErrorBoundary.jsx` wraps the whole app.
- **Builds**: `eas.json` has dev/preview/production profiles. Run `eas build --profile production --platform all` once you have an Expo account + credentials.
- Guest-first: no auth required to browse.
- `useAudioPlayer()` (exported from `app/_layout.jsx`) is the global hook — same engine instance persists across every tab.

## Before you ship
1. Replace the two `audioUri` placeholders in `app/(tabs)/index.jsx` with your real sermon CDN URLs (S3/Cloudflare/Mux/etc).
2. Drop real `icon.png` (1024×1024), `adaptive-icon.png` (1024×1024, transparent), `splash.png`, `favicon.png` (48×48) into `/assets`.
3. Bundle the full 66-book KJV (or your translation) JSON into `lib/bibleData.js` — swap the `BIBLE_TEXT` object for a full dataset or an on-device SQLite lookup.
4. Set a real donation URL in `components/HamburgerDrawer.jsx` (`give` action) and a real support email (`contact` action).
5. Connect `lib/storage.js` to a real backend sync layer when the backend lands — the interface (`getAll/add/remove/update`) won't need to change on the UI side.
6. Run `npx expo install --check` after cloning to lock native module versions to your Expo SDK.
