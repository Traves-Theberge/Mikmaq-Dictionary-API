#!/usr/bin/env node

/**
 * Mi'kmaq Dictionary MCP Server
 * 
 * This Model Context Protocol server provides access to the Mi'kmaq dictionary
 * for AI models and applications to use in conversations and translations.
 * 
 * By our people, for our people. For the children and the elders.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  TextContent,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Types for Mi'kmaq dictionary data
interface MikmaqWord {
  word: string;
  type: string;
  definitions: string[];
  translations: string[];
  usages: Array<{
    translation: string;
    english: string;
  }>;
}

interface MikmaqDictionary {
  message: {
    meta: {
      name: string;
    };
    words: MikmaqWord[];
  };
}

class MikmaqDictionaryMCP {
  private dictionary: MikmaqWord[] = [];
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'mikmaq-dictionary-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.loadDictionary();
    this.setupHandlers();
  }

  private loadDictionary(): void {
    try {
      // Look for dictionary.json in the parent directory (relative to this MCP folder)
      const dictionaryPath = join(__dirname, '..', '..', 'dictionary.json');
      const data = readFileSync(dictionaryPath, 'utf-8');
      const parsedData: MikmaqDictionary = JSON.parse(data);
      
      this.dictionary = parsedData.message.words;
      console.error(`🏛️ Mi'kmaq Dictionary MCP: Loaded ${this.dictionary.length} words`);
    } catch (error) {
      console.error('❌ Error loading Mi\'kmaq dictionary:', error);
      throw new Error('Failed to load Mi\'kmaq dictionary');
    }
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'lookup_mikmaq_word',
            description: 'Look up a Mi\'kmaq word and get its English definitions and usage examples',
            inputSchema: {
              type: 'object',
              properties: {
                word: {
                  type: 'string',
                  description: 'The Mi\'kmaq word to look up',
                },
              },
              required: ['word'],
            },
          },
          {
            name: 'lookup_english_word',
            description: 'Find Mi\'kmaq translations for an English word',
            inputSchema: {
              type: 'object',
              properties: {
                word: {
                  type: 'string',
                  description: 'The English word to find Mi\'kmaq translations for',
                },
              },
              required: ['word'],
            },
          },
          {
            name: 'search_mikmaq_dictionary',
            description: 'Search the Mi\'kmaq dictionary with a query term',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search term to find in Mi\'kmaq words, definitions, or translations',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 10)',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_random_mikmaq_word',
            description: 'Get a random Mi\'kmaq word for learning purposes',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_dictionary_stats',
            description: 'Get statistics about the Mi\'kmaq dictionary',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ] satisfies Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: Missing arguments for tool call',
            },
          ],
          isError: true,
        };
      }

      try {
        switch (name) {
          case 'lookup_mikmaq_word':
            return await this.lookupMikmaqWord(args.word as string);

          case 'lookup_english_word':
            return await this.lookupEnglishWord(args.word as string);

          case 'search_mikmaq_dictionary':
            return await this.searchDictionary(
              args.query as string,
              (args.limit as number) || 10
            );

          case 'get_random_mikmaq_word':
            return await this.getRandomWord();

          case 'get_dictionary_stats':
            return await this.getDictionaryStats();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async lookupMikmaqWord(word: string): Promise<CallToolResult> {
    const normalizedWord = word.toLowerCase().trim();
    const matches = this.dictionary.filter(entry => 
      entry.word.toLowerCase() === normalizedWord
    );

    if (matches.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `🔍 No exact match found for Mi'kmaq word "${word}".\n\n💡 Try using the search_mikmaq_dictionary tool for broader results, or check the spelling.`,
          } as TextContent,
        ],
      };
    }

    const result = matches.map(entry => ({
      word: entry.word,
      type: entry.type,
      definitions: entry.definitions,
      translations: entry.translations,
      usages: entry.usages,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `🏛️ **Mi'kmaq Word Found**: ${word}\n\n` + JSON.stringify(result, null, 2),
        } as TextContent,
      ],
    };
  }

  private async lookupEnglishWord(word: string): Promise<CallToolResult> {
    const normalizedWord = word.toLowerCase().trim();
    const matches = this.dictionary.filter(entry =>
      entry.definitions.some(def => def.toLowerCase().includes(normalizedWord)) ||
      entry.translations.some(trans => trans.toLowerCase().includes(normalizedWord))
    );

    if (matches.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `🔍 No Mi'kmaq translations found for English word "${word}".\n\n💡 Try a different word or use search_mikmaq_dictionary for broader results.`,
          } as TextContent,
        ],
      };
    }

    const result = matches.slice(0, 10).map(entry => ({
      mikmaq_word: entry.word,
      type: entry.type,
      definitions: entry.definitions,
      translations: entry.translations,
      usages: entry.usages,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `🌊 **English → Mi'kmaq**: "${word}"\n\nFound ${matches.length} Mi'kmaq words:\n\n` + JSON.stringify(result, null, 2),
        } as TextContent,
      ],
    };
  }

  private async searchDictionary(query: string, limit: number): Promise<CallToolResult> {
    const normalizedQuery = query.toLowerCase().trim();
    const matches = this.dictionary.filter(entry =>
      entry.word.toLowerCase().includes(normalizedQuery) ||
      entry.definitions.some(def => def.toLowerCase().includes(normalizedQuery)) ||
      entry.translations.some(trans => trans.toLowerCase().includes(normalizedQuery)) ||
      entry.usages.some(usage => usage.english.toLowerCase().includes(normalizedQuery))
    );

    const result = matches.slice(0, limit).map(entry => ({
      word: entry.word,
      type: entry.type,
      definitions: entry.definitions,
      translations: entry.translations,
      relevance_score: this.calculateRelevance(entry, normalizedQuery),
    }));

    // Sort by relevance
    result.sort((a, b) => b.relevance_score - a.relevance_score);

    const searchResults = {
      query,
      total_matches: matches.length,
      results_shown: result.length,
      results: result.map(({ relevance_score, ...rest }) => rest),
    };

    return {
      content: [
        {
          type: 'text',
          text: `🔍 **Dictionary Search**: "${query}"\n\nFound ${matches.length} matches, showing top ${result.length}:\n\n` + JSON.stringify(searchResults, null, 2),
        } as TextContent,
      ],
    };
  }

  private calculateRelevance(entry: MikmaqWord, query: string): number {
    let score = 0;
    
    // Exact word match gets highest score
    if (entry.word.toLowerCase() === query) score += 100;
    else if (entry.word.toLowerCase().includes(query)) score += 50;
    
    // Definition matches
    entry.definitions.forEach(def => {
      if (def.toLowerCase() === query) score += 80;
      else if (def.toLowerCase().includes(query)) score += 30;
    });
    
    // Translation matches
    entry.translations.forEach(trans => {
      if (trans.toLowerCase().includes(query)) score += 20;
    });
    
    return score;
  }

  private async getRandomWord(): Promise<CallToolResult> {
    const randomIndex = Math.floor(Math.random() * this.dictionary.length);
    const randomWord = this.dictionary[randomIndex];

    return {
      content: [
        {
          type: 'text',
          text: `🎲 **Random Mi'kmaq Word for Learning**\n\n**${randomWord.word}** (${randomWord.type})\n\n` + JSON.stringify({
            word: randomWord.word,
            type: randomWord.type,
            definitions: randomWord.definitions,
            translations: randomWord.translations,
            usages: randomWord.usages,
          }, null, 2),
        } as TextContent,
      ],
    };
  }

  private async getDictionaryStats(): Promise<CallToolResult> {
    const wordTypes: { [key: string]: number } = {};
    
    this.dictionary.forEach(word => {
      wordTypes[word.type] = (wordTypes[word.type] || 0) + 1;
    });

    const stats = {
      total_words: this.dictionary.length,
      word_types: wordTypes,
      most_common_types: Object.entries(wordTypes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([type, count]) => ({ type, count })),
    };

    return {
      content: [
        {
          type: 'text',
          text: `📊 **Mi'kmaq Dictionary Statistics**\n\n🏛️ By our people, for our people. For the children and the elders.\n\n` + JSON.stringify(stats, null, 2),
        } as TextContent,
      ],
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🏛️ Mi\'kmaq Dictionary MCP Server started successfully');
    console.error('🌊 Ready to serve Mi\'kmaq language data to AI models');
    console.error('📚 By our people, for our people. For the children and the elders.');
  }
}

// Start the server
const server = new MikmaqDictionaryMCP();
server.start().catch((error) => {
  console.error('❌ Failed to start Mi\'kmaq Dictionary MCP server:', error);
  process.exit(1);
});
