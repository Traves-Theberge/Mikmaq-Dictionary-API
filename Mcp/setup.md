# Mi'kmaq Dictionary MCP Server Setup

## What I Just Updated:

### 1. **Updated to Latest MCP SDK (1.17.3)**
```json
"@modelcontextprotocol/sdk": "^1.17.3"
```

### 2. **Updated All Dependencies to 2025 Versions**
- Zod: 3.24.1
- TypeScript: 5.7.2  
- Node types: 22.10.1
- TSX: 4.19.2

### 3. **Fixed TypeScript Errors**
- Added proper type annotations for request handlers
- Fixed error handling type issues
- Fixed array sorting type assertions

## How to Install and Run:

### Option 1: Run the install script
```bash
# On Windows
./install.bat

# On Mac/Linux  
chmod +x install.sh && ./install.sh
```

### Option 2: Manual installation
```bash
npm install
npm run build
npm start
```

## How This MCP Server Works:

### Architecture:
```
Cursor IDE → MCP Server → Your Dictionary API → Response
```

### The Flow:
1. **You ask Cursor**: "Look up the Mi'kmaq word 'samqwan'"
2. **Cursor calls MCP tool**: `lookup_mikmaq_word` with `{"word": "samqwan"}`  
3. **MCP server calls your API**: `GET http://localhost:3000/api/v1/entries/mik/samqwan`
4. **API responds**: `[{"word": "samqwan", "meanings": [{"definitions": ["water"]}]}]`
5. **MCP formats response**: "**samqwan** (noun) • water"
6. **Cursor shows you**: The formatted Mi'kmaq dictionary result

### Available Tools:
- `lookup_mikmaq_word` - Look up Mi'kmaq words
- `lookup_english_word` - Find Mi'kmaq translations  
- `search_dictionary` - Bidirectional search
- `get_random_word` - Random word for learning
- `get_dictionary_stats` - Dictionary statistics
- `get_word_types` - Available grammatical types
- `check_api_health` - API health status

## Next Steps:
1. Run `install.bat` to install dependencies
2. Make sure your dictionary API is running: `cd .. && npm run dev`
3. Test MCP server: `npm run dev`
4. Configure Cursor with `cursor-mcp-config-local.json`
