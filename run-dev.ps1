$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root "backend"
$frontendPath = Join-Path $root "frontend"

Write-Host "Starting backend and frontend in production mode..."

Start-Process powershell -ArgumentList "-NoExit", "-Command", "$env:GIN_MODE='release'; $env:APP_ENV='production'; cd '$backendPath'; go run cmd/server/main.go"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run build; npm start"

Write-Host "Backend and frontend started in separate terminals (production)."