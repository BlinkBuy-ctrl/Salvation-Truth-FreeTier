import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, Dimensions, Linking, Share } from "react-native";
import { router } from "expo-router";
import {
  X,
  Bell,
  HeartHandshake,
  Mail,
  Share2,
  Info,
  Settings,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(300, SCREEN_WIDTH * 0.8);

const LINKS = [
  { key: "reminders", label: "My Reminders", Icon: Bell, action: "reminders" },
  { key: "give", label: "Give", Icon: HeartHandshake, action: "give" },
  { key: "contact", label: "Contact Us", Icon: Mail, action: "contact" },
  { key: "share", label: "Share the App", Icon: Share2, action: "share" },
  { key: "about", label: "About", Icon: Info, action: "about" },
  { key: "settings", label: "Settings", Icon: Settings, action: "settings" },
];

export default function HamburgerDrawer({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: visible ? 0 : -DRAWER_WIDTH,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(overlayOpacity, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateX, overlayOpacity]);

  const handleAction = async (action) => {
    onClose();
    switch (action) {
      case "reminders":
        router.push("/reminders");
        break;
      case "give":
        Linking.openURL("https://example.org/give").catch(() => {});
        break;
      case "contact":
        Linking.openURL("mailto:hello@salvationandtruth.church").catch(() => {});
        break;
      case "share":
        Share.share({
          message: "Join me on Salvation and Truth — daily sermons, scripture, and prayer.",
        }).catch(() => {});
        break;
      case "about":
        router.push("/about");
        break;
      case "settings":
        router.push("/settings");
        break;
      default:
        break;
    }
  };

  if (!visible) {
    return (
      <Animated.View
        pointerEvents="none"
        style={{ opacity: overlayOpacity, position: "absolute" }}
      />
    );
  }

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15,23,42,0.5)",
          opacity: overlayOpacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: DRAWER_WIDTH,
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 16,
          transform: [{ translateX }],
          shadowColor: "#0F172A",
          shadowOffset: { width: 6, height: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 16,
        }}
      >
        <View className="flex-row items-center justify-between px-5 mb-6">
          <View>
            <Text className="text-[#0F172A] text-[15px] font-bold">Salvation & Truth</Text>
            <Text className="text-[#94A3B8] text-[11.5px] mt-0.5">Guest Visitor</Text>
          </View>
          <Pressable
            onPress={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center"
          >
            <X size={15} color="#0F172A" />
          </Pressable>
        </View>

        <View className="px-2">
          {LINKS.map(({ key, label, Icon, action }) => (
            <Pressable
              key={key}
              onPress={() => handleAction(action)}
              className="flex-row items-center px-4 py-3.5 rounded-2xl active:bg-[#F1F5F9]"
            >
              <View className="w-9 h-9 rounded-full bg-[#F1F5F9] items-center justify-center">
                <Icon size={16} color="#0F172A" />
              </View>
              <Text className="text-[#1E293B] text-[14px] font-medium ml-3">{label}</Text>
            </Pressable>
          ))}
        </View>

        <View className="absolute bottom-8 left-0 right-0 items-center">
          <Text className="text-[#CBD5E1] text-[11px]">Salvation and Truth © {new Date().getFullYear()}</Text>
        </View>
      </Animated.View>
    </View>
  );
}
