import "../global.css";
import { createContext, useContext, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Tabs } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, BookOpen, User, Menu } from "lucide-react-native";
import * as Notifications from "expo-notifications";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import ErrorBoundary from "../components/ErrorBoundary";
import OfflineBanner from "../components/OfflineBanner";
import HamburgerDrawer from "../components/HamburgerDrawer";
import { useAudioEngine } from "../lib/useAudioEngine";
import { ThemeProvider, useTheme } from "../lib/ThemeContext";
import { AuthProvider } from "../lib/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AudioPlayerContext = createContext(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return ctx;
}

function AudioPlayerProvider({ children }) {
  const engine = useAudioEngine();

  return (
    <AudioPlayerContext.Provider value={engine}>
      {children}
      <CustomAudioPlayer />
    </AudioPlayerContext.Provider>
  );
}

function TopHeader({ onMenuPress }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View
      style={{ paddingTop: insets.top, backgroundColor: colors.headerBg, borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View className="flex-row items-center justify-between h-14 px-4">
        <Pressable
          onPress={onMenuPress}
          hitSlop={12}
          className="w-10 h-10 items-center justify-center rounded-xl active:opacity-60"
        >
          <View style={{ alignItems: "flex-start", justifyContent: "center", gap: 4 }}>
            <View style={{ width: 20, height: 2, borderRadius: 999, backgroundColor: colors.textPrimary }} />
            <View style={{ width: 20, height: 2, borderRadius: 999, backgroundColor: colors.textPrimary }} />
            <View style={{ width: 12, height: 2, borderRadius: 999, backgroundColor: colors.gold }} />
          </View>
        </Pressable>

        <View className="flex-row items-center">
          <Text style={{ color: colors.textPrimary }} className="text-[15px] tracking-[2px] font-semibold">
            SALVATION
          </Text>
          <View style={{ width: 4, height: 4, borderRadius: 999, backgroundColor: colors.gold, marginHorizontal: 6 }} />
          <Text style={{ color: colors.gold }} className="text-[15px] tracking-[2px] font-semibold">
            TRUTH
          </Text>
        </View>

        <View className="w-10 h-10" />
      </View>
      <OfflineBanner />
    </View>
  );
}

function TabIcon({ Icon, focused, colors }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", height: 44 }}>
      <Icon size={23} color={focused ? colors.textPrimary : colors.textMuted} strokeWidth={focused ? 2.4 : 1.8} />
      <View
        style={{
          marginTop: 6,
          width: 5,
          height: 5,
          borderRadius: 999,
          backgroundColor: focused ? colors.gold : "transparent",
        }}
      />
    </View>
  );
}

function RootLayoutContent() {
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopHeader onMenuPress={() => setDrawerOpen(true)} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.tabBarBg,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 0,
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 6,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.06,
            shadowRadius: 16,
          },
        }}
      >
        <Tabs.Screen
          name="(tabs)/index"
          options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} colors={colors} /> }}
        />
        <Tabs.Screen
          name="(tabs)/bible"
          options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={BookOpen} focused={focused} colors={colors} /> }}
        />
        <Tabs.Screen
          name="(tabs)/profile"
          options={{ tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} colors={colors} /> }}
        />
      </Tabs>
      <HamburgerDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AudioPlayerProvider>
              <RootLayoutContent />
            </AudioPlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
