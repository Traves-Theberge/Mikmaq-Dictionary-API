// Test setup file
import * as fs from 'fs';
import * as path from 'path';

// Mock dictionary data for testing
export const mockDictionaryData = {
  message: {
    meta: {
      name: "Mi'gmaq"
    },
    words: [
      {
        word: "agase'wa'latl",
        type: "verb animate transitive",
        definitions: ["hire"],
        translations: ["He/she hires him/her"],
        usages: [
          {
            translation: "Ulagu agase'wa'lapnn Sa'nal.",
            english: "Yesterday he/she hired Sean."
          }
        ]
      },
      {
        word: "aloqoman",
        type: "noun inanimate",
        definitions: ["grape"],
        translations: ["Grape"],
        usages: [
          {
            translation: "Aloqomann tam(i) etlnigwegl?",
            english: "Where do grapes grow?"
          }
        ]
      },
      {
        word: "alapiet",
        type: "verb animate intransitive",
        definitions: ["looks around", "looks here and there", "looks about"],
        translations: ["He/she/it looks around"],
        usages: [
          {
            translation: "Sangew alapiet, getu' migwite'tg ms't goqwei.",
            english: "He/she slowly looks around, he/she wants to remember every"
          }
        ]
      }
    ]
  }
};

// Create a test dictionary file
const testDictionaryPath = path.join(process.cwd(), 'test-dictionary.json');

beforeAll(() => {
  // Create test dictionary file
  fs.writeFileSync(testDictionaryPath, JSON.stringify(mockDictionaryData, null, 2));
  
  // Suppress console output during tests
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  // Clean up test dictionary file
  if (fs.existsSync(testDictionaryPath)) {
    fs.unlinkSync(testDictionaryPath);
  }
});
