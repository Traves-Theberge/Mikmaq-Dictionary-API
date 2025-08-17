import request from 'supertest';
import express from 'express';
import { DictionaryController } from '../../src/controllers/DictionaryController';
import { DictionaryService } from '../../src/services/DictionaryService';
import { mockDictionaryData } from '../setup';

// Mock the DictionaryService
jest.mock('../../src/services/DictionaryService');
const MockedDictionaryService = DictionaryService as jest.MockedClass<typeof DictionaryService>;

describe('DictionaryController', () => {
  let app: express.Application;
  let mockDictionaryService: jest.Mocked<DictionaryService>;
  let dictionaryController: DictionaryController;

  beforeEach(() => {
    // Create mock service instance
    mockDictionaryService = {
      findWord: jest.fn(),
      convertToApiFormat: jest.fn(),
      getStats: jest.fn(),
      getAllWordTypes: jest.fn(),
      getRandomWord: jest.fn(),
      searchEnglishToMikmaq: jest.fn(),
      searchMikmaqToEnglish: jest.fn(),
      findEnglishWord: jest.fn()
    } as any;

    // Mock the constructor to return our mock instance
    MockedDictionaryService.mockImplementation(() => mockDictionaryService);

    // Create controller and express app
    dictionaryController = new DictionaryController();
    app = express();
    app.use(express.json());

    // Setup routes
    app.get('/entries/mik/:word', dictionaryController.getWordDefinition);
    app.get('/entries/english/:word', dictionaryController.getEnglishWord);
    app.get('/entries/random', dictionaryController.getRandomWord);
    app.get('/search', dictionaryController.searchBidirectional);
    app.get('/stats', dictionaryController.getStats);
    app.get('/word-types', dictionaryController.getWordTypes);
    app.get('/health', dictionaryController.healthCheck);
    
    // Add 404 handler for testing
    app.use('*', (req, res) => {
      res.status(404).json({
        title: 'Not Found',
        message: 'The requested endpoint was not found.',
        resolution: 'Check the API documentation for available endpoints.'
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /entries/mik/:word', () => {
    it('should return word definition successfully', async () => {
      const mockWord = mockDictionaryData.message.words[0];
      const mockApiResponse = {
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
      };

      mockDictionaryService.findWord.mockReturnValue([mockWord]);
      mockDictionaryService.convertToApiFormat.mockReturnValue(mockApiResponse);

      const response = await request(app)
        .get('/entries/mik/agase\'wa\'latl')
        .expect(200);

      expect(response.body).toEqual([mockApiResponse]);
      expect(mockDictionaryService.findWord).toHaveBeenCalledWith(
        'agase\'wa\'latl',
        { exact: false, limit: 10, partOfSpeech: undefined }
      );
    });

    it('should handle query parameters correctly', async () => {
      const mockWord = mockDictionaryData.message.words[0];
      mockDictionaryService.findWord.mockReturnValue([mockWord]);
      mockDictionaryService.convertToApiFormat.mockReturnValue({} as any);

      await request(app)
        .get('/entries/mik/test?exact=true&limit=5&partOfSpeech=verb')
        .expect(200);

      expect(mockDictionaryService.findWord).toHaveBeenCalledWith(
        'test',
        { exact: true, limit: 5, partOfSpeech: 'verb' }
      );
    });

    it('should return 404 when word not found', async () => {
      mockDictionaryService.findWord.mockReturnValue([]);

      const response = await request(app)
        .get('/entries/mik/nonexistent')
        .expect(404);

      expect(response.body).toEqual({
        title: "No Definitions Found",
        message: 'Sorry pal, we couldn\'t find definitions for the word "nonexistent" in Mi\'kmaq.',
        resolution: "You can try the search again with different spelling or head to the web instead."
      });
    });

    it('should return 404 when word parameter is empty', async () => {
      const response = await request(app)
        .get('/entries/mik/')
        .expect(404);

      // This will hit Express's 404 handler, not our route handler
      expect(response.body.title).toBe("Not Found");
    });

    it('should handle service errors gracefully', async () => {
      mockDictionaryService.findWord.mockImplementation(() => {
        throw new Error('Service error');
      });

      const response = await request(app)
        .get('/entries/mik/test')
        .expect(500);

      expect(response.body).toEqual({
        title: "Internal Server Error",
        message: "An error occurred while processing your request.",
        resolution: "Please try again later or contact support."
      });
    });
  });

  describe('GET /stats', () => {
    it('should return dictionary statistics', async () => {
      const mockStats = {
        totalWords: 6581,
        wordTypes: {
          'verb animate intransitive': 2090,
          'verb animate transitive': 1021
        }
      };

      mockDictionaryService.getStats.mockReturnValue(mockStats);

      const response = await request(app)
        .get('/stats')
        .expect(200);

      expect(response.body).toEqual(mockStats);
      expect(mockDictionaryService.getStats).toHaveBeenCalled();
    });

    it('should handle stats service error', async () => {
      mockDictionaryService.getStats.mockImplementation(() => {
        throw new Error('Stats error');
      });

      const response = await request(app)
        .get('/stats')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /word-types', () => {
    it('should return available word types', async () => {
      const mockWordTypes = [
        'noun animate',
        'verb animate intransitive',
        'verb animate transitive'
      ];

      mockDictionaryService.getAllWordTypes.mockReturnValue(mockWordTypes);

      const response = await request(app)
        .get('/word-types')
        .expect(200);

      expect(response.body).toEqual({ wordTypes: mockWordTypes });
      expect(mockDictionaryService.getAllWordTypes).toHaveBeenCalled();
    });

    it('should handle word types service error', async () => {
      mockDictionaryService.getAllWordTypes.mockImplementation(() => {
        throw new Error('Word types error');
      });

      const response = await request(app)
        .get('/word-types')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /entries/random', () => {
    it('should return a random word', async () => {
      const mockWord = mockDictionaryData.message.words[0];
      const mockApiResponse = {
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
      };

      mockDictionaryService.getRandomWord.mockReturnValue(mockWord);
      mockDictionaryService.convertToApiFormat.mockReturnValue(mockApiResponse);

      const response = await request(app)
        .get('/entries/random')
        .expect(200);

      expect(response.body).toEqual(mockApiResponse);
      expect(mockDictionaryService.getRandomWord).toHaveBeenCalled();
    });

    it('should handle random word service error', async () => {
      mockDictionaryService.getRandomWord.mockImplementation(() => {
        throw new Error('Random word error');
      });

      const response = await request(app)
        .get('/entries/random')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /entries/english/:word', () => {
    it('should return Mi\'kmaq translations for English word', async () => {
      const mockWord = mockDictionaryData.message.words[1]; // aloqoman (grape)
      const mockApiResponse = {
        word: "aloqoman",
        phonetic: undefined,
        phonetics: [],
        origin: undefined,
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [{
            definition: 'grape',
            example: 'Where do grapes grow?',
            synonyms: [],
            antonyms: []
          }]
        }]
      };

      mockDictionaryService.findEnglishWord.mockReturnValue([mockWord]);
      mockDictionaryService.convertToApiFormat.mockReturnValue(mockApiResponse);

      const response = await request(app)
        .get('/entries/english/grape')
        .expect(200);

      expect(response.body).toEqual([mockApiResponse]);
      expect(mockDictionaryService.findEnglishWord).toHaveBeenCalledWith(
        'grape',
        { limit: 10, partOfSpeech: undefined }
      );
    });

    it('should handle query parameters for English lookup', async () => {
      const mockWord = mockDictionaryData.message.words[1];
      mockDictionaryService.findEnglishWord.mockReturnValue([mockWord]);
      mockDictionaryService.convertToApiFormat.mockReturnValue({} as any);

      await request(app)
        .get('/entries/english/grape?limit=5&partOfSpeech=noun')
        .expect(200);

      expect(mockDictionaryService.findEnglishWord).toHaveBeenCalledWith(
        'grape',
        { limit: 5, partOfSpeech: 'noun' }
      );
    });

    it('should return 404 when no Mi\'kmaq translations found', async () => {
      mockDictionaryService.findEnglishWord.mockReturnValue([]);

      const response = await request(app)
        .get('/entries/english/nonexistent')
        .expect(404);

      expect(response.body).toEqual({
        title: "No Mi'kmaq Translations Found",
        message: 'Sorry, we couldn\'t find Mi\'kmaq translations for the English word "nonexistent".',
        resolution: "Try different spelling or related words."
      });
    });
  });

  describe('GET /search', () => {
    it('should perform English to Mi\'kmaq search', async () => {
      const mockWord = mockDictionaryData.message.words[1];
      const mockApiResponse = {
        word: "aloqoman",
        phonetic: undefined,
        phonetics: [],
        origin: undefined,
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [{
            definition: 'grape',
            example: 'Where do grapes grow?',
            synonyms: [],
            antonyms: []
          }]
        }]
      };

      mockDictionaryService.searchEnglishToMikmaq.mockReturnValue([mockWord]);
      mockDictionaryService.convertToApiFormat.mockReturnValue(mockApiResponse);

      const response = await request(app)
        .get('/search?q=grape&type=english-to-mikmaq')
        .expect(200);

      expect(response.body).toEqual([mockApiResponse]);
      expect(mockDictionaryService.searchEnglishToMikmaq).toHaveBeenCalledWith(
        'grape',
        { limit: 10, partOfSpeech: undefined }
      );
    });

    it('should perform Mi\'kmaq to English search', async () => {
      const mockWord = mockDictionaryData.message.words[1];
      const mockApiResponse = {
        word: "aloqoman",
        phonetic: undefined,
        phonetics: [],
        origin: undefined,
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [{
            definition: 'grape',
            example: 'Where do grapes grow?',
            synonyms: [],
            antonyms: []
          }]
        }]
      };

      mockDictionaryService.searchMikmaqToEnglish.mockReturnValue([mockWord]);
      mockDictionaryService.convertToApiFormat.mockReturnValue(mockApiResponse);

      const response = await request(app)
        .get('/search?q=aloqoman&type=mikmaq-to-english')
        .expect(200);

      expect(response.body).toEqual([mockApiResponse]);
      expect(mockDictionaryService.searchMikmaqToEnglish).toHaveBeenCalledWith(
        'aloqoman',
        { limit: 10, partOfSpeech: undefined }
      );
    });

    it('should return 400 for missing parameters', async () => {
      const response = await request(app)
        .get('/search?q=test')
        .expect(400);

      expect(response.body).toEqual({
        title: "Missing Parameters",
        message: "Both 'q' (query) and 'type' parameters are required.",
        resolution: "Use type 'english-to-mikmaq' or 'mikmaq-to-english'."
      });
    });

    it('should return 400 for invalid search type', async () => {
      const response = await request(app)
        .get('/search?q=test&type=invalid-type')
        .expect(400);

      expect(response.body).toEqual({
        title: "Invalid Search Type",
        message: 'Search type "invalid-type" is not supported.',
        resolution: "Use type 'english-to-mikmaq' or 'mikmaq-to-english'."
      });
    });

    it('should return 404 when no search results found', async () => {
      mockDictionaryService.searchEnglishToMikmaq.mockReturnValue([]);

      const response = await request(app)
        .get('/search?q=nonexistent&type=english-to-mikmaq')
        .expect(404);

      expect(response.body).toEqual({
        title: "No Results Found",
        message: 'No results found for "nonexistent" with search type "english-to-mikmaq".',
        resolution: "Try different search terms or check your spelling."
      });
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        message: 'Mi\'kmaq Dictionary API is running',
        version: '1.0.0'
      });
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
