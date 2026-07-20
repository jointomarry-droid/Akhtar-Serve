# PocketBase Startup Script for Windows
# This script starts PocketBase and optionally runs the collection setup

param(
    [switch]$Setup,
    [switch]$Seed,
    [switch]$Migrate,
    [int]$Port = 8090
)

# ==================== CONFIGURATION ====================

$PbDir = "$PSScriptRoot\pb"
$PbExe = "$PbDir\pocketbase.exe"
$DataDir = "$PbDir\data"
$LogFile = "$PBDir\pocketbase.log"

# ==================== FUNCTIONS ====================

function Write-Header {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   PocketBase Server for Akhtar-Serve   " -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Test-PocketBaseExists {
    if (-not (Test-Path $PbExe)) {
        Write-Host "ERROR: PocketBase executable not found at:" -ForegroundColor Red
        Write-Host "  $PbExe" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please download PocketBase from:" -ForegroundColor Yellow
        Write-Host "  https://pocketbase.io/docs/" -ForegroundColor Cyan
        exit 1
    }
}

function Start-PocketBaseServer {
    param([int]$ServerPort = 8090)

    Write-Host "Starting PocketBase server..." -ForegroundColor Green
    Write-Host "  URL: http://localhost:$ServerPort" -ForegroundColor Cyan
    Write-Host "  Admin: http://localhost:$ServerPort/_/" -ForegroundColor Cyan
    Write-Host "  Data: $DataDir" -ForegroundColor Cyan
    Write-Host ""

    # Create data directory if it doesn't exist
    if (-not (Test-Path $DataDir)) {
        New-Item -ItemType Directory -Path $DataDir -Force | Out-Null
        Write-Host "Created data directory: $DataDir" -ForegroundColor Yellow
    }

    # Start PocketBase
    & $PbExe serve --dir $DataDir --http=127.0.0.1:$ServerPort
}

function Test-Connection {
    param([int]$ServerPort = 8090)

    Write-Host "Testing PocketBase connection..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$ServerPort/api/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "SUCCESS: PocketBase is running!" -ForegroundColor Green
            Write-Host "  URL: http://localhost:$ServerPort" -ForegroundColor Cyan
            Write-Host "  Admin: http://localhost:$ServerPort/_/" -ForegroundColor Cyan
            return $true
        }
    } catch {
        Write-Host "ERROR: Cannot connect to PocketBase" -ForegroundColor Red
        return $false
    }
}

function Invoke-CollectionSetup {
    Write-Host "Running collection setup..." -ForegroundColor Yellow
    Set-Location $PSScriptRoot
    npx tsx scripts/setup-pocketbase-collections.ts
}

function Invoke-SeedData {
    Write-Host "Seeding sample data..." -ForegroundColor Yellow
    Set-Location $PSScriptRoot
    npx tsx scripts/seed-pocketbase-data.ts
}

function Invoke-Migration {
    Write-Host "Running Firestore migration..." -ForegroundColor Yellow
    Set-Location $PSScriptRoot
    npx tsx scripts/migrate-from-firestore.ts
}

# ==================== MAIN ====================

Write-Header

# Check if PocketBase exists
Test-PocketBaseExists

# Handle command-line arguments
if ($Setup) {
    Write-Host "Running in setup mode..." -ForegroundColor Magenta
    
    # Start PocketBase in background
    $job = Start-Job -ScriptBlock {
        param($exe, $data, $port)
        & $exe serve --dir $data --http=127.0.0.1:$port
    } -ArgumentList $PbExe, $DataDir, $Port

    # Wait for server to start
    Write-Host "Waiting for PocketBase to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3

    # Check connection
    if (Test-Connection -ServerPort $Port) {
        # Run collection setup
        Invoke-CollectionSetup
        
        # Optionally seed data
        if ($Seed) {
            Invoke-SeedData
        }

        Write-Host ""
        Write-Host "Setup complete!" -ForegroundColor Green
        Write-Host "PocketBase is running in the background." -ForegroundColor Cyan
        Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
        
        # Keep script running
        Wait-Job -Job $job
    } else {
        Write-Host "Failed to start PocketBase" -ForegroundColor Red
        Stop-Job -Job $job
    }
} elseif ($Migrate) {
    Write-Host "Running in migration mode..." -ForegroundColor Magenta
    
    # Start PocketBase in background
    $job = Start-Job -ScriptBlock {
        param($exe, $data, $port)
        & $exe serve --dir $data --http=127.0.0.1:$port
    } -ArgumentList $PbExe, $DataDir, $Port

    # Wait for server to start
    Start-Sleep -Seconds 3

    # Check connection
    if (Test-Connection -ServerPort $Port) {
        # Run migration
        Invoke-Migration
        
        Write-Host ""
        Write-Host "Migration complete!" -ForegroundColor Green
        Stop-Job -Job $job
    } else {
        Write-Host "Failed to start PocketBase" -ForegroundColor Red
        Stop-Job -Job $job
    }
} else {
    # Normal startup
    Start-PocketBaseServer -ServerPort $Port
}
