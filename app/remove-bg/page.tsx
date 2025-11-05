"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

export default function RemoveBackgroundPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setProcessedUrl("");
      }
    },
    []
  );

  const handleRemoveBackground = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    // 模拟处理延迟
    setTimeout(() => {
      // 实际项目中，这里应该调用抠图 API
      // 这里仅作为示例，显示提示信息
      alert(
        "此功能需要集成第三方抠图 API，如 remove.bg、百度AI、阿里云等服务。\n\n建议集成方案：\n1. remove.bg API\n2. 百度智能云图像处理\n3. 阿里云视觉智能开放平台\n4. 开源方案：rembg (Python)"
      );
      setIsProcessing(false);
    }, 1500);
  }, [selectedFile]);

  const handleDownload = useCallback(() => {
    if (!processedUrl) return;

    const a = document.createElement("a");
    a.href = processedUrl;
    a.download = `removed_bg_${selectedFile?.name || "image.png"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [processedUrl, selectedFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">
            抠图去背景
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="text-6xl mb-4">✂️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                点击选择图片或拖拽上传
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                支持 JPG、PNG 等格式，AI智能识别主体
              </p>
            </label>
          </div>

          {/* Process Button */}
          {selectedFile && !processedUrl && (
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isProcessing ? "处理中..." : "一键去背景"}
            </button>
          )}
        </div>

        {/* Preview Section */}
        {(previewUrl || processedUrl) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                原始图片
              </h3>
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Processed Image */}
            {processedUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  去除背景后
                </h3>
                <div className="relative aspect-square bg-transparent rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px",
                    }}
                  />
                  <img
                    src={processedUrl}
                    alt="Processed"
                    className="relative w-full h-full object-contain"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                  下载透明图片
                </button>
              </div>
            )}
          </div>
        )}

        {/* API Integration Info */}
        <div className="mt-12 bg-purple-50 dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🔌 API 集成说明
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium">推荐的抠图服务商：</p>
            <div className="space-y-2 pl-4">
              <div>
                <strong>1. Remove.bg</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • 专业抠图服务，效果好，有免费额度
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • API: https://www.remove.bg/api
                </p>
              </div>
              <div>
                <strong>2. 百度智能云</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • 提供人像分割、物体分割等服务
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • API: https://ai.baidu.com/tech/imageprocess
                </p>
              </div>
              <div>
                <strong>3. 阿里云视觉智能</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • 图像分割服务，支持多种场景
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • API: https://vision.aliyun.com/
                </p>
              </div>
              <div>
                <strong>4. 开源方案 rembg</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • Python 库，可自建服务
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • GitHub: https://github.com/danielgatis/rembg
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-pink-50 dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            💡 使用提示
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• 人像照片效果最佳，建议主体清晰、背景简单</li>
            <li>• 支持多种场景：人像、商品、动物等</li>
            <li>• 处理后的图片为 PNG 格式，支持透明背景</li>
            <li>• 可用于证件照、电商主图、海报设计等场景</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
