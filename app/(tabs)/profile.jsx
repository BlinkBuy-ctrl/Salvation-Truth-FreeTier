import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronRight, LogOut, ShieldCheck } from "lucide-react-native";
import { useAuth } from "../../lib/AuthContext";
import { useTheme } from "../../lib/ThemeContext";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  const ROWS = [
    { label: "My Reminders", route: "/reminders" },
    { label: "Notification Settings", route: "/settings" },
    { label: "About Us", route: "/about" },
  ];

  const initials = isLoggedIn
    ? user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "G";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} className="px-6 pt-8">
      <View className="items-center">
        <View style={{ backgroundColor: colors.navy }} className="w-20 h-20 rounded-full items-center justify-center">
          <Text style={{ color: colors.gold }} className="text-[26px] font-bold">{initials}</Text>
        </View>
        <Text style={{ color: colors.textPrimary }} className="text-[16px] font-bold mt-4">
          {isLoggedIn ? user.name : "Guest Visitor"}
        </Text>
        <Text style={{ color: colors.textMuted }} className="text-[12.5px] mt-1">
          {isLoggedIn ? user.email : "Browsing without an account"}
        </Text>
        {isAdmin ? (
          <View style={{ backgroundColor: colors.surfaceAlt }} className="flex-row items-center mt-2.5 px-3 py-1.5 rounded-full">
            <ShieldCheck size={12} color={colors.gold} />
            <Text style={{ color: colors.gold }} className="text-[11px] font-semibold ml-1.5">Admin</Text>
          </View>
        ) : null}
      </View>

      {!isLoggedIn ? (
        <>
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={{ backgroundColor: colors.navy }}
            className="mt-8 rounded-[18px] py-4 items-center active:opacity-90"
          >
            <Text className="text-white text-[14px] font-semibold">Sign In</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(auth)/signup")}
            style={{ borderWidth: 1, borderColor: colors.border }}
            className="mt-3 rounded-[18px] py-4 items-center active:opacity-70"
          >
            <Text style={{ color: colors.textPrimary }} className="text-[14px] font-semibold">Create Account</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          onPress={logout}
          style={{ borderWidth: 1, borderColor: colors.border }}
          className="mt-8 flex-row items-center justify-center rounded-[18px] py-4 active:opacity-70"
        >
          <LogOut size={15} color={colors.textPrimary} />
          <Text style={{ color: colors.textPrimary }} className="text-[14px] font-semibold ml-2">Log Out</Text>
        </Pressable>
      )}

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }} className="mt-6 rounded-[20px] p-1">
        {ROWS.map((row, i) => (
          <Pressable
            key={row.label}
            onPress={() => row.route && router.push(row.route)}
            className="flex-row items-center justify-between px-4 py-4 active:opacity-70"
            style={{
              borderBottomWidth: i < ROWS.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ color: colors.textSecondary }} className="text-[14px] font-medium">{row.label}</Text>
            <ChevronRight size={15} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
