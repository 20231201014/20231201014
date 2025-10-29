# 百度贴吧项目推送GitHub自动化脚本
# 创建日期: 2024-01-01
# 功能: 检查Git安装状态并将项目推送到GitHub

# 设置脚本错误时停止执行
$ErrorActionPreference = "Stop"

# 项目根目录
$ProjectRoot = "c:\Users\35793\Desktop\新建文件夹\20231201014--"
# GitHub仓库地址
$GitHubRepoUrl = "https://github.com/20231201014/20231201014--.git"
# Git下载URL
$GitDownloadUrl = "https://github.com/git-for-windows/git/releases/latest/download/Git-2.43.0-64-bit.exe"

# 函数: 检查Git是否已安装
function Test-GitInstalled {
    try {
        # 尝试获取Git版本
        $gitVersion = git --version
        Write-Host "✓ Git已安装: $gitVersion" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ Git未安装在系统路径中" -ForegroundColor Red
        return $false
    }
}

# 函数: 显示Git安装指南
function Show-GitInstallationGuide {
    Write-Host "`n=======================================" -ForegroundColor Yellow
    Write-Host "Git安装指南:" -ForegroundColor Yellow
    Write-Host "=======================================" -ForegroundColor Yellow
    Write-Host "1. 下载Git安装程序:" -ForegroundColor Cyan
    Write-Host "   访问 $GitDownloadUrl 或 https://git-scm.com/download/win"
    Write-Host "`n2. 运行安装程序并保持默认设置"
    Write-Host "`n3. 安装完成后，重启PowerShell再运行此脚本"
    Write-Host "=======================================" -ForegroundColor Yellow
    
    # 提供下载选项
    $downloadResponse = Read-Host "是否要自动打开Git下载页面? (Y/N)"
    if ($downloadResponse -eq "Y" -or $downloadResponse -eq "y") {
        Start-Process $GitDownloadUrl
        Write-Host "已打开Git下载页面..." -ForegroundColor Green
    }
}

# 函数: 配置Git用户信息
function Set-GitUserInfo {
    Write-Host "`n=======================================" -ForegroundColor Yellow
    Write-Host "Git用户配置" -ForegroundColor Yellow
    Write-Host "=======================================" -ForegroundColor Yellow
    
    # 获取用户输入的GitHub用户名
    $userName = Read-Host "请输入您的GitHub用户名"
    while ([string]::IsNullOrEmpty($userName)) {
        $userName = Read-Host "用户名不能为空，请重新输入"
    }
    
    # 获取用户输入的GitHub邮箱
    $userEmail = Read-Host "请输入您的GitHub邮箱"
    while ([string]::IsNullOrEmpty($userEmail)) {
        $userEmail = Read-Host "邮箱不能为空，请重新输入"
    }
    
    # 配置Git用户信息
    try {
        git config --global user.name "$userName"
        git config --global user.email "$userEmail"
        Write-Host "✓ Git用户信息配置成功" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ Git用户信息配置失败: $_" -ForegroundColor Red
        return $false
    }
}

# 函数: 初始化Git仓库
function Initialize-GitRepository {
    param(
        [string]$RepoPath
    )
    
    Write-Host "`n=======================================" -ForegroundColor Yellow
    Write-Host "初始化Git仓库" -ForegroundColor Yellow
    Write-Host "=======================================" -ForegroundColor Yellow
    
    # 进入项目目录
    Set-Location -Path $RepoPath
    Write-Host "当前目录: $(Get-Location)" -ForegroundColor Cyan
    
    # 检查是否已经有.git目录
    if (Test-Path -Path ".git" -PathType Container) {
        Write-Host "✓ Git仓库已存在" -ForegroundColor Green
        return $true
    }
    
    # 初始化Git仓库
    try {
        git init
        Write-Host "✓ Git仓库初始化成功" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ Git仓库初始化失败: $_" -ForegroundColor Red
        return $false
    }
}

# 函数: 添加所有文件到Git
function Add-FilesToGit {
    try {
        Write-Host "正在添加文件到Git..." -ForegroundColor Cyan
        git add .
        Write-Host "✓ 文件添加成功" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ 文件添加失败: $_" -ForegroundColor Red
        return $false
    }
}

# 函数: 提交Git更改
function Commit-GitChanges {
    param(
        [string]$CommitMessage = "初始化百度贴吧毕业设计项目"
    )
    
    try {
        Write-Host "正在提交更改..." -ForegroundColor Cyan
        git commit -m "$CommitMessage"
        Write-Host "✓ 提交成功" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ 提交失败: $_" -ForegroundColor Red
        return $false
    }
}

# 函数: 关联GitHub远程仓库
function Add-GitRemoteRepository {
    param(
        [string]$RemoteUrl
    )
    
    # 检查是否已经有关联的远程仓库
    try {
        $remoteExists = git remote -v
        if ($remoteExists -match "origin") {
            Write-Host "✓ 远程仓库已关联: $RemoteUrl" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "检查远程仓库时出错: $_" -ForegroundColor Yellow
    }
    
    # 添加远程仓库
    try {
        Write-Host "正在关联GitHub远程仓库..." -ForegroundColor Cyan
        git remote add origin $RemoteUrl
        Write-Host "✓ 远程仓库关联成功" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ 远程仓库关联失败: $_" -ForegroundColor Red
        return $false
    }
}

# 函数: 推送到GitHub
function Push-ToGitHub {
    try {
        Write-Host "`n=======================================" -ForegroundColor Yellow
        Write-Host "推送到GitHub" -ForegroundColor Yellow
        Write-Host "=======================================" -ForegroundColor Yellow
        Write-Host "正在推送代码到GitHub..." -ForegroundColor Cyan
        Write-Host "注意: 首次推送需要输入GitHub凭证"
        Write-Host "      GitHub推荐使用个人访问令牌作为密码"
        
        # 推送到GitHub
        git push -u origin master
        
        Write-Host "`n✓ 代码成功推送到GitHub!" -ForegroundColor Green
        Write-Host "✓ 仓库地址: $GitHubRepoUrl" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "`n✗ 推送失败: $_" -ForegroundColor Red
        Write-Host "`n可能的解决方案:" -ForegroundColor Yellow
        Write-Host "1. 检查您的网络连接"
        Write-Host "2. 确认您有权限访问该GitHub仓库"
        Write-Host "3. 确保您的GitHub用户名和访问令牌正确"
        Write-Host "4. 如果使用访问令牌，请确保有足够的权限(repo权限)"
        return $false
    }
}

# 函数: 显示推送指南
function Show-PushGuide {
    Write-Host "`n=======================================" -ForegroundColor Green
    Write-Host "✓ 百度贴吧项目推送脚本完成" -ForegroundColor Green
    Write-Host "=======================================" -ForegroundColor Green
    Write-Host "`n后续开发命令参考:" -ForegroundColor Cyan
    Write-Host "1. 查看当前状态: git status"
    Write-Host "2. 添加修改的文件: git add ."
    Write-Host "3. 提交更改: git commit -m \"描述您的更改\""
    Write-Host "4. 推送到GitHub: git push"
    Write-Host "5. 从GitHub拉取最新代码: git pull"
    Write-Host "`n您的项目前端部分已经完整实现，包含了:"
    Write-Host "- 登录注册页面"
    Write-Host "- 发布帖子功能"
    Write-Host "- 用户中心页面"
    Write-Host "- 完整的API服务配置"
    Write-Host "- 环境变量配置"
    Write-Host "- 响应式UI设计"
    Write-Host "`n祝您项目开发顺利!" -ForegroundColor Green
}

# 主函数
function Main {
    Clear-Host
    Write-Host "=======================================" -ForegroundColor Green
    Write-Host "百度贴吧毕业设计项目GitHub推送工具" -ForegroundColor Green
    Write-Host "=======================================" -ForegroundColor Green
    
    # 检查Git是否安装
    if (-not (Test-GitInstalled)) {
        Show-GitInstallationGuide
        return
    }
    
    # 配置Git用户信息
    if (-not (Set-GitUserInfo)) {
        Write-Host "请先正确配置Git用户信息" -ForegroundColor Red
        return
    }
    
    # 初始化Git仓库
    if (-not (Initialize-GitRepository -RepoPath $ProjectRoot)) {
        return
    }
    
    # 添加文件到Git
    if (-not (Add-FilesToGit)) {
        return
    }
    
    # 提交更改
    if (-not (Commit-GitChanges)) {
        return
    }
    
    # 关联GitHub远程仓库
    if (-not (Add-GitRemoteRepository -RemoteUrl $GitHubRepoUrl)) {
        return
    }
    
    # 推送到GitHub
    Push-ToGitHub
    
    # 显示推送指南
    Show-PushGuide
}

# 执行主函数
Main

# 暂停脚本，等待用户按Enter键退出
Read-Host "`n按Enter键退出..."