import * as fs from 'fs';
import * as path from 'path';
import { MikmaqDictionary, MikmaqWord, DictionaryApiResponse, Meaning, Definition, SearchOptions } from '../types/dictionary';

export class DictionaryService {
  private dictionary: MikmaqWord[] = [];
  private wordIndex: Map<string, MikmaqWord> = new Map();

  constructor() {
    this.loadDictionary();
  }

  private loadDictionary(): void {
    try {
      const dictionaryPath = path.join(process.cwd(), 'dictionary.json');
      const data = fs.readFileSync(dictionaryPath, 'utf-8');
      const parsedData: MikmaqDictionary = JSON.parse(data);
      
      this.dictionary = parsedData.message.words;
      
      // Create index for faster lookups
      this.dictionary.forEach(word => {
        this.wordIndex.set(word.word.toLowerCase(), word);
      });

      console.log(`Loaded ${this.dictionary.length} Mi'kmaq words into dictionary`);
    } catch (error) {
      console.error('Error loading dictionary:', error);
      throw new Error('Failed to load Mi\'kmaq dictionary');
    }
  }

  public findWord(searchTerm: string, options: SearchOptions = {}): MikmaqWord[] {
    const { exact = false, limit = 10, partOfSpeech } = options;
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    if (exact) {
      const exactMatch = this.wordIndex.get(normalizedSearch);
      if (exactMatch) {
        return partOfSpeech && exactMatch.type !== partOfSpeech ? [] : [exactMatch];
      }
      return [];
    }

    // Fuzzy search
    const results: MikmaqWord[] = [];
    
    for (const word of this.dictionary) {
      if (results.length >= limit) break;
      
      const wordLower = word.word.toLowerCase();
      
      // Check if word matches search criteria
      const matchesSearch = wordLower.includes(normalizedSearch) || 
                           word.definitions.some(def => def.toLowerCase().includes(normalizedSearch)) ||
                           word.translations.some(trans => trans.toLowerCase().includes(normalizedSearch));
      
      const matchesPartOfSpeech = !partOfSpeech || word.type === partOfSpeech;
      
      if (matchesSearch && matchesPartOfSpeech) {
        results.push(word);
      }
    }
    
    // Sort by relevance (exact matches first, then by word length)
    return results.sort((a, b) => {
      const aExact = a.word.toLowerCase() === normalizedSearch;
      const bExact = b.word.toLowerCase() === normalizedSearch;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.word.length - b.word.length;
    });
  }

  public convertToApiFormat(mikmaqWord: MikmaqWord): DictionaryApiResponse {
    // Convert Mi'kmaq grammatical types to more standard parts of speech
    const partOfSpeech = this.normalizePartOfSpeech(mikmaqWord.type);
    
    const definitions: Definition[] = mikmaqWord.definitions.map(def => ({
      definition: def,
      example: mikmaqWord.usages.length > 0 ? mikmaqWord.usages[0].english : undefined,
      synonyms: [],
      antonyms: []
    }));

    const meaning: Meaning = {
      partOfSpeech,
      definitions
    };

    return {
      word: mikmaqWord.word,
      phonetic: undefined, // Mi'kmaq phonetic data not available in source
      phonetics: [],
      origin: undefined, // Etymology not available in source
      meanings: [meaning]
    };
  }

  private normalizePartOfSpeech(mikmaqType: string): string {
    const typeMap: { [key: string]: string } = {
      'verb animate transitive': 'verb',
      'verb animate intransitive': 'verb',
      'verb inanimate transitive': 'verb',
      'verb inanimate intransitive': 'verb',
      'noun animate': 'noun',
      'noun inanimate': 'noun',
      'noun': 'noun',
      'particle': 'particle',
      'pronoun': 'pronoun',
      'unclassified': 'other'
    };

    return typeMap[mikmaqType] || mikmaqType;
  }

  public getStats(): { totalWords: number; wordTypes: { [key: string]: number } } {
    const wordTypes: { [key: string]: number } = {};
    
    this.dictionary.forEach(word => {
      wordTypes[word.type] = (wordTypes[word.type] || 0) + 1;
    });

    return {
      totalWords: this.dictionary.length,
      wordTypes
    };
  }

  public getAllWordTypes(): string[] {
    const types = new Set<string>();
    this.dictionary.forEach(word => types.add(word.type));
    return Array.from(types).sort();
  }

  public getRandomWord(): MikmaqWord {
    const randomIndex = Math.floor(Math.random() * this.dictionary.length);
    return this.dictionary[randomIndex];
  }

  public searchEnglishToMikmaq(englishQuery: string, options: SearchOptions = {}): MikmaqWord[] {
    const { limit = 10, partOfSpeech } = options;
    const normalizedQuery = englishQuery.toLowerCase().trim();
    
    const results: MikmaqWord[] = [];
    
    for (const word of this.dictionary) {
      if (results.length >= limit) break;
      
      // Search in definitions and translations
      const matchesDefinition = word.definitions.some(def => 
        def.toLowerCase().includes(normalizedQuery)
      );
      const matchesTranslation = word.translations.some(trans => 
        trans.toLowerCase().includes(normalizedQuery)
      );
      const matchesUsageEnglish = word.usages.some(usage => 
        usage.english.toLowerCase().includes(normalizedQuery)
      );
      
      const matchesSearch = matchesDefinition || matchesTranslation || matchesUsageEnglish;
      const matchesPartOfSpeech = !partOfSpeech || word.type === partOfSpeech;
      
      if (matchesSearch && matchesPartOfSpeech) {
        results.push(word);
      }
    }
    
    // Sort by relevance (exact definition matches first)
    return results.sort((a, b) => {
      const aExactDef = a.definitions.some(def => def.toLowerCase() === normalizedQuery);
      const bExactDef = b.definitions.some(def => def.toLowerCase() === normalizedQuery);
      
      if (aExactDef && !bExactDef) return -1;
      if (!aExactDef && bExactDef) return 1;
      
      return a.word.localeCompare(b.word);
    });
  }

  public searchMikmaqToEnglish(mikmaqQuery: string, options: SearchOptions = {}): MikmaqWord[] {
    // This is essentially the same as our existing findWord method
    return this.findWord(mikmaqQuery, options);
  }

  public findEnglishWord(englishWord: string, options: SearchOptions = {}): MikmaqWord[] {
    const { limit = 10, partOfSpeech } = options;
    const normalizedWord = englishWord.toLowerCase().trim();
    
    const results: MikmaqWord[] = [];
    
    for (const word of this.dictionary) {
      if (results.length >= limit) break;
      
      // Look for exact matches in definitions first
      const exactDefMatch = word.definitions.some(def => 
        def.toLowerCase() === normalizedWord
      );
      
      if (exactDefMatch) {
        const matchesPartOfSpeech = !partOfSpeech || word.type === partOfSpeech;
        if (matchesPartOfSpeech) {
          results.push(word);
        }
      }
    }
    
    // If no exact matches, look for partial matches
    if (results.length === 0) {
      for (const word of this.dictionary) {
        if (results.length >= limit) break;
        
        const partialDefMatch = word.definitions.some(def => 
          def.toLowerCase().includes(normalizedWord)
        );
        const partialTransMatch = word.translations.some(trans => 
          trans.toLowerCase().includes(normalizedWord)
        );
        
        if (partialDefMatch || partialTransMatch) {
          const matchesPartOfSpeech = !partOfSpeech || word.type === partOfSpeech;
          if (matchesPartOfSpeech) {
            results.push(word);
          }
        }
      }
    }
    
    return results.sort((a, b) => a.word.localeCompare(b.word));
  }
}
