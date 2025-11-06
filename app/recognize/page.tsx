"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

export default function RecognizePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("请详细识别并描述这张图片的内容");
  const [fileInfo, setFileInfo] = useState<{
    size: number;
    width?: number;
    height?: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 清理 URL 对象
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const processFile = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setResult("");
        setError("");

        // 获取图片信息
        const img = new Image();
        img.onload = () => {
          setFileInfo({
            size: file.size,
            width: img.width,
            height: img.height,
          });
        };
        img.src = url;
      } else {
        setError("请选择有效的图片文件");
      }
    },
    [previewUrl]
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

  const handleRecognize = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("prompt", prompt);

      const response = await fetch("/api/recognize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "识别失败");
      }

      const data = await response.json();

      // 提取识别结果
      if (data.success && data.data.choices && data.data.choices.length > 0) {
        const content = data.data.choices[0].message.content;
        setResult(content);
      } else {
        throw new Error("未能获取识别结果");
      }
    } catch (error) {
      console.error("识别失败:", error);
      setError(
        error instanceof Error ? error.message : "识别失败，请稍后重试"
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, prompt]);

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(null);
    setPreviewUrl("");
    setResult("");
    setFileInfo(null);
    setError("");
    setPrompt("请详细识别并描述这张图片的内容");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const presetPrompts = [
    "请详细识别并描述这张图片的内容",
    "识别图片中的所有文字",
    "识别图片中的物体和场景",
    "分析图片的构图和色彩",
    "识别图片中的人物和动作",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
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
            图片识别
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
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 scale-105"
                : "border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400"
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
                {isDragging ? "📥" : selectedFile ? "✅" : "🔍"}
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
                  ? `${formatFileSize(fileInfo.size)} - ${fileInfo.width} × ${fileInfo.height}px`
                  : "支持 JPG、PNG、WebP 等格式"}
              </p>
            </label>
          </div>

          {/* Prompt Input */}
          {selectedFile && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                识别要求
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：识别图片中的所有文字"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500"
                rows={3}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {presetPrompts.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(preset)}
                    className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400 text-lg">
                  ⚠️
                </span>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && (
            <div className="mt-6 flex gap-4">
              {!result ? (
                <>
                  <button
                    onClick={handleRecognize}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                        AI 识别中...
                      </span>
                    ) : (
                      "🔍 开始识别"
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
                  🔄 识别新图片
                </button>
              )}
            </div>
          )}
        </div>

        {/* Result Section */}
        {(previewUrl || result) && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  图片预览
                </h3>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                  原图
                </span>
              </div>
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
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
                      {formatFileSize(fileInfo.size)}
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

            {/* Recognition Result */}
            {result ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    识别结果
                  </h3>
                  <span className="text-xs bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full font-medium">
                    已完成
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {result}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">⏳</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    点击"开始识别"分析图片
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    使用火山引擎 AI 技术
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Info */}
        <div className="mt-12 bg-green-50 dark:bg-gray-800 rounded-2xl p-6">
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
                  使用火山引擎 AI，精准识别图片内容
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💬</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  自定义提示
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  可自定义识别要求，获得更精准的结果
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📝</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  详细描述
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  提供详细的图片内容描述和分析
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-emerald-50 dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            💡 使用提示
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              • <strong>通用识别：</strong>AI
              自动分析图片内容，提供详细描述
            </li>
            <li>
              • <strong>文字识别：</strong>
              可识别图片中的文字（支持中英文）
            </li>
            <li>
              • <strong>物体检测：</strong>识别图片中的物体、场景和人物
            </li>
            <li>
              • <strong>自定义需求：</strong>可以自己输入识别要求获得更精准结果
            </li>
            <li>
              • <strong>最佳效果：</strong>图片清晰度越高，识别准确率越高
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
