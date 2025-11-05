@echo off
chcp 65001
cd /d D:\research\research01

echo ========================================
echo 提交抠图去背景功能
echo ========================================
echo.

echo [检查] 检查 Git 状态...
git status
echo.

echo [1/4] 添加所有文件...
git add .
if %errorlevel% neq 0 (
    echo ❌ 添加文件失败
    pause
    exit /b 1
)
echo ✅ 文件添加成功
echo.

echo [2/4] 创建提交...
git commit -m "feat: 实现抠图去背景功能" -m "" -m "✨ 新增功能:" -m "- 集成 Remove.bg API 实现 AI 智能抠图" -m "- 支持点击和拖拽上传图片" -m "- 实时预览原图和处理结果" -m "- 输出高质量 PNG 透明背景图片" -m "- 一键下载处理后的图片" -m "" -m "🎨 UI 优化:" -m "- 拖拽上传视觉反馈" -m "- 加载过程显示动画" -m "- 棋盘格背景显示透明效果" -m "- 详细的文件信息展示" -m "- 完整的错误提示机制" -m "- 响应式设计，支持移动端" -m "" -m "🔧 技术实现:" -m "- 创建 Next.js API 路由 (app/api/remove-bg/route.ts)" -m "- 环境变量安全存储 API Key (.env.local)" -m "- 完善的错误处理和用户反馈" -m "- 内存管理，防止泄漏" -m "- TypeScript 类型安全" -m "" -m "📁 文件变更:" -m "- 新增: app/api/remove-bg/route.ts - API 路由" -m "- 新增: .env.local - 环境变量配置" -m "- 更新: app/remove-bg/page.tsx - 完整功能实现" -m "- 新增: REMOVE_BG_README.md - 使用说明文档" -m "" -m "🎯 功能特点:" -m "- AI 智能识别主体，3-5 秒完成处理" -m "- 支持人像、产品图、宠物等多种场景" -m "- 专业级抠图效果，边缘自然流畅" -m "- 免费版提供 50 次/月额度"

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ 提交失败或没有更改需要提交
    echo.
    pause
    exit /b 1
)
echo ✅ 提交成功
echo.

echo [3/4] 查看提交信息...
git log --oneline -1
echo.

echo [4/4] 推送到 GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ 推送到 main 分支失败，尝试 master 分支...
    git push origin master
    if %errorlevel% neq 0 (
        echo.
        echo ❌ 推送失败
        echo.
        echo 可能的原因：
        echo 1. 网络连接问题
        echo 2. 需要身份验证
        echo 3. 分支名称不匹配
        echo.
        echo 请尝试在 GitHub Desktop 中推送
        echo.
        pause
        exit /b 1
    )
)
echo.

echo ========================================
echo ✅✅✅ 成功完成！
echo ========================================
echo.
echo 代码已推送到：
echo https://github.com/Melody1319/research01
echo.
echo 本次提交内容：
echo - 实现抠图去背景功能
echo - 集成 Remove.bg API
echo - 完整的 UI 和交互
echo.
pause
