@echo off
chcp 65001
cd /d D:\research\research01

echo ========================================
echo Git 状态诊断
echo ========================================
echo.

echo [1] 当前分支和状态
git status
echo.

echo [2] 最近的提交记录（最新5条）
git log --oneline -5
echo.

echo [3] 本地和远程的差异
git log origin/main..HEAD --oneline
echo.

echo [4] 远程仓库配置
git remote -v
echo.

echo [5] 检查是否有未推送的提交
git status -sb
echo.

echo ========================================
echo 诊断完成
echo ========================================
echo.
echo 分析结果：
echo.
echo 如果 [3] 显示有提交记录 = 本地有提交但未推送
echo 如果 [3] 没有显示 = 本地和远程一致
echo.
pause
