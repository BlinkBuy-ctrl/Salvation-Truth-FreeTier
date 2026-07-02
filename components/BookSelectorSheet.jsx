import { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import { X } from "lucide-react-native";
import { BOOKS } from "../lib/bibleData";

export default function BookSelectorSheet({ visible, onClose, onSelect }) {
  const [testament, setTestament] = useState("OT");
  const [pickedBook, setPickedBook] = useState(null);

  const handleClose = () => {
    setPickedBook(null);
    onClose();
  };

  const handleBookPress = (book) => {
    setPickedBook(book);
  };

  const handleChapterPress = (chapter) => {
    onSelect(pickedBook.id, chapter);
    setPickedBook(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-[#F8FAFC] rounded-t-[28px] h-[78%]">
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-[#0F172A] text-[17px] font-bold">
              {pickedBook ? pickedBook.name : "Choose a Book"}
            </Text>
            <Pressable
              onPress={pickedBook ? () => setPickedBook(null) : handleClose}
              className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center"
            >
              <X size={15} color="#0F172A" />
            </Pressable>
          </View>

          {!pickedBook ? (
            <>
              <View className="flex-row px-5 mb-3">
                {["OT", "NT"].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setTestament(t)}
                    className="mr-2 px-4 py-2 rounded-full"
                    style={{ backgroundColor: testament === t ? "#0F172A" : "#F1F5F9" }}
                  >
                    <Text
                      className="text-[12.5px] font-semibold"
                      style={{ color: testament === t ? "#FFFFFF" : "#64748B" }}
                    >
                      {t === "OT" ? "Old Testament" : "New Testament"}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
                {BOOKS.filter((b) => b.testament === testament).map((book) => (
                  <Pressable
                    key={book.id}
                    onPress={() => handleBookPress(book)}
                    className="flex-row items-center justify-between py-3.5"
                    style={{ borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}
                  >
                    <Text className="text-[#1E293B] text-[14.5px] font-medium">{book.name}</Text>
                    <Text className="text-[#94A3B8] text-[12px]">{book.chapters} ch</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                {Array.from({ length: pickedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                  <Pressable
                    key={chapter}
                    onPress={() => handleChapterPress(chapter)}
                    className="w-12 h-12 rounded-2xl bg-white items-center justify-center"
                    style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
                  >
                    <Text className="text-[#0F172A] text-[13.5px] font-semibold">{chapter}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
