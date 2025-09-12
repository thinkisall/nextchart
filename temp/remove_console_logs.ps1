$files = Get-ChildItem -Path "D:\workspace\nextjschart\app" -Recurse -Include "*.ts","*.tsx","*.js","*.jsx" -File

foreach($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if($content -and ($content -match "console\.log|console\.warn")) {
        # Remove console.log and console.warn statements
        $newContent = $content -replace "\s*console\.log\([^)]*\);\s*`n?", "" -replace "\s*console\.warn\([^)]*\);\s*`n?", ""
        
        # Remove empty lines that might be left
        $newContent = $newContent -replace "`n`n`n+", "`n`n"
        
        if($newContent -ne $content) {
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "Updated: $($file.Name)"
        }
    }
}

Write-Host "Console.log and console.warn removal completed!"
