@echo off
chcp 65001
cd /d D:\research\research01

echo ========================================
echo 添加并提交所有更改
echo ========================================
echo.

echo [1/3] 添加所有文件...
git add .
echo ✅ 文件已添加
echo.

echo [2/3] 创建提交...
git commit -m "feat: 完善图片压缩功能并添加其他功能页面" -m "" -m "✨ 新增内容:" -m "- 完善图片压缩功能（拖拽上传、预览、质量控制）" -m "- 创建抠图去背景功能页面" -m "- 创建图片识别功能页面" -m "- 创建AI生图功能页面" -m "- 添加各种帮助文档和脚本" -m "" -m "🎨 图片压缩功能亮点:" -m "- 支持拖拽上传" -m "- 实时预览和详细信息展示" -m "- 多格式支持（JPG/PNG/WebP/GIF）" -m "- 智能压缩质量控制（10-100%%）" -m "- 压缩率可视化展示" -m "- 本地处理，保护隐私" -m "" -m "📁 文件结构:" -m "- app/compress/ - 图片压缩" -m "- app/remove-bg/ - 抠图去背景" -m "- app/recognize/ - 图片识别" -m "- app/generate/ - AI生图"
echo.

if %errorlevel% equ 0 (
    echo ✅ 提交成功
    echo.

    echo [3/3] 推送到 GitHub...
    git push origin main
    echo.

    if %errorlevel% equ 0 (
        echo ========================================
        echo ✅✅✅ 完成！代码已成功推送到 GitHub
        echo ========================================
        echo.
        echo 查看你的仓库：
        echo https://github.com/Melody1319/research01
        echo.
    ) else (
        echo ========================================
        echo ❌ 推送失败
        echo ========================================
        echo.
        echo 请检查：
        echo 1. 网络连接
        echo 2. GitHub 账号权限
        echo 3. 可能需要在 GitHub Desktop 中操作
        echo.
    )
) else (
    echo ❌ 提交失败
    echo.
)

pause
