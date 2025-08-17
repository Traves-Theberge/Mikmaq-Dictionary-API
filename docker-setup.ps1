# Mi'kmaq Dictionary API - Simple Docker Setup for Windows
# Run this script to set up the API locally with Docker

Write-Host "🏛️  Mi'kmaq Dictionary API - Docker Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not running" -ForegroundColor Red
    Write-Host "   Please install Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if dictionary.json exists
if (-not (Test-Path "dictionary.json")) {
    Write-Host "❌ dictionary.json not found" -ForegroundColor Red
    Write-Host "   Please ensure you have the complete repository with dictionary data" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dictionary data found ($(Get-Content dictionary.json | Measure-Object -Line | Select-Object -ExpandProperty Lines) lines)" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Building and starting the Mi'kmaq Dictionary API..." -ForegroundColor Yellow

# Build and start the container
docker-compose up --build -d

Write-Host ""
Write-Host "⏳ Waiting for API to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test if API is running
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Mi'kmaq Dictionary API is running!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🔍 Your API is ready:" -ForegroundColor Cyan
    Write-Host "   📖 Documentation: http://localhost:3000/" -ForegroundColor White
    Write-Host "   🏥 Health Check: http://localhost:3000/api/v1/health" -ForegroundColor White
    Write-Host "   🎲 Random Word: http://localhost:3000/api/v1/entries/random" -ForegroundColor White
    Write-Host "   🌊 Example: http://localhost:3000/api/v1/entries/mik/samqwan" -ForegroundColor White
    
    Write-Host ""
    Write-Host "📊 Quick Test Commands:" -ForegroundColor Cyan
    Write-Host '   Invoke-RestMethod -Uri "http://localhost:3000/api/v1/entries/english/water"' -ForegroundColor Gray
    Write-Host '   Invoke-RestMethod -Uri "http://localhost:3000/api/v1/entries/random"' -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "🛠️  Docker Commands:" -ForegroundColor Cyan
    Write-Host "   View logs: docker-compose logs -f" -ForegroundColor Gray
    Write-Host "   Stop API: docker-compose down" -ForegroundColor Gray
    Write-Host "   Restart: docker-compose restart" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ API is not responding. Check the logs:" -ForegroundColor Red
    Write-Host "   docker-compose logs" -ForegroundColor Yellow
    
    Write-Host ""
    Write-Host "🔍 Container status:" -ForegroundColor Yellow
    docker-compose ps
}

Write-Host ""
Write-Host "🙏 Wela'lioq (Thank you) for using the Mi'kmaq Dictionary API!" -ForegroundColor Green
Write-Host "   By our people, for our people. For the children and the elders." -ForegroundColor Green
