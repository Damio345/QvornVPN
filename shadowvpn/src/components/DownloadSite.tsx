import { useState } from 'react'

export default function DownloadSite() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('windows')

  const platforms = [
    { id: 'windows', name: 'Windows', icon: '🪟', file: 'ShadowVPN-2.1.0-x64.exe', size: '45.2 MB' },
    { id: 'linux', name: 'Linux', icon: '🐧', file: 'shadowvpn_2.1.0_amd64.deb', size: '38.7 MB' },
    { id: 'macos', name: 'macOS', icon: '🍎', file: 'ShadowVPN-2.1.0.dmg', size: '42.1 MB' },
    { id: 'android', name: 'Android', icon: '🤖', file: 'ShadowVPN-2.1.0.apk', size: '28.4 MB' },
    { id: 'ios', name: 'iOS', icon: '📱', file: 'App Store', size: '—' },
  ]

  const features = [
    {
      icon: '🔒',
      title: 'Военное шифрование',
      description: 'AES-256-GCM, WireGuard, Shadowsocks. Ваши данные защищены на уровне, который используют спецслужбы.'
    },
    {
      icon: '⚡',
      title: 'Молниеносная скорость',
      description: 'Протокол WireGuard обеспечивает скорость до 1 Гбит/с. Никаких тормозов при стриминге или загрузке.'
    },
    {
      icon: '🌍',
      title: '12+ локаций',
      description: 'Серверы в Германии, США, Японии, Сингапуре, Великобритании и других странах. Автовыбор ближайшего.'
    },
    {
      icon: '🚫',
      title: 'Kill Switch',
      description: 'Если VPN отключится, интернет тоже отключится. Ваши данные никогда не утекут.'
    },
    {
      icon: '📱',
      title: 'Все платформы',
      description: 'Windows, Linux, macOS, Android, iOS. Одно приложение на всех ваших устройствах.'
    },
    {
      icon: '🔑',
      title: 'Активация по ключу',
      description: 'Получите ключ от Telegram бота и активируйте подписку за 10 секунд.'
    },
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
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">ShadowVPN</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Возможности</a>
              <a href="#download" className="text-gray-400 hover:text-white transition-colors text-sm">Скачать</a>
              <a href="#requirements" className="text-gray-400 hover:text-white transition-colors text-sm">Требования</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-400 text-sm font-medium">Версия 2.1.0 • WireGuard + Shadowsocks</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Приватность без
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              компромиссов
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Военное шифрование. Скорость до 1 Гбит/с. 12+ локаций.
            Работает на Windows, Linux, macOS, Android и iOS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#download"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Скачать бесплатно
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all border border-gray-700"
            >
              Узнать больше
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>✓ Без рекламы</span>
            <span>✓ Без логов</span>
            <span>✓ Open Source</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Почему ShadowVPN?
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Всё что нужно для безопасного и быстрого интернета
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Скачать ShadowVPN
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Выберите вашу платформу
            </p>
          </div>

          {/* Platform selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedPlatform === platform.id
                    ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50'
                    : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                <span className="text-xl">{platform.icon}</span>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Download card */}
          {currentPlatform && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">{currentPlatform.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">ShadowVPN для {currentPlatform.name}</h3>
              <p className="text-gray-400 mb-6">Версия 2.1.0 • {currentPlatform.size}</p>
              
              {currentPlatform.id === 'ios' ? (
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-blue-500/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Открыть App Store
                </a>
              ) : (
                <a
                  href={`#download-${currentPlatform.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-blue-500/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Скачать {currentPlatform.file}
                </a>
              )}

              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                <span>✓ Проверено антивирусом</span>
                <span>✓ Без вирусов</span>
                <span>✓ Open Source</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Installation Guide */}
      <section id="install" className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Как установить
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Простая установка за 3 шага
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Скачайте установщик</h3>
                <p className="text-gray-400">Выберите вашу платформу выше и скачайте соответствующий файл. Размер всего ~40 МБ.</p>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Запустите установку</h3>
                <p className="text-gray-400">
                  <strong>Windows:</strong> Запустите .exe файл и следуйте мастеру установки<br />
                  <strong>Linux:</strong> Откройте терминал и выполните <code className="bg-gray-800 px-2 py-0.5 rounded text-cyan-400">sudo dpkg -i shadowvpn_2.1.0_amd64.deb</code><br />
                  <strong>macOS:</strong> Откройте .dmg файл и перетащите приложение в папку Applications<br />
                  <strong>Android:</strong> Разрешите установку из неизвестных источников и установите .apk
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Активируйте подписку</h3>
                <p className="text-gray-400">
                  Откройте Telegram бота <code className="bg-gray-800 px-2 py-0.5 rounded text-cyan-400">@ShadowVPN_Bot</code>, получите ключ активации и вставьте его в приложении. Готово!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section id="requirements" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Системные требования
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Минимальные требования для работы ShadowVPN
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.filter(p => p.id !== 'ios').map(platform => (
              <div key={platform.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{platform.icon}</span>
                  <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                </div>
                <ul className="space-y-2">
                  {requirements[platform.id as keyof typeof requirements]?.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
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
              {
                q: 'Как активировать подписку?',
                a: 'После установки откройте приложение, перейдите в раздел "Подписка" и введите ключ, полученный от Telegram бота @ShadowVPN_Bot.'
              },
              {
                q: 'Работает ли VPN с торрентами?',
                a: 'Да, ShadowVPN поддерживает P2P трафик на всех серверах. Мы не ограничиваем скорость и не блокируем торренты.'
              },
              {
                q: 'Можно ли использовать на нескольких устройствах?',
                a: 'Зависит от тарифа. Basic — 1 устройство, Premium — 3 устройства, Unlimited — без ограничений.'
              },
              {
                q: 'Что если VPN не работает?',
                a: 'Попробуйте сменить сервер, перезапустить приложение или проверить интернет-соединение. Если проблема сохраняется, обратитесь в поддержку @ShadowVPN_Support.'
              },
              {
                q: 'Храните ли вы логи?',
                a: 'Нет. Мы не ведём логи вашей активности. Только минимальная информация для работы сервиса (дата регистрации, статус подписки).'
              },
            ].map((item, i) => (
              <details key={i} className="group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-800/30 transition-colors">
                  <span className="text-white font-medium">{item.q}</span>
                  <svg className="w-5 h-5 text-blue-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-400 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">ShadowVPN</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 ShadowVPN. Все права защищены.
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
