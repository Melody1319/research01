@echo off
chcp 65001
cd /d D:\research\research01

echo === Git Status ===
git status

echo.
echo === Adding all changes ===
git add .

echo.
echo === Creating commit ===
git commit -m "feat: 创建图片综合处理网站" -m "- 更新首页为四个功能入口页面" -m "- 新增图片压缩功能（支持本地压缩、质量调节、下载）" -m "- 新增抠图去背景功能（含API集成说明）" -m "- 新增图片识别功能（支持通用识别、OCR、物体检测）" -m "- 新增AI生图功能（支持多种风格和比例选择）" -m "- 所有页面支持响应式设计和暗色模式"

echo.
echo === Pushing to remote ===
git push origin main

echo.
echo === Done! ===
pause
