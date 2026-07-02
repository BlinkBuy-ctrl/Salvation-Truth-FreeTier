import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, Switch, ScrollView } from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@st/app_settings";

const DEFAULT_SETTINGS = {
  autoDownloadOnWifi: true,
  darkAudioBackground: true,
  weeklyDigestEmail: false,
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (raw) setSettings(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  const updateSetting = useCallback(
    (key, value) => {
      const next = { ...settings, [key]: value };
      setSettings(next);
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    },
    [settings]
  );

  if (!loaded) return null;

  const ROWS = [
    {
      key: "autoDownloadOnWifi",
      label: "Auto-download new sermons on Wi-Fi",
    },
    {
      key: "darkAudioBackground",
      label: "Keep audio playing in background",
    },
    {
      key: "weeklyDigestEmail",
      label: "Weekly digest email",
    },
  ];

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
        <Text className="text-[#0F172A] text-[16px] font-bold ml-3">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="bg-white rounded-2xl" style={{ borderWidth: 1, borderColor: "#E2E8F0" }}>
          {ROWS.map((row, i) => (
            <View
              key={row.key}
              className="flex-row items-center justify-between px-4 py-4"
              style={{
                borderBottomWidth: i < ROWS.length - 1 ? 1 : 0,
                borderBottomColor: "#F1F5F9",
              }}
            >
              <Text className="text-[#1E293B] text-[13.5px] font-medium flex-1 mr-3">
                {row.label}
              </Text>
              <Switch
                value={settings[row.key]}
                onValueChange={(v) => updateSetting(row.key, v)}
                trackColor={{ false: "#E2E8F0", true: "#D97706" }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
