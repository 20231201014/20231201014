@echo off
cls
echo ======================================================
echo           百度贴吧项目GitHub推送工具
setlocal enabledelayedexpansion

:: 检查Git是否安装
echo 正在检查Git安装状态...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git未安装！请先安装Git再运行此脚本。
    echo 
    echo Git安装步骤：
    echo 1. 访问 https://git-scm.com/download/win 下载Git
    echo 2. 运行安装程序，使用默认配置
    echo 3. 安装完成后重启电脑
    echo 4. 再次运行此脚本
    
    pause
    exit /b 1
)

:: Git已安装，显示版本
git --version
echo [SUCCESS] Git已正确安装。

:: 设置项目路径和GitHub仓库
set PROJECT_PATH="%~dp0"
set GITHUB_REPO="https://github.com/20231201014/20231201014--"

echo ======================================================
echo 项目路径: %PROJECT_PATH%
echo GitHub仓库: %GITHUB_REPO%
echo ======================================================

:: 创建或更新.gitignore文件
if not exist .gitignore (
    echo [INFO] 创建.gitignore文件...
    echo # Logs > .gitignore
    echo logs >> .gitignore
    echo *.log >> .gitignore
    echo npm-debug.log* >> .gitignore
    echo yarn-debug.log* >> .gitignore
    echo yarn-error.log* >> .gitignore
    echo pnpm-debug.log* >> .gitignore
    echo lerna-debug.log* >> .gitignore
    echo .npm >> .gitignore
    echo .yarn-integrity >> .gitignore
    echo # Build outputs >> .gitignore
    echo dist >> .gitignore
    echo dist-ssr >> .gitignore
    echo *.local >> .gitignore
    echo # Editor directories and files >> .gitignore
    echo .vscode/* >> .gitignore
    echo !.vscode/extensions.json >> .gitignore
    echo .idea >> .gitignore
    echo .DS_Store >> .gitignore
    echo *.suo >> .gitignore
    echo *.ntvs* >> .gitignore
    echo *.njsproj >> .gitignore
    echo *.sln >> .gitignore
    echo *.sw? >> .gitignore
    echo # Environment variables >> .gitignore
    echo .env >> .gitignore
    echo .env.local >> .gitignore
    echo .env.development.local >> .gitignore
    echo .env.test.local >> .gitignore
    echo .env.production.local >> .gitignore
    echo [SUCCESS] .gitignore文件创建成功。
)

:: 开始Git配置
echo 
echo ======================================================
echo 请输入您的GitHub账号信息：
echo ======================================================
set /p GITHUB_USERNAME="GitHub用户名: "
set /p GITHUB_EMAIL="GitHub邮箱: "

:: 配置Git用户信息
git config --global user.name "%GITHUB_USERNAME%"
git config --global user.email "%GITHUB_EMAIL%"
echo [SUCCESS] Git用户信息配置成功。

:: 检查是否已有.git目录
if not exist .git (
    echo 
echo ======================================================
    echo 初始化Git仓库...
    echo ======================================================
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] Git仓库初始化失败！
        pause
        exit /b 1
    )
    echo [SUCCESS] Git仓库初始化成功。
)

:: 添加远程仓库
echo 
echo ======================================================
echo 添加GitHub远程仓库...
echo ======================================================
git remote remove origin >nul 2>&1
set REMOTE_URL=https://github.com/20231201014/20231201014--.git
git remote add origin %REMOTE_URL%
if %errorlevel% neq 0 (
    echo [ERROR] 添加远程仓库失败！请检查仓库地址是否正确。
    echo 仓库地址: %REMOTE_URL%
    pause
    exit /b 1
)
echo [SUCCESS] 远程仓库添加成功。

:: 添加文件
echo 
echo ======================================================
echo 添加文件到Git...
echo ======================================================
git add .
if %errorlevel% neq 0 (
    echo [ERROR] 添加文件失败！
    pause
    exit /b 1
)
echo [SUCCESS] 文件添加成功。

:: 提交更改
echo 
echo ======================================================
echo 提交更改...
echo ======================================================
git commit -m "初始化百度贴吧毕业设计项目"
if %errorlevel% neq 0 (
    echo [ERROR] 提交更改失败！
    pause
    exit /b 1
)
echo [SUCCESS] 更改提交成功。

:: 推送到GitHub
echo 
echo ======================================================
echo 推送到GitHub...
echo ======================================================
echo 注意：首次推送需要输入GitHub凭证。
echo GitHub推荐使用个人访问令牌(Personal Access Token)作为密码。
echo 获取访问令牌: https://github.com/settings/tokens
echo 请确保令牌拥有repo权限。
echo ======================================================
git push -u origin master
if %errorlevel% neq 0 (
    echo 
    echo [ERROR] 推送失败！可能的原因：
    echo 1. 网络连接问题
    echo 2. GitHub凭证不正确
    echo 3. 没有仓库权限
    echo 4. 个人访问令牌权限不足
    echo 
    echo 请重试并确保凭证正确。
    pause
    exit /b 1
)

echo 
echo ======================================================
echo [SUCCESS] 代码成功推送到GitHub！
echo 仓库地址: %REMOTE_URL%
echo ======================================================
echo 
echo 常用Git命令：
echo 1. 查看状态: git status
echo 2. 添加修改: git add .
echo 3. 提交更改: git commit -m "描述"
echo 4. 推送代码: git push
echo 5. 拉取代码: git pull
echo 
echo 项目已成功推送到GitHub！祝您开发顺利！
pause
exit /b 0