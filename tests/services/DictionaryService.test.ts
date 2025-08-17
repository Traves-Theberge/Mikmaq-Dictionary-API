import * as fs from 'fs';
import * as path from 'path';
import { DictionaryService } from '../../src/services/DictionaryService';
import { mockDictionaryData } from '../setup';

// Mock fs to use our test data
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('DictionaryService', () => {
  let dictionaryService: DictionaryService;

  beforeEach(() => {
    // Mock fs.readFileSync to return our test data
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockDictionaryData));
    
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    dictionaryService = new DictionaryService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should load dictionary data successfully', () => {
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(
        path.join(process.cwd(), 'dictionary.json'),
        'utf-8'
      );
      expect(console.log).toHaveBeenCalledWith('Loaded 3 Mi\'kmaq words into dictionary');
    });

    it('should throw error when dictionary fails to load', () => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => new DictionaryService()).toThrow('Failed to load Mi\'kmaq dictionary');
    });
  });

  describe('findWord', () => {
    it('should find exact word match', () => {
      const results = dictionaryService.findWord("agase'wa'latl", { exact: true });
      
      expect(results).toHaveLength(1);
      expect(results[0].word).toBe("agase'wa'latl");
      expect(results[0].type).toBe("verb animate transitive");
    });

    it('should return empty array for exact match when word not found', () => {
      const results = dictionaryService.findWord('nonexistent', { exact: true });
      
      expect(results).toHaveLength(0);
    });

    it('should perform fuzzy search by word', () => {
      const results = dictionaryService.findWord('alo');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].word).toBe('aloqoman');
    });

    it('should search by definition', () => {
      const results = dictionaryService.findWord('grape');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.definitions.includes('grape'))).toBe(true);
    });

    it('should search by translation', () => {
      const results = dictionaryService.findWord('Grape');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.translations.includes('Grape'))).toBe(true);
    });

    it('should filter by part of speech', () => {
      const results = dictionaryService.findWord('a', { 
        partOfSpeech: 'noun inanimate',
        limit: 10 
      });
      
      expect(results.every(r => r.type === 'noun inanimate')).toBe(true);
    });

    it('should respect limit parameter', () => {
      const results = dictionaryService.findWord('a', { limit: 2 });
      
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should sort results by relevance (exact matches first)', () => {
      const results = dictionaryService.findWord('aloqoman');
      
      expect(results[0].word).toBe('aloqoman');
    });
  });

  describe('convertToApiFormat', () => {
    it('should convert Mi\'kmaq word to API format', () => {
      const mikmaqWord = mockDictionaryData.message.words[0];
      const apiResponse = dictionaryService.convertToApiFormat(mikmaqWord);

      expect(apiResponse).toEqual({
        word: "agase'wa'latl",
        phonetic: undefined,
        phonetics: [],
        origin: undefined,
        meanings: [{
          partOfSpeech: 'verb',
          definitions: [{
            definition: 'hire',
            example: 'Yesterday he/she hired Sean.',
            synonyms: [],
            antonyms: []
          }]
        }]
      });
    });

    it('should handle word with no usages', () => {
      const wordWithoutUsages = {
        ...mockDictionaryData.message.words[0],
        usages: []
      };
      
      const apiResponse = dictionaryService.convertToApiFormat(wordWithoutUsages);

      expect(apiResponse.meanings[0].definitions[0].example).toBeUndefined();
    });

    it('should normalize part of speech correctly', () => {
      const testCases = [
        { input: 'verb animate transitive', expected: 'verb' },
        { input: 'noun inanimate', expected: 'noun' },
        { input: 'particle', expected: 'particle' },
        { input: 'unknown type', expected: 'unknown type' }
      ];

      testCases.forEach(({ input, expected }) => {
        const word = { ...mockDictionaryData.message.words[0], type: input };
        const result = dictionaryService.convertToApiFormat(word);
        expect(result.meanings[0].partOfSpeech).toBe(expected);
      });
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      const stats = dictionaryService.getStats();

      expect(stats.totalWords).toBe(3);
      expect(stats.wordTypes).toEqual({
        'verb animate transitive': 1,
        'noun inanimate': 1,
        'verb animate intransitive': 1
      });
    });
  });

  describe('getAllWordTypes', () => {
    it('should return all unique word types sorted', () => {
      const wordTypes = dictionaryService.getAllWordTypes();

      expect(wordTypes).toEqual([
        'noun inanimate',
        'verb animate intransitive', 
        'verb animate transitive'
      ]);
    });
  });

  describe('getRandomWord', () => {
    it('should return a random word from the dictionary', () => {
      const randomWord = dictionaryService.getRandomWord();

      expect(randomWord).toBeDefined();
      expect(randomWord.word).toBeDefined();
      expect(randomWord.type).toBeDefined();
      expect(randomWord.definitions).toBeDefined();
      expect(randomWord.translations).toBeDefined();
    });

    it('should return different words on multiple calls (probabilistic)', () => {
      const words = new Set();
      // Try 10 times to get different words
      for (let i = 0; i < 10; i++) {
        words.add(dictionaryService.getRandomWord().word);
      }
      // With 3 words, we should get at least 2 different ones in 10 tries
      expect(words.size).toBeGreaterThan(1);
    });
  });

  describe('searchEnglishToMikmaq', () => {
    it('should find Mi\'kmaq words by English definition', () => {
      const results = dictionaryService.searchEnglishToMikmaq('grape');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.definitions.includes('grape'))).toBe(true);
    });

    it('should find Mi\'kmaq words by English translation', () => {
      const results = dictionaryService.searchEnglishToMikmaq('Grape');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.translations.includes('Grape'))).toBe(true);
    });

    it('should find Mi\'kmaq words by English usage example', () => {
      const results = dictionaryService.searchEnglishToMikmaq('hired');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => 
        r.usages.some(u => u.english.toLowerCase().includes('hired'))
      )).toBe(true);
    });

    it('should respect limit parameter', () => {
      const results = dictionaryService.searchEnglishToMikmaq('a', { limit: 2 });

      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should filter by part of speech', () => {
      const results = dictionaryService.searchEnglishToMikmaq('grape', { 
        partOfSpeech: 'noun inanimate' 
      });

      expect(results.every(r => r.type === 'noun inanimate')).toBe(true);
    });

    it('should sort results with exact definition matches first', () => {
      const results = dictionaryService.searchEnglishToMikmaq('grape');

      if (results.length > 1) {
        const firstResult = results[0];
        expect(firstResult.definitions.some(def => 
          def.toLowerCase() === 'grape'
        )).toBe(true);
      }
    });
  });

  describe('searchMikmaqToEnglish', () => {
    it('should delegate to findWord method', () => {
      const spy = jest.spyOn(dictionaryService, 'findWord');
      const searchOptions = { limit: 5, exact: true };

      dictionaryService.searchMikmaqToEnglish('test', searchOptions);

      expect(spy).toHaveBeenCalledWith('test', searchOptions);
    });
  });

  describe('findEnglishWord', () => {
    it('should find exact English word matches first', () => {
      const results = dictionaryService.findEnglishWord('grape');

      expect(results.length).toBeGreaterThan(0);
      const firstResult = results[0];
      expect(firstResult.definitions.some(def => 
        def.toLowerCase() === 'grape'
      )).toBe(true);
    });

    it('should find partial matches when no exact matches exist', () => {
      const results = dictionaryService.findEnglishWord('grap');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => 
        r.definitions.some(def => def.toLowerCase().includes('grap')) ||
        r.translations.some(trans => trans.toLowerCase().includes('grap'))
      )).toBe(true);
    });

    it('should respect limit parameter', () => {
      const results = dictionaryService.findEnglishWord('a', { limit: 2 });

      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should filter by part of speech', () => {
      const results = dictionaryService.findEnglishWord('grape', { 
        partOfSpeech: 'noun inanimate' 
      });

      expect(results.every(r => r.type === 'noun inanimate')).toBe(true);
    });

    it('should return empty array for non-existent word', () => {
      const results = dictionaryService.findEnglishWord('xyznonsenseword');

      expect(results).toEqual([]);
    });

    it('should sort results alphabetically by Mi\'kmaq word', () => {
      const results = dictionaryService.findEnglishWord('a');

      if (results.length > 1) {
        for (let i = 1; i < results.length; i++) {
          expect(results[i-1].word.localeCompare(results[i].word)).toBeLessThanOrEqual(0);
        }
      }
    });
  });
});
