import { useState, useEffect, useRef } from 'react'

export default function DownloadSite() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('windows')
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [counters, setCounters] = useState({ servers: 0, speed: 0, logs: 0, uptime: 0 })
  const statsRef = useRef<HTMLDivElement>(null)
  const cursorGlowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    
    // Cursor glow - прямое обновление DOM для мгновенной реакции
    const handleMouse = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${e.clientX - 192}px`
        cursorGlowRef.current.style.top = `${e.clientY - 192}px`
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouse)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 2000
            const steps = 60
            const interval = duration / steps

            let currentStep = 0
            const timer = setInterval(() => {
              currentStep++
              const progress = currentStep / steps
              
              setCounters({
                servers: Math.round(30 * progress),
                speed: Math.round(1000 * progress),
                logs: 0,
                uptime: Math.round(99.9 * progress * 10) / 10
              })

              if (currentStep >= steps) {
                clearInterval(timer)
              }
            }, interval)

            return () => clearInterval(timer)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const platforms = [
    { id: 'windows', name: 'Windows', icon: '🪟', file: 'QvornVPN-2.1.0-x64.exe', size: '45.2 MB' },
    { id: 'linux', name: 'Linux', icon: '🐧', file: 'vornexvpn_2.1.0_amd64.deb', size: '38.7 MB' },
    { id: 'macos', name: 'macOS', icon: '🍎', file: 'QvornVPN-2.1.0.dmg', size: '42.1 MB' },
    { id: 'android', name: 'Android', icon: '🤖', file: 'QvornVPN-2.1.0.apk', size: '28.4 MB' },
    { id: 'ios', name: 'iOS', icon: '📱', file: 'App Store', size: '—' },
  ]

  const features = [
    { icon: '🔒', title: 'Военное шифрование', description: 'AES-256-GCM, WireGuard, Shadowsocks. Ваши данные защищены на уровне спецслужб.', color: 'from-blue-500 to-cyan-500' },
    { icon: '⚡', title: 'Молниеносная скорость', description: 'Протокол WireGuard обеспечивает скорость до 1 Гбит/с.', color: 'from-yellow-500 to-orange-500' },
    { icon: '🌍', title: '30+ серверов', description: 'Серверы в Германии, США, Японии, Гонконге, Южной Корее, Нидерландах.', color: 'from-green-500 to-emerald-500' },
    { icon: '🚫', title: 'Kill Switch', description: 'Если VPN отключится, интернет тоже отключится. Данные не утекут.', color: 'from-red-500 to-pink-500' },
    { icon: '📱', title: 'Все платформы', description: 'Windows, Linux, macOS, Android, iOS. Одно приложение на всех устройствах.', color: 'from-purple-500 to-violet-500' },
    { icon: '🔑', title: 'Активация по ключу', description: 'Получите ключ от Telegram бота и активируйте подписку за 10 секунд.', color: 'from-cyan-500 to-blue-500' },
  ]

  const pricing = [
    {
      name: 'Basic',
      price: '149',
      period: 'месяц',
      devices: '1 устройство',
      features: ['Все серверы', 'Безлимитный трафик', 'WireGuard + Shadowsocks', 'Поддержка 24/7'],
      popular: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Premium',
      price: '299',
      period: 'месяц',
      devices: '3 устройства',
      features: ['Все серверы', 'Безлимитный трафик', 'WireGuard + Shadowsocks', 'Приоритетная поддержка', 'Выделенные IP'],
      popular: true,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Unlimited',
      price: '499',
      period: 'месяц',
      devices: '∞ устройств',
      features: ['Все серверы', 'Безлимитный трафик', 'WireGuard + Shadowsocks', 'VIP поддержка', 'Выделенные IP', 'Ранний доступ к функциям'],
      popular: false,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const requirements = {
    windows: ['Windows 10/11 (64-bit)', '2 GB RAM', '100 MB свободного места', 'Интернет для активации'],
    linux: ['Ubuntu 20.04+, Linux Mint 21+, Debian 11+', '2 GB RAM', '100 MB свободного места', 'Интернет для активации'],
    macos: ['macOS 11.0+ (Big Sur)', '2 GB RAM', '100 MB свободного места', 'Интернет для активации'],
    android: ['Android 8.0+', '100 MB свободного места', 'Интернет для активации'],
    ios: ['iOS 14.0+', '100 MB свободного места', 'Интернет для активации'],
  }

  const currentPlatform = platforms.find(p => p.id === selectedPlatform)

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
      {/* Улучшенный фон с декором - ЗАФИКСИРОВАН */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        {/* Основные градиентные орбы - ЗАФИКСИРОВАНЫ */}
        <div 
          className="absolute w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none"
          style={{ 
            top: '-300px', 
            left: '-300px'
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"
          style={{ 
            bottom: '-250px', 
            right: '-250px'
          }}
        />
        <div 
          className="absolute w-[700px] h-[700px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"
          style={{ 
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Дополнительные орбы - ЗАФИКСИРОВАНЫ */}
        <div 
          className="absolute w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none"
          style={{ 
            top: '20%', 
            right: '10%'
          }}
        />
        <div 
          className="absolute w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
          style={{ 
            bottom: '30%', 
            left: '5%'
          }}
        />

        {/* Декоративные кольца - ЗАФИКСИРОВАНЫ */}
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-500/20 rounded-full pointer-events-none" />
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-purple-500/20 rounded-full pointer-events-none" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 border-2 border-cyan-500/20 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 border-2 border-pink-500/20 rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/2 w-28 h-28 border-2 border-indigo-500/20 rounded-full pointer-events-none" />
        
        {/* Градиентные полосы - ЗАФИКСИРОВАНЫ */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
        
        {/* Вертикальные линии - ЗАФИКСИРОВАНЫ */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none" />
        
        {/* Точки-звёзды - ЗАФИКСИРОВАНЫ */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full pointer-events-none"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`
            }}
          />
        ))}
        
        {/* Анимированная сетка - более заметная, ЗАФИКСИРОВАНА */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Плавающие частицы - ЗАФИКСИРОВАНЫ */}
        {[...Array(50)].map((_, i) => {
          const size = 1 + (i % 4)
          const startX = (i * 13) % 100
          const startY = (i * 29) % 100
          const colors = ['rgba(59, 130, 246, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(6, 182, 212, 0.3)', 'rgba(236, 72, 153, 0.3)']
          const color = colors[i % colors.length]
          
          return (
            <div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${startX}%`,
                top: `${startY}%`,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                boxShadow: `0 0 ${size * 3}px ${color}`
              }}
            />
          )
        })}

        {/* Cursor glow — мгновенно следует за курсором */}
        <div 
          ref={cursorGlowRef}
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
            willChange: 'left, top'
          }}
        />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl shadow-black/30 py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-lg border-2 border-blue-400/50 animate-ping opacity-0 group-hover:opacity-100" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-[length:200%] animate-[gradient_3s_ease_infinite] group-hover:scale-105 transition-transform">
                QvornVPN
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Возможности', 'Цены', 'Скачать', 'FAQ'].map((item, i) => (
                <a 
                  key={i}
                  href={`#${['features', 'pricing', 'download', 'faq'][i]}`}
                  className="text-gray-400 hover:text-white transition-all duration-300 text-sm relative group overflow-hidden"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-500" />
                  <span className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 -mx-2 px-2 py-1 rounded" />
                </a>
              ))}
              <a 
                href="https://t.me/QvornVPN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-lg text-sm text-blue-400 transition-all hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-8 animate-[fadeInUp_0.8s_ease-out] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-sm font-medium">Версия 2.1.0 • WireGuard + Shadowsocks</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight animate-[fadeInUp_1s_ease-out]">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Приватность без
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent bg-[length:200%] animate-[gradient_3s_ease_infinite]">
              компромиссов
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-[fadeInUp_1.2s_ease-out]">
            Военное шифрование. Скорость до 1 Гбит/с. 30+ серверов.
            <br />
            Работает на{' '}
            <span className="relative inline-block">
              <span className="text-white font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Windows</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </span>
            ,{' '}
            <span className="relative inline-block">
              <span className="text-white font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Linux</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </span>
            ,{' '}
            <span className="relative inline-block">
              <span className="text-white font-medium bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">macOS</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </span>
            ,{' '}
            <span className="relative inline-block">
              <span className="text-white font-medium bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Android</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </span>
            {' '}и{' '}
            <span className="relative inline-block">
              <span className="text-white font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">iOS</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </span>
            .
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_1.4s_ease-out]">
            <a
              href="#download"
              className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="absolute inset-0 rounded-xl border-2 border-white/30 animate-ping opacity-0 group-hover:opacity-100" />
              
              <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Скачать бесплатно
              </span>
            </a>
            <a
              href="#pricing"
              className="group relative w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all border border-white/10 hover:border-white/20 hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative">Смотреть цены →</span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm animate-[fadeInUp_1.6s_ease-out]">
            {[
              { icon: '🚫', text: 'Без рекламы' },
              { icon: '🔒', text: 'Без логов' },
              { icon: '🔓', text: 'Open Source' },
              { icon: '🌍', text: '30+ серверов' }
            ].map((badge, i) => (
              <span 
                key={i} 
                className="group flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-all duration-300 hover:scale-110 cursor-default"
              >
                <span className="text-lg group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                  {badge.icon}
                </span>
                <span>{badge.text}</span>
              </span>
            ))}
          </div>

          <div ref={statsRef} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-[fadeInUp_1.8s_ease-out]">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
              <div className="relative z-10">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {counters.servers}+
                </p>
                <p className="text-gray-500 text-sm mt-1">Серверов</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500" />
              <div className="relative z-10">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {counters.speed} <span className="text-lg">Мбит/с</span>
                </p>
                <p className="text-gray-500 text-sm mt-1">Скорость</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
              <div className="relative z-10">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {counters.logs}
                </p>
                <p className="text-gray-500 text-sm mt-1">Логов</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-violet-500/0 group-hover:from-purple-500/10 group-hover:to-violet-500/10 transition-all duration-500" />
              <div className="relative z-10">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {counters.uptime}%
                </p>
                <p className="text-gray-500 text-sm mt-1">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`py-20 px-4 relative transition-all duration-1000 ${visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Почему QvornVPN?
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Всё что нужно для безопасного и быстрого интернета
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden hover-lift"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`} />
                <div className="absolute inset-[1px] bg-gray-900/95 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{feature.description}</p>
                  
                  <div className={`h-0.5 bg-gradient-to-r ${feature.color} mt-4 w-0 group-hover:w-full transition-all duration-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`py-20 px-4 relative transition-all duration-1000 overflow-visible ${visibleSections.has('pricing') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto overflow-visible">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Тарифы
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Выберите подходящий план для ваших нужд
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 items-stretch">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`relative group ${plan.popular ? 'md:-mt-8' : 'md:mt-4'}`}
              >
                <div className={`relative bg-gray-900/50 backdrop-blur-sm border ${plan.popular ? 'border-purple-500/50' : 'border-gray-800'} rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 h-full overflow-visible`}>
                  {plan.popular && (
                    <div className="absolute -top-12 left-0 right-0 flex justify-center z-20">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg shadow-purple-500/30 whitespace-nowrap">
                        Популярный
                      </div>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{plan.devices}</p>
                    
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 text-lg">₽/{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="https://t.me/QvornVPN_Bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                      }`}
                    >
                      Получить ключ
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className={`py-20 px-4 relative transition-all duration-1000 ${visibleSections.has('download') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Скачать QvornVPN
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Выберите вашу платформу
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                  selectedPlatform === platform.id
                    ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50 shadow-lg shadow-blue-500/30 scale-110'
                    : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-gray-700 hover:scale-105'
                }`}
              >
                {selectedPlatform === platform.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-pulse" />
                )}
                <span className="relative z-10 text-xl">{platform.icon}</span>
                <span className="relative z-10">{platform.name}</span>
              </button>
            ))}
          </div>

          {currentPlatform && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-gradient" />
              
              <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="text-7xl mb-4 animate-[float_3s_ease-in-out_infinite] transform group-hover:scale-110 transition-transform duration-500">
                    {currentPlatform.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    QvornVPN для {currentPlatform.name}
                  </h3>
                  <p className="text-gray-400 mb-6">Версия 2.1.0 • {currentPlatform.size}</p>
                  
                  {currentPlatform.id === 'ios' ? (
                    <a
                      href="https://apps.apple.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 relative overflow-hidden group/btn"
                    >
                      <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                      <span className="relative">Открыть App Store →</span>
                    </a>
                  ) : (
                    <a
                      href={`#download-${currentPlatform.id}`}
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 overflow-hidden relative"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                      <span className="relative flex items-center gap-2">
                        <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Скачать {currentPlatform.file}
                      </span>
                    </a>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Проверено антивирусом
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Без вирусов
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Open Source
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`py-20 px-4 relative transition-all duration-1000 ${visibleSections.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Частые вопросы
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Как активировать подписку?', a: 'После установки откройте приложение, перейдите в раздел "Подписка" и введите ключ от Telegram бота @QvornVPN_Bot.' },
              { q: 'Работает ли VPN с торрентами?', a: 'Да, QvornVPN поддерживает P2P трафик на всех серверах без ограничений скорости.' },
              { q: 'Можно ли использовать на нескольких устройствах?', a: 'Зависит от тарифа. Basic — 1 устройство, Premium — 3, Unlimited — без ограничений.' },
              { q: 'Что если VPN не работает?', a: 'Смените сервер, перезапустите приложение или обратитесь в поддержку @QvornVPN_Support.' },
              { q: 'Храните ли вы логи?', a: 'Нет. Мы не ведём логи вашей активности. Только минимальная информация для работы сервиса.' },
            ].map((item, i) => (
              <details key={i} className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-800/30 transition-colors">
                  <span className="text-white font-medium group-hover:text-blue-300 transition-colors">{item.q}</span>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <svg className="w-5 h-5 text-blue-400 transition-transform group-open:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="px-5 pb-5 text-gray-400 leading-relaxed animate-[fadeIn_0.3s_ease-out]">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 group mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">QvornVPN</span>
              </div>
              <p className="text-gray-500 text-sm">
                Безопасный и быстрый VPN для всех платформ. Защитите свою приватность в интернете.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Ссылки</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Возможности</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Тарифы</a></li>
                <li><a href="#download" className="text-gray-400 hover:text-blue-400 transition-colors">Скачать</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-blue-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Telegram</h3>
              <div className="space-y-3">
                <a 
                  href="https://t.me/QvornVPN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  <span>Канал @QvornVPN</span>
                </a>
                <a 
                  href="https://t.me/QvornVPN_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  <span>Бот @QvornVPN_Bot</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 text-xs">
                Сделано с <span className="text-red-400 animate-pulse inline-block">❤</span> для приватности в интернете
              </p>
              
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Все системы работают</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse" />
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-xs">
                © 2024 QvornVPN. Все права защищены.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
