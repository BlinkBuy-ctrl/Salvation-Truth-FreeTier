// Public-domain KJV text. Book list/chapter counts are the real canonical structure,
// so navigation is accurate for all 66 books immediately.
// Full verse text is bundled for the sample chapters below — swap BIBLE_TEXT
// for a complete bundled JSON (or on-device SQLite) when you're ready; the
// reader component doesn't change.

export const BOOKS = [
  // Old Testament
  { id: "gen", name: "Genesis", testament: "OT", chapters: 50 },
  { id: "exo", name: "Exodus", testament: "OT", chapters: 40 },
  { id: "lev", name: "Leviticus", testament: "OT", chapters: 27 },
  { id: "num", name: "Numbers", testament: "OT", chapters: 36 },
  { id: "deu", name: "Deuteronomy", testament: "OT", chapters: 34 },
  { id: "jos", name: "Joshua", testament: "OT", chapters: 24 },
  { id: "jdg", name: "Judges", testament: "OT", chapters: 21 },
  { id: "rut", name: "Ruth", testament: "OT", chapters: 4 },
  { id: "1sa", name: "1 Samuel", testament: "OT", chapters: 31 },
  { id: "2sa", name: "2 Samuel", testament: "OT", chapters: 24 },
  { id: "1ki", name: "1 Kings", testament: "OT", chapters: 22 },
  { id: "2ki", name: "2 Kings", testament: "OT", chapters: 25 },
  { id: "1ch", name: "1 Chronicles", testament: "OT", chapters: 29 },
  { id: "2ch", name: "2 Chronicles", testament: "OT", chapters: 36 },
  { id: "ezr", name: "Ezra", testament: "OT", chapters: 10 },
  { id: "neh", name: "Nehemiah", testament: "OT", chapters: 13 },
  { id: "est", name: "Esther", testament: "OT", chapters: 10 },
  { id: "job", name: "Job", testament: "OT", chapters: 42 },
  { id: "psa", name: "Psalms", testament: "OT", chapters: 150 },
  { id: "pro", name: "Proverbs", testament: "OT", chapters: 31 },
  { id: "ecc", name: "Ecclesiastes", testament: "OT", chapters: 12 },
  { id: "sng", name: "Song of Solomon", testament: "OT", chapters: 8 },
  { id: "isa", name: "Isaiah", testament: "OT", chapters: 66 },
  { id: "jer", name: "Jeremiah", testament: "OT", chapters: 52 },
  { id: "lam", name: "Lamentations", testament: "OT", chapters: 5 },
  { id: "eze", name: "Ezekiel", testament: "OT", chapters: 48 },
  { id: "dan", name: "Daniel", testament: "OT", chapters: 12 },
  { id: "hos", name: "Hosea", testament: "OT", chapters: 14 },
  { id: "joe", name: "Joel", testament: "OT", chapters: 3 },
  { id: "amo", name: "Amos", testament: "OT", chapters: 9 },
  { id: "oba", name: "Obadiah", testament: "OT", chapters: 1 },
  { id: "jon", name: "Jonah", testament: "OT", chapters: 4 },
  { id: "mic", name: "Micah", testament: "OT", chapters: 7 },
  { id: "nah", name: "Nahum", testament: "OT", chapters: 3 },
  { id: "hab", name: "Habakkuk", testament: "OT", chapters: 3 },
  { id: "zep", name: "Zephaniah", testament: "OT", chapters: 3 },
  { id: "hag", name: "Haggai", testament: "OT", chapters: 2 },
  { id: "zec", name: "Zechariah", testament: "OT", chapters: 14 },
  { id: "mal", name: "Malachi", testament: "OT", chapters: 4 },
  // New Testament
  { id: "mat", name: "Matthew", testament: "NT", chapters: 28 },
  { id: "mrk", name: "Mark", testament: "NT", chapters: 16 },
  { id: "luk", name: "Luke", testament: "NT", chapters: 24 },
  { id: "jhn", name: "John", testament: "NT", chapters: 21 },
  { id: "act", name: "Acts", testament: "NT", chapters: 28 },
  { id: "rom", name: "Romans", testament: "NT", chapters: 16 },
  { id: "1co", name: "1 Corinthians", testament: "NT", chapters: 16 },
  { id: "2co", name: "2 Corinthians", testament: "NT", chapters: 13 },
  { id: "gal", name: "Galatians", testament: "NT", chapters: 6 },
  { id: "eph", name: "Ephesians", testament: "NT", chapters: 6 },
  { id: "php", name: "Philippians", testament: "NT", chapters: 4 },
  { id: "col", name: "Colossians", testament: "NT", chapters: 4 },
  { id: "1th", name: "1 Thessalonians", testament: "NT", chapters: 5 },
  { id: "2th", name: "2 Thessalonians", testament: "NT", chapters: 3 },
  { id: "1ti", name: "1 Timothy", testament: "NT", chapters: 6 },
  { id: "2ti", name: "2 Timothy", testament: "NT", chapters: 4 },
  { id: "tit", name: "Titus", testament: "NT", chapters: 3 },
  { id: "phm", name: "Philemon", testament: "NT", chapters: 1 },
  { id: "heb", name: "Hebrews", testament: "NT", chapters: 13 },
  { id: "jas", name: "James", testament: "NT", chapters: 5 },
  { id: "1pe", name: "1 Peter", testament: "NT", chapters: 5 },
  { id: "2pe", name: "2 Peter", testament: "NT", chapters: 3 },
  { id: "1jn", name: "1 John", testament: "NT", chapters: 5 },
  { id: "2jn", name: "2 John", testament: "NT", chapters: 1 },
  { id: "3jn", name: "3 John", testament: "NT", chapters: 1 },
  { id: "jud", name: "Jude", testament: "NT", chapters: 1 },
  { id: "rev", name: "Revelation", testament: "NT", chapters: 22 },
];

// Bundled sample chapters — real KJV text, keyed as "bookId-chapter".
export const BIBLE_TEXT = {
  "jhn-3": [
    { v: 1, t: "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews." },
    { v: 2, t: "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him." },
    { v: 3, t: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God." },
    { v: 16, t: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
    { v: 17, t: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." },
    { v: 18, t: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God." },
  ],
  "psa-23": [
    { v: 1, t: "The LORD is my shepherd; I shall not want." },
    { v: 2, t: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
    { v: 3, t: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
    { v: 4, t: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
    { v: 5, t: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
    { v: 6, t: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever." },
  ],
  "rom-8": [
    { v: 1, t: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit." },
    { v: 28, t: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
    { v: 31, t: "What shall we then say to these things? If God be for us, who can be against us?" },
    { v: 37, t: "Nay, in all these things we are more than conquerors through him that loved us." },
    { v: 38, t: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come," },
    { v: 39, t: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." },
  ],
  "gen-1": [
    { v: 1, t: "In the beginning God created the heaven and the earth." },
    { v: 2, t: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
    { v: 3, t: "And God said, Let there be light: and there was light." },
    { v: 4, t: "And God saw the light, that it was good: and God divided the light from the darkness." },
  ],
};

export const VERSE_OF_THE_DAY = {
  reference: "Isaiah 41:10",
  text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
};

export function getBook(bookId) {
  return BOOKS.find((b) => b.id === bookId);
}

export function getChapterText(bookId, chapter) {
  return BIBLE_TEXT[`${bookId}-${chapter}`] ?? null;
}
