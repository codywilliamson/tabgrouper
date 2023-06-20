param($version)

# Load the manifest
$json = Get-Content -Path ..\manifest.json -Raw | ConvertFrom-Json

# Set the new version
$json.version = $version

# Save the manifest
$json | ConvertTo-Json -Depth 32 | Set-Content -Path ..\manifest.json