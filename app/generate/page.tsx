"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [size, setSize] = useState<string>("2K");
  const [error, setError] = useState<string>("");

  const sizeOptions = [
    { id: "1K", name: "标清 1K", description: "1024x1024" },
    { id: "2K", name: "高清 2K", description: "2048x2048" },
  ];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      alert("请输入图片描述");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          size: size,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "生成图片失败");
      }

      // 从 API 响应中提取图片 URL
      if (data.data && data.data.data && data.data.data.length > 0) {
        const imageUrl = data.data.data[0].url;
        const newImage: GeneratedImage = {
          url: imageUrl,
          prompt: prompt,
          timestamp: Date.now(),
        };

        setGeneratedImages((prev) => [newImage, ...prev]);
      } else {
        throw new Error("API 返回数据格式错误");
      }
    } catch (err) {
      console.error("Generate error:", err);
      setError(err instanceof Error ? err.message : "生成图片失败，请重试");
      alert(err instanceof Error ? err.message : "生成图片失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, size]);

  const handleDownload = useCallback((image: GeneratedImage) => {
    const a = document.createElement("a");
    a.href = image.url;
    a.download = `ai_generated_${image.timestamp}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const presetPrompts = [
    "一只可爱的橘猫，坐在窗台上看着窗外的雪景，温暖的阳光，高清摄影",
    "未来科幻城市，霓虹灯，赛博朋克风格，夜晚，雨后反光，4K画质",
    "日式庭院，樱花盛开，宁静优美，清晨阳光，专业摄影",
    "梵高风格的星空下的小镇，油画质感，浓郁色彩",
    "宫崎骏风格的森林精灵，动画风格，梦幻氛围",
    "中国山水画，水墨画风格，飘渺云雾，意境深远",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
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
            AI 生图
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Generation Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prompt Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                图片描述
              </h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请描述你想生成的图片，越详细效果越好..."
                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500"
              />

              {/* Preset Prompts */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  快速选择：
                </p>
                <div className="flex flex-wrap gap-2">
                  {presetPrompts.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(preset)}
                      className="text-xs px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                    >
                      {preset.slice(0, 15)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                图片尺寸
              </h3>
              <div className="space-y-2">
                {sizeOptions.map((sizeOption) => (
                  <button
                    key={sizeOption.id}
                    onClick={() => setSize(sizeOption.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all text-left ${
                      size === sizeOption.id
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="font-semibold">{sizeOption.name}</span>
                    <span className="text-sm ml-2 opacity-75">
                      ({sizeOption.description})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isGenerating ? "生成中..." : "✨ 开始生成"}
            </button>
          </div>

          {/* Right Panel - Generated Images */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                生成结果
              </h3>

              {generatedImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    还没有生成图片
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    输入描述并点击"开始生成"按钮
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedImages.map((image, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden"
                    >
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                          {image.prompt}
                        </p>
                        <button
                          onClick={() => handleDownload(image)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
                        >
                          下载图片
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* API Integration Info */}
            <div className="mt-6 bg-orange-50 dark:bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔌 已集成火山引擎 AI 生图
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  当前使用火山引擎（Volcano Engine）图片生成 API，支持高质量的
                  AI 图片生成能力。
                </p>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>支持 1K 和 2K 分辨率图片生成</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>中文提示词支持，理解能力强</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>快速生成，一般 10-30 秒内完成</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>生成的图片包含水印标识</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 bg-red-50 dark:bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                💡 提示词技巧
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• 使用详细的描述，包括主体、环境、光线、风格等</li>
                <li>• 添加艺术家名字可以模仿特定风格，如"梵高风格"</li>
                <li>• 使用质量词提升效果：高清、4K、精致、专业摄影</li>
                <li>• 反向提示词帮助避免不想要的元素</li>
                <li>
                  • 可以组合多个概念，如"赛博朋克 + 日本庭院 + 霓虹灯"
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
