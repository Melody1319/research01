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
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [style, setStyle] = useState<string>("realistic");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");

  const styles = [
    { id: "realistic", name: "写实风格", emoji: "📷" },
    { id: "anime", name: "动漫风格", emoji: "🎨" },
    { id: "oil", name: "油画风格", emoji: "🖼️" },
    { id: "watercolor", name: "水彩风格", emoji: "💧" },
    { id: "sketch", name: "素描风格", emoji: "✏️" },
    { id: "3d", name: "3D渲染", emoji: "🎮" },
  ];

  const aspectRatios = [
    { id: "1:1", name: "正方形", size: "1024x1024" },
    { id: "16:9", name: "横屏", size: "1024x576" },
    { id: "9:16", name: "竖屏", size: "576x1024" },
    { id: "4:3", name: "标准", size: "1024x768" },
  ];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      alert("请输入图片描述");
      return;
    }

    setIsGenerating(true);

    // 模拟生成延迟
    setTimeout(() => {
      // 实际项目中，这里应该调用 AI 生图 API
      alert(
        `AI 生图功能需要集成第三方 API\n\n推荐服务：\n• Stable Diffusion\n• DALL-E (OpenAI)\n• Midjourney\n• 文心一格（百度）\n• 通义万相（阿里）\n\n提示词：${prompt}\n风格：${styles.find((s) => s.id === style)?.name}\n尺寸：${aspectRatios.find((r) => r.id === aspectRatio)?.size}`
      );

      // 添加一个模拟的生成记录
      const newImage: GeneratedImage = {
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5o6l5YWlIEFJIEFQSTwvdGV4dD48L3N2Zz4=",
        prompt: prompt,
        timestamp: Date.now(),
      };

      setGeneratedImages((prev) => [newImage, ...prev]);
      setIsGenerating(false);
    }, 2000);
  }, [prompt, style, aspectRatio, styles, aspectRatios]);

  const handleDownload = useCallback((image: GeneratedImage) => {
    const a = document.createElement("a");
    a.href = image.url;
    a.download = `ai_generated_${image.timestamp}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const presetPrompts = [
    "一只可爱的橘猫，坐在窗台上看着窗外的雪景",
    "未来科幻城市，霓虹灯，赛博朋克风格",
    "日式庭院，樱花盛开，宁静优美",
    "梵高风格的星空下的小镇",
    "宫崎骏风格的森林精灵",
    "中国山水画，水墨画风格",
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

            {/* Negative Prompt */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                反向提示词（可选）
              </h3>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="描述你不想要的元素，如：模糊、低质量、变形..."
                className="w-full h-24 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>

            {/* Style Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                艺术风格
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all text-left ${
                      style === s.id
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="text-xl mr-2">{s.emoji}</span>
                    <span className="text-sm">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                画面比例
              </h3>
              <div className="space-y-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all text-left ${
                      aspectRatio === ratio.id
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="font-semibold">{ratio.name}</span>
                    <span className="text-sm ml-2 opacity-75">
                      ({ratio.size})
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
                🔌 AI 生图服务集成
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium">推荐的 AI 生图服务：</p>
                <div className="space-y-2 pl-4">
                  <div>
                    <strong>1. Stable Diffusion</strong>
                    <p className="text-gray-600 dark:text-gray-400">
                      • 开源方案，可自建或使用 Stability AI API
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      • 灵活性高，支持多种模型和风格
                    </p>
                  </div>
                  <div>
                    <strong>2. DALL-E (OpenAI)</strong>
                    <p className="text-gray-600 dark:text-gray-400">
                      • 强大的图像生成能力，效果出色
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      • API: https://platform.openai.com/docs/guides/images
                    </p>
                  </div>
                  <div>
                    <strong>3. 文心一格（百度）</strong>
                    <p className="text-gray-600 dark:text-gray-400">
                      • 国内服务，中文理解能力强
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      • API: https://yige.baidu.com/
                    </p>
                  </div>
                  <div>
                    <strong>4. 通义万相（阿里）</strong>
                    <p className="text-gray-600 dark:text-gray-400">
                      • 多种风格支持，适合商业使用
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      • API: https://www.aliyun.com/product/ai/tongyi
                    </p>
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
