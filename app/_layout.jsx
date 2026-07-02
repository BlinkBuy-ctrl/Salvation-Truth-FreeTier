import { useState, useCallback, createContext, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Tabs } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, BookOpen, User, Menu } from "lucide-react-native";
import CustomAudioPlayer from "../components/CustomAudioPlayer";

const AudioPlayerContext = createContext(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return ctx;
}

function AudioPlayerProvider({ children }) {
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const playAudio = useCallback((audioItem) => {
    setCurrentPlayingAudio(audioItem);
    setProgressSeconds(0);
    setIsPlaying(true);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const closePlayer = useCallback(() => {
    setCurrentPlayingAudio(null);
    setIsPlaying(false);
    setProgressSeconds(0);
  }, []);

  const cyclePlaybackSpeed = useCallback(() => {
    setPlaybackSpeed((prev) => {
      if (prev === 1) return 1.25;
      if (prev === 1.25) return 1.5;
      if (prev === 1.5) return 2;
      return 1;
    });
  }, []);

  const seekTo = useCallback((seconds) => {
    setProgressSeconds(seconds);
  }, []);

  const value = {
    currentPlayingAudio,
    isPlaying,
    progressSeconds,
    playbackSpeed,
    playAudio,
    togglePlayback,
    closePlayer,
    cyclePlaybackSpeed,
    setProgressSeconds,
    seekTo,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <CustomAudioPlayer />
    </AudioPlayerContext.Provider>
  );
}

function TopHeader({ onMenuPress }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-[#F8FAFC] border-b border-[#E2E8F0]"
    >
      <View className="flex-row items-center justify-between h-14 px-4">
        <Pressable
          onPress={onMenuPress}
          hitSlop={12}
          className="w-10 h-10 items-center justify-center rounded-xl active:bg-[#F1F5F9]"
        >
          <View className="items-start justify-center" style={{ gap: 4 }}>
            <View className="w-5 h-[2px] bg-[#0F172A] rounded-full" />
            <View className="w-5 h-[2px] bg-[#0F172A] rounded-full" />
            <View className="w-3 h-[2px] bg-[#D97706] rounded-full" />
          </View>
        </Pressable>

        <View className="flex-row items-center">
          <Text className="text-[15px] tracking-[2px] text-[#0F172A] font-semibold">
            SALVATION
          </Text>
          <View className="w-1 h-1 rounded-full bg-[#D97706] mx-1.5" />
          <Text className="text-[15px] tracking-[2px] text-[#D97706] font-semibold">
            TRUTH
          </Text>
        </View>

        <View className="w-10 h-10" />
      </View>
    </View>
  );
}

function TabIcon({ Icon, focused }) {
  return (
    <View className="items-center justify-center" style={{ height: 44 }}>
      <Icon
        size={23}
        color={focused ? "#0F172A" : "#94A3B8"}
        strokeWidth={focused ? 2.4 : 1.8}
      />
      <View
        className="mt-1.5 rounded-full"
        style={{
          width: 5,
          height: 5,
          backgroundColor: focused ? "#D97706" : "transparent",
        }}
      />
    </View>
  );
}

function RootLayoutContent() {
  const insets = useSafeAreaInsets();

  const handleMenuPress = () => {
    console.log("Menu opened");
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <TopHeader onMenuPress={handleMenuPress} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
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
          options={{
            tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/bible"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon Icon={BookOpen} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/profile"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
          }}
        />
      </Tabs>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AudioPlayerProvider>
        <RootLayoutContent />
      </AudioPlayerProvider>
    </SafeAreaProvider>
  );
}
