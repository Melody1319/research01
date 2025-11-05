import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "高效压缩图片大小，保持画质清晰，支持批量处理",
      icon: "🗜️",
      href: "/compress",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "抠图去背景",
      description: "AI智能识别主体，一键去除背景，精准高效",
      icon: "✂️",
      href: "/remove-bg",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "图片识别",
      description: "智能识别图片内容，提取文字信息，快速分析",
      icon: "🔍",
      href: "/recognize",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "AI 生图",
      description: "AI智能生成图片，创意无限，一键生成专业图像",
      icon: "🎨",
      href: "/generate",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            图片处理工具
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            AI智能图片处理平台，让图片处理更简单
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Card Content */}
              <div className="relative p-8">
                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-4 flex items-center text-sm font-medium text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  开始使用
                  <svg
                    className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            为什么选择我们？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  快速高效
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  采用最新AI技术，处理速度快，效率高
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  安全可靠
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  数据加密传输，不保存用户文件，保护隐私
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💎</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  专业品质
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  专业级处理效果，满足各种场景需求
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2025 图片处理工具. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
