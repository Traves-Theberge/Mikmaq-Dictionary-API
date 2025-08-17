# Mi'kmaq Dictionary API - Endpoint Testing Script
# This script tests all 9 API endpoints to make sure everything works

Write-Host "🧪 Testing Mi'kmaq Dictionary API Endpoints" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"
$testsPassed = 0
$testsTotal = 9

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedContent = ""
    )
    
    Write-Host ""
    Write-Host "🔍 Testing: $Name" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 10
        
        if ($ExpectedContent -and ($response | ConvertTo-Json -Depth 10) -notlike "*$ExpectedContent*") {
            Write-Host "   ❌ FAIL - Expected content not found" -ForegroundColor Red
            return $false
        }
        
        Write-Host "   ✅ PASS - Response received" -ForegroundColor Green
        
        # Show a sample of the response
        if ($response -is [Array] -and $response.Count -gt 0) {
            Write-Host "   📄 Sample: $($response[0].word)" -ForegroundColor Cyan
        } elseif ($response.message) {
            Write-Host "   📄 Sample: $($response.message)" -ForegroundColor Cyan
        } elseif ($response.word) {
            Write-Host "   📄 Sample: $($response.word)" -ForegroundColor Cyan
        }
        
        return $true
    }
    catch {
        Write-Host "   ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test 1: Root Documentation
if (Test-Endpoint "Root Documentation" "$baseUrl/" "Mi'kmaq Dictionary API") {
    $testsPassed++
}

# Test 2: Health Check
if (Test-Endpoint "Health Check" "$baseUrl/api/v1/health" "healthy") {
    $testsPassed++
}

# Test 3: Dictionary Statistics
if (Test-Endpoint "Dictionary Statistics" "$baseUrl/api/v1/stats" "totalWords") {
    $testsPassed++
}

# Test 4: Word Types
if (Test-Endpoint "Word Types" "$baseUrl/api/v1/word-types" "wordTypes") {
    $testsPassed++
}

# Test 5: Mi'kmaq Word Lookup
if (Test-Endpoint "Mi'kmaq Word Lookup" "$baseUrl/api/v1/entries/mik/samqwan" "water") {
    $testsPassed++
}

# Test 6: English Word Lookup
if (Test-Endpoint "English Word Lookup" "$baseUrl/api/v1/entries/english/water" "samqwan") {
    $testsPassed++
}

# Test 7: Random Word
if (Test-Endpoint "Random Word" "$baseUrl/api/v1/entries/random" "word") {
    $testsPassed++
}

# Test 8: English to Mi'kmaq Search
if (Test-Endpoint "English to Mi'kmaq Search" "$baseUrl/api/v1/search?q=water&type=english-to-mikmaq&limit=3") {
    $testsPassed++
}

# Test 9: Mi'kmaq to English Search
if (Test-Endpoint "Mi'kmaq to English Search" "$baseUrl/api/v1/search?q=samqwan&type=mikmaq-to-english") {
    $testsPassed++
}

# Summary
Write-Host ""
Write-Host "📊 TEST RESULTS" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "   Passed: $testsPassed/$testsTotal" -ForegroundColor $(if($testsPassed -eq $testsTotal) { "Green" } else { "Yellow" })

if ($testsPassed -eq $testsTotal) {
    Write-Host ""
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "   Your Mi'kmaq Dictionary API is working perfectly!" -ForegroundColor Green
    Write-Host "   All 9 endpoints are functional and responding correctly." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Some tests failed. Check the errors above." -ForegroundColor Yellow
    Write-Host "   Make sure your API is running: docker-compose up -d" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌊 Try these example queries in your browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/" -ForegroundColor White
Write-Host "   http://localhost:3000/api/v1/entries/mik/samqwan" -ForegroundColor White
Write-Host "   http://localhost:3000/api/v1/entries/english/water" -ForegroundColor White
Write-Host "   http://localhost:3000/api/v1/entries/random" -ForegroundColor White
