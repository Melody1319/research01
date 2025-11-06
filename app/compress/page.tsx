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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [previewUrl, compressedUrl]);

  const processFile = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCompressedUrl("");

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
      alert("请选择有效的图片文件");
    }
  }, [previewUrl, compressedUrl]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

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
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("无法创建 Canvas 上下文");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let outputType = "image/jpeg";
      if (selectedFile.type === "image/png") outputType = "image/png";
      else if (selectedFile.type === "image/webp") outputType = "image/webp";

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
            setFileInfo((prev) =>
              prev ? { ...prev, compressedSize: blob.size } : null
            );
          }
          setIsProcessing(false);
        },
        outputType,
        outputType === "image/png" ? undefined : quality / 100
      );
    } catch (error) {
      alert("压缩失败");
      setIsProcessing(false);
    }
  }, [selectedFile, previewUrl, quality]);

  const handleDownload = useCallback(() => {
    if (!compressedUrl || !selectedFile) return;

    const a = document.createElement("a");
    a.href = compressedUrl;
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl, compressedUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-white/20 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:scale-110 transition-transform duration-300 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              图片压缩
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">高效压缩，极速体验</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
          <div
            className={`relative border-3 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
              isDragging
                ? "border-blue-500 bg-blue-100/50 dark:bg-blue-900/30 scale-[1.02]"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
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
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <div className="w-24 h-24 mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-xl">
                <span className="text-5xl">{isDragging ? "📥" : selectedFile ? "✅" : "📁"}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {selectedFile
                  ? selectedFile.name
                  : isDragging
                  ? "松开上传图片"
                  : "点击或拖拽上传图片"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {selectedFile
                  ? `${formatFileSize(selectedFile.size)} • ${fileInfo?.width} × ${fileInfo?.height}px`
                  : "支持 JPG、PNG、GIF、WebP 等格式"}
              </p>
            </label>
          </div>

          {/* Quality Slider */}
          {selectedFile && (
            <div className="mt-10 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-center justify-between mb-5">
                <label className="text-xl font-bold text-gray-900 dark:text-white">
                  压缩质量
                </label>
                <div className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg">
                  {quality}%
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => {
                  setQuality(Number(e.target.value));
                  setCompressedUrl("");
                }}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #06b6d4 ${quality}%, #e5e7eb ${quality}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">
                <span>最小</span>
                <span>平衡</span>
                <span>最大</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && (
            <div className="mt-8 flex gap-4">
              {!compressedUrl ? (
                <>
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                  >
                    {isProcessing ? "压缩中..." : "🗜️ 开始压缩"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-8 py-5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    重置
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full px-8 py-5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  🔄 处理新图片
                </button>
              )}
            </div>
          )}
        </div>

        {/* Preview Section */}
        {(previewUrl || compressedUrl) && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Original Image */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">原始图片</h3>
                <span className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold text-sm">
                  原图
                </span>
              </div>
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-inner">
                <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />
              </div>
              {fileInfo && (
                <div className="mt-6 space-y-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">文件大小</span>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                      {formatFileSize(fileInfo.originalSize)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">图片尺寸</span>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                      {fileInfo.width} × {fileInfo.height}px
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Compressed Image */}
            {compressedUrl ? (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">压缩后</h3>
                  <span className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-sm shadow-lg">
                    已压缩
                  </span>
                </div>
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-inner">
                  <img src={compressedUrl} alt="Compressed" className="w-full h-full object-contain" />
                </div>
                {fileInfo?.compressedSize && (
                  <div className="mt-6 space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/30">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">压缩后</span>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">
                        {formatFileSize(fileInfo.compressedSize)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">节省空间</span>
                      <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                        {formatFileSize(fileInfo.originalSize - fileInfo.compressedSize)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">压缩率</span>
                      <span className="font-bold text-green-600 dark:text-green-400 text-2xl">
                        {compressionRate}%
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleDownload}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载压缩图片
                </button>
              </div>
            ) : (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 flex items-center justify-center">
                <div className="text-center py-16">
                  <div className="text-7xl mb-6">⏳</div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    调整质量后点击开始压缩
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
