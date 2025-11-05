@echo off
chcp 65001
cd /d D:\research\research01

echo ========================================
echo 图片处理网站 - Git 提交和推送
echo ========================================
echo.

echo [检查] 检测 Git 是否安装...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ 错误：未检测到 Git
    echo.
    echo 请先安装 Git：
    echo 1. 访问：https://git-scm.com/download/win
    echo 2. 下载并安装 Git for Windows
    echo 3. 安装后重新运行此脚本
    echo.
    echo 或者尝试以下方法：
    echo - 重启命令提示符
    echo - 重启电脑
    echo - 检查 Git 安装路径是否在系统 PATH 中
    echo.
    pause
    exit /b 1
)

echo ✅ Git 已安装
git --version
echo.

echo [1/4] 查看当前状态...
git status
if %errorlevel% neq 0 (
    echo.
    echo ❌ 错误：不是一个 Git 仓库
    echo.
    echo 初始化 Git 仓库...
    git init
    echo.
    echo 请设置远程仓库地址：
    echo git remote add origin https://github.com/你的用户名/你的仓库名.git
    echo.
    pause
    exit /b 1
)
echo.

echo [2/4] 添加所有修改...
git add .
if %errorlevel% neq 0 (
    echo ❌ 添加文件失败
    pause
    exit /b 1
)
echo ✅ 文件添加成功
echo.

echo [3/4] 创建提交...
git commit -m "feat: 完善图片压缩功能" -m "" -m "✨ 新增功能:" -m "- 添加拖拽上传支持，可直接拖拽图片文件" -m "- 实现图片预览功能，显示详细信息（大小、尺寸、格式）" -m "- 支持多种图片格式（JPG、PNG、WebP、GIF）" -m "- 智能压缩质量控制（10-100%%）" -m "- 压缩结果对比展示，包含压缩率可视化" -m "- 文件下载功能，保持原始格式和文件名" -m "- 重置功能，支持处理新图片" -m "" -m "🎨 UI 优化:" -m "- 拖拽时视觉反馈（边框高亮、缩放动画）" -m "- 加载过程显示旋转动画" -m "- 压缩质量滑块带渐变色可视化" -m "- 详细的压缩信息展示（文件大小、压缩率、进度条）" -m "- 响应式设计，完美支持移动端和桌面端" -m "- 暗色模式全面支持" -m "" -m "🔧 技术改进:" -m "- 使用 Canvas API 本地处理图片" -m "- 防止内存泄漏，自动清理 URL 对象" -m "- 完善的错误处理机制" -m "- TypeScript 类型安全" -m "- 性能优化（useCallback、useEffect）" -m "" -m "🔒 隐私保护:" -m "- 所有处理在浏览器本地完成" -m "- 图片不会上传到服务器" -m "- 100%% 数据安全"

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ 提交失败或没有更改需要提交
    echo.
    pause
    exit /b 1
)
echo ✅ 提交成功
echo.

echo [检查] 检查远程仓库配置...
git remote -v
if %errorlevel% neq 0 (
    echo.
    echo ❌ 未配置远程仓库
    echo.
    echo 请先配置远程仓库地址：
    echo git remote add origin https://github.com/你的用户名/你的仓库名.git
    echo.
    pause
    exit /b 1
)
echo.

echo [4/4] 推送到远端仓库...
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
        echo 2. 没有推送权限
        echo 3. 需要身份验证
        echo 4. 分支名称不匹配
        echo.
        echo 请尝试：
        echo - 检查网络连接
        echo - 使用 GitHub Desktop 或 VS Code 进行推送
        echo - 手动执行：git push origin main（或 master）
        echo.
        pause
        exit /b 1
    )
)
echo.

echo ========================================
echo ✅ 提交和推送成功完成！
echo ========================================
echo.
echo 下一步：
echo - 运行 npm run dev 启动开发服务器
echo - 访问 http://localhost:3000/compress 查看效果
echo.
pause
