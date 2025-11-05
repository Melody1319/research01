# Git commit and push script
Set-Location "D:\research\research01"

Write-Host "=== Git Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Adding all changes ===" -ForegroundColor Cyan
git add .

Write-Host "`n=== Creating commit ===" -ForegroundColor Cyan
git commit -m "feat: 创建图片综合处理网站

- 更新首页为四个功能入口页面
- 新增图片压缩功能（支持本地压缩、质量调节、下载）
- 新增抠图去背景功能（含API集成说明）
- 新增图片识别功能（支持通用识别、OCR、物体检测）
- 新增AI生图功能（支持多种风格和比例选择）
- 所有页面支持响应式设计和暗色模式"

Write-Host "`n=== Pushing to remote ===" -ForegroundColor Cyan
git push origin main

Write-Host "`n=== Done! ===" -ForegroundColor Green
