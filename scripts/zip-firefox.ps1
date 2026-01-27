# Copy extension to temp build folder
Copy-Item -Path extension -Destination extension_v2_build -Recurse

Push-Location extension_v2_build

# Remove other manifests
Remove-Item manifest.json, manifest_v3.json -ErrorAction SilentlyContinue

# Rename v2 manifest
Rename-Item manifest_v2.json manifest.json

# Read version from manifest.json
$manifest = Get-Content manifest.json -Raw | ConvertFrom-Json
$version = $manifest.version

# Build zip name
$zipName = "../extension_firefox_v$version.zip"

# ✅ Firefox-safe zip (NO backslashes)
tar -a -c -f $zipName *

Pop-Location

# Cleanup
Remove-Item extension_v2_build -Recurse
