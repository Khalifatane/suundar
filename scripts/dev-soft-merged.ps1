Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$port = 3000
$connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1

if ($null -ne $connection) {
  $process = Get-Process -Id $connection.OwningProcess -ErrorAction Stop

  if ($process.ProcessName -ne "node") {
    Write-Error "Port $port is already in use by '$($process.ProcessName)' (PID $($process.Id)). Stop that process manually, then run pnpm dev again."
    exit 1
  }

  Write-Host "Freeing stale Node process on port $port (PID $($process.Id))..."
  Stop-Process -Id $process.Id -Force
  Start-Sleep -Milliseconds 300
}

& pnpm turbo run dev --filter=storefront
exit $LASTEXITCODE
