import {
  DictionaryApiResponse,
  ErrorResponse,
  DictionaryStats,
  HealthResponse,
  MikmaqDictionaryClient,
  LookupWordInput,
  SearchInput
} from './types.js';

export class MikmaqDictionaryAPIClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: MikmaqDictionaryClient) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout || 10000; // 10 second default timeout
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      // Use Node.js built-in fetch (available in Node 18+)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MikmaqDictionary-MCP-Server/1.0.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(`API Error (${response.status}): ${errorData.message}`);
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to connect to Mi'kmaq Dictionary API: ${error.message}`);
      }
      throw new Error('Unknown error occurred while connecting to API');
    }
  }

  /**
   * Look up a Mi'kmaq word and get its English definitions
   */
  async lookupMikmaqWord(input: LookupWordInput): Promise<DictionaryApiResponse[]> {
    const params = new URLSearchParams();
    if (input.exact !== undefined) params.append('exact', input.exact.toString());
    if (input.limit !== undefined) params.append('limit', input.limit.toString());
    if (input.partOfSpeech) params.append('partOfSpeech', input.partOfSpeech);

    const queryString = params.toString();
    const endpoint = `/api/v1/entries/mik/${encodeURIComponent(input.word)}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<DictionaryApiResponse[]>(endpoint);
  }

  /**
   * Look up an English word and get its Mi'kmaq translations
   */
  async lookupEnglishWord(input: LookupWordInput): Promise<DictionaryApiResponse[]> {
    const params = new URLSearchParams();
    if (input.limit !== undefined) params.append('limit', input.limit.toString());
    if (input.partOfSpeech) params.append('partOfSpeech', input.partOfSpeech);

    const queryString = params.toString();
    const endpoint = `/api/v1/entries/english/${encodeURIComponent(input.word)}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<DictionaryApiResponse[]>(endpoint);
  }

  /**
   * Get a random Mi'kmaq word for learning
   */
  async getRandomWord(): Promise<DictionaryApiResponse> {
    return this.makeRequest<DictionaryApiResponse>('/api/v1/entries/random');
  }

  /**
   * Perform bidirectional search (English ↔ Mi'kmaq)
   */
  async search(input: SearchInput): Promise<DictionaryApiResponse[]> {
    const params = new URLSearchParams();
    params.append('q', input.query);
    params.append('type', input.type);
    if (input.limit !== undefined) params.append('limit', input.limit.toString());
    if (input.partOfSpeech) params.append('partOfSpeech', input.partOfSpeech);

    const endpoint = `/api/v1/search?${params.toString()}`;
    return this.makeRequest<DictionaryApiResponse[]>(endpoint);
  }

  /**
   * Get dictionary statistics
   */
  async getStats(): Promise<DictionaryStats> {
    return this.makeRequest<DictionaryStats>('/api/v1/stats');
  }

  /**
   * Get available word types/grammatical categories
   */
  async getWordTypes(): Promise<{ wordTypes: string[] }> {
    return this.makeRequest<{ wordTypes: string[] }>('/api/v1/word-types');
  }

  /**
   * Check API health status
   */
  async healthCheck(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>('/api/v1/health');
  }

  /**
   * Test connection to the API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}
