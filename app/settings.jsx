import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, Switch, ScrollView } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Moon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../lib/ThemeContext";

const SETTINGS_KEY = "@st/app_settings";

const DEFAULT_SETTINGS = {
  autoDownloadOnWifi: true,
  darkAudioBackground: true,
  weeklyDigestEmail: false,
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, mode, toggleTheme } = useTheme();
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

  const ROWS = [
    { key: "autoDownloadOnWifi", label: "Auto-download new sermons on Wi-Fi" },
    { key: "darkAudioBackground", label: "Keep audio playing in background" },
    { key: "weeklyDigestEmail", label: "Weekly digest email" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          className="w-9 h-9 rounded-full items-center justify-center"
        >
          <ChevronLeft size={17} color={colors.textPrimary} />
        </Pressable>
        <Text style={{ color: colors.textPrimary }} className="text-[16px] font-bold ml-3">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: colors.textMuted }} className="text-[12px] font-semibold mb-2">APPEARANCE</Text>
        <View
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          className="rounded-2xl mb-6"
        >
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-row items-center flex-1 mr-3">
              <Moon size={16} color={colors.textPrimary} />
              <Text style={{ color: colors.textSecondary }} className="text-[13.5px] font-medium ml-3">
                Dark mode
              </Text>
            </View>
            <Switch
              value={mode === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.gold }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={{ color: colors.textMuted }} className="text-[12px] font-semibold mb-2">GENERAL</Text>
        <View
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          className="rounded-2xl"
        >
          {ROWS.map((row, i) => (
            <View
              key={row.key}
              className="flex-row items-center justify-between px-4 py-4"
              style={{
                borderBottomWidth: i < ROWS.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <Text style={{ color: colors.textSecondary }} className="text-[13.5px] font-medium flex-1 mr-3">
                {row.label}
              </Text>
              <Switch
                value={settings[row.key]}
                onValueChange={(v) => updateSetting(row.key, v)}
                trackColor={{ false: colors.border, true: colors.gold }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
