// Mi'kmaq Dictionary API Response Types
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

export interface ErrorResponse {
  title: string;
  message: string;
  resolution: string;
}

export interface DictionaryStats {
  totalWords: number;
  wordTypes: { [key: string]: number };
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  version: string;
}

// MCP Tool Input Schemas
export interface LookupWordInput {
  word: string;
  exact?: boolean;
  limit?: number;
  partOfSpeech?: string;
}

export interface SearchInput {
  query: string;
  type: 'english-to-mikmaq' | 'mikmaq-to-english';
  limit?: number;
  partOfSpeech?: string;
}

export interface MikmaqDictionaryClient {
  baseUrl: string;
  timeout?: number;
}
