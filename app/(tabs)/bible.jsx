import { View, Text } from "react-native";

export default function BibleScreen() {
  return (
    <View className="flex-1 bg-[#F8FAFC] items-center justify-center px-8">
      <View className="w-16 h-16 rounded-[20px] bg-[#0F172A] items-center justify-center mb-5">
        <Text className="text-[#D97706] text-[22px] font-bold">S</Text>
      </View>
      <Text className="text-[#0F172A] text-[17px] font-bold text-center">
        The Word is coming
      </Text>
      <Text className="text-[#64748B] text-[13.5px] text-center mt-2 leading-5">
        "Your word is a lamp to my feet and a light to my path." — Psalm 119:105
      </Text>
    </View>
  );
}
