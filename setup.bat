@echo off
REM Brew Bakes Coffee Shop Setup Script for Windows

echo 🚀 Brew Bakes Coffee Shop Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    echo.    Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js detected: %%i

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm detected: %%i
echo.

REM Navigate to server directory
cd server

REM Install server dependencies
echo 📦 Installing server dependencies...
call npm install

REM Check if .env exists
if not exist .env (
    echo.
    echo ⚠️  .env file not found. Creating from template...
    copy .env.example .env
    echo ✅ .env file created. Please update with your credentials.
    echo.
    echo 📝 Edit the following file with your API keys:
    echo    - Stripe API keys
    echo    - Yango delivery credentials
    echo    - MongoDB connection string (if not local)
)

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo    1. Edit server\.env with your API credentials
echo    2. Start MongoDB: mongod
echo    3. Start the server: npm start
echo    4. Open http://localhost:5000 in your browser
echo.
echo 🔐 Admin Login:
echo    - Username: admin
echo    - Password: admin123
echo.
pause
