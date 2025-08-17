import express from 'express';
import { setupMiddleware } from './middleware';
import dictionaryRoutes from './routes/dictionary';

const app = express();
const PORT = process.env.PORT || 3000;

// Setup middleware
setupMiddleware(app);

// API Routes
app.use('/api/v1', dictionaryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Mi\'kmaq Dictionary API',
    version: '1.0.0',
    description: 'A comprehensive RESTful API for Mi\'kmaq language dictionary lookups with bidirectional search',
    endpoints: {
      // Dictionary lookups
      'GET /api/v1/entries/mik/<word>': 'Get Mi\'kmaq word definitions and translations',
      'GET /api/v1/entries/english/<word>': 'Find Mi\'kmaq translations of English words',
      'GET /api/v1/entries/random': 'Get a random Mi\'kmaq word for learning',
      
      // Search endpoints
      'GET /api/v1/search?q=<query>&type=english-to-mikmaq': 'Search English to Mi\'kmaq',
      'GET /api/v1/search?q=<query>&type=mikmaq-to-english': 'Search Mi\'kmaq to English',
      
      // Utility endpoints
      'GET /api/v1/stats': 'Get dictionary statistics',
      'GET /api/v1/word-types': 'Get available grammatical word types',
      'GET /api/v1/health': 'Health check endpoint'
    },
    examples: {
      mikmaqLookup: '/api/v1/entries/mik/aloqoman',
      englishLookup: '/api/v1/entries/english/water',
      randomWord: '/api/v1/entries/random',
      englishToMikmaq: '/api/v1/search?q=water&type=english-to-mikmaq&limit=5',
      mikmaqToEnglish: '/api/v1/search?q=samqwan&type=mikmaq-to-english'
    },
    parameters: {
      exact: 'boolean - exact match only (default: false)',
      limit: 'number - max results to return (default: 10)',
      partOfSpeech: 'string - filter by grammatical type',
      q: 'string - search query (required for search endpoints)',
      type: 'string - search direction: "english-to-mikmaq" or "mikmaq-to-english"'
    },
    statistics: {
      totalWords: '6,581 Mi\'kmaq words',
      verbCategories: '4,731 entries (72%)',
      nounCategories: '1,602 entries (24%)',
      otherCategories: '248 entries (4%)'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    title: 'Not Found',
    message: 'The requested endpoint was not found.',
    resolution: 'Check the API documentation for available endpoints.'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    title: 'Internal Server Error',
    message: 'An unexpected error occurred.',
    resolution: 'Please try again later or contact support.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mi'kmaq Dictionary API is running on port ${PORT}`);
  console.log(`📖 Access the API at http://localhost:${PORT}`);
  console.log(`🔍 Example: http://localhost:${PORT}/api/v1/entries/mik/hello`);
});

export default app;
