import { View, Text } from "react-native";
import { WifiOff } from "lucide-react-native";
import { useNetworkStatus } from "../lib/useNetworkStatus";

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <View className="bg-[#1E293B] px-4 py-2 flex-row items-center justify-center">
      <WifiOff size={13} color="#F8FAFC" />
      <Text className="text-white text-[11.5px] font-medium ml-2">
        You're offline — showing saved content
      </Text>
    </View>
  );
}
