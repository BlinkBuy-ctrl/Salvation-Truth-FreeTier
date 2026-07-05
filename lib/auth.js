import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const USERS_KEY = "@st/users";
const SESSION_KEY = "@st/session";
const SALT = "st-local-v1";

async function hashPassword(password) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${SALT}:${password}`
  );
}

async function getUsers() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveUsers(users) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function seedAdminIfMissing() {
  const users = await getUsers();
  if (users.some((u) => u.role === "admin")) return;
  const passwordHash = await hashPassword("Admin@123");
  users.push({
    id: "admin-seed",
    name: "Pastor Emmanuel Kadzuwa",
    email: "admin@salvationandtruth.church",
    passwordHash,
    role: "admin",
    createdAt: Date.now(),
  });
  await saveUsers(users);
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

export const AuthStore = {
  async init() {
    await seedAdminIfMissing();
  },

  async signup({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getUsers();
    if (users.some((u) => u.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }
    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "member",
      createdAt: Date.now(),
    };
    users.push(newUser);
    await saveUsers(users);
    await AsyncStorage.setItem(SESSION_KEY, newUser.id);
    return publicUser(newUser);
  },

  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getUsers();
    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) {
      throw new Error("No account found with that email.");
    }
    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      throw new Error("Incorrect password.");
    }
    await AsyncStorage.setItem(SESSION_KEY, user.id);
    return publicUser(user);
  },

  async logout() {
    await AsyncStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser() {
    const sessionId = await AsyncStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;
    const users = await getUsers();
    const user = users.find((u) => u.id === sessionId);
    return publicUser(user);
  },
};
