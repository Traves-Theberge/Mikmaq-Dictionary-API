# Mi'kmaq Dictionary MCP Setup
# Simple setup script for the MCP server

Write-Host "🏛️  Mi'kmaq Dictionary MCP Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""  
Write-Host "🔨 Building TypeScript..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "✅ MCP Server is ready!" -ForegroundColor Green

$mcpPath = (Get-Location).Path + "\dist\index.js"

Write-Host ""
Write-Host "📋 **Claude Desktop Configuration**" -ForegroundColor Cyan
Write-Host "Add this to your claude_desktop_config.json:" -ForegroundColor White
Write-Host ""
Write-Host '{' -ForegroundColor Gray
Write-Host '  "mcpServers": {' -ForegroundColor Gray
Write-Host '    "mikmaq-dictionary": {' -ForegroundColor Gray
Write-Host "      `"command`": `"node`"," -ForegroundColor Gray
Write-Host "      `"args`": [`"$mcpPath`"]" -ForegroundColor Gray
Write-Host '    }' -ForegroundColor Gray
Write-Host '  }' -ForegroundColor Gray
Write-Host '}' -ForegroundColor Gray
Write-Host ""

Write-Host "🛠️  **Available Tools**" -ForegroundColor Cyan
Write-Host "• lookup_mikmaq_word" -ForegroundColor White
Write-Host "• lookup_english_word" -ForegroundColor White  
Write-Host "• search_mikmaq_dictionary" -ForegroundColor White
Write-Host "• get_random_mikmaq_word" -ForegroundColor White
Write-Host "• get_dictionary_stats" -ForegroundColor White
Write-Host ""

Write-Host "🙏 Wela'lioq - By our people, for our people!" -ForegroundColor Green
