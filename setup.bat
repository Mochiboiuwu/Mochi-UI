@echo off
REM Mochi-UI Quick Setup Script for Windows
REM This script helps you get started with Mochi-UI v2.0

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              MOCHI-UI v2.0 - Quick Setup                   ║
echo ║          Advanced System Monitor for Windows                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ✗ ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo After installation, run this script again.
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js found: 
node --version

REM Install dependencies
echo.
echo [2/4] Installing dependencies...
if exist node_modules (
    echo Dependencies already installed. Skipping...
) else (
    npm install
    if errorlevel 1 (
        echo ✗ Failed to install dependencies
        pause
        exit /b 1
    )
)
echo ✓ Dependencies installed successfully

REM Create icon
echo.
echo [3/4] Setting up application icon...
if exist build\icon.ico (
    echo ✓ Icon already exists at build/icon.ico
) else (
    echo Creating icon setup...
    powershell -ExecutionPolicy Bypass -File create-icon.ps1
    if errorlevel 1 (
        echo.
        echo ⚠ Icon creation failed or skipped
        echo You can create an icon manually later using:
        echo   - https://icoconvert.com/ (online)
        echo   - Photoshop, GIMP, or Paint.NET (local)
        echo.
    ) else (
        echo ✓ Icon created successfully
    )
)

REM Test the application
echo.
echo [4/4] Setup complete!
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                   NEXT STEPS                               ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║  1. START DEVELOPMENT BUILD:                              ║
echo ║     npm start                                             ║
echo ║                                                            ║
echo ║  2. BUILD WINDOWS EXECUTABLE:                             ║
echo ║     npm run build:win                                     ║
echo ║     (Output will be in: dist/ folder)                     ║
echo ║                                                            ║
echo ║  3. BUILD INSTALLER:                                      ║
echo ║     npm run build:nsis                                    ║
echo ║                                                            ║
echo ║  4. MORE OPTIONS:                                         ║
echo ║     npm run build    (build both formats)                 ║
echo ║                                                            ║
echo ║  5. DOCUMENTATION:                                        ║
echo ║     - README.md (overview)                                ║
echo ║     - BUILD_INSTRUCTIONS.md (detailed guide)              ║
echo ║     - CHANGELOG.md (version history)                      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Ask if user wants to start development build
set /p launch="Would you like to start the development build now? (y/n): "
if /i "%launch%"=="y" (
    echo.
    echo Starting Mochi-UI in development mode...
    echo.
    npm start
) else (
    echo.
    echo Setup complete! Run 'npm start' when you're ready.
    echo.
)

pause
