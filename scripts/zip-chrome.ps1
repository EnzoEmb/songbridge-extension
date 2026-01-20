# Copy extension to temp build folder
Copy-Item -Path extension -Destination extension_v3_build -Recurse

Push-Location extension_v3_build

# Remove other manifests
Remove-Item manifest.json, manifest_v2.json -ErrorAction SilentlyContinue

# Rename v3 manifest
Rename-Item manifest_v3.json manifest.json

# Read version from manifest.json
$manifest = Get-Content manifest.json -Raw | ConvertFrom-Json
$version = $manifest.version

# Build zip name
$zipName = "../extension_chrome_v$version.zip"

# Zip contents
Compress-Archive -Path * -DestinationPath $zipName -Force

Pop-Location

# Cleanup
Remove-Item extension_v3_build -Recurse
