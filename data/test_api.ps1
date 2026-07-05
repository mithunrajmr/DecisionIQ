$body = '{"priority": 65}'
$resp = Invoke-RestMethod -Uri 'http://localhost:8000/generate-scenarios' -Method POST -ContentType 'application/json' -Body $body
Write-Host "=== SCENARIOS RESPONSE ==="
$resp | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "=== EXPLANATION RESPONSE ==="
$body2 = '{"scenario": "AI Recommended", "priority": 65}'
$resp2 = Invoke-RestMethod -Uri 'http://localhost:8000/explanation' -Method POST -ContentType 'application/json' -Body $body2
$resp2 | ConvertTo-Json -Depth 10
