import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, ActivityIndicator } from "react-native";
import { Play, Pause, X, Gauge, AlertCircle } from "lucide-react-native";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer } from "../app/_layout";

const RATES = [1, 1.25, 1.5, 1.75, 2];

function formatTime(millis) {
  const totalSeconds = Math.floor((millis || 0) / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CustomAudioPlayer() {
  const insets = useSafeAreaInsets();
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    positionMillis,
    durationMillis,
    playbackRate,
    error,
    togglePlayback,
    seekTo,
    setRate,
    close,
  } = useAudioPlayer();

  const slideAnim = useRef(new Animated.Value(140)).current;
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: currentTrack ? 0 : 140,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  }, [currentTrack, slideAnim]);

  if (!currentTrack) return null;

  const displayPosition = isScrubbing ? scrubValue : positionMillis;
  const tabBarHeight = 64 + insets.bottom;

  const handleRateCycle = () => {
    const idx = RATES.indexOf(playbackRate);
    const next = RATES[(idx + 1) % RATES.length];
    setRate(next);
  };

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
            disabled={isBuffering || Boolean(error)}
            className="w-11 h-11 rounded-full bg-[#D97706] items-center justify-center active:opacity-80"
          >
            {isBuffering ? (
              <ActivityIndicator size="small" color="#0F172A" />
            ) : error ? (
              <AlertCircle size={17} color="#0F172A" />
            ) : isPlaying ? (
              <Pause size={17} color="#0F172A" fill="#0F172A" />
            ) : (
              <Play size={17} color="#0F172A" fill="#0F172A" style={{ marginLeft: 1 }} />
            )}
          </Pressable>

          <View className="flex-1 ml-3.5 mr-2">
            <Text className="text-white text-[13.5px] font-semibold" numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text className="text-[#94A3B8] text-[11px] mt-0.5" numberOfLines={1}>
              {error ? "Playback failed — tap to retry" : currentTrack.author}
            </Text>
          </View>

          <Pressable
            onPress={handleRateCycle}
            className="px-2.5 py-1.5 rounded-full mr-2"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <View className="flex-row items-center">
              <Gauge size={12} color="#F8FAFC" />
              <Text className="text-white text-[11px] font-semibold ml-1">{playbackRate}x</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={close}
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <X size={15} color="#F8FAFC" />
          </Pressable>
        </View>

        <View className="mt-1">
          <Slider
            minimumValue={0}
            maximumValue={durationMillis || 1}
            value={displayPosition}
            minimumTrackTintColor="#D97706"
            maximumTrackTintColor="rgba(255,255,255,0.15)"
            thumbTintColor="#D97706"
            onSlidingStart={() => {
              setIsScrubbing(true);
              setScrubValue(positionMillis);
            }}
            onValueChange={setScrubValue}
            onSlidingComplete={(value) => {
              seekTo(value);
              setIsScrubbing(false);
            }}
            style={{ width: "100%", height: 24 }}
          />
          <View className="flex-row justify-between -mt-1">
            <Text className="text-[#64748B] text-[10.5px] font-medium">
              {formatTime(displayPosition)}
            </Text>
            <Text className="text-[#64748B] text-[10.5px] font-medium">
              {formatTime(durationMillis)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
