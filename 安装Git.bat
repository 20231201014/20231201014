@echo off
cls
echo ====================================================================
echo          百度贴吧项目 - Git自动安装脚本
 echo ====================================================================
echo.
echo 此脚本将自动下载并安装Git，无需手动操作。
echo 安装完成后，您需要重新启动电脑使配置生效。
echo.

:: 设置下载路径和临时目录
set GIT_INSTALLER_URL=https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe
set INSTALLER_FILE=%TEMP%\Git-2.43.0-64-bit.exe
set INSTALL_DIR=C:\Program Files\Git

echo 正在下载Git安装程序...
:: 使用PowerShell下载Git安装程序
powershell -Command "$webClient = New-Object System.Net.WebClient; $webClient.DownloadFile('%GIT_INSTALLER_URL%', '%INSTALLER_FILE%')"

:: 检查下载是否成功
if not exist "%INSTALLER_FILE%" (
    echo 下载失败！请检查您的网络连接。
    echo 您可以手动从 https://git-scm.com/download/win 下载安装。
    pause
    exit /b 1
)

echo Git安装程序下载成功！
echo.
echo 正在安装Git...
echo 请耐心等待，这个过程可能需要几分钟...

:: 静默安装Git
start /wait "" "%INSTALLER_FILE%" /VERYSILENT /NORESTART /NOCANCEL /SP- /SUPPRESSMSGBOXES /COMPONENTS="icons,ext\reg\shellhere,assoc,assoc_sh" /DIR="%INSTALL_DIR%"

echo Git安装完成！
echo.

:: 添加Git到环境变量（当前会话）
set PATH=%INSTALL_DIR%\bin;%INSTALL_DIR%\cmd;%INSTALL_DIR%\mingw64\bin;%PATH%

echo 正在验证Git安装...
git --version
if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Git安装成功！版本信息如上所示。
    echo.
    echo 重要提示：
    echo 1. 您需要重新启动电脑以使Git完全配置到系统PATH中
    echo 2. 重启后，您可以使用我们提供的GitHub完整推送指南.md进行代码推送
    echo 3. 推送指南位于：%CD%\GitHub完整推送指南.md
    echo.
) else (
    echo.
    echo ❌ Git安装可能存在问题，请重启电脑后再次检查。
    echo 如果问题仍然存在，请参考GitHub完整推送指南中的手动安装步骤。
    echo.
)

:: 清理临时文件
del "%INSTALLER_FILE%"

echo 安装脚本已完成。
echo. 
pause