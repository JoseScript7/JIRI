import { I18n } from "i18n-js";

const translations = {
  en: {
    greeting: "Hello",
    games: "Cognitive Games",
    caregiver: "Caregiver Portal",
    memoryAlbum: "Memory Album",
    tasks: "Tasks & Chores",
    settings: "Settings",
    play: "Play",
    score: "Score",
    reminders: "Reminders",
    medication: "Medication",
    faceRec: "Face Recognition",
    voiceNav: "Tap for Voice Navigation",
  },
  as: {
    // Assamese
    greeting: "নমস্কাৰ (Namaskar)",
    games: "জ্ঞানমূলক খেল (Cognitive Games)",
    caregiver: "যতন লোৱা ব্যক্তিৰ পৰ্টেল (Caregiver Portal)",
    memoryAlbum: "স্মৃতিৰ এলবাম (Memory Album)",
    tasks: "কৰ্ম আৰু ঘৰুৱা কাম (Tasks & Chores)",
    settings: "ছেটিংছ (Settings)",
    play: "খেলক (Play)",
    score: "স্কোৰ (Score)",
    reminders: "স্মৃতিচাৰণ (Reminders)",
    medication: "দৰৱ (Medication)",
    faceRec: "মুখ চিনাক্তকৰণ (Face Recognition)",
    voiceNav: "ভইচ নেভিগেশ্বনৰ বাবে টিপক",
  },
  bn: {
    // Bengali
    greeting: "নমস্কার",
    games: "জ্ঞানমূলক গেম",
    caregiver: "তত্ত্বাবধায়ক পোর্টাল",
    memoryAlbum: "স্মৃতির অ্যালবাম",
    tasks: "কাজ ও ঘরোয়া কাজ",
    settings: "সেটিংস",
    play: "খেলুন",
    score: "স্কোর",
    reminders: "অনুস্মারক",
    medication: "ওষুধ",
    faceRec: "মুখ শনাক্তকরণ",
    voiceNav: "ভয়েস নেভিগেশনের জন্য আলতো চাপুন",
  },
  // Placeholders for Bodo, Manipuri, Khasi, Mizo, Nepali
  brx: { greeting: "खुलुमबाय (Khulumbai)", games: "Cognitive Games (Bodo)" },
  mni: {
    greeting: "ꯈꯨꯔꯨꯝꯖꯔꯤ (Khurumjari)",
    games: "Cognitive Games (Manipuri)",
  },
  kha: { greeting: "Khyndai (Khublei)", games: "Cognitive Games (Khasi)" },
  lus: { greeting: "Chibai (Mizo)", games: "Cognitive Games (Mizo)" },
  ne: { greeting: "नमस्ते (Namaste)", games: "Cognitive Games (Nepali)" },
};

const i18n = new I18n(translations);
i18n.defaultLocale = "en";
i18n.locale = "en"; // Default, will be updated via app state

export default i18n;
