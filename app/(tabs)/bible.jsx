import { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import BookSelectorSheet from "../../components/BookSelectorSheet";
import { getBook, getChapterText, VERSE_OF_THE_DAY } from "../../lib/bibleData";

const DEFAULT_BOOK = "jhn";
const DEFAULT_CHAPTER = 3;

export default function BibleScreen() {
  const [bookId, setBookId] = useState(DEFAULT_BOOK);
  const [chapter, setChapter] = useState(DEFAULT_CHAPTER);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [highlightedVerse, setHighlightedVerse] = useState(null);

  const book = getBook(bookId);
  const verses = getChapterText(bookId, chapter);

  const goToChapter = useCallback((nextChapter) => {
    if (nextChapter < 1 || nextChapter > book.chapters) return;
    setChapter(nextChapter);
    setHighlightedVerse(null);
  }, [book]);

  const handleSelect = (newBookId, newChapter) => {
    setBookId(newBookId);
    setChapter(newChapter);
    setHighlightedVerse(null);
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mx-5 mt-5 bg-[#0F172A] rounded-[24px] p-5">
          <Text className="text-[#D97706] text-[11px] font-bold tracking-[1.5px]">
            VERSE OF THE DAY
          </Text>
          <Text
            className="text-white text-[15px] leading-6 mt-2.5"
            style={{ fontFamily: "Georgia" }}
          >
            "{VERSE_OF_THE_DAY.text}"
          </Text>
          <Text className="text-[#94A3B8] text-[12px] mt-2.5 font-medium">
            {VERSE_OF_THE_DAY.reference}
          </Text>
        </View>

        <Pressable
          onPress={() => setPickerOpen(true)}
          className="mx-5 mt-6 flex-row items-center justify-between bg-white rounded-2xl px-4 py-3.5"
          style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
        >
          <Text className="text-[#0F172A] text-[15px] font-bold">
            {book.name} {chapter}
          </Text>
          <ChevronDown size={18} color="#64748B" />
        </Pressable>

        <View className="px-6 mt-6">
          {verses ? (
            verses.map((verse) => {
              const isHighlighted = highlightedVerse === verse.v;
              return (
                <Pressable
                  key={verse.v}
                  onPress={() => setHighlightedVerse(isHighlighted ? null : verse.v)}
                  className="flex-row mb-4"
                  style={{
                    backgroundColor: isHighlighted ? "#FEF3E2" : "transparent",
                    borderRadius: 14,
                    padding: isHighlighted ? 10 : 0,
                    marginHorizontal: isHighlighted ? -10 : 0,
                  }}
                >
                  <Text
                    className="text-[#D97706] text-[12px] font-bold mr-2.5 mt-1"
                    style={{ minWidth: 18 }}
                  >
                    {verse.v}
                  </Text>
                  <Text
                    className="flex-1 text-[#1E293B] text-[16px] leading-[27px]"
                    style={{ fontFamily: "Georgia" }}
                  >
                    {verse.t}
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <View className="items-center py-16">
              <Text className="text-[#94A3B8] text-[13.5px] text-center leading-5">
                This chapter hasn't been bundled into the app yet.{"\n"}
                Try John 3, Psalm 23, Romans 8, or Genesis 1 for the full reading experience.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        className="flex-row items-center justify-between px-5 py-3.5 bg-white"
        style={{ borderTopWidth: 1, borderTopColor: "#F1F5F9" }}
      >
        <Pressable
          onPress={() => goToChapter(chapter - 1)}
          disabled={chapter <= 1}
          className="flex-row items-center px-4 py-2.5 rounded-full"
          style={{ backgroundColor: "#F1F5F9", opacity: chapter <= 1 ? 0.4 : 1 }}
        >
          <ChevronLeft size={15} color="#0F172A" />
          <Text className="text-[#0F172A] text-[12.5px] font-semibold ml-1">Prev</Text>
        </Pressable>

        <Text className="text-[#94A3B8] text-[12px] font-medium">
          Chapter {chapter} of {book.chapters}
        </Text>

        <Pressable
          onPress={() => goToChapter(chapter + 1)}
          disabled={chapter >= book.chapters}
          className="flex-row items-center px-4 py-2.5 rounded-full"
          style={{ backgroundColor: "#F1F5F9", opacity: chapter >= book.chapters ? 0.4 : 1 }}
        >
          <Text className="text-[#0F172A] text-[12.5px] font-semibold mr-1">Next</Text>
          <ChevronRight size={15} color="#0F172A" />
        </Pressable>
      </View>

      <BookSelectorSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
      />
    </View>
  );
}
