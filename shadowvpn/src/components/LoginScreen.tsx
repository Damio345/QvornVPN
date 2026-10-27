import { useState } from 'react'

interface LoginScreenProps {
  onSelect: (mode: string) => void
}

export default function LoginScreen({ onSelect }: LoginScreenProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl rotate-6 opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              ShadowVPN
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Безопасность • Скорость • Анонимность</p>
          <p className="text-gray-500 text-sm mt-2">Powered by WireGuard®</p>
        </div>

        {/* Selection cards */}
        <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto mb-6">
          {/* Client */}
          <button
            onClick={() => onSelect('client')}
            onMouseEnter={() => setHovered('client')}
            onMouseLeave={() => setHovered(null)}
            className={`flex-1 group relative overflow-hidden rounded-2xl border transition-all duration-500 p-8 ${
              hovered === 'client'
                ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/20 scale-105'
                : 'border-gray-800 bg-gray-900/50 hover:border-blue-500/30'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Клиент</h3>
              <p className="text-gray-400 text-sm">Подключение к VPN серверам, управление подпиской</p>
            </div>
          </button>

          {/* Admin */}
          <button
            onClick={() => onSelect('admin')}
            onMouseEnter={() => setHovered('admin')}
            onMouseLeave={() => setHovered(null)}
            className={`flex-1 group relative overflow-hidden rounded-2xl border transition-all duration-500 p-8 ${
              hovered === 'admin'
                ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20 scale-105'
                : 'border-gray-800 bg-gray-900/50 hover:border-purple-500/30'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Админ-панель</h3>
              <p className="text-gray-400 text-sm">Управление серверами, мониторинг пользователей</p>
            </div>
          </button>
        </div>



        <p className="text-gray-600 text-xs mt-8">v2.1.0 • WireGuard Protocol • Linux / Windows / macOS</p>
      </div>
    </div>
  )
}
