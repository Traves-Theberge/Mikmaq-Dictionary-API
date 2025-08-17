import request from 'supertest';
import app from '../../src/index';

// Integration tests that test the full API stack
describe('API Integration Tests', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Mi\'kmaq Dictionary API',
        version: '1.0.0',
        description: 'A comprehensive RESTful API for Mi\'kmaq language dictionary lookups with bidirectional search',
        endpoints: expect.any(Object),
        examples: expect.any(Object)
      });
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return health check', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        message: 'Mi\'kmaq Dictionary API is running',
        version: '1.0.0'
      });
    });
  });

  describe('GET /api/v1/stats', () => {
    it('should return dictionary statistics', async () => {
      const response = await request(app)
        .get('/api/v1/stats')
        .expect(200);

      expect(response.body).toMatchObject({
        totalWords: expect.any(Number),
        wordTypes: expect.any(Object)
      });

      expect(response.body.totalWords).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/word-types', () => {
    it('should return available word types', async () => {
      const response = await request(app)
        .get('/api/v1/word-types')
        .expect(200);

      expect(response.body).toHaveProperty('wordTypes');
      expect(Array.isArray(response.body.wordTypes)).toBe(true);
      expect(response.body.wordTypes.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/entries/mik/:word', () => {
    it('should find existing Mi\'kmaq word', async () => {
      const response = await request(app)
        .get('/api/v1/entries/mik/agase\'wa\'latl')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const firstResult = response.body[0];
      expect(firstResult).toMatchObject({
        word: expect.any(String),
        meanings: expect.any(Array)
      });

      expect(firstResult.meanings[0]).toMatchObject({
        partOfSpeech: expect.any(String),
        definitions: expect.any(Array)
      });
    });

    it('should handle exact search parameter', async () => {
      const response = await request(app)
        .get('/api/v1/entries/mik/agase\'wa\'latl?exact=true')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].word).toBe('agase\'wa\'latl');
      }
    });

    it('should handle limit parameter', async () => {
      const response = await request(app)
        .get('/api/v1/entries/mik/a?limit=3')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(3);
    });

    it('should return 404 for non-existent word', async () => {
      const response = await request(app)
        .get('/api/v1/entries/mik/xyznonsenseword123')
        .expect(404);

      expect(response.body).toMatchObject({
        title: "No Definitions Found",
        message: expect.stringContaining('xyznonsenseword123'),
        resolution: expect.any(String)
      });
    });
  });

  describe('GET /api/v1/entries/english/:word', () => {
    it('should find Mi\'kmaq translations for English words', async () => {
      const response = await request(app)
        .get('/api/v1/entries/english/water')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const firstResult = response.body[0];
      expect(firstResult).toMatchObject({
        word: expect.any(String),
        meanings: expect.any(Array)
      });

      // Should find samqwan (water in Mi'kmaq)
      expect(firstResult.word).toBe('samqwan');
    });

    it('should return 404 for English words with no Mi\'kmaq translations', async () => {
      const response = await request(app)
        .get('/api/v1/entries/english/xyznonsenseword123')
        .expect(404);

      expect(response.body).toMatchObject({
        title: "No Mi'kmaq Translations Found",
        message: expect.stringContaining('xyznonsenseword123'),
        resolution: expect.any(String)
      });
    });
  });

  describe('GET /api/v1/entries/random', () => {
    it('should return a random Mi\'kmaq word', async () => {
      const response = await request(app)
        .get('/api/v1/entries/random')
        .expect(200);

      expect(response.body).toMatchObject({
        word: expect.any(String),
        meanings: expect.any(Array)
      });

      expect(response.body.meanings[0]).toMatchObject({
        partOfSpeech: expect.any(String),
        definitions: expect.any(Array)
      });
    });

    it('should return different words on multiple calls', async () => {
      const words = new Set();
      
      // Get 5 random words
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .get('/api/v1/entries/random')
          .expect(200);
        words.add(response.body.word);
      }

      // Should get at least 2 different words in 5 tries (probabilistic)
      expect(words.size).toBeGreaterThan(1);
    });
  });

  describe('GET /api/v1/search', () => {
    it('should perform English to Mi\'kmaq search', async () => {
      const response = await request(app)
        .get('/api/v1/search?q=water&type=english-to-mikmaq&limit=3')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.length).toBeLessThanOrEqual(3);
      
      const firstResult = response.body[0];
      expect(firstResult).toMatchObject({
        word: expect.any(String),
        meanings: expect.any(Array)
      });
    });

    it('should perform Mi\'kmaq to English search', async () => {
      const response = await request(app)
        .get('/api/v1/search?q=samqwan&type=mikmaq-to-english')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const firstResult = response.body[0];
      expect(firstResult.word).toBe('samqwan');
    });

    it('should return 400 for missing query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/search?q=test')
        .expect(400);

      expect(response.body).toMatchObject({
        title: "Missing Parameters",
        message: expect.stringContaining('required'),
        resolution: expect.any(String)
      });
    });

    it('should return 400 for invalid search type', async () => {
      const response = await request(app)
        .get('/api/v1/search?q=test&type=invalid')
        .expect(400);

      expect(response.body).toMatchObject({
        title: "Invalid Search Type",
        message: expect.stringContaining('invalid'),
        resolution: expect.any(String)
      });
    });

    it('should return 404 for search with no results', async () => {
      const response = await request(app)
        .get('/api/v1/search?q=xyznonsenseword123&type=english-to-mikmaq')
        .expect(404);

      expect(response.body).toMatchObject({
        title: "No Results Found",
        message: expect.stringContaining('xyznonsenseword123'),
        resolution: expect.any(String)
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/api/v1/nonexistent')
        .expect(404);

      expect(response.body).toMatchObject({
        title: 'Not Found',
        message: 'The requested endpoint was not found.',
        resolution: expect.any(String)
      });
    });

    it('should handle malformed requests gracefully', async () => {
      const response = await request(app)
        .get('/api/v1/entries/mik/')
        .expect(404);

      expect(response.body.title).toBe('Not Found');
    });
  });

  describe('CORS and Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      // Helmet adds various security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });
});
