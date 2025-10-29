@echo off
cls

echo ====================================
echo   Project Cleanup and SSH Push Tool
echo ====================================
echo.

echo Step 1: Checking Git availability...
"C:\Program Files\Git\bin\git.exe" --version 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git command not available!
    echo Please ensure Git is properly installed.
    goto end
)

echo Git is available!
echo.

echo Step 2: Cleaning unnecessary files...
echo Keeping only essential files:
echo - frontend/ (frontend project)
echo - README.md
echo - .gitignore
echo - Project documentation files

echo.
echo Deleting temporary script files...

REM Delete batch files
del /q auto_ssh_key.bat 2>nul
del /q check_and_push.ps1 2>nul
del /q clone_repo_english.bat 2>nul
del /q create_ssh_key.bat 2>nul
del /q direct_clone_repo.bat 2>nul
del /q fix_git_path.bat 2>nul
del /q generate_ssh_keys.bat 2>nul
del /q git_connection_test.bat 2>nul
del /q git_diagnostic_clone.bat 2>nul
del /q install_git.bat 2>nul
del /q install_git_english.bat 2>nul
del /q install_git_simple.bat 2>nul
del /q open_git_download.bat 2>nul
del /q push_code.bat 2>nul
del /q push_english.bat 2>nul
del /q push_script.ps1 2>nul
del /q push_to_github.ps1 2>nul
del /q push_to_github_repo.ps1 2>nul
del /q push_to_new_repo.ps1 2>nul
del /q push_with_git_path.bat 2>nul
del /q push_with_installed_git.ps1 2>nul
del /q simple_clone.bat 2>nul
del /q simple_install_git.bat 2>nul
del /q simple_ssh_key.bat 2>nul
del /q ssh_key_english.bat 2>nul
del /q clean_and_push.bat 2>nul

echo.
echo File cleanup completed!
echo.

echo Step 3: Initializing Git repository...
"C:\Program Files\Git\bin\git.exe" init

echo.
echo Step 4: Adding files to Git...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo Step 5: Committing changes...
"C:\Program Files\Git\bin\git.exe" commit -m "Clean project files and prepare for GitHub push"

echo.
echo Step 6: Adding remote repository (SSH)...
"C:\Program Files\Git\bin\git.exe" remote add origin git@github.com:20231201014/20231201014.git

echo.
echo Step 7: Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS! Project pushed to GitHub!
    echo Repository: https://github.com/20231201014/20231201014
) else (
    echo.
    echo Push failed! Trying master branch...
    "C:\Program Files\Git\bin\git.exe" push -u origin master
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo SUCCESS! Project pushed to GitHub (master branch)!
        echo Repository: https://github.com/20231201014/20231201014
    ) else (
        echo.
        echo PUSH FAILED! Possible reasons:
        echo 1. Repository does not exist or no permission
        echo 2. SSH key not added to GitHub
        echo 3. Network connection issue
        echo.
        echo Check: https://github.com/20231201014/20231201014
    )
)

:end
echo.
echo Press any key to exit...
pause >nul