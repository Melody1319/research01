"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface RecognitionResult {
  labels?: string[];
  text?: string;
  objects?: { name: string; confidence: number }[];
}

export default function RecognizePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [recognitionType, setRecognitionType] = useState<
    "general" | "text" | "object"
  >("general");

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setResult(null);
      }
    },
    []
  );

  const handleRecognize = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    // 模拟处理延迟
    setTimeout(() => {
      // 模拟识别结果
      const mockResults: Record<typeof recognitionType, RecognitionResult> = {
        general: {
          labels: [
            "风景",
            "自然",
            "天空",
            "山脉",
            "户外",
            "树木",
            "云朵",
            "日落",
          ],
        },
        text: {
          text: "这里将显示图片中识别出的文字内容...\n\n需要集成 OCR API 服务，如：\n• 百度 OCR\n• 腾讯云 OCR\n• 阿里云 OCR\n• Google Vision API\n• Tesseract (开源)",
        },
        object: {
          objects: [
            { name: "人物", confidence: 98.5 },
            { name: "汽车", confidence: 95.2 },
            { name: "建筑", confidence: 89.7 },
            { name: "树木", confidence: 87.3 },
          ],
        },
      };

      setResult(mockResults[recognitionType]);
      setIsProcessing(false);
    }, 1500);
  }, [selectedFile, recognitionType]);

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
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors">
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
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                点击选择图片或拖拽上传
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                支持通用识别、文字识别、物体检测
              </p>
            </label>
          </div>

          {/* Recognition Type Selection */}
          {selectedFile && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                识别类型
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setRecognitionType("general")}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    recognitionType === "general"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  通用识别
                </button>
                <button
                  onClick={() => setRecognitionType("text")}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    recognitionType === "text"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  文字识别 (OCR)
                </button>
                <button
                  onClick={() => setRecognitionType("object")}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    recognitionType === "object"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  物体检测
                </button>
              </div>
            </div>
          )}

          {/* Process Button */}
          {selectedFile && (
            <button
              onClick={handleRecognize}
              disabled={isProcessing}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isProcessing ? "识别中..." : "开始识别"}
            </button>
          )}
        </div>

        {/* Result Section */}
        {previewUrl && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                图片预览
              </h3>
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Recognition Result */}
            {result && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  识别结果
                </h3>
                <div className="space-y-4">
                  {/* General Recognition */}
                  {result.labels && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        图片标签：
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.labels.map((label, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Recognition */}
                  {result.text && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        识别的文字：
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {result.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Object Detection */}
                  {result.objects && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        检测到的物体：
                      </p>
                      <div className="space-y-2">
                        {result.objects.map((obj, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                          >
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {obj.name}
                            </span>
                            <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                              {obj.confidence}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Integration Info */}
        <div className="mt-12 bg-green-50 dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🔌 API 集成说明
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium">推荐的图像识别服务：</p>
            <div className="space-y-2 pl-4">
              <div>
                <strong>1. 百度 AI 开放平台</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • 图像识别、OCR、物体检测等多种能力
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • API: https://ai.baidu.com/
                </p>
              </div>
              <div>
                <strong>2. 腾讯云 AI</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • 图像分析、文字识别、图像审核
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • API: https://cloud.tencent.com/product/ai
                </p>
              </div>
              <div>
                <strong>3. 阿里云视觉智能</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • 图像识别、视频理解、人脸识别
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • API: https://vision.aliyun.com/
                </p>
              </div>
              <div>
                <strong>4. Google Vision API</strong>
                <p className="text-gray-600 dark:text-gray-400">
                  • 强大的图像识别能力，支持多语言
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • API: https://cloud.google.com/vision
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
              • 通用识别：识别图片中的场景、物体、活动等，返回标签和描述
            </li>
            <li>• 文字识别：支持印刷体、手写体识别，可识别多种语言</li>
            <li>
              • 物体检测：精确定位图片中的物体位置和类别，返回置信度
            </li>
            <li>• 图片清晰度越高，识别准确率越高</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
