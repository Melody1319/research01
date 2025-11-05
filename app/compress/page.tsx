"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    originalSize: number;
    compressedSize?: number;
    width?: number;
    height?: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 清理 URL 对象以防止内存泄漏
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [previewUrl, compressedUrl]);

  const processFile = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      // 清理旧的 URL
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCompressedUrl("");

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
      alert("请选择有效的图片文件（JPG、PNG、GIF、WebP 等）");
    }
  }, [previewUrl, compressedUrl]);

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

  const handleCompress = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      // 创建一个 canvas 来压缩图片
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("无法创建 Canvas 上下文");
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // 根据原始文件类型选择输出格式
      let outputType = "image/jpeg";
      let fileExtension = "jpg";

      // PNG 格式保持透明度
      if (selectedFile.type === "image/png") {
        outputType = "image/png";
        fileExtension = "png";
      } else if (selectedFile.type === "image/webp") {
        outputType = "image/webp";
        fileExtension = "webp";
      }

      // 转换为压缩后的 blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
            setFileInfo((prev) =>
              prev ? { ...prev, compressedSize: blob.size } : null
            );
          } else {
            alert("压缩失败，请重试");
          }
          setIsProcessing(false);
        },
        outputType,
        outputType === "image/png" ? undefined : quality / 100
      );
    } catch (error) {
      console.error("压缩失败:", error);
      alert("压缩失败: " + (error instanceof Error ? error.message : "未知错误"));
      setIsProcessing(false);
    }
  }, [selectedFile, previewUrl, quality]);

  const handleDownload = useCallback(() => {
    if (!compressedUrl || !selectedFile) return;

    const a = document.createElement("a");
    a.href = compressedUrl;

    // 保持原始文件扩展名
    const originalName = selectedFile.name;
    const extensionMatch = originalName.match(/\.[^.]+$/);
    const extension = extensionMatch ? extensionMatch[0] : ".jpg";
    const nameWithoutExt = originalName.replace(/\.[^.]+$/, "");

    a.download = `compressed_${nameWithoutExt}${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [compressedUrl, selectedFile]);

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);

    setSelectedFile(null);
    setPreviewUrl("");
    setCompressedUrl("");
    setFileInfo(null);
    setQuality(80);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl, compressedUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const compressionRate =
    fileInfo?.compressedSize && fileInfo?.originalSize
      ? (
          ((fileInfo.originalSize - fileInfo.compressedSize) /
            fileInfo.originalSize) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
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
            图片压缩
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
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
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
                {isDragging ? "📥" : selectedFile ? "✅" : "📁"}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {selectedFile
                  ? selectedFile.name
                  : isDragging
                  ? "松开鼠标上传"
                  : "点击选择图片或拖拽上传"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedFile
                  ? `${formatFileSize(selectedFile.size)} - ${fileInfo?.width} × ${fileInfo?.height}px`
                  : "支持 JPG、PNG、GIF、WebP 等格式"}
              </p>
            </label>
          </div>

          {/* Quality Slider */}
          {selectedFile && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  压缩质量: {quality}%
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {quality < 50
                    ? "低质量 - 体积最小"
                    : quality < 80
                    ? "中等质量 - 平衡"
                    : "高质量 - 体积较大"}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => {
                  setQuality(Number(e.target.value));
                  setCompressedUrl(""); // 重置压缩结果
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${quality}%, #e5e7eb ${quality}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && (
            <div className="mt-6 flex gap-4">
              {!compressedUrl ? (
                <>
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                        压缩中...
                      </span>
                    ) : (
                      "🗜️ 开始压缩"
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
        {(previewUrl || compressedUrl) && (
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
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      文件格式:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white uppercase">
                      {selectedFile?.type.replace("image/", "")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Compressed Image */}
            {compressedUrl ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    压缩后
                  </h3>
                  <span className="text-xs bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full font-medium">
                    已压缩
                  </span>
                </div>
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={compressedUrl}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                </div>
                {fileInfo?.compressedSize && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        压缩后大小:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatFileSize(fileInfo.compressedSize)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        减少大小:
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatFileSize(
                          fileInfo.originalSize - fileInfo.compressedSize
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        压缩率:
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {compressionRate}%
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{
                              width: `${100 - parseFloat(compressionRate)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {100 - parseFloat(compressionRate)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        保留了原图的{" "}
                        {(100 - parseFloat(compressionRate)).toFixed(1)}% 大小
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleDownload}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
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
                  下载压缩图片
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">⏳</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    调整压缩质量后点击"开始压缩"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            💡 使用提示
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              • <strong>推荐质量设置：</strong>70-90% 可以在质量和大小之间取得良好平衡
            </li>
            <li>
              • <strong>格式支持：</strong>支持 JPG、PNG、WebP、GIF
              等主流图片格式
            </li>
            <li>
              • <strong>隐私安全：</strong>
              所有处理都在本地浏览器完成，不会上传到服务器
            </li>
            <li>
              • <strong>PNG 透明度：</strong>PNG
              格式会保留透明通道，但压缩效果有限
            </li>
            <li>
              • <strong>最佳实践：</strong>网页使用建议 60-80%
              质量，打印使用建议 90%+ 质量
            </li>
            <li>
              • <strong>文件命名：</strong>压缩后的文件会自动添加
              "compressed_" 前缀
            </li>
          </ul>
        </div>

        {/* Feature Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              极速处理
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              基于 Canvas API 的本地处理，无需等待上传下载，瞬间完成压缩
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              隐私保护
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              图片不会离开你的设备，完全在浏览器本地处理，100% 安全
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              精确控制
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              自由调节压缩质量，实时预览效果，找到最适合的平衡点
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
