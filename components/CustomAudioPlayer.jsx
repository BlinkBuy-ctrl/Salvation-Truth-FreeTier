import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Play, Pause, X, Gauge } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer } from "../app/_layout";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CustomAudioPlayer() {
  const insets = useSafeAreaInsets();
  const {
    currentPlayingAudio,
    isPlaying,
    progressSeconds,
    playbackSpeed,
    togglePlayback,
    closePlayer,
    cyclePlaybackSpeed,
    setProgressSeconds,
  } = useAudioPlayer();

  const slideAnim = useRef(new Animated.Value(120)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: currentPlayingAudio ? 0 : 120,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  }, [currentPlayingAudio, slideAnim]);

  useEffect(() => {
    if (isPlaying && currentPlayingAudio) {
      intervalRef.current = setInterval(() => {
        setProgressSeconds((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= currentPlayingAudio.durationSeconds) {
            clearInterval(intervalRef.current);
            return currentPlayingAudio.durationSeconds;
          }
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentPlayingAudio, playbackSpeed, setProgressSeconds]);

  if (!currentPlayingAudio) return null;

  const progressPct = Math.min(
    100,
    (progressSeconds / currentPlayingAudio.durationSeconds) * 100
  );

  const tabBarHeight = 64 + insets.bottom;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: tabBarHeight + 10,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        className="bg-[#0F172A] rounded-[22px] px-4 py-3.5"
        style={{
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.28,
          shadowRadius: 24,
          elevation: 10,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={togglePlayback}
            className="w-11 h-11 rounded-full bg-[#D97706] items-center justify-center active:opacity-80"
          >
            {isPlaying ? (
              <Pause size={17} color="#0F172A" fill="#0F172A" />
            ) : (
              <Play size={17} color="#0F172A" fill="#0F172A" style={{ marginLeft: 1 }} />
            )}
          </Pressable>

          <View className="flex-1 ml-3.5 mr-2">
            <Text
              className="text-white text-[13.5px] font-semibold"
              numberOfLines={1}
            >
              {currentPlayingAudio.title}
            </Text>
            <Text className="text-[#94A3B8] text-[11px] mt-0.5" numberOfLines={1}>
              {currentPlayingAudio.author}
            </Text>
          </View>

          <Pressable
            onPress={cyclePlaybackSpeed}
            className="px-2.5 py-1.5 rounded-full mr-2"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <View className="flex-row items-center">
              <Gauge size={12} color="#F8FAFC" />
              <Text className="text-white text-[11px] font-semibold ml-1">
                {playbackSpeed}x
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={closePlayer}
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <X size={15} color="#F8FAFC" />
          </Pressable>
        </View>

        <View className="mt-3">
          <View
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <View
              className="h-1 bg-[#D97706] rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-[#64748B] text-[10.5px] font-medium">
              {formatTime(progressSeconds)}
            </Text>
            <Text className="text-[#64748B] text-[10.5px] font-medium">
              {formatTime(currentPlayingAudio.durationSeconds)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
