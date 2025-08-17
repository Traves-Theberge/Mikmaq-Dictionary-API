import { Request, Response } from 'express';
import { DictionaryService } from '../services/DictionaryService';
import { ErrorResponse, SearchOptions, MikmaqWord } from '../types/dictionary';

export class DictionaryController {
  private dictionaryService: DictionaryService;

  constructor() {
    this.dictionaryService = new DictionaryService();
  }

  public getWordDefinition = async (req: Request, res: Response): Promise<void> => {
    try {
      const { word } = req.params;
      const { exact, limit, partOfSpeech } = req.query;

      if (!word || word.trim().length === 0) {
        const errorResponse: ErrorResponse = {
          title: "No Definitions Found",
          message: "Sorry pal, we couldn't find definitions for the word you were looking for.",
          resolution: "You can try the search again at later time or head to the web instead."
        };
        res.status(404).json(errorResponse);
        return;
      }

      const searchOptions: SearchOptions = {
        exact: exact === 'true',
        limit: limit ? parseInt(limit as string, 10) : 10,
        partOfSpeech: partOfSpeech as string
      };

      const mikmaqWords = this.dictionaryService.findWord(word, searchOptions);

      if (mikmaqWords.length === 0) {
        const errorResponse: ErrorResponse = {
          title: "No Definitions Found",
          message: `Sorry pal, we couldn't find definitions for the word "${word}" in Mi'kmaq.`,
          resolution: "You can try the search again with different spelling or head to the web instead."
        };
        res.status(404).json(errorResponse);
        return;
      }

      // Convert to API format
      const apiResponse = mikmaqWords.map(mikmaqWord => 
        this.dictionaryService.convertToApiFormat(mikmaqWord)
      );

      res.json(apiResponse);
    } catch (error) {
      console.error('Error in getWordDefinition:', error);
      const errorResponse: ErrorResponse = {
        title: "Internal Server Error",
        message: "An error occurred while processing your request.",
        resolution: "Please try again later or contact support."
      };
      res.status(500).json(errorResponse);
    }
  };

  public getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = this.dictionaryService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getWordTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const wordTypes = this.dictionaryService.getAllWordTypes();
      res.json({ wordTypes });
    } catch (error) {
      console.error('Error in getWordTypes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getRandomWord = async (req: Request, res: Response): Promise<void> => {
    try {
      const randomWord = this.dictionaryService.getRandomWord();
      const apiResponse = this.dictionaryService.convertToApiFormat(randomWord);
      res.json(apiResponse);
    } catch (error) {
      console.error('Error in getRandomWord:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public searchBidirectional = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q, type } = req.query;
      const { limit, partOfSpeech } = req.query;

      if (!q || !type) {
        const errorResponse: ErrorResponse = {
          title: "Missing Parameters",
          message: "Both 'q' (query) and 'type' parameters are required.",
          resolution: "Use type 'english-to-mikmaq' or 'mikmaq-to-english'."
        };
        res.status(400).json(errorResponse);
        return;
      }

      const searchOptions: SearchOptions = {
        limit: limit ? parseInt(limit as string, 10) : 10,
        partOfSpeech: partOfSpeech as string
      };

      let mikmaqWords: MikmaqWord[] = [];

      if (type === 'english-to-mikmaq') {
        mikmaqWords = this.dictionaryService.searchEnglishToMikmaq(q as string, searchOptions);
      } else if (type === 'mikmaq-to-english') {
        mikmaqWords = this.dictionaryService.searchMikmaqToEnglish(q as string, searchOptions);
      } else {
        const errorResponse: ErrorResponse = {
          title: "Invalid Search Type",
          message: `Search type "${type}" is not supported.`,
          resolution: "Use type 'english-to-mikmaq' or 'mikmaq-to-english'."
        };
        res.status(400).json(errorResponse);
        return;
      }

      if (mikmaqWords.length === 0) {
        const errorResponse: ErrorResponse = {
          title: "No Results Found",
          message: `No results found for "${q}" with search type "${type}".`,
          resolution: "Try different search terms or check your spelling."
        };
        res.status(404).json(errorResponse);
        return;
      }

      const apiResponse = mikmaqWords.map(word => 
        this.dictionaryService.convertToApiFormat(word)
      );

      res.json(apiResponse);
    } catch (error) {
      console.error('Error in searchBidirectional:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getEnglishWord = async (req: Request, res: Response): Promise<void> => {
    try {
      const { word } = req.params;
      const { limit, partOfSpeech } = req.query;

      if (!word || word.trim().length === 0) {
        const errorResponse: ErrorResponse = {
          title: "No Word Provided",
          message: "Please provide an English word to search for.",
          resolution: "Include an English word in the URL path."
        };
        res.status(404).json(errorResponse);
        return;
      }

      const searchOptions: SearchOptions = {
        limit: limit ? parseInt(limit as string, 10) : 10,
        partOfSpeech: partOfSpeech as string
      };

      const mikmaqWords = this.dictionaryService.findEnglishWord(word, searchOptions);

      if (mikmaqWords.length === 0) {
        const errorResponse: ErrorResponse = {
          title: "No Mi'kmaq Translations Found",
          message: `Sorry, we couldn't find Mi'kmaq translations for the English word "${word}".`,
          resolution: "Try different spelling or related words."
        };
        res.status(404).json(errorResponse);
        return;
      }

      const apiResponse = mikmaqWords.map(mikmaqWord => 
        this.dictionaryService.convertToApiFormat(mikmaqWord)
      );

      res.json(apiResponse);
    } catch (error) {
      console.error('Error in getEnglishWord:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public healthCheck = async (req: Request, res: Response): Promise<void> => {
    res.json({
      status: 'healthy',
      message: 'Mi\'kmaq Dictionary API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  };
}
