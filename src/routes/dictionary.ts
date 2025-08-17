import { Router } from 'express';
import { DictionaryController } from '../controllers/DictionaryController';

const router = Router();
const dictionaryController = new DictionaryController();

// Main dictionary endpoints
router.get('/entries/mik/:word', dictionaryController.getWordDefinition);
router.get('/entries/english/:word', dictionaryController.getEnglishWord);
router.get('/entries/random', dictionaryController.getRandomWord);

// Search endpoints
router.get('/search', dictionaryController.searchBidirectional);

// Utility endpoints
router.get('/stats', dictionaryController.getStats);
router.get('/word-types', dictionaryController.getWordTypes);
router.get('/health', dictionaryController.healthCheck);

export default router;
