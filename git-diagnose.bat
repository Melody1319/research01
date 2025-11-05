@echo off
chcp 65001
echo ========================================
echo Git 环境诊断工具
echo ========================================
echo.

echo [检查 1] 检测 Git 是否安装...
where git >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git 已安装
    git --version
) else (
    echo ❌ Git 未安装或未添加到系统 PATH
    echo.
    echo 解决方案：
    echo 1. 下载 Git：https://git-scm.com/download/win
    echo 2. 安装时选择 "Git from the command line and also from 3rd-party software"
    echo 3. 安装后重启命令提示符
    echo.
    goto :check_common_paths
)
echo.

echo [检查 2] Git 安装路径...
where git
echo.

echo [检查 3] 当前目录...
cd
echo.

echo [检查 4] 切换到项目目录...
cd /d D:\research\research01
if %errorlevel% equ 0 (
    echo ✅ 成功切换到项目目录
) else (
    echo ❌ 项目目录不存在
)
echo.

echo [检查 5] 检查是否为 Git 仓库...
git status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 这是一个 Git 仓库
    echo.
    echo 当前分支：
    git branch
    echo.
    echo 远程仓库：
    git remote -v
) else (
    echo ❌ 这不是一个 Git 仓库
    echo.
    echo 需要初始化：
    echo git init
)
echo.

echo [检查 6] 检查待提交的更改...
git status
echo.

echo ========================================
echo 诊断完成
echo ========================================
echo.
goto :end

:check_common_paths
echo.
echo [额外检查] 查找常见 Git 安装位置...
if exist "C:\Program Files\Git\bin\git.exe" (
    echo ✅ 找到 Git：C:\Program Files\Git\bin\git.exe
    echo.
    echo 请将以下路径添加到系统 PATH：
    echo C:\Program Files\Git\bin
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    echo ✅ 找到 Git：C:\Program Files (x86)\Git\bin\git.exe
    echo.
    echo 请将以下路径添加到系统 PATH：
    echo C:\Program Files (x86)\Git\bin
) else (
    echo ❌ 未找到 Git 安装
)
echo.

:end
pause
