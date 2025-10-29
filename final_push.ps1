Write-Host "====================================" -ForegroundColor Green
Write-Host "   Final Project Cleanup and Push" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Step 1: Clean up unnecessary files
Write-Host "Step 1: Cleaning up unnecessary files..." -ForegroundColor Yellow
$filesToRemove = @(
    "auto_ssh_key.bat",
    "clean_and_push.bat", 
    "clean_and_push_english.bat",
    "clean_and_push.ps1",
    "final_clean_push.bat",
    "fix_git_path.bat",
    "push_with_https.ps1",
    "SSH密钥使用指南.md",
    "手动推送指南.txt",
    "推送代码.bat",
    "推送代码到GitHub.bat",
    "最终推送指南.md",
    "安装Git.bat"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removed: $file" -ForegroundColor Gray
    }
}
Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host ""

# Step 2: Add all remaining files to Git
Write-Host "Step 2: Adding files to Git..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" add .
Write-Host "Files added to Git!" -ForegroundColor Green
Write-Host ""

# Step 3: Check if there are changes to commit
Write-Host "Step 3: Checking for changes to commit..." -ForegroundColor Yellow
$status = & "C:\Program Files\Git\bin\git.exe" status --porcelain
if ($status) {
    Write-Host "Changes detected, committing..." -ForegroundColor Yellow
    & "C:\Program Files\Git\bin\git.exe" commit -m "Clean project structure - removed temporary files"
    Write-Host "Changes committed!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit." -ForegroundColor Green
}
Write-Host ""

# Step 4: Push to GitHub using HTTPS
Write-Host "Step 4: Pushing to GitHub (HTTPS)..." -ForegroundColor Yellow
Write-Host "Repository: https://github.com/20231201014/20231201014" -ForegroundColor Cyan
Write-Host ""

# Try pushing to main branch
Write-Host "Attempting to push to main branch..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" branch -M main
$result = & "C:\Program Files\Git\bin\git.exe" push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "   SUCCESS! Project pushed to GitHub!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "Repository: https://github.com/20231201014/20231201014" -ForegroundColor Cyan
    Write-Host "Branch: main" -ForegroundColor Cyan
} else {
    Write-Host "Push to main failed. Trying master branch..." -ForegroundColor Yellow
    & "C:\Program Files\Git\bin\git.exe" branch -M master
    $result = & "C:\Program Files\Git\bin\git.exe" push -u origin master 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "" -ForegroundColor Green
        Write-Host "====================================" -ForegroundColor Green
        Write-Host "   SUCCESS! Project pushed to GitHub!" -ForegroundColor Green
        Write-Host "====================================" -ForegroundColor Green
        Write-Host "Repository: https://github.com/20231201014/20231201014" -ForegroundColor Cyan
        Write-Host "Branch: master" -ForegroundColor Cyan
    } else {
        Write-Host "" -ForegroundColor Red
        Write-Host "====================================" -ForegroundColor Red
        Write-Host "   PUSH FAILED" -ForegroundColor Red
        Write-Host "====================================" -ForegroundColor Red
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        Write-Host ""
        Write-Host "Possible solutions:" -ForegroundColor Yellow
        Write-Host "1. Check if repository exists: https://github.com/20231201014/20231201014" -ForegroundColor Yellow
        Write-Host "2. You may need to manually enter GitHub credentials" -ForegroundColor Yellow
        Write-Host "3. If using 2FA, use Personal Access Token as password" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Project cleanup completed!" -ForegroundColor Green
Write-Host "Remaining files are clean and ready for development." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")