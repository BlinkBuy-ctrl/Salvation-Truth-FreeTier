import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";

export default function ProfileScreen() {
  const ROWS = [
    { label: "My Reminders", route: "/reminders" },
    { label: "Saved Voice Notes", route: null },
    { label: "Notification Settings", route: "/settings" },
  ];

  return (
    <View className="flex-1 bg-[#F8FAFC] px-6 pt-8">
      <View className="items-center">
        <View className="w-20 h-20 rounded-full bg-[#0F172A] items-center justify-center">
          <Text className="text-[#D97706] text-[26px] font-bold">G</Text>
        </View>
        <Text className="text-[#0F172A] text-[16px] font-bold mt-4">Guest Visitor</Text>
        <Text className="text-[#94A3B8] text-[12.5px] mt-1">Browsing without an account</Text>
      </View>

      <Pressable className="mt-8 bg-[#0F172A] rounded-[18px] py-4 items-center active:opacity-90">
        <Text className="text-white text-[14px] font-semibold">Create an Account</Text>
      </Pressable>

      <View className="mt-6 bg-white rounded-[20px] p-1">
        {ROWS.map((row, i) => (
          <Pressable
            key={row.label}
            onPress={() => row.route && router.push(row.route)}
            className="flex-row items-center justify-between px-4 py-4 active:opacity-70"
            style={{
              borderBottomWidth: i < ROWS.length - 1 ? 1 : 0,
              borderBottomColor: "#F1F5F9",
            }}
          >
            <Text className="text-[#1E293B] text-[14px] font-medium">{row.label}</Text>
            <ChevronRight size={15} color="#CBD5E1" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
