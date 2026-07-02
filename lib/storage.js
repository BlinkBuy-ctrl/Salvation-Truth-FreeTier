import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  REMINDERS: "@st/reminders",
  SAVED_VOICE_NOTES: "@st/saved_voice_notes",
  LAST_PLAYBACK: "@st/last_playback",
};

async function safeGet(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Storage read failed for ${key}`, err);
    return fallback;
  }
}

async function safeSet(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Storage write failed for ${key}`, err);
    return false;
  }
}

export const ReminderStore = {
  async getAll() {
    return safeGet(KEYS.REMINDERS, []);
  },
  async add(reminder) {
    const current = await this.getAll();
    const next = [...current, { ...reminder, id: reminder.id ?? String(Date.now()) }];
    await safeSet(KEYS.REMINDERS, next);
    return next;
  },
  async remove(id) {
    const current = await this.getAll();
    const next = current.filter((r) => r.id !== id);
    await safeSet(KEYS.REMINDERS, next);
    return next;
  },
  async update(id, patch) {
    const current = await this.getAll();
    const next = current.map((r) => (r.id === id ? { ...r, ...patch } : r));
    await safeSet(KEYS.REMINDERS, next);
    return next;
  },
};

export const SavedVoiceNotesStore = {
  async getAll() {
    return safeGet(KEYS.SAVED_VOICE_NOTES, []);
  },
  async toggle(voiceNote) {
    const current = await this.getAll();
    const exists = current.some((v) => v.id === voiceNote.id);
    const next = exists
      ? current.filter((v) => v.id !== voiceNote.id)
      : [...current, voiceNote];
    await safeSet(KEYS.SAVED_VOICE_NOTES, next);
    return { list: next, saved: !exists };
  },
  async isSaved(id) {
    const current = await this.getAll();
    return current.some((v) => v.id === id);
  },
};

export const PlaybackPositionStore = {
  async get() {
    return safeGet(KEYS.LAST_PLAYBACK, null);
  },
  async set(audioId, positionMillis) {
    await safeSet(KEYS.LAST_PLAYBACK, { audioId, positionMillis, savedAt: Date.now() });
  },
  async clear() {
    try {
      await AsyncStorage.removeItem(KEYS.LAST_PLAYBACK);
    } catch (err) {
      console.warn("Failed clearing playback position", err);
    }
  },
};
