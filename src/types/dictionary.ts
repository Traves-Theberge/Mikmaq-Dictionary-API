// Mi'kmaq Dictionary Types
export interface MikmaqWord {
  word: string;
  type: string;
  definitions: string[];
  translations: string[];
  usages: MikmaqUsage[];
}

export interface MikmaqUsage {
  translation: string;
  english: string;
}

export interface MikmaqDictionary {
  message: {
    meta: {
      name: string;
    };
    words: MikmaqWord[];
  };
}

// API Response Types (following dictionary API structure)
export interface DictionaryApiResponse {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}

export interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

// Error Response Type
export interface ErrorResponse {
  title: string;
  message: string;
  resolution: string;
}

// Search Options
export interface SearchOptions {
  exact?: boolean;
  limit?: number;
  partOfSpeech?: string;
}
