# Mi'kmaq Dictionary MCP Server

An MCP (Model Context Protocol) server that provides seamless integration between the Mi'kmaq Dictionary API and IDEs like Cursor, enabling AI assistants to access Mi'kmaq language resources directly.

## 🌟 Features

- **7 MCP Tools** for comprehensive Mi'kmaq dictionary access
- **Bidirectional Search**: English ↔ Mi'kmaq translations
- **Language Learning**: Random word generator for daily practice
- **Statistics**: Dictionary insights and word type information
- **Production Ready**: Docker containerization and health monitoring
- **IDE Integration**: Works with Cursor, VS Code, and other MCP-compatible editors

## 🛠️ Available MCP Tools

1. **`lookup_mikmaq_word`** - Look up Mi'kmaq words and get English definitions
2. **`lookup_english_word`** - Find Mi'kmaq translations for English words
3. **`search_dictionary`** - Bidirectional fuzzy search (English ↔ Mi'kmaq)
4. **`get_random_word`** - Get random Mi'kmaq words for learning
5. **`get_dictionary_stats`** - View dictionary statistics and word counts
6. **`get_word_types`** - List all grammatical categories
7. **`check_api_health`** - Monitor API status and connectivity

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Navigate to the MCP directory
cd Mcp

# Start both the dictionary API and MCP server
docker-compose up -d

# Check logs
docker-compose logs -f mikmaq-mcp-server
```

### Option 2: Local Development

```bash
# Navigate to MCP directory
cd Mcp

# Install dependencies
npm install

# Build the project
npm run build

# Start the MCP server (requires API running on localhost:3000)
npm start
```

### Option 3: Development Mode

```bash
cd Mcp
npm install
npm run dev  # Uses tsx for hot reload
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `Mcp/` directory:

```env
# Mi'kmaq Dictionary API Configuration
MIKMAQ_API_URL=http://localhost:3000
MIKMAQ_API_TIMEOUT=10000

# For Docker deployment
MIKMAQ_API_URL=http://mikmaq-dictionary-api:3000
```

### Cursor IDE Integration

Add this configuration to your Cursor settings (`~/.cursor/mcp_servers.json`):

```json
{
  "mcpServers": {
    "mikmaq-dictionary": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--network", "mcp_mikmaq-network",
        "mcp-mikmaq-mcp-server"
      ],
      "env": {
        "MIKMAQ_API_URL": "http://mikmaq-dictionary-api:3000"
      }
    }
  }
}
```

Or for local development:

```json
{
  "mcpServers": {
    "mikmaq-dictionary": {
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

## 🧪 Testing the MCP Server

### Test with the Dictionary API Running

```bash
# Start the main dictionary API first
cd .. && docker-compose up -d

# Or locally
cd .. && npm run dev

# Then test the MCP server
cd Mcp
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npm start
```

### Example MCP Tool Calls

```bash
# Lookup a Mi'kmaq word
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "lookup_mikmaq_word", "arguments": {"word": "samqwan"}}}' | npm start

# Find English translations
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "lookup_english_word", "arguments": {"word": "water"}}}' | npm start

# Get random word for learning
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "get_random_word", "arguments": {}}}' | npm start
```

## 📊 Usage Examples in Cursor

Once configured, you can use these tools in Cursor by asking the AI assistant:

- *"Look up the Mi'kmaq word 'samqwan'"*
- *"Find Mi'kmaq translations for 'water'"*
- *"Search for Mi'kmaq words related to 'ocean'"*
- *"Give me a random Mi'kmaq word to learn today"*
- *"Show me dictionary statistics"*
- *"What grammatical word types are available?"*

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Failed**
   ```bash
   # Ensure the dictionary API is running
   curl http://localhost:3000/api/v1/health
   
   # Check Docker network connectivity
   docker network ls
   docker-compose logs mikmaq-dictionary-api
   ```

2. **MCP Server Not Responding**
   ```bash
   # Check MCP server logs
   docker-compose logs mikmaq-mcp-server
   
   # Test MCP server directly
   echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npm start
   ```

3. **Cursor Integration Issues**
   - Verify MCP server configuration in Cursor settings
   - Check that Docker containers are running
   - Restart Cursor after configuration changes

## 🏗️ Development

### Project Structure

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
├── docker-compose.yml      # Multi-service orchestration
└── README.md              # This file
```

### Adding New Tools

To add new MCP tools:

1. Add the tool definition in `src/index.ts` under `ListToolsRequestSchema`
2. Implement the tool handler in the `CallToolRequestSchema` switch statement
3. Add any new API methods to `dictionary-client.ts`
4. Update type definitions in `types.ts` as needed

## 🌍 Cultural Context

This MCP server extends the Mi'kmaq Dictionary API's mission of language preservation into the development environment, making Mi'kmaq language resources accessible to developers and AI assistants while maintaining cultural respect and community focus.

**Wela'lioq** (Thank you) for supporting Mi'kmaq language preservation through technology.

## 📄 License

This MCP server follows the same Mi'kmaq Cultural Heritage License as the main dictionary API. See the main project's LICENSE file for details.
