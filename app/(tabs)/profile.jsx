import { View, Text, Pressable } from "react-native";

export default function ProfileScreen() {
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
        {["My Reminders", "Saved Voice Notes", "Notification Settings"].map((label, i) => (
          <View
            key={label}
            className="px-4 py-4"
            style={{
              borderBottomWidth: i < 2 ? 1 : 0,
              borderBottomColor: "#F1F5F9",
            }}
          >
            <Text className="text-[#1E293B] text-[14px] font-medium">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
