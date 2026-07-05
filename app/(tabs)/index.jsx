import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Play, Pause, Heart, MessageCircle, Share2, Gauge, Plus, X } from "lucide-react-native";
import { useAudioPlayer } from "../_layout";
import { useAuth } from "../../lib/AuthContext";
import { useTheme } from "../../lib/ThemeContext";
import { PostsStore, ReactionsStore } from "../../lib/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ANNOUNCEMENTS = [
  { id: "a1", title: "Annual Youth Summit", subtitle: "Aug 14 – 16 · Main Auditorium" },
  { id: "a2", title: "Night of Intercession", subtitle: "Every last Friday · 9PM" },
  { id: "a3", title: "Marriage & Covenant Class", subtitle: "Starts Sept 3 · Room 204" },
];

const SEED_FEED = [
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
    // Swap for the CMS/CDN-hosted sermon file URL once the backend is wired.
    audioUri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "p3",
    type: "text",
    author: "Salvation and Truth Media",
    timeAgo: "2 days ago",
    body: "Sunday's altar call — 47 souls surrendered to Christ. Heaven is rejoicing.",
  },
  {
    id: "p4",
    type: "audio",
    author: "Pastor Emmanuel Kadzuwa",
    timeAgo: "3 days ago",
    title: "The Weight of Unoffered Praise",
    durationLabel: "08:12",
    audioUri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
];

function LiveBanner() {
  const { colors } = useTheme();
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
      <View style={{ backgroundColor: colors.navy }} className="px-4 py-3.5 flex-row items-center justify-between rounded-[22px]">
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
          <Text className="text-white text-[13.5px] font-semibold">Live Prayer Happening Now</Text>
        </View>
        <View style={{ backgroundColor: colors.gold }} className="px-3 py-1.5 rounded-full">
          <Text className="text-white text-[11px] font-bold">JOIN</Text>
        </View>
      </View>
    </Pressable>
  );
}

function AnnouncementsScroller() {
  const { colors } = useTheme();
  return (
    <View className="mt-6">
      <Text style={{ color: colors.textPrimary }} className="text-[17px] font-bold px-5 mb-3">Upcoming</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}>
        {ANNOUNCEMENTS.map((item, idx) => (
          <View
            key={item.id}
            style={{
              width: SCREEN_WIDTH * 0.62,
              marginRight: 12,
              borderRadius: idx % 2 === 0 ? 26 : 18,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            className="p-5 justify-between"
          >
            <View
              style={{ backgroundColor: colors.navy }}
              className="w-9 h-9 rounded-full items-center justify-center mb-8"
            >
              <Text style={{ color: colors.gold }} className="text-[13px] font-bold">{item.title.charAt(0)}</Text>
            </View>
            <Text style={{ color: colors.textPrimary }} className="text-[15px] font-bold leading-5">{item.title}</Text>
            <Text style={{ color: colors.textMuted }} className="text-[12.5px] mt-1">{item.subtitle}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function formatMillis(millis) {
  const totalSeconds = Math.floor((millis || 0) / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function PostHeader({ author, timeAgo }) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center">
      <View style={{ backgroundColor: colors.navy }} className="w-10 h-10 rounded-full items-center justify-center">
        <Text style={{ color: colors.gold }} className="text-[13px] font-bold">
          {author.split(" ").map((n) => n.charAt(0)).slice(0, 2).join("")}
        </Text>
      </View>
      <View className="ml-3">
        <Text style={{ color: colors.textPrimary }} className="text-[13.5px] font-semibold">{author}</Text>
        <Text style={{ color: colors.textMuted }} className="text-[11.5px] mt-0.5">{timeAgo}</Text>
      </View>
    </View>
  );
}

function PostFooter({ postId }) {
  const { colors } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const [likeState, setLikeState] = useState({ count: 0, isLiked: false });

  useEffect(() => {
    ReactionsStore.getLikeState(postId, user?.id).then(setLikeState);
  }, [postId, user?.id]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      router.push("/(auth)/login");
      return;
    }
    const { likedBy, isLiked } = await ReactionsStore.toggleLike(postId, user.id);
    setLikeState({ count: likedBy.length, isLiked });
  };

  return (
    <View className="flex-row items-center mt-4 pt-3.5" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
      <Pressable onPress={handleLike} className="flex-row items-center mr-6 active:opacity-60">
        <Heart
          size={16}
          color={likeState.isLiked ? "#EF4444" : colors.textMuted}
          fill={likeState.isLiked ? "#EF4444" : "transparent"}
        />
        <Text style={{ color: colors.textMuted }} className="text-[12px] ml-1.5 font-medium">{likeState.count}</Text>
      </Pressable>
      <Pressable className="flex-row items-center mr-6 active:opacity-60">
        <MessageCircle size={16} color={colors.textMuted} />
      </Pressable>
      <Pressable className="flex-row items-center active:opacity-60">
        <Share2 size={16} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

function AudioPostCard({ post }) {
  const { colors } = useTheme();
  const { currentTrack, isPlaying, isBuffering, positionMillis, durationMillis, playbackRate, play, togglePlayback, setRate } =
    useAudioPlayer();

  const isThisTrack = currentTrack?.id === post.id;
  const displayPositionMillis = isThisTrack ? positionMillis : 0;
  const displayDurationMillis = isThisTrack && durationMillis ? durationMillis : null;
  const progressPct = displayDurationMillis ? Math.min(100, (displayPositionMillis / displayDurationMillis) * 100) : 0;
  const showBuffering = isThisTrack && isBuffering;

  const handlePlayPress = () => {
    if (isThisTrack) {
      togglePlayback();
    } else {
      play({ id: post.id, title: post.title, author: post.author, audioUri: post.audioUri });
    }
  };

  const handleRateCycle = () => {
    const RATES = [1, 1.25, 1.5, 1.75, 2];
    const idx = RATES.indexOf(isThisTrack ? playbackRate : 1);
    setRate(RATES[(idx + 1) % RATES.length]);
  };

  return (
    <View
      style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
      className="mx-5 mb-4 rounded-[24px] p-5"
    >
      <PostHeader author={post.author} timeAgo={post.timeAgo} />

      <View style={{ backgroundColor: colors.surfaceAlt }} className="mt-4 rounded-[20px] p-4">
        <View className="flex-row items-center">
          <Pressable
            onPress={handlePlayPress}
            disabled={showBuffering}
            style={{ backgroundColor: colors.navy }}
            className="w-12 h-12 rounded-full items-center justify-center active:opacity-80"
          >
            {showBuffering ? (
              <ActivityIndicator size="small" color="#F8FAFC" />
            ) : isThisTrack && isPlaying ? (
              <Pause size={18} color="#F8FAFC" fill="#F8FAFC" />
            ) : (
              <Play size={18} color="#F8FAFC" fill="#F8FAFC" style={{ marginLeft: 1 }} />
            )}
          </Pressable>

          <View className="flex-1 ml-3.5">
            <Text style={{ color: colors.textPrimary }} className="text-[14.5px] font-semibold leading-5" numberOfLines={2}>
              {post.title}
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-[11.5px] mt-1">Voice Note · Sermon</Text>
          </View>

          <Pressable
            onPress={handleRateCycle}
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            className="px-2.5 py-1.5 rounded-full flex-row items-center ml-2"
          >
            <Gauge size={12} color={colors.textPrimary} />
            <Text style={{ color: colors.textPrimary }} className="text-[11px] font-semibold ml-1">
              {isThisTrack ? `${playbackRate}x` : "1x"}
            </Text>
          </Pressable>
        </View>

        <View className="mt-4">
          <View style={{ backgroundColor: colors.border }} className="h-1.5 rounded-full overflow-hidden">
            <View style={{ width: `${progressPct}%`, backgroundColor: colors.gold }} className="h-1.5 rounded-full" />
          </View>
          <View className="flex-row justify-between mt-1.5">
            <Text style={{ color: colors.textMuted }} className="text-[11px] font-medium">{formatMillis(displayPositionMillis)}</Text>
            <Text style={{ color: colors.textMuted }} className="text-[11px] font-medium">
              {displayDurationMillis ? formatMillis(displayDurationMillis) : post.durationLabel}
            </Text>
          </View>
        </View>
      </View>

      <PostFooter postId={post.id} />
    </View>
  );
}

function TextPostCard({ post }) {
  const { colors } = useTheme();
  return (
    <View
      style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
      className="mx-5 mb-4 rounded-[24px] p-5"
    >
      <PostHeader author={post.author} timeAgo={post.timeAgo} />
      <Text style={{ color: colors.textSecondary, fontFamily: "Georgia" }} className="text-[14.5px] leading-6 mt-4">
        {post.body}
      </Text>
      {post.verse ? (
        <View style={{ backgroundColor: colors.surfaceAlt }} className="mt-3 self-start px-3 py-1.5 rounded-full">
          <Text style={{ color: colors.gold }} className="text-[12px] font-semibold">{post.verse}</Text>
        </View>
      ) : null}
      <PostFooter postId={post.id} />
    </View>
  );
}

function AdminComposer({ onPosted }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!body.trim()) return;
    setPosting(true);
    await PostsStore.create({
      type: "text",
      author: user.name,
      timeAgo: "Just now",
      body: body.trim(),
    });
    setPosting(false);
    setBody("");
    setOpen(false);
    onPosted();
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderStyle: "dashed" }}
        className="mx-5 mb-4 rounded-[20px] px-4 py-3.5 flex-row items-center"
      >
        <View style={{ backgroundColor: colors.navy }} className="w-8 h-8 rounded-full items-center justify-center">
          <Plus size={15} color={colors.gold} />
        </View>
        <Text style={{ color: colors.textMuted }} className="text-[13.5px] ml-3">Share something with the church...</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View className="flex-1 bg-black/40 justify-end">
          <View style={{ backgroundColor: colors.bg }} className="rounded-t-[28px] p-6">
            <View className="flex-row items-center justify-between mb-5">
              <Text style={{ color: colors.textPrimary }} className="text-[17px] font-bold">New Post</Text>
              <Pressable
                onPress={() => setOpen(false)}
                style={{ backgroundColor: colors.surfaceAlt }}
                className="w-8 h-8 rounded-full items-center justify-center"
              >
                <X size={15} color={colors.textPrimary} />
              </Pressable>
            </View>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Write a word of encouragement..."
              placeholderTextColor={colors.textMuted}
              multiline
              style={{ color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border, minHeight: 110, textAlignVertical: "top" }}
              className="rounded-2xl p-4 text-[14.5px]"
            />
            <Pressable
              onPress={handlePost}
              disabled={posting || !body.trim()}
              style={{ backgroundColor: colors.navy, opacity: posting || !body.trim() ? 0.6 : 1 }}
              className="mt-4 rounded-2xl py-4 items-center"
            >
              {posting ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text className="text-white text-[14px] font-semibold">Post to Feed</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { isAdmin } = useAuth();
  const [customPosts, setCustomPosts] = useState([]);

  const loadPosts = useCallback(() => {
    PostsStore.getAll().then(setCustomPosts);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const feed = [...customPosts, ...SEED_FEED];

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <LiveBanner />
      <AnnouncementsScroller />

      <Text style={{ color: colors.textPrimary }} className="text-[17px] font-bold px-5 mt-7 mb-3">Pastor's Feed</Text>

      {isAdmin ? <AdminComposer onPosted={loadPosts} /> : null}

      {feed.map((post) =>
        post.type === "audio" ? (
          <AudioPostCard key={post.id} post={post} />
        ) : (
          <TextPostCard key={post.id} post={post} />
        )
      )}
    </ScrollView>
  );
}
