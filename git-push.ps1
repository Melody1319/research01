# Git 提交和推送脚本
Set-Location "D:\research\research01"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "图片处理网站 - Git 提交和推送" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] 查看当前状态..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "[2/4] 添加所有修改..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "[3/4] 创建提交..." -ForegroundColor Yellow
$commitMessage = @"
feat: 完善图片压缩功能

✨ 新增功能:
- 添加拖拽上传支持，可直接拖拽图片文件
- 实现图片预览功能，显示详细信息（大小、尺寸、格式）
- 支持多种图片格式（JPG、PNG、WebP、GIF）
- 智能压缩质量控制（10-100%）
- 压缩结果对比展示，包含压缩率可视化
- 文件下载功能，保持原始格式和文件名
- 重置功能，支持处理新图片

🎨 UI 优化:
- 拖拽时视觉反馈（边框高亮、缩放动画）
- 加载过程显示旋转动画
- 压缩质量滑块带渐变色可视化
- 详细的压缩信息展示（文件大小、压缩率、进度条）
- 响应式设计，完美支持移动端和桌面端
- 暗色模式全面支持

🔧 技术改进:
- 使用 Canvas API 本地处理图片
- 防止内存泄漏，自动清理 URL 对象
- 完善的错误处理机制
- TypeScript 类型安全
- 性能优化（useCallback、useEffect）

🔒 隐私保护:
- 所有处理在浏览器本地完成
- 图片不会上传到服务器
- 100% 数据安全
"@

git commit -m $commitMessage
Write-Host ""

Write-Host "[4/4] 推送到远端仓库..." -ForegroundColor Yellow
git push origin main
Write-Host ""

if ($LASTEXITCODE -eq 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ 提交和推送成功完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ 推送失败，请检查网络连接或权限" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}

Write-Host ""
Read-Host "按回车键退出"
