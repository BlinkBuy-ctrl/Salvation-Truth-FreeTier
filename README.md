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

## Notes
- Guest-first: no auth required to browse.
- `useAudioPlayer()` (exported from `app/_layout.jsx`) is the global hook for triggering/controlling voice note playback from anywhere in the app.
- Mock progress ticking simulates real playback for demo purposes — swap in `expo-av`/`expo-audio` when wiring real audio files.
