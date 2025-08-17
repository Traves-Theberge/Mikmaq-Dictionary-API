# Mi'kmaq Dictionary API - Project Structure

## 📁 Clean Project Layout

```
Mi'kmaq MCP/
├── 📄 Core Files
│   ├── dictionary.json          # Mi'kmaq language dictionary data (6,581 words)
│   ├── package.json             # Node.js dependencies and scripts
│   ├── package-lock.json        # Locked dependency versions
│   ├── tsconfig.json           # TypeScript configuration
│   └── jest.config.js          # Test configuration
│
├── 🐳 Docker Setup
│   ├── Dockerfile              # Container build instructions
│   ├── docker-compose.yml      # Simple local container setup
│   ├── docker-setup.ps1        # Easy setup script for Windows
│   └── .dockerignore           # Files to exclude from Docker build
│
├── 📚 Documentation
│   ├── README.md               # Complete API documentation
│   ├── LICENSE                 # Mi'kmaq Cultural Heritage License
│   └── PROJECT-STRUCTURE.md    # This file
│
├── 💻 Source Code
│   └── src/
│       ├── index.ts            # Main application entry point
│       ├── controllers/        # API endpoint handlers
│       │   └── DictionaryController.ts
│       ├── services/           # Business logic
│       │   └── DictionaryService.ts
│       ├── types/              # TypeScript type definitions
│       │   └── dictionary.ts
│       ├── middleware/         # Express middleware
│       │   └── index.ts
│       └── routes/             # API route definitions
│           └── dictionary.ts
│
├── 🧪 Testing
│   ├── tests/                  # Test suites (71 tests)
│   │   ├── services/           # Service layer tests
│   │   ├── controllers/        # Controller tests
│   │   ├── integration/        # End-to-end API tests
│   │   └── setup.ts           # Test configuration
│   └── test-endpoints.ps1      # Manual endpoint testing script
│
├── 🏗️ Build Output (Generated)
│   └── dist/                   # Compiled JavaScript (created by npm run build)
│
├── 📦 Dependencies (Generated)
│   └── node_modules/           # Installed packages (created by npm install)
│
└── 🔧 Config Files
    ├── .gitignore             # Git ignore patterns
    └── .dockerignore          # Docker ignore patterns
```

## 🚀 Quick Commands

```powershell
# Setup and run with Docker
.\docker-setup.ps1

# Or manually
docker-compose up --build -d

# Test all endpoints
.\test-endpoints.ps1

# Local development
npm install
npm run dev

# Run tests
npm test

# Build for production
npm run build
npm start
```

## 🎯 Key Features

- ✅ **9 API Endpoints** - Complete bidirectional dictionary
- ✅ **6,581 Mi'kmaq Words** - Comprehensive language data
- ✅ **71 Tests** - Full test coverage
- ✅ **Docker Ready** - Simple containerization
- ✅ **Cultural License** - Respectful Indigenous data use
- ✅ **TypeScript** - Type-safe development
- ✅ **Production Ready** - Optimized and secure

## 📞 API Endpoints

1. `GET /` - API documentation
2. `GET /api/v1/health` - Health check
3. `GET /api/v1/entries/mik/<word>` - Mi'kmaq → English
4. `GET /api/v1/entries/english/<word>` - English → Mi'kmaq
5. `GET /api/v1/entries/random` - Random word learning
6. `GET /api/v1/search?q=<>&type=english-to-mikmaq` - English search
7. `GET /api/v1/search?q=<>&type=mikmaq-to-english` - Mi'kmaq search
8. `GET /api/v1/stats` - Dictionary statistics
9. `GET /api/v1/word-types` - Grammatical categories

**By our people, for our people. For the children and the elders.** 🏛️
