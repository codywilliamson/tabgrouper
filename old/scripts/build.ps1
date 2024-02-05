param($version)

# Call the increment_version script
.\scripts\Increment-Version.ps1 -version $version

# Create the zip file
Compress-Archive -Path assets, LICENSE, manifest.json, popup.html, popup.js, tabGrouper.js, readme.md -DestinationPath .\releases\tabgrouper_$version.zip
