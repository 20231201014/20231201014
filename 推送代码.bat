@echo off
cls
echo ====================================================================
echo                 百度贴吧项目 - 代码推送助手
 echo ====================================================================
echo.

:: 检查Git是否安装
where git > nul 2> nul
if %ERRORLEVEL% NEQ 0 (
    echo Git未安装！正在打开Git下载页面...
    echo.
    start https://git-scm.com/download/win
    echo 请按照《Git手动安装指南.md》完成安装，然后重新运行此脚本。
    echo.
    pause
    exit /b 1
)

echo Git已安装！正在准备推送代码...
echo.

:: 创建一个临时的PowerShell脚本，避免批处理中的特殊字符问题
echo $userName = "20231201014"
echo $email = Read-Host -Prompt "请输入您的GitHub邮箱地址: "
echo $repoUrl = "https://github.com/20231201014/20231201014--.git"
echo echo 正在配置Git用户信息...
echo git config --global user.name $userName
echo git config --global user.email $email
echo echo Git用户信息配置完成。
echo echo.
echo echo 初始化Git仓库...
echo git init
echo echo 仓库初始化完成。
echo echo.
echo echo 添加文件到暂存区...
echo git add .
echo echo 文件添加完成。
echo echo.
echo echo 提交更改...
echo git commit -m "初始化百度贴吧毕业设计项目"
echo echo 提交完成。
echo echo.
echo echo 添加远程仓库...
echo git remote add origin $repoUrl
echo echo 远程仓库添加完成。
echo echo.
echo echo 正在推送到GitHub...
echo echo 重要：首次推送时，请使用个人访问令牌而非密码！
echo git push -u origin master
echo echo.
echo echo 如果推送成功，您的代码已成功上传到GitHub仓库。
echo echo 如果遇到身份验证问题，请参考《GitHub账户推送指南.md》创建个人访问令牌。
echo echo.
echo pause> push_temp.ps1

:: 运行PowerShell脚本
powershell -ExecutionPolicy Bypass -File push_temp.ps1

:: 清理临时脚本
del push_temp.ps1

echo 推送操作完成。
pause