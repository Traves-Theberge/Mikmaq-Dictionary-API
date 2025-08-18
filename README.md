<div align="center">
  <img src="Mikmaq_State_Flag.png" alt="Mi'kmaq Nation Flag" width="400" style="margin: 20px 0;">
</div>

# Mi'kmaq Dictionary API & MCP

A comprehensive RESTful API for Mi'kmaq language dictionary lookups with bidirectional search capabilities, built with TypeScript and Express.js. This API provides access to over 6,500 Mi'kmaq words with definitions, translations, and usage examples.

**By our people, for our people. For the children and the elders.**

This digital resource serves the Mi'kmaq community in preserving and revitalizing L'nu'k (our language) for future generations.

## 🌟 Features

- 🔄 **Bidirectional Search**: English ↔ Mi'kmaq translation in both directions
- 🎯 **Random Word Learning**: Get random Mi'kmaq words for daily learning
- 🔍 **Advanced Search**: Fuzzy search, exact matches, and filtered results
- 📚 **Rich Linguistic Data**: Definitions, translations, usage examples, and grammatical types
- 🏷️ **Grammatical Classification**: Proper Mi'kmaq linguistic categories (animate/inanimate, transitive/intransitive)
- 🚀 **High Performance**: In-memory indexing for sub-millisecond lookups
- 🐳 **Docker Ready**: Complete containerization with Docker Compose
- 🛡️ **Production Security**: Rate limiting, CORS, security headers, and health monitoring
- 📊 **Analytics**: Comprehensive dictionary statistics and insights
- 🧪 **Fully Tested**: 71 comprehensive tests with 100% core functionality coverage
- 🔌 **MCP Integration**: Model Context Protocol server for seamless IDE integration (Cursor, VS Code)
- 🤖 **AI Assistant Ready**: Direct access to Mi'kmaq dictionary through AI coding assistants

## 📚 Complete API Reference

### 🔍 Dictionary Lookup Endpoints

#### 1. Mi'kmaq Word Lookup
```
GET /api/v1/entries/mik/<word>
```
Find English definitions and translations for Mi'kmaq words.

**Example:**
```bash
curl "http://localhost:3000/api/v1/entries/mik/samqwan"
```

#### 2. English Word Lookup ✨ **NEW**
```
GET /api/v1/entries/english/<word>
```
Find Mi'kmaq translations for English words.

**Example:**
```bash
curl "http://localhost:3000/api/v1/entries/english/water"
# Returns: samqwan (Mi'kmaq word for water)
```

#### 3. Random Word for Learning ✨ **NEW**
```
GET /api/v1/entries/random
```
Get a random Mi'kmaq word - perfect for daily language learning!

**Example:**
```bash
curl "http://localhost:3000/api/v1/entries/random"
```

### 🔍 Bidirectional Search Endpoints ✨ **NEW**

#### 4. English to Mi'kmaq Search
```
GET /api/v1/search?q=<query>&type=english-to-mikmaq
```
Search for Mi'kmaq words using English terms.

**Example:**
```bash
curl "http://localhost:3000/api/v1/search?q=water&type=english-to-mikmaq&limit=5"
```

#### 5. Mi'kmaq to English Search
```
GET /api/v1/search?q=<query>&type=mikmaq-to-english
```
Search for English definitions using Mi'kmaq terms.

**Example:**
```bash
curl "http://localhost:3000/api/v1/search?q=samqwan&type=mikmaq-to-english"
```

### 🛠️ Utility Endpoints

- `GET /api/v1/stats` - Dictionary statistics and word counts
- `GET /api/v1/word-types` - Available grammatical categories
- `GET /api/v1/health` - Health check and API status
- `GET /` - Complete API documentation and examples

## 📋 Query Parameters

All endpoints support these optional parameters:

- **`exact`** (boolean): Exact match only (default: false)
- **`limit`** (number): Maximum results to return (default: 10)
- **`partOfSpeech`** (string): Filter by grammatical type
- **`q`** (string): Search query (required for search endpoints)
- **`type`** (string): Search direction - "english-to-mikmaq" or "mikmaq-to-english"

## 📊 Example API Response

```json
[
  {
    "word": "samqwan",
    "phonetic": null,
    "phonetics": [],
    "origin": null,
    "meanings": [
      {
        "partOfSpeech": "noun",
        "definitions": [
          {
            "definition": "water",
            "example": "Nowhere is there better tasting water than in Listuguj.",
            "synonyms": [],
            "antonyms": []
          }
        ]
      }
    ]
  }
]
```

## 🔌 MCP Integration (Model Context Protocol)

The Mi'kmaq Dictionary API includes a **Model Context Protocol (MCP) server** that enables seamless integration with AI-powered IDEs like Cursor, allowing AI assistants to directly access Mi'kmaq language resources during development.

### 🌟 MCP Features

- **7 MCP Tools** for comprehensive Mi'kmaq dictionary access
- **IDE Integration**: Works with Cursor, VS Code, and other MCP-compatible editors
- **AI Assistant Access**: Enable AI coding assistants to lookup, translate, and learn Mi'kmaq words
- **Docker Ready**: Containerized MCP server with automatic API connectivity
- **Real-time Access**: Direct API integration without additional configuration

### 🛠️ Available MCP Tools

1. **`lookup_mikmaq_word`** - Look up Mi'kmaq words and get English definitions
2. **`lookup_english_word`** - Find Mi'kmaq translations for English words  
3. **`search_dictionary`** - Bidirectional fuzzy search (English ↔ Mi'kmaq)
4. **`get_random_word`** - Get random Mi'kmaq words for learning
5. **`get_dictionary_stats`** - View dictionary statistics and word counts
6. **`get_word_types`** - List all grammatical categories
7. **`check_api_health`** - Monitor API status and connectivity

### 🚀 Quick MCP Setup

#### Option 1: Docker Compose (Recommended)

```bash
# Start both API and MCP server together
docker-compose up -d

# The MCP server will be available for IDE integration
# API: http://localhost:3000
# MCP: Ready for IDE connection
```

#### Option 2: Local Development

```bash
# Start the dictionary API first
npm run dev

# In a separate terminal, start the MCP server
cd Mcp
npm install
npm run build
npm start
```

### 🔧 Cursor IDE Configuration

Add this to your Cursor MCP settings (`~/.cursor/mcp_servers.json` or workspace settings):

**For Docker deployment:**
```json
{
  "mcpServers": {
    "mikmaq-dictionary": {
      "description": "Mi'kmaq Dictionary API integration for language preservation and learning",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--network", "mcp_mikmaq-network", 
        "mcp-mikmaq-mcp-server"
      ],
      "env": {
        "MIKMAQ_API_URL": "http://mikmaq-dictionary-api:3000",
        "MIKMAQ_API_TIMEOUT": "10000"
      }
    }
  }
}
```

**For local development:**
```json
{
  "mcpServers": {
    "mikmaq-dictionary": {
      "description": "Mi'kmaq Dictionary API integration for language preservation and learning",
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/your/project/Mcp",
      "env": {
        "MIKMAQ_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

### 💬 Using MCP in Your IDE

Once configured, you can interact with the Mi'kmaq dictionary directly through your AI assistant:

**Example conversations:**
- *"Look up the Mi'kmaq word 'samqwan'"*
- *"Find Mi'kmaq translations for 'water'"*
- *"Give me a random Mi'kmaq word to learn today"*
- *"Search for Mi'kmaq words related to 'ocean'"*
- *"Show me dictionary statistics"*
- *"What grammatical word types are available in Mi'kmaq?"*

The AI assistant will use the MCP tools to provide real-time access to the dictionary, supporting language learning and cultural preservation directly in your development environment.

### 🧪 Testing MCP Integration

```bash
# Test MCP server connectivity
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npm start

# Test a dictionary lookup
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "lookup_mikmaq_word", "arguments": {"word": "samqwan"}}}' | npm start

# Test random word generation
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "get_random_word", "arguments": {}}}' | npm start
```

### 📁 MCP Project Structure

```
Mcp/
├── src/
│   ├── index.ts              # Main MCP server implementation
│   ├── dictionary-client.ts  # API client for dictionary service
│   └── types.ts             # TypeScript type definitions
├── dist/                    # Compiled JavaScript output
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── Dockerfile              # Container configuration
└── docker-compose.yml     # Multi-service orchestration
```

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Docker** (optional, for containerized deployment) - [Download here](https://www.docker.com/)
- **Git** - [Download here](https://git-scm.com/)

### Method 1: Quick Start with Docker (Recommended)

The fastest way to get the API running:

1. **Clone the repository:**
```bash
git clone <repository-url>
cd mikmaq-dictionary-api
```

2. **Start with Docker Compose:**
```bash
docker-compose up -d
```

3. **Verify the API is running:**
```bash
curl http://localhost:3000/api/v1/health
```

4. **Test a Mi'kmaq word lookup:**
```bash
curl http://localhost:3000/api/v1/entries/mik/samqwan
```

5. **View API documentation:**
Open your browser to: `http://localhost:3000`

### Method 2: Local Development Setup

For development and customization:

#### Step 1: Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd mikmaq-dictionary-api

# Install dependencies
npm install
```

#### Step 2: Development Mode
```bash
# Start development server with hot reload
npm run dev

# The API will be available at http://localhost:3000
```

#### Step 3: Production Build
```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Method 3: Manual Docker Build

If you want to build the Docker image yourself:

```bash
# Build the Docker image
docker build -t mikmaq-dictionary-api .

# Run the container
docker run -p 3000:3000 -v $(pwd)/dictionary.json:/app/dictionary.json:ro mikmaq-dictionary-api
```

### 🧪 Running Tests

Verify everything works correctly:

```bash
# Run all tests (71 comprehensive tests)
npm test

# Run tests with coverage report
npm run test -- --coverage

# Run linting
npm run lint
```

### 🔧 Configuration

#### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration  
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Custom Port

To run on a different port:

```bash
# Using environment variable
PORT=8080 npm start

# Or modify your .env file
echo "PORT=8080" > .env
npm start
```

### 📁 Project Structure

```
mikmaq-dictionary-api/
├── src/                    # Source code
│   ├── controllers/        # API endpoint handlers
│   ├── services/          # Business logic
│   ├── types/             # TypeScript type definitions
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   └── index.ts           # Main application entry
├── Mcp/                   # Model Context Protocol server
│   ├── src/               # MCP server source code
│   │   ├── index.ts       # Main MCP server implementation
│   │   ├── dictionary-client.ts  # API client
│   │   └── types.ts       # MCP type definitions
│   ├── dist/              # Compiled MCP server
│   ├── package.json       # MCP dependencies
│   ├── tsconfig.json      # MCP TypeScript config
│   ├── Dockerfile         # MCP container configuration
│   └── docker-compose.yml # MCP orchestration
├── tests/                 # Test suites
│   ├── services/          # Service layer tests
│   ├── controllers/       # Controller tests
│   ├── integration/       # End-to-end API tests
│   └── setup.ts          # Test configuration
├── dist/                  # Compiled JavaScript (after build)
├── dictionary.json        # Mi'kmaq language dictionary data
├── mcp.json              # MCP server configuration
├── Dockerfile            # Docker container configuration
├── docker-compose.yml    # Multi-container setup
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Test configuration
└── LICENSE               # Mi'kmaq Cultural Heritage License
```

## Dictionary Data

The API uses a comprehensive Mi'kmaq dictionary containing:
- **6,581 total words**
- **Verb categories** (72% of dictionary):
  - Animate Intransitive: 2,090 entries
  - Animate Transitive: 1,021 entries
  - Inanimate Transitive: 855 entries
  - Inanimate Intransitive: 765 entries
- **Noun categories** (24% of dictionary):
  - Inanimate Nouns: 831 entries
  - Animate Nouns: 771 entries
  - General Nouns: 29 entries
- **Other categories** (4% of dictionary):
  - Particles: 120 entries
  - Unclassified: 83 entries
  - Pronouns: 16 entries

## 📝 Example Usage

### Basic Queries

```bash
# Get API documentation
curl http://localhost:3000/

# Health check
curl http://localhost:3000/api/v1/health

# Random Mi'kmaq word for learning
curl http://localhost:3000/api/v1/entries/random

# Dictionary statistics
curl http://localhost:3000/api/v1/stats
```

### Word Lookups

```bash
# Mi'kmaq to English
curl "http://localhost:3000/api/v1/entries/mik/samqwan"

# English to Mi'kmaq
curl "http://localhost:3000/api/v1/entries/english/water"

# Exact word lookup
curl "http://localhost:3000/api/v1/entries/mik/samqwan?exact=true"

# Search with limit
curl "http://localhost:3000/api/v1/entries/english/water?limit=5"
```

### Bidirectional Search

```bash
# English to Mi'kmaq search
curl "http://localhost:3000/api/v1/search?q=water&type=english-to-mikmaq&limit=3"

# Mi'kmaq to English search  
curl "http://localhost:3000/api/v1/search?q=samqwan&type=mikmaq-to-english"

# Filter by grammatical type
curl "http://localhost:3000/api/v1/search?q=water&type=english-to-mikmaq&partOfSpeech=noun%20inanimate"
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Error: EADDRINUSE: address already in use :::3000
# Solution: Use a different port
PORT=8080 npm start
```

#### Dictionary Not Loading
```bash
# Error: Failed to load Mi'kmaq dictionary
# Solution: Ensure dictionary.json exists in project root
ls -la dictionary.json

# If missing, ensure you have the complete repository
git status
```

#### Tests Failing
```bash
# Run tests in verbose mode to see details
npm test -- --verbose

# Clear Jest cache if needed
npx jest --clearCache
npm test
```

#### Docker Issues
```bash
# Stop all containers and restart
docker-compose down
docker-compose up -d

# View container logs
docker-compose logs -f

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

#### MCP Integration Issues
```bash
# Test MCP server connectivity
cd Mcp
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npm start

# Check if dictionary API is accessible from MCP server
curl http://localhost:3000/api/v1/health

# Verify MCP server Docker network
docker network ls | grep mcp
docker-compose logs mikmaq-mcp-server

# Test MCP tools directly
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "get_random_word", "arguments": {}}}' | npm start
```

#### Cursor IDE Integration Issues
```bash
# Verify MCP configuration file location
ls ~/.cursor/mcp_servers.json

# Check Cursor logs for MCP connection errors
# Restart Cursor after MCP configuration changes

# Test MCP server independently
cd Mcp && npm start
```

### Performance Tips

#### For Large Scale Usage
```bash
# Use production mode
NODE_ENV=production npm start

# Enable clustering (modify package.json)
npm install pm2 -g
pm2 start dist/index.js -i max
```

#### Memory Optimization
The API loads all 6,581 words into memory for fast lookups. For memory-constrained environments:
- Minimum RAM: 512MB
- Recommended RAM: 1GB+
- Docker memory limit: `--memory=1g`

### API Response Times
- **Word lookups**: < 1ms (in-memory)
- **Search queries**: 1-5ms (depending on complexity)
- **Random words**: < 1ms
- **Statistics**: < 1ms

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Docker Commands

### API Only
```bash
# Build image
docker build -t mikmaq-dictionary-api .

# Run container
docker run -p 3000:3000 -v $(pwd)/dictionary.json:/app/dictionary.json:ro mikmaq-dictionary-api

# Using Docker Compose
docker-compose up -d        # Start services
docker-compose logs -f      # View logs
docker-compose down         # Stop services
```

### API + MCP Server
```bash
# Start both API and MCP server
docker-compose up -d

# View MCP server logs
docker-compose logs -f mikmaq-mcp-server

# View API logs
docker-compose logs -f mikmaq-dictionary-api

# Stop all services
docker-compose down

# Rebuild MCP server
cd Mcp
docker build -t mcp-mikmaq-mcp-server .
cd ..
docker-compose up -d
```

## API Response Format

The API follows the structure of dictionary APIs like DictionaryAPI.dev:

```typescript
interface DictionaryApiResponse {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}
```

## Rate Limiting

- **100 requests per 15 minutes** per IP address
- Rate limit headers included in responses
- Configurable via environment variables

## Error Responses

```json
{
  "title": "No Definitions Found",
  "message": "Sorry pal, we couldn't find definitions for the word you were looking for.",
  "resolution": "You can try the search again at later time or head to the web instead."
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Mi'kmaq Language Preservation License (MLPL) - see LICENSE file for details.

This project operates under a special license created by our people, for our people, ensuring that this digital resource serves the Mi'kmaq community while respecting our cultural sovereignty.

## 🏛️ Cultural Heritage & License

This project is dedicated to the preservation and revitalization of Mi'kmaq language and culture. It operates under a **Mi'kmaq Cultural Heritage License** that ensures respectful use and community benefit.

### For Our People, By Our People

This API is created:
- **🧒 For the Children**: Ensuring future generations can learn Mi'kmawisimk in the digital age
- **👴 For the Elders**: Honoring knowledge keepers who preserved this language through generations
- **🤝 For the Community**: Supporting language revitalization and cultural continuity
- **🏛️ For the Nation**: Strengthening Mi'kmaq identity and sovereignty through linguistic preservation

### Cultural Responsibilities

When using this API, please:
- ✅ Acknowledge the Mi'kmaq Nation as the source of language knowledge
- ✅ Respect the cultural context and sacred nature of language preservation  
- ✅ Support Mi'kmaq language revitalization efforts when possible
- ✅ Recognize that language is living culture, not just data
- ❌ Do not use for purposes harmful or disrespectful to Mi'kmaq people
- ❌ Do not claim ownership of Mi'kmaq language or culture

## 🤝 Acknowledgments

**Wela'lioq** (Thank You) to:
- Mi'kmaq Elders and knowledge keepers who preserved Mi'kmawisimk through generations
- Mi'kmaq educators and community members working on language revitalization
- All those who understand that technology should serve Indigenous communities
- The traditional territories of Mi'kma'ki where this language has been spoken for millennia

*"Msit No'kmaq" - All My Relations*

## 📜 License

This project uses a dual licensing approach:
- **Mi'kmaq Cultural Heritage License**: Ensures respectful use and community benefit
- **MIT License**: Provides technical implementation flexibility

The cultural license takes precedence for appropriate use of Mi'kmaq language data. See [LICENSE](LICENSE) for complete terms.

## 🌐 Contributing

We welcome contributions that:
- Support Mi'kmaq language preservation and education
- Improve accessibility for language learners
- Enhance technical performance and reliability
- Follow cultural protocols and community guidance

Please engage respectfully and prioritize community needs in any contributions.
