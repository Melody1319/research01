"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

export default function RemoveBackgroundPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<{
    originalSize: number;
    width?: number;
    height?: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 清理 URL 对象以防止内存泄漏
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [previewUrl, processedUrl]);

  const processFile = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        // 清理旧的 URL
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (processedUrl) URL.revokeObjectURL(processedUrl);

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setProcessedUrl("");
        setError("");

        // 获取图片尺寸
        const img = new Image();
        img.onload = () => {
          setFileInfo({
            originalSize: file.size,
            width: img.width,
            height: img.height,
          });
        };
        img.src = url;
      } else {
        setError("请选择有效的图片文件（JPG、PNG 等）");
      }
    },
    [previewUrl, processedUrl]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  // 拖拽功能
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleRemoveBackground = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError("");

    try {
      // 准备表单数据
      const formData = new FormData();
      formData.append("image", selectedFile);

      // 调用我们的 API 路由
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "去除背景失败");
      }

      // 获取处理后的图片
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
    } catch (error) {
      console.error("去除背景失败:", error);
      setError(
        error instanceof Error ? error.message : "处理失败，请稍后重试"
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile]);

  const handleDownload = useCallback(() => {
    if (!processedUrl || !selectedFile) return;

    const a = document.createElement("a");
    a.href = processedUrl;

    // 生成文件名
    const originalName = selectedFile.name;
    const nameWithoutExt = originalName.replace(/\.[^.]+$/, "");
    a.download = `${nameWithoutExt}-no-bg.png`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [processedUrl, selectedFile]);

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);

    setSelectedFile(null);
    setPreviewUrl("");
    setProcessedUrl("");
    setFileInfo(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl, processedUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

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
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105"
                : "border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
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
              <div className="text-6xl mb-4">
                {isDragging ? "📥" : selectedFile ? "✅" : "✂️"}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedFile
                  ? selectedFile.name
                  : isDragging
                  ? "松开鼠标上传"
                  : "点击选择图片或拖拽上传"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedFile && fileInfo
                  ? `${formatFileSize(fileInfo.originalSize)} - ${fileInfo.width} × ${fileInfo.height}px`
                  : "支持 JPG、PNG 等格式，AI智能识别主体"}
              </p>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && (
            <div className="mt-6 flex gap-4">
              {!processedUrl ? (
                <>
                  <button
                    onClick={handleRemoveBackground}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        AI处理中...
                      </span>
                    ) : (
                      "✂️ 一键去背景"
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    重新选择
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  🔄 处理新图片
                </button>
              )}
            </div>
          )}
        </div>

        {/* Preview Section */}
        {(previewUrl || processedUrl) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  原始图片
                </h3>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                  原图
                </span>
              </div>
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
              {fileInfo && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      文件大小:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatFileSize(fileInfo.originalSize)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      图片尺寸:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {fileInfo.width} × {fileInfo.height}px
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Processed Image */}
            {processedUrl ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    去除背景后
                  </h3>
                  <span className="text-xs bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full font-medium">
                    已处理
                  </span>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  {/* 棋盘格背景 */}
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
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    ✅ 背景已成功去除，保存为 PNG 透明格式
                  </p>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    下载透明图片
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">⏳</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    点击"一键去背景"开始处理
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    使用 AI 技术智能识别主体
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Info */}
        <div className="mt-12 bg-purple-50 dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            ✨ 功能特点
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  AI 智能识别
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  使用 Remove.bg API，AI 自动识别主体，精准去除背景
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  快速处理
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  专业级 API 服务，通常 3-5 秒内完成处理
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🎨</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  高质量输出
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  PNG 透明背景，保持高清画质，边缘自然流畅
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
            <li>
              • <strong>最佳效果：</strong>人像照片、产品图效果最好，主体清晰效果更佳
            </li>
            <li>
              • <strong>支持格式：</strong>JPG、PNG 等常见图片格式
            </li>
            <li>
              • <strong>输出格式：</strong>自动保存为 PNG 透明背景图片
            </li>
            <li>
              • <strong>应用场景：</strong>证件照、电商主图、海报设计、社交媒体等
            </li>
            <li>
              • <strong>API 限制：</strong>免费版每月 50 次，需要更多请升级套餐
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
