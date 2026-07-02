import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { router } from "expo-router";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Mail,
  Phone,
  Facebook,
  Youtube,
  Instagram,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SERVICE_TIMES = [
  { label: "Sunday Worship", time: "8:00 AM & 10:30 AM" },
  { label: "Wednesday Bible Study", time: "6:00 PM" },
  { label: "Night of Intercession", time: "Last Friday · 9:00 PM" },
];

const SOCIALS = [
  { key: "facebook", Icon: Facebook, url: "https://facebook.com/salvationandtruth" },
  { key: "youtube", Icon: Youtube, url: "https://youtube.com/@salvationandtruth" },
  { key: "instagram", Icon: Instagram, url: "https://instagram.com/salvationandtruth" },
];

function SectionLabel({ children }) {
  return (
    <Text className="text-[#D97706] text-[11px] font-bold tracking-[1.5px] mb-2.5">
      {children}
    </Text>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F8FAFC]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-white items-center justify-center"
          style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
        >
          <ChevronLeft size={17} color="#0F172A" />
        </Pressable>
        <Text className="text-[#0F172A] text-[16px] font-bold ml-3">About Us</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <View className="mx-5 mt-2 bg-[#0F172A] rounded-[26px] p-6">
          <View className="w-12 h-12 rounded-[16px] bg-[#D97706] items-center justify-center mb-4">
            <Text className="text-[#0F172A] text-[18px] font-bold">S</Text>
          </View>
          <Text className="text-white text-[19px] font-bold leading-6">
            Carrying the Word beyond{"\n"}the sanctuary walls
          </Text>
          <Text
            className="text-[#CBD5E1] text-[13.5px] leading-6 mt-3"
            style={{ fontFamily: "Georgia" }}
          >
            Every sermon, scripture, and prayer gathering here is offered freely, without
            barriers, to anyone seeking Christ.
          </Text>
        </View>

        <View className="mx-5 mt-7">
          <SectionLabel>OUR MISSION</SectionLabel>
          <Text className="text-[#1E293B] text-[14.5px] leading-6" style={{ fontFamily: "Georgia" }}>
            To make disciples of Christ by proclaiming the whole counsel of God's Word, nurturing
            believers to spiritual maturity, and equipping every member to carry the gospel into
            their homes, workplaces, and communities.
          </Text>
        </View>

        <View className="mx-5 mt-6">
          <SectionLabel>OUR VISION</SectionLabel>
          <Text className="text-[#1E293B] text-[14.5px] leading-6" style={{ fontFamily: "Georgia" }}>
            A generation rooted in truth, walking in salvation, and unafraid to stand for Christ
            in an uncertain world.
          </Text>
        </View>

        <View className="mx-5 mt-8">
          <SectionLabel>FROM THE PASTOR</SectionLabel>
          <View
            className="bg-white rounded-[22px] p-5"
            style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <View className="flex-row items-center mb-3.5">
              <View className="w-12 h-12 rounded-full bg-[#0F172A] items-center justify-center">
                <Text className="text-[#D97706] text-[14px] font-bold">EK</Text>
              </View>
              <View className="ml-3">
                <Text className="text-[#0F172A] text-[14px] font-bold">
                  Pastor Emmanuel Kadzuwa
                </Text>
                <Text className="text-[#94A3B8] text-[11.5px] mt-0.5">Senior Pastor</Text>
              </View>
            </View>
            <Text
              className="text-[#475569] text-[13.5px] leading-6"
              style={{ fontFamily: "Georgia" }}
            >
              "I believe the Word of God was never meant to stay locked inside four walls. This
              app is my way of putting scripture, sermons, and a place to pray into your pocket —
              wherever you are, whatever season you're walking through."
            </Text>
          </View>
        </View>

        <View className="mx-5 mt-8">
          <SectionLabel>SERVICE TIMES</SectionLabel>
          <View className="bg-white rounded-[22px]" style={{ borderWidth: 1, borderColor: "#E2E8F0" }}>
            {SERVICE_TIMES.map((service, i) => (
              <View
                key={service.label}
                className="flex-row items-center px-4 py-3.5"
                style={{
                  borderBottomWidth: i < SERVICE_TIMES.length - 1 ? 1 : 0,
                  borderBottomColor: "#F1F5F9",
                }}
              >
                <View className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center">
                  <Clock size={14} color="#0F172A" />
                </View>
                <Text className="text-[#1E293B] text-[13.5px] font-medium ml-3 flex-1">
                  {service.label}
                </Text>
                <Text className="text-[#64748B] text-[12.5px] font-medium">{service.time}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mx-5 mt-8">
          <SectionLabel>VISIT OR REACH US</SectionLabel>
          <View className="bg-white rounded-[22px]" style={{ borderWidth: 1, borderColor: "#E2E8F0" }}>
            <Pressable
              onPress={() =>
                Linking.openURL(
                  "https://maps.google.com/?q=Salvation+and+Truth+Church+Lilongwe"
                ).catch(() => {})
              }
              className="flex-row items-center px-4 py-3.5"
              style={{ borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}
            >
              <View className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center">
                <MapPin size={14} color="#0F172A" />
              </View>
              <Text className="text-[#1E293B] text-[13.5px] font-medium ml-3">
                Area 47, Lilongwe, Malawi
              </Text>
            </Pressable>
            <Pressable
              onPress={() =>
                Linking.openURL("mailto:hello@salvationandtruth.church").catch(() => {})
              }
              className="flex-row items-center px-4 py-3.5"
              style={{ borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}
            >
              <View className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center">
                <Mail size={14} color="#0F172A" />
              </View>
              <Text className="text-[#1E293B] text-[13.5px] font-medium ml-3">
                hello@salvationandtruth.church
              </Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL("tel:+265999000000").catch(() => {})}
              className="flex-row items-center px-4 py-3.5"
            >
              <View className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center">
                <Phone size={14} color="#0F172A" />
              </View>
              <Text className="text-[#1E293B] text-[13.5px] font-medium ml-3">
                +265 999 000 000
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-row justify-center mt-8" style={{ gap: 14 }}>
          {SOCIALS.map(({ key, Icon, url }) => (
            <Pressable
              key={key}
              onPress={() => Linking.openURL(url).catch(() => {})}
              className="w-11 h-11 rounded-full bg-white items-center justify-center"
              style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
            >
              <Icon size={17} color="#0F172A" />
            </Pressable>
          ))}
        </View>

        <Text className="text-[#CBD5E1] text-[11px] text-center mt-8">
          Salvation and Truth © {new Date().getFullYear()}
        </Text>
      </ScrollView>
    </View>
  );
}
