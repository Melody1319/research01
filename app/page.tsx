"use client";

import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "高效压缩图片大小，保持画质清晰",
      icon: "🗜️",
      href: "/compress",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      hoverBorder: "hover:border-blue-500",
    },
    {
      title: "抠图去背景",
      description: "AI智能识别主体，一键去除背景",
      icon: "✂️",
      href: "/remove-bg",
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      hoverBorder: "hover:border-purple-500",
    },
    {
      title: "图片识别",
      description: "智能识别图片内容，快速分析",
      icon: "🔍",
      href: "/recognize",
      gradient: "from-green-500 via-green-600 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      hoverBorder: "hover:border-green-500",
    },
    {
      title: "AI 生图",
      description: "AI智能生成图片，创意无限",
      icon: "🎨",
      href: "/generate",
      gradient: "from-orange-500 via-orange-600 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      iconBg: "bg-orange-100 dark:bg-orange-900/50",
      hoverBorder: "hover:border-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-30 dark:opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/20 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              AI 图片处理工具
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              专业的 AI 智能图片处理平台，让创作更简单
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border-2 border-transparent ${feature.hoverBorder} transition-all duration-500 overflow-hidden hover:scale-105 hover:shadow-2xl`}
            >
              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              {/* Card Content */}
              <div className="relative p-8">
                {/* Icon Container */}
                <div
                  className={`w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}
                >
                  <span className="text-4xl">{feature.icon}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {feature.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Action Button */}
                <div className={`inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r ${feature.gradient} text-white font-medium text-sm transform group-hover:translate-x-2 transition-all duration-300 shadow-lg`}>
                  立即使用
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              {/* Corner Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/50 to-transparent dark:from-white/10 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20 dark:border-gray-700/50">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              为什么选择我们
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              专业、快速、安全的图片处理服务
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                极速处理
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                采用最新 AI 技术，毫秒级响应，高效处理各类图片任务
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                隐私安全
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                端到端加密传输，不存储任何用户数据，全方位保护隐私
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-4xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                专业品质
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                专业级 AI 算法，超高清输出，满足各种专业场景需求
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-white/20 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2025 AI 图片处理工具. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
