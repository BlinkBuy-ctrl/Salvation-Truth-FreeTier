import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { Play, Pause, Heart, MessageCircle, Share2, Gauge } from "lucide-react-native";
import { useAudioPlayer } from "../_layout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ANNOUNCEMENTS = [
  {
    id: "a1",
    title: "Annual Youth Summit",
    subtitle: "Aug 14 – 16 · Main Auditorium",
    tint: "#0F172A",
  },
  {
    id: "a2",
    title: "Night of Intercession",
    subtitle: "Every last Friday · 9PM",
    tint: "#D97706",
  },
  {
    id: "a3",
    title: "Marriage & Covenant Class",
    subtitle: "Starts Sept 3 · Room 204",
    tint: "#0F172A",
  },
];

const FEED = [
  {
    id: "p1",
    type: "text",
    author: "Pastor Emmanuel Kadzuwa",
    timeAgo: "2h ago",
    body:
      "Beloved, do not let your heart be troubled by what your eyes see today. Faith is not the absence of storms, it is the presence of Christ within them.",
    verse: "John 14:27",
  },
  {
    id: "p2",
    type: "audio",
    author: "Pastor Emmanuel Kadzuwa",
    timeAgo: "Yesterday",
    title: "Standing on the Rock in Uncertain Seasons",
    durationLabel: "05:40",
    durationSeconds: 340,
  },
  {
    id: "p3",
    type: "image",
    author: "Salvation and Truth Media",
    timeAgo: "2 days ago",
    body: "Sunday's altar call — 47 souls surrendered to Christ. Heaven is rejoicing.",
    imageColor: "#0F172A",
  },
  {
    id: "p4",
    type: "audio",
    author: "Pastor Emmanuel Kadzuwa",
    timeAgo: "3 days ago",
    title: "The Weight of Unoffered Praise",
    durationLabel: "08:12",
    durationSeconds: 492,
  },
];

function LiveBanner() {
  const pulse = useRef(new Animated.Value(0)).current;
  const [isLive] = useState(true);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (!isLive) return null;

  const dotScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const dotOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0.2] });

  return (
    <Pressable className="mx-5 mt-4 rounded-[22px] overflow-hidden active:opacity-90">
      <View className="bg-[#0F172A] px-4 py-3.5 flex-row items-center justify-between rounded-[22px]">
        <View className="flex-row items-center">
          <View className="w-2.5 h-2.5 rounded-full bg-[#EF4444] items-center justify-center mr-3">
            <Animated.View
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#EF4444",
                transform: [{ scale: dotScale }],
                opacity: dotOpacity,
              }}
            />
          </View>
          <Text className="text-white text-[13.5px] font-semibold">
            Live Prayer Happening Now
          </Text>
        </View>
        <View className="bg-[#D97706] px-3 py-1.5 rounded-full">
          <Text className="text-white text-[11px] font-bold">JOIN</Text>
        </View>
      </View>
    </Pressable>
  );
}

function AnnouncementsScroller() {
  return (
    <View className="mt-6">
      <Text className="text-[#0F172A] text-[17px] font-bold px-5 mb-3">
        Upcoming
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
      >
        {ANNOUNCEMENTS.map((item, idx) => (
          <View
            key={item.id}
            style={{
              width: SCREEN_WIDTH * 0.62,
              marginRight: 12,
              borderRadius: idx % 2 === 0 ? 26 : 18,
            }}
            className="p-5 justify-between"
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: item.tint,
                borderRadius: idx % 2 === 0 ? 26 : 18,
                opacity: 0.06,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderWidth: 1.5,
                borderColor: item.tint,
                borderRadius: idx % 2 === 0 ? 26 : 18,
                opacity: 0.12,
              }}
            />
            <View
              className="w-9 h-9 rounded-full items-center justify-center mb-8"
              style={{ backgroundColor: item.tint }}
            >
              <Text className="text-white text-[13px] font-bold">
                {item.title.charAt(0)}
              </Text>
            </View>
            <Text className="text-[#0F172A] text-[15px] font-bold leading-5">
              {item.title}
            </Text>
            <Text className="text-[#64748B] text-[12.5px] mt-1">
              {item.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function AudioPostCard({ post }) {
  const { currentPlayingAudio, isPlaying, progressSeconds, playbackSpeed, playAudio, togglePlayback, cyclePlaybackSpeed } =
    useAudioPlayer();

  const isThisPlaying = currentPlayingAudio?.id === post.id;
  const displayProgress = isThisPlaying ? progressSeconds : 0;
  const progressPct = Math.min(100, (displayProgress / post.durationSeconds) * 100);

  const handlePlayPress = () => {
    if (isThisPlaying) {
      togglePlayback();
    } else {
      playAudio({
        id: post.id,
        title: post.title,
        author: post.author,
        durationSeconds: post.durationSeconds,
      });
    }
  };

  return (
    <View
      className="mx-5 mb-4 bg-white rounded-[24px] p-5"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 2,
      }}
    >
      <PostHeader author={post.author} timeAgo={post.timeAgo} />

      <View className="mt-4 bg-[#F1F5F9] rounded-[20px] p-4">
        <View className="flex-row items-center">
          <Pressable
            onPress={handlePlayPress}
            className="w-12 h-12 rounded-full bg-[#0F172A] items-center justify-center active:opacity-80"
          >
            {isThisPlaying && isPlaying ? (
              <Pause size={18} color="#F8FAFC" fill="#F8FAFC" />
            ) : (
              <Play size={18} color="#F8FAFC" fill="#F8FAFC" style={{ marginLeft: 1 }} />
            )}
          </Pressable>

          <View className="flex-1 ml-3.5">
            <Text className="text-[#0F172A] text-[14.5px] font-semibold leading-5" numberOfLines={2}>
              {post.title}
            </Text>
            <Text className="text-[#94A3B8] text-[11.5px] mt-1">Voice Note · Sermon</Text>
          </View>

          <Pressable
            onPress={cyclePlaybackSpeed}
            className="bg-white px-2.5 py-1.5 rounded-full flex-row items-center ml-2"
            style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Gauge size={12} color="#0F172A" />
            <Text className="text-[#0F172A] text-[11px] font-semibold ml-1">
              {isThisPlaying ? `${playbackSpeed}x` : "1x"}
            </Text>
          </Pressable>
        </View>

        <View className="mt-4">
          <View className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <View
              className="h-1.5 bg-[#D97706] rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-1.5">
            <Text className="text-[#94A3B8] text-[11px] font-medium">
              {formatTime(displayProgress)}
            </Text>
            <Text className="text-[#94A3B8] text-[11px] font-medium">
              {post.durationLabel}
            </Text>
          </View>
        </View>
      </View>

      <PostFooter />
    </View>
  );
}

function PostHeader({ author, timeAgo }) {
  return (
    <View className="flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-[#0F172A] items-center justify-center">
        <Text className="text-[#D97706] text-[13px] font-bold">
          {author.split(" ").map((n) => n.charAt(0)).slice(0, 2).join("")}
        </Text>
      </View>
      <View className="ml-3">
        <Text className="text-[#0F172A] text-[13.5px] font-semibold">{author}</Text>
        <Text className="text-[#94A3B8] text-[11.5px] mt-0.5">{timeAgo}</Text>
      </View>
    </View>
  );
}

function PostFooter() {
  return (
    <View className="flex-row items-center mt-4 pt-3.5" style={{ borderTopWidth: 1, borderTopColor: "#F1F5F9" }}>
      <Pressable className="flex-row items-center mr-6 active:opacity-60">
        <Heart size={16} color="#94A3B8" />
        <Text className="text-[#94A3B8] text-[12px] ml-1.5 font-medium">142</Text>
      </Pressable>
      <Pressable className="flex-row items-center mr-6 active:opacity-60">
        <MessageCircle size={16} color="#94A3B8" />
        <Text className="text-[#94A3B8] text-[12px] ml-1.5 font-medium">18</Text>
      </Pressable>
      <Pressable className="flex-row items-center active:opacity-60">
        <Share2 size={16} color="#94A3B8" />
      </Pressable>
    </View>
  );
}

function TextPostCard({ post }) {
  return (
    <View
      className="mx-5 mb-4 bg-white rounded-[24px] p-5"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 2,
      }}
    >
      <PostHeader author={post.author} timeAgo={post.timeAgo} />
      <Text className="text-[#1E293B] text-[14.5px] leading-6 mt-4">{post.body}</Text>
      {post.verse ? (
        <View className="mt-3 self-start bg-[#FEF3E2] px-3 py-1.5 rounded-full">
          <Text className="text-[#D97706] text-[12px] font-semibold">{post.verse}</Text>
        </View>
      ) : null}
      <PostFooter />
    </View>
  );
}

function ImagePostCard({ post }) {
  return (
    <View
      className="mx-5 mb-4 bg-white rounded-[24px] overflow-hidden"
      style={{
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 2,
      }}
    >
      <View className="p-5 pb-3">
        <PostHeader author={post.author} timeAgo={post.timeAgo} />
      </View>
      <View
        style={{ height: 190, backgroundColor: post.imageColor, opacity: 0.9 }}
        className="mx-5 rounded-[18px] items-center justify-center"
      >
        <Text className="text-white/40 text-[12px] font-medium">Sunday Service Photo</Text>
      </View>
      <View className="p-5 pt-3">
        <Text className="text-[#1E293B] text-[14px] leading-5">{post.body}</Text>
        <PostFooter />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-[#F8FAFC]"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <LiveBanner />
      <AnnouncementsScroller />

      <Text className="text-[#0F172A] text-[17px] font-bold px-5 mt-7 mb-3">
        Pastor's Feed
      </Text>

      {FEED.map((post) => {
        if (post.type === "audio") return <AudioPostCard key={post.id} post={post} />;
        if (post.type === "image") return <ImagePostCard key={post.id} post={post} />;
        return <TextPostCard key={post.id} post={post} />;
      })}
    </ScrollView>
  );
}
