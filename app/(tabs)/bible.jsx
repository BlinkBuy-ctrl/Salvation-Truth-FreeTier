import { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import BookSelectorSheet from "../../components/BookSelectorSheet";
import { getBook, getChapterText, VERSE_OF_THE_DAY } from "../../lib/bibleData";
import { useTheme } from "../../lib/ThemeContext";

const DEFAULT_BOOK = "jhn";
const DEFAULT_CHAPTER = 3;

export default function BibleScreen() {
  const { colors } = useTheme();
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
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ backgroundColor: colors.navy }} className="mx-5 mt-5 rounded-[24px] p-5">
          <Text style={{ color: colors.gold }} className="text-[11px] font-bold tracking-[1.5px]">
            VERSE OF THE DAY
          </Text>
          <Text className="text-white text-[15px] leading-6 mt-2.5" style={{ fontFamily: "Georgia" }}>
            "{VERSE_OF_THE_DAY.text}"
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-[12px] mt-2.5 font-medium">
            {VERSE_OF_THE_DAY.reference}
          </Text>
        </View>

        <Pressable
          onPress={() => setPickerOpen(true)}
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          className="mx-5 mt-6 flex-row items-center justify-between rounded-2xl px-4 py-3.5"
        >
          <Text style={{ color: colors.textPrimary }} className="text-[15px] font-bold">
            {book.name} {chapter}
          </Text>
          <ChevronDown size={18} color={colors.textMuted} />
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
                    backgroundColor: isHighlighted ? colors.surfaceAlt : "transparent",
                    borderRadius: 14,
                    padding: isHighlighted ? 10 : 0,
                    marginHorizontal: isHighlighted ? -10 : 0,
                  }}
                >
                  <Text style={{ color: colors.gold, minWidth: 18 }} className="text-[12px] font-bold mr-2.5 mt-1">
                    {verse.v}
                  </Text>
                  <Text
                    style={{ color: colors.textSecondary, fontFamily: "Georgia" }}
                    className="flex-1 text-[16px] leading-[27px]"
                  >
                    {verse.t}
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <View className="items-center py-16">
              <Text style={{ color: colors.textMuted }} className="text-[13.5px] text-center leading-5">
                This chapter hasn't been bundled into the app yet.{"\n"}
                Try John 3, Psalm 23, Romans 8, or Genesis 1 for the full reading experience.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}
        className="flex-row items-center justify-between px-5 py-3.5"
      >
        <Pressable
          onPress={() => goToChapter(chapter - 1)}
          disabled={chapter <= 1}
          style={{ backgroundColor: colors.surfaceAlt, opacity: chapter <= 1 ? 0.4 : 1 }}
          className="flex-row items-center px-4 py-2.5 rounded-full"
        >
          <ChevronLeft size={15} color={colors.textPrimary} />
          <Text style={{ color: colors.textPrimary }} className="text-[12.5px] font-semibold ml-1">Prev</Text>
        </Pressable>

        <Text style={{ color: colors.textMuted }} className="text-[12px] font-medium">
          Chapter {chapter} of {book.chapters}
        </Text>

        <Pressable
          onPress={() => goToChapter(chapter + 1)}
          disabled={chapter >= book.chapters}
          style={{ backgroundColor: colors.surfaceAlt, opacity: chapter >= book.chapters ? 0.4 : 1 }}
          className="flex-row items-center px-4 py-2.5 rounded-full"
        >
          <Text style={{ color: colors.textPrimary }} className="text-[12.5px] font-semibold mr-1">Next</Text>
          <ChevronRight size={15} color={colors.textPrimary} />
        </Pressable>
      </View>

      <BookSelectorSheet visible={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleSelect} />
    </View>
  );
}
