Write-Host "====================================" -ForegroundColor Green
Write-Host "   Project Cleanup and SSH Push" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Step 1: Set Git configuration
Write-Host "Step 1: Setting Git configuration..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" config user.email "20231201014@example.com"
& "C:\Program Files\Git\bin\git.exe" config user.name "20231201014"
Write-Host "Git configuration set successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Remove existing remote if exists
Write-Host "Step 2: Removing existing remote repository..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" remote remove origin 2>$null
Write-Host "Remote repository cleaned!" -ForegroundColor Green
Write-Host ""

# Step 3: Initialize Git repository
Write-Host "Step 3: Initializing Git repository..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" init
Write-Host "Git repository initialized!" -ForegroundColor Green
Write-Host ""

# Step 4: Add all files to Git
Write-Host "Step 4: Adding files to Git..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" add .
Write-Host "Files added to Git!" -ForegroundColor Green
Write-Host ""

# Step 5: Commit changes
Write-Host "Step 5: Committing changes..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Clean project structure"
Write-Host "Changes committed!" -ForegroundColor Green
Write-Host ""

# Step 6: Add SSH remote repository
Write-Host "Step 6: Adding SSH remote repository..." -ForegroundColor Yellow
& "C:\Program Files\Git\bin\git.exe" remote add origin git@github.com:20231201014/20231201014.git
Write-Host "SSH remote added!" -ForegroundColor Green
Write-Host ""

# Step 7: Push to GitHub
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
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
    Write-Host "Trying master branch instead..." -ForegroundColor Yellow
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
        Write-Host "Possible issues:" -ForegroundColor Yellow
        Write-Host "1. Repository may not exist" -ForegroundColor Yellow
        Write-Host "2. SSH key not configured on GitHub" -ForegroundColor Yellow
        Write-Host "3. Check repository: https://github.com/20231201014/20231201014" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Error details:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")