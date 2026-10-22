@echo off
setlocal
cd /d "%~dp0"
title LINAD - Local Development Server
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not available in PATH.
  echo Install Node.js 24 or newer, then try again.
  pause
  exit /b 1
)
if not exist "package.json" (
  echo ERROR: package.json not found.
  echo Put this file in the main LINAD project folder.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 (
    echo ERROR: Dependency installation failed.
    pause
    exit /b 1
  )
)
echo Starting LINAD at http://127.0.0.1:5173/
echo Keep this window open while using the website.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:5173/'"
call npm run dev -- --port 5173 --strictPort
if errorlevel 1 (
  echo.
  echo Server stopped with an error. Check whether port 5173 is already in use.
  pause
)
