# ============================================================
#  run.ps1  —  Levanta Frontend, Backend y FingerprintService
# ============================================================

$root     = $PSScriptRoot
$frontend = Join-Path $root "apps\frontend"
$backend  = Join-Path $root "apps\backend"
$checkout = Join-Path $root "apps\checkout"
$service  = Join-Path $root "apps\dotnetCodes\FingerprintService"

# Puerto del backend (debe coincidir con el .env / app.ts)
$BACKEND_PORT  = 3030
$FRONTEND_PORT = 5173
$CHECKOUT_PORT = 5174

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Iniciando proyecto trabajo-final-dev3" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Función: matar proceso que ocupa un puerto ───────────────
function Kill-Port {
    param([int]$Port)
    $pids = (netstat -ano | Select-String ":$Port\s" | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Sort-Object -Unique)

    foreach ($p in $pids) {
        if ($p -match '^\d+$' -and $p -ne '0') {
            try {
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
                Write-Host "  Puerto $Port liberado (PID $p)." -ForegroundColor DarkGray
            } catch {}
        }
    }
}

# ── Liberar puertos antes de arrancar ───────────────────────
Write-Host "[0/4] Liberando puertos en uso..." -ForegroundColor DarkYellow
Kill-Port $BACKEND_PORT
Kill-Port $FRONTEND_PORT
Kill-Port $CHECKOUT_PORT
Start-Sleep -Seconds 1

# ── Verificar/instalar dependencias del backend ─────────────
$swaggerPkg = Join-Path $backend "node_modules\swagger-ui-express"
if (-Not (Test-Path $swaggerPkg)) {
    Write-Host "[0/3] Instalando dependencias del backend (swagger)..." -ForegroundColor DarkYellow
    Push-Location $backend
    pnpm install
    Pop-Location
    Write-Host "      Dependencias instaladas." -ForegroundColor DarkGreen
}

# ── FINGERPRINT SERVICE (.NET 8 — x64) ──────────────────────
Write-Host "[1/4] Iniciando FingerprintService (.NET)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$service'; Write-Host 'FingerprintService' -ForegroundColor Magenta; dotnet run --project FingerprintService.csproj -r win-x64" `
    -WindowStyle Normal

Start-Sleep -Seconds 2

# ── BACKEND (Node / tsx) ─────────────────────────────────────
Write-Host "[2/4] Iniciando Backend (Node + tsx)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$backend'; Write-Host 'Backend' -ForegroundColor Green; pnpm run dev" `
    -WindowStyle Normal

Start-Sleep -Seconds 2

# ── FRONTEND (Vite) ──────────────────────────────────────────
Write-Host "[3/4] Iniciando Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$frontend'; Write-Host 'Frontend' -ForegroundColor Blue; pnpm run dev" `
    -WindowStyle Normal

Start-Sleep -Seconds 2

# ── CHECKOUT (Vite) ───────────────────────────────────────────
Write-Host "[4/4] Iniciando Checkout (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd '$checkout'; Write-Host 'Checkout' -ForegroundColor DarkMagenta; pnpm run dev -- --port $CHECKOUT_PORT" `
    -WindowStyle Normal

Write-Host ""
Write-Host "Todo levantado. Se abrieron 4 terminales." -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend   -> http://localhost:$FRONTEND_PORT" -ForegroundColor Blue
Write-Host "  Checkout   -> http://localhost:$CHECKOUT_PORT" -ForegroundColor DarkMagenta
Write-Host "  Backend    -> http://localhost:$BACKEND_PORT" -ForegroundColor Green
Write-Host "  Swagger UI -> http://localhost:$BACKEND_PORT/api-docs" -ForegroundColor Cyan
Write-Host "  Service    -> revisa la terminal de .NET para el puerto" -ForegroundColor Magenta
Write-Host ""
