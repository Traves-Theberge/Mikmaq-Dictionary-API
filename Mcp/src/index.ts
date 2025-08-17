#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { MikmaqDictionaryAPIClient } from './dictionary-client.js';

// Environment configuration
const API_BASE_URL = process.env.MIKMAQ_API_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(process.env.MIKMAQ_API_TIMEOUT || '10000');

// Initialize the dictionary API client
const dictionaryClient = new MikmaqDictionaryAPIClient({
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT
});

// Input validation schemas
const LookupWordSchema = z.object({
  word: z.string().min(1, 'Word cannot be empty'),
  exact: z.boolean().optional(),
  limit: z.number().min(1).max(50).optional(),
  partOfSpeech: z.string().optional()
});

const SearchSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  type: z.enum(['english-to-mikmaq', 'mikmaq-to-english']),
  limit: z.number().min(1).max(50).optional(),
  partOfSpeech: z.string().optional()
});

// Create the MCP server
const server = new Server(
  {
    name: 'mikmaq-dictionary-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to format dictionary results for display
function formatDictionaryResults(results: any[], searchTerm: string, searchType: string): string {
  if (results.length === 0) {
    return `No results found for "${searchTerm}" in ${searchType} search.`;
  }

  let output = `Found ${results.length} result(s) for "${searchTerm}":\n\n`;
  
  results.forEach((entry, index) => {
    output += `${index + 1}. **${entry.word}** (${entry.meanings[0]?.partOfSpeech || 'unknown'})\n`;
    
    entry.meanings.forEach((meaning: any) => {
      meaning.definitions.forEach((def: any) => {
        output += `   • ${def.definition}\n`;
        if (def.example) {
          output += `     Example: "${def.example}"\n`;
        }
      });
    });
    output += '\n';
  });

  return output;
}

// Register MCP tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'lookup_mikmaq_word',
        description: 'Look up a Mi\'kmaq word and get its English definitions and translations',
        inputSchema: {
          type: 'object',
          properties: {
            word: {
              type: 'string',
              description: 'The Mi\'kmaq word to look up'
            },
            exact: {
              type: 'boolean',
              description: 'Whether to perform exact match only (default: false)',
              default: false
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (1-50, default: 10)',
              minimum: 1,
              maximum: 50,
              default: 10
            },
            partOfSpeech: {
              type: 'string',
              description: 'Filter by grammatical type (e.g., "noun animate", "verb animate transitive")'
            }
          },
          required: ['word']
        }
      },
      {
        name: 'lookup_english_word',
        description: 'Look up an English word and find its Mi\'kmaq translations',
        inputSchema: {
          type: 'object',
          properties: {
            word: {
              type: 'string',
              description: 'The English word to find Mi\'kmaq translations for'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (1-50, default: 10)',
              minimum: 1,
              maximum: 50,
              default: 10
            },
            partOfSpeech: {
              type: 'string',
              description: 'Filter by grammatical type (e.g., "noun animate", "verb animate transitive")'
            }
          },
          required: ['word']
        }
      },
      {
        name: 'search_dictionary',
        description: 'Perform bidirectional search in the Mi\'kmaq dictionary (English ↔ Mi\'kmaq)',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query'
            },
            type: {
              type: 'string',
              enum: ['english-to-mikmaq', 'mikmaq-to-english'],
              description: 'Search direction: "english-to-mikmaq" or "mikmaq-to-english"'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (1-50, default: 10)',
              minimum: 1,
              maximum: 50,
              default: 10
            },
            partOfSpeech: {
              type: 'string',
              description: 'Filter by grammatical type'
            }
          },
          required: ['query', 'type']
        }
      },
      {
        name: 'get_random_word',
        description: 'Get a random Mi\'kmaq word for learning and practice',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'get_dictionary_stats',
        description: 'Get statistics about the Mi\'kmaq dictionary (total words, word type distribution)',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'get_word_types',
        description: 'Get all available grammatical word types in the Mi\'kmaq dictionary',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'lookup_mikmaq_word': {
        const input = LookupWordSchema.parse(args);
        const results = await dictionaryClient.lookupMikmaqWord(input);
        
        return {
          content: [
            {
              type: 'text',
              text: formatDictionaryResults(results, input.word, 'Mi\'kmaq word lookup')
            }
          ]
        };
      }

      case 'lookup_english_word': {
        const input = LookupWordSchema.parse(args);
        const results = await dictionaryClient.lookupEnglishWord(input);
        
        return {
          content: [
            {
              type: 'text',
              text: formatDictionaryResults(results, input.word, 'English word lookup')
            }
          ]
        };
      }

      case 'search_dictionary': {
        const input = SearchSchema.parse(args);
        const results = await dictionaryClient.search(input);
        
        const searchTypeDisplay = input.type === 'english-to-mikmaq' 
          ? 'English → Mi\'kmaq' 
          : 'Mi\'kmaq → English';
        
        return {
          content: [
            {
              type: 'text',
              text: formatDictionaryResults(results, input.query, `${searchTypeDisplay} search`)
            }
          ]
        };
      }

      case 'get_random_word': {
        const result = await dictionaryClient.getRandomWord();
        
        let output = `**Random Mi'kmaq Word:** ${result.word}\n\n`;
        output += `**Part of Speech:** ${result.meanings[0]?.partOfSpeech || 'unknown'}\n\n`;
        
        result.meanings.forEach((meaning) => {
          meaning.definitions.forEach((def) => {
            output += `**Definition:** ${def.definition}\n`;
            if (def.example) {
              output += `**Example:** "${def.example}"\n`;
            }
          });
        });

        output += `\n*Perfect for daily Mi'kmaq language learning!*`;
        
        return {
          content: [
            {
              type: 'text',
              text: output
            }
          ]
        };
      }

      case 'get_dictionary_stats': {
        const stats = await dictionaryClient.getStats();
        
        let output = `**Mi'kmaq Dictionary Statistics**\n\n`;
        output += `**Total Words:** ${stats.totalWords.toLocaleString()}\n\n`;
        output += `**Word Type Distribution:**\n`;
        
        // Sort word types by count (descending)
        const sortedTypes = Object.entries(stats.wordTypes)
          .sort(([,a], [,b]) => (b as number) - (a as number));
        
        sortedTypes.forEach(([type, count]) => {
          const percentage = ((count / stats.totalWords) * 100).toFixed(1);
          output += `• ${type}: ${count.toLocaleString()} (${percentage}%)\n`;
        });

        return {
          content: [
            {
              type: 'text',
              text: output
            }
          ]
        };
      }

      case 'get_word_types': {
        const result = await dictionaryClient.getWordTypes();
        
        let output = `**Available Mi'kmaq Grammatical Word Types:**\n\n`;
        result.wordTypes.forEach((type, index) => {
          output += `${index + 1}. ${type}\n`;
        });
        
        output += `\n*Use these types with the partOfSpeech parameter to filter search results.*`;
        
        return {
          content: [
            {
              type: 'text',
              text: output
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`Invalid input: ${errorMessages}`);
    }
    
    // Re-throw other errors
    throw error;
  }
});

// Start the server
async function main() {
  // Test connection to the dictionary API on startup
  console.error('🚀 Starting Mi\'kmaq Dictionary MCP Server...');
  
  try {
    const isConnected = await dictionaryClient.testConnection();
    if (isConnected) {
      console.error('✅ Successfully connected to Mi\'kmaq Dictionary API');
    } else {
      console.error('⚠️  Warning: Could not connect to Mi\'kmaq Dictionary API');
      console.error(`   Make sure the API is running at: ${API_BASE_URL}`);
    }
  } catch (error) {
    console.error('❌ Error testing API connection:', error);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('🔗 MCP Server connected and ready for Mi\'kmaq language queries!');
  console.error('📚 Available tools: lookup_mikmaq_word, lookup_english_word, search_dictionary, get_random_word, get_dictionary_stats, get_word_types');
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  console.error('\n👋 Shutting down Mi\'kmaq Dictionary MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('\n👋 Shutting down Mi\'kmaq Dictionary MCP Server...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error('Fatal error starting MCP server:', error);
  process.exit(1);
});
