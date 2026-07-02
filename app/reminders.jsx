import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Switch, TextInput, Modal, Platform } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Plus, Clock, Trash2, X } from "lucide-react-native";
import * as Notifications from "expo-notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReminderStore } from "../lib/storage";

const PRESETS = [
  { label: "Sunday Service", hour: 8, minute: 0, weekday: 1 },
  { label: "Night of Intercession", hour: 21, minute: 0, weekday: 6 },
  { label: "Daily Devotion", hour: 6, minute: 30, weekday: null },
];

async function ensureNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const { status: requested } = await Notifications.requestPermissionsAsync();
  return requested === "granted";
}

async function scheduleReminderNotification(reminder) {
  const trigger =
    reminder.weekday != null
      ? { weekday: reminder.weekday, hour: reminder.hour, minute: reminder.minute, repeats: true }
      : { hour: reminder.hour, minute: reminder.minute, repeats: true };

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Salvation and Truth",
      body: reminder.label,
      sound: true,
    },
    trigger,
  });
  return notificationId;
}

async function cancelReminderNotification(notificationId) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (err) {
    console.warn("Cancel notification failed", err);
  }
}

function formatTime(hour, minute) {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

const WEEKDAY_LABELS = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function AddReminderModal({ visible, onClose, onCreate }) {
  const [label, setLabel] = useState("");
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);

  const handleCreate = () => {
    if (!label.trim()) return;
    onCreate({ label: label.trim(), hour, minute, weekday: null });
    setLabel("");
    setHour(8);
    setMinute(0);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-[#F8FAFC] rounded-t-[28px] p-6">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-[#0F172A] text-[17px] font-bold">New Reminder</Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center"
            >
              <X size={15} color="#0F172A" />
            </Pressable>
          </View>

          <Text className="text-[#64748B] text-[12px] font-semibold mb-2">LABEL</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="e.g. Morning Prayer"
            placeholderTextColor="#94A3B8"
            className="bg-white rounded-2xl px-4 py-3.5 text-[14.5px] text-[#0F172A]"
            style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
          />

          <Text className="text-[#64748B] text-[12px] font-semibold mb-2 mt-5">TIME</Text>
          <View className="flex-row" style={{ gap: 10 }}>
            <View className="flex-1 bg-white rounded-2xl px-4 py-3.5" style={{ borderWidth: 1, borderColor: "#E2E8F0" }}>
              <TextInput
                value={String(hour)}
                onChangeText={(v) => setHour(Math.max(0, Math.min(23, Number(v.replace(/\D/g, "")) || 0)))}
                keyboardType="number-pad"
                maxLength={2}
                className="text-[14.5px] text-[#0F172A] text-center font-semibold"
              />
              <Text className="text-[#94A3B8] text-[10px] text-center mt-1">HOUR (0–23)</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl px-4 py-3.5" style={{ borderWidth: 1, borderColor: "#E2E8F0" }}>
              <TextInput
                value={String(minute)}
                onChangeText={(v) => setMinute(Math.max(0, Math.min(59, Number(v.replace(/\D/g, "")) || 0)))}
                keyboardType="number-pad"
                maxLength={2}
                className="text-[14.5px] text-[#0F172A] text-center font-semibold"
              />
              <Text className="text-[#94A3B8] text-[10px] text-center mt-1">MINUTE</Text>
            </View>
          </View>

          <Pressable
            onPress={handleCreate}
            className="mt-6 bg-[#0F172A] rounded-2xl py-4 items-center active:opacity-90"
          >
            <Text className="text-white text-[14px] font-semibold">Set Reminder</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const [reminders, setReminders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const loadReminders = useCallback(async () => {
    const stored = await ReminderStore.getAll();
    setReminders(stored);
  }, []);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleCreate = async (draft) => {
    const granted = await ensureNotificationPermission();
    if (!granted) {
      setPermissionDenied(true);
      setModalOpen(false);
      return;
    }
    const notificationId = await scheduleReminderNotification(draft);
    const next = await ReminderStore.add({ ...draft, enabled: true, notificationId });
    setReminders(next);
    setModalOpen(false);
  };

  const handleAddPreset = async (preset) => {
    const alreadyExists = reminders.some((r) => r.label === preset.label);
    if (alreadyExists) return;
    await handleCreate(preset);
  };

  const handleToggle = async (reminder, value) => {
    if (value) {
      const granted = await ensureNotificationPermission();
      if (!granted) {
        setPermissionDenied(true);
        return;
      }
      const notificationId = await scheduleReminderNotification(reminder);
      const next = await ReminderStore.update(reminder.id, { enabled: true, notificationId });
      setReminders(next);
    } else {
      await cancelReminderNotification(reminder.notificationId);
      const next = await ReminderStore.update(reminder.id, { enabled: false, notificationId: null });
      setReminders(next);
    }
  };

  const handleDelete = async (reminder) => {
    await cancelReminderNotification(reminder.notificationId);
    const next = await ReminderStore.remove(reminder.id);
    setReminders(next);
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-white items-center justify-center"
          style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
        >
          <ChevronLeft size={17} color="#0F172A" />
        </Pressable>
        <Text className="text-[#0F172A] text-[16px] font-bold ml-3">My Reminders</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {permissionDenied ? (
          <View className="bg-[#FEF3E2] rounded-2xl p-4 mb-4">
            <Text className="text-[#92400E] text-[12.5px] leading-5">
              Notifications are turned off for this app. Enable them in your device settings to
              get reminders.
            </Text>
          </View>
        ) : null}

        <Text className="text-[#64748B] text-[12px] font-semibold mb-3">QUICK ADD</Text>
        <View className="flex-row flex-wrap mb-6" style={{ gap: 8 }}>
          {PRESETS.map((preset) => (
            <Pressable
              key={preset.label}
              onPress={() => handleAddPreset(preset)}
              className="bg-white rounded-full px-4 py-2.5"
              style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
            >
              <Text className="text-[#0F172A] text-[12.5px] font-medium">{preset.label}</Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-[#64748B] text-[12px] font-semibold">ACTIVE REMINDERS</Text>
          <Pressable
            onPress={() => setModalOpen(true)}
            className="flex-row items-center bg-[#0F172A] rounded-full px-3.5 py-2"
          >
            <Plus size={13} color="#FFFFFF" />
            <Text className="text-white text-[12px] font-semibold ml-1">Custom</Text>
          </Pressable>
        </View>

        {reminders.length === 0 ? (
          <View className="items-center py-14">
            <Clock size={28} color="#CBD5E1" />
            <Text className="text-[#94A3B8] text-[13px] mt-3">No reminders yet</Text>
          </View>
        ) : (
          reminders.map((reminder) => (
            <View
              key={reminder.id}
              className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center justify-between mb-2.5"
              style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
            >
              <View className="flex-1">
                <Text className="text-[#0F172A] text-[14px] font-semibold">{reminder.label}</Text>
                <Text className="text-[#94A3B8] text-[12px] mt-0.5">
                  {reminder.weekday != null ? `${WEEKDAY_LABELS[reminder.weekday]} · ` : "Daily · "}
                  {formatTime(reminder.hour, reminder.minute)}
                </Text>
              </View>
              <Switch
                value={reminder.enabled}
                onValueChange={(v) => handleToggle(reminder, v)}
                trackColor={{ false: "#E2E8F0", true: "#D97706" }}
                thumbColor="#FFFFFF"
              />
              <Pressable onPress={() => handleDelete(reminder)} className="ml-3 p-1">
                <Trash2 size={16} color="#94A3B8" />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <AddReminderModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </View>
  );
}
