@echo off
cls

echo ====================================
echo   Final Project Cleanup and Push
echo ====================================
echo.

echo Step 1: Setting Git user configuration...
git config user.email "20231201014@example.com"
git config user.name "20231201014"

echo.
echo Step 2: Removing existing remote repository...
git remote remove origin 2>nul
echo.

echo Step 3: Manual file cleanup...
echo Deleting unnecessary files...

REM Delete all batch files except this one
for %%f in (*.bat) do if not "%%f"=="final_clean_push.bat" del /q "%%f" 2>nul

REM Delete PowerShell scripts
del /q *.ps1 2>nul

REM Delete temporary guide files (keep only essential ones)
del /q "GitHub完整推送指南.md" 2>nul
del /q "GitHub账户推送指南.md" 2>nul
del /q "Git命令列表.txt" 2>nul
del /q "Git安装与推送指南.md" 2>nul
del /q "Git手动安装指南.md" 2>nul
del /q "手动推送指南.txt" 2>nul
del /q "推送代码.bat" 2>nul
del /q "推送代码到GitHub.bat" 2>nul
del /q "安装Git.bat" 2>nul

REM Keep: README.md, .gitignore, frontend/, project docs
echo.
echo Files to keep:
dir /b | findstr /v "final_clean_push.bat"
echo.

echo Step 4: Initializing Git repository...
git init
echo.

echo Step 5: Adding files to Git...
git add .
echo.

echo Step 6: Committing changes...
git commit -m "Initial commit: Clean project structure"
echo.

echo Step 7: Adding SSH remote repository...
git remote add origin git@github.com:20231201014/20231201014.git
echo.

echo Step 8: Pushing to GitHub (main branch)...
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   SUCCESS! Project pushed to GitHub!
    echo ====================================
    echo Repository: https://github.com/20231201014/20231201014
    echo.
    echo Current directory contents:
    dir /b
) else (
    echo.
    echo Trying master branch instead...
    git branch -M master
    git push -u origin master
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ====================================
        echo   SUCCESS! Project pushed to GitHub!
        echo ====================================
        echo Repository: https://github.com/20231201014/20231201014
        echo Branch: master
    ) else (
        echo.
        echo ====================================
        echo   PUSH FAILED
        echo ====================================
        echo Possible issues:
        echo 1. Repository may not exist
        echo 2. SSH key not configured on GitHub
        echo 3. Check repository: https://github.com/20231201014/20231201014
    )
)

echo.
echo Press any key to exit...
pause >nul