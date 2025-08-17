# Mi'kmaq Dictionary MCP Server

A Model Context Protocol (MCP) server that provides access to the Mi'kmaq dictionary for AI models and applications.

**By our people, for our people. For the children and the elders.**

## 🌟 Features

- 📚 **6,581 Mi'kmaq Words** - Complete dictionary access
- 🔍 **Bidirectional Lookup** - Mi'kmaq ↔ English translation
- 🎲 **Random Words** - Perfect for language learning
- 📊 **Dictionary Statistics** - Insights into the language data
- 🔎 **Smart Search** - Find words by meaning, usage, or partial matches

## 🚀 Quick Start

### Installation

```bash
cd mcp
npm install
npm run build
```

### Usage with Claude Desktop

Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "mikmaq-dictionary": {
      "command": "node",
      "args": ["/path/to/Mi'kmaq MCP/mcp/dist/index.js"],
      "cwd": "/path/to/Mi'kmaq MCP/mcp"
    }
  }
}
```

### Usage with Other MCP Clients

```bash
# Start the server
npm start

# Or run directly
node dist/index.js
```

## 🛠️ Available Tools

### 1. `lookup_mikmaq_word`
Look up a specific Mi'kmaq word and get its English definitions.

**Parameters:**
- `word` (string): The Mi'kmaq word to look up

**Example:**
```
Tool: lookup_mikmaq_word
Input: { "word": "samqwan" }
Output: Complete definition with translations and usage examples
```

### 2. `lookup_english_word`
Find Mi'kmaq translations for an English word.

**Parameters:**
- `word` (string): The English word to translate

**Example:**
```
Tool: lookup_english_word  
Input: { "word": "water" }
Output: Mi'kmaq words that mean "water" (like "samqwan")
```

### 3. `search_mikmaq_dictionary`
Search the dictionary with any query term.

**Parameters:**
- `query` (string): Search term
- `limit` (number, optional): Max results (default: 10)

**Example:**
```
Tool: search_mikmaq_dictionary
Input: { "query": "water", "limit": 5 }
Output: All words related to water with relevance scores
```

### 4. `get_random_mikmaq_word`
Get a random Mi'kmaq word for learning.

**Parameters:** None

**Example:**
```
Tool: get_random_mikmaq_word
Input: {}
Output: Random word with complete definition
```

### 5. `get_dictionary_stats`
Get statistics about the dictionary contents.

**Parameters:** None

**Example:**
```
Tool: get_dictionary_stats
Input: {}
Output: Word counts, most common types, etc.
```

## 📋 Example Conversations

### Learning Mi'kmaq
```
Human: I want to learn a new Mi'kmaq word today.

AI: Let me get you a random Mi'kmaq word to learn!

[Uses get_random_mikmaq_word]

Here's your word for today: **"alapiet"** - meaning "looks around" or "looks here and there". It's a verb (animate intransitive).

Example usage: "Sangew alapiet, getu' migwite'tg ms't goqwei" - "He/she slowly looks around, he/she wants to remember everything."
```

### Translation Help
```
Human: How do you say "water" in Mi'kmaq?

AI: [Uses lookup_english_word with "water"]

In Mi'kmaq, "water" is **"samqwan"**. It's a noun (inanimate). 

Here's an example: "Nowhere is there better tasting water than in Listuguj."
```

### Cultural Learning
```
Human: Tell me about Mi'kmaq words related to nature.

AI: [Uses search_mikmaq_dictionary with "nature" terms]

Here are some beautiful Mi'kmaq words connected to nature:
- **samqwan** - water
- **nipukt** - forest/woods  
- **kisiku** - sky/day
- **telo'teg** - ocean/sea

Each word carries deep cultural meaning and connection to the land.
```

## 🏛️ Cultural Respect

This MCP server operates under the Mi'kmaq Cultural Heritage License, ensuring:

- ✅ Respectful use of Indigenous language data
- ✅ Support for Mi'kmaq language revitalization
- ✅ Recognition of Mi'kmaq cultural sovereignty
- ✅ Educational and community benefit focus

## 🔧 Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

## 📁 Project Structure

```
mcp/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🤝 Integration Examples

### With Claude Desktop
Perfect for having conversations about Mi'kmaq language and getting real-time translations.

### With Custom Applications
Integrate Mi'kmaq language support into your apps using the MCP protocol.

### With Language Learning Tools
Build educational applications that help preserve and teach Mi'kmaq.

---

**Wela'lioq** (Thank you) for supporting Mi'kmaq language preservation through technology! 🙏
