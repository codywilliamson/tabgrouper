param($version)

# Change directory to the project root
Set-Location ..

# Call the increment_version script
.\scripts\increment_version.ps1 -version $version

# Create the zip file
Compress-Archive -Path assets, LICENSE, manifest.json, popup.html, popup.js, tabGrouper.js, readme.md -DestinationPath .\releases\tabgrouper_$version.zip
