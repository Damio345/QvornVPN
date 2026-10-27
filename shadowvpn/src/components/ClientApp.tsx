import { useState, useEffect } from 'react'

interface ClientAppProps {
  onBack: () => void
}

type Tab = 'connect' | 'servers' | 'subscription' | 'settings'

interface Server {
  name: string
  flag: string
  country: string
  ip: string
  port: number
  ping: number
  load: number
  distance?: number
  protocol: 'wireguard' | 'shadowsocks'
  ssConfig?: {
    method: string
    password: string
  }
}

export default function ClientApp({ onBack }: ClientAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>('connect')
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [selectedServer, setSelectedServer] = useState<string>('')
  const [traffic, setTraffic] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [subscriptionKey, setSubscriptionKey] = useState('')
  const [keyActivated, setKeyActivated] = useState(false)
  const [keyError, setKeyError] = useState('')
  const [autoConnect, setAutoConnect] = useState(true)
  const [killSwitch, setKillSwitch] = useState(true)
  const [dnsProtection, setDnsProtection] = useState(true)
  const [splitTunnel, setSplitTunnel] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [userCountry, setUserCountry] = useState<string>('')
  const [userCity, setUserCity] = useState<string>('')
  const [detecting, setDetecting] = useState(true)
  const [servers, setServers] = useState<Server[]>([])
  const [ipAddress, setIpAddress] = useState('')

  // Все серверы (WireGuard + Shadowsocks)
  const allServers: Server[] = [
    // WireGuard серверы
    { name: 'Germany', flag: '🇩🇪', country: 'DE', ip: '185.220.101.42', port: 51820, ping: 0, load: 45, protocol: 'wireguard' },
    { name: 'Netherlands', flag: '🇳🇱', country: 'NL', ip: '45.132.188.91', port: 51820, ping: 0, load: 62, protocol: 'wireguard' },
    { name: 'USA East', flag: '🇺🇸', country: 'US', ip: '23.106.215.77', port: 51820, ping: 0, load: 78, protocol: 'wireguard' },
    { name: 'Japan', flag: '🇯🇵', country: 'JP', ip: '103.152.112.35', port: 51820, ping: 0, load: 33, protocol: 'wireguard' },
    { name: 'Singapore', flag: '🇸🇬', country: 'SG', ip: '194.163.140.88', port: 51820, ping: 0, load: 51, protocol: 'wireguard' },
    { name: 'United Kingdom', flag: '🇬🇧', country: 'GB', ip: '89.238.178.23', port: 51820, ping: 0, load: 55, protocol: 'wireguard' },
    { name: 'Canada', flag: '🇨🇦', country: 'CA', ip: '172.83.156.44', port: 51820, ping: 0, load: 29, protocol: 'wireguard' },
    { name: 'Finland', flag: '🇫🇮', country: 'FI', ip: '91.219.236.12', port: 51820, ping: 0, load: 18, protocol: 'wireguard' },
    { name: 'France', flag: '🇫🇷', country: 'FR', ip: '62.210.16.61', port: 51820, ping: 0, load: 41, protocol: 'wireguard' },
    { name: 'Poland', flag: '🇵🇱', country: 'PL', ip: '51.195.37.18', port: 51820, ping: 0, load: 37, protocol: 'wireguard' },
    { name: 'Sweden', flag: '🇸🇪', country: 'SE', ip: '185.86.78.2', port: 51820, ping: 0, load: 22, protocol: 'wireguard' },
    { name: 'Switzerland', flag: '🇨🇭', country: 'CH', ip: '185.181.229.66', port: 51820, ping: 0, load: 31, protocol: 'wireguard' },
    
    // Shadowsocks серверы
    { 
      name: 'Japan (SS)', 
      flag: '🇯🇵', 
      country: 'JP', 
      ip: '191.223.221.53', 
      port: 8388, 
      ping: 0, 
      load: 28, 
      protocol: 'shadowsocks',
      ssConfig: {
        method: 'aes-256-gcm',
        password: 'JuD6MNgtX3nVpCzFzXYVYjDTZ7nsmavT'
      }
    },
  ]

  // Координаты стран для расчёта расстояния
  const countryCoords: Record<string, [number, number]> = {
    'DE': [51.1657, 10.4515],
    'NL': [52.1326, 5.2913],
    'US': [37.0902, -95.7129],
    'JP': [36.2048, 138.2529],
    'SG': [1.3521, 103.8198],
    'GB': [55.3781, -3.4360],
    'CA': [56.1304, -106.3468],
    'FI': [61.9241, 25.7482],
    'FR': [46.6034, 1.8883],
    'PL': [51.9194, 19.1451],
    'SE': [60.1282, 18.6435],
    'CH': [46.8182, 8.2275],
    'RU': [61.5240, 105.3188],
    'UA': [48.3794, 31.1656],
    'BY': [53.7098, 27.9534],
    'KZ': [48.0196, 66.9237],
    'BR': [-14.2350, -51.9253],
    'AU': [-25.2744, 133.7751],
    'IN': [20.5937, 78.9629],
    'KR': [35.9078, 127.7669],
  }

  // Haversine formula для расстояния
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Парсинг Shadowsocks URL
  const parseShadowsocksURL = (url: string): Server | null => {
    try {
      if (!url.startsWith('ss://')) return null
      
      // Убираем ss://
      const rest = url.slice(5)
      
      // Разделяем по @ (base64 часть до @, хост после)
      const atIndex = rest.indexOf('@')
      if (atIndex === -1) return null
      
      const base64Part = rest.slice(0, atIndex)
      const hostAndRest = rest.slice(atIndex + 1)
      
      // Декодируем base64 (method:password)
      const decoded = atob(base64Part)
      const colonIndex = decoded.indexOf(':')
      if (colonIndex === -1) return null
      
      const method = decoded.slice(0, colonIndex)
      const password = decoded.slice(colonIndex + 1)
      
      // Разделяем хост:порт и фрагмент
      const hashIndex = hostAndRest.indexOf('#')
      const hostAndPort = hashIndex !== -1 ? hostAndRest.slice(0, hashIndex) : hostAndRest
      const fragment = hashIndex !== -1 ? hostAndRest.slice(hashIndex + 1) : ''
      
      const [host, port] = hostAndPort.split(':')
      
      // Извлекаем название из фрагмента
      const name = fragment ? decodeURIComponent(fragment) : 'Shadowsocks Server'
      
      // Определяем флаг по названию
      let flag = '🏳️'
      if (name.includes('🇯🇵') || name.includes('Japan')) flag = '🇯🇵'
      else if (name.includes('🇺🇸') || name.includes('USA')) flag = '🇺🇸'
      else if (name.includes('🇩🇪') || name.includes('Germany')) flag = '🇩🇪'
      
      return {
        name: name.replace(/🇯🇵|🇺🇸|🇩🇪/g, '').trim(),
        flag,
        country: flag === '🇯🇵' ? 'JP' : flag === '🇺🇸' ? 'US' : 'DE',
        ip: host,
        port: parseInt(port),
        ping: 0,
        load: Math.floor(Math.random() * 50) + 20,
        protocol: 'shadowsocks',
        ssConfig: { method, password }
      }
    } catch (e) {
      return null
    }
  }

  // Определяем геолокацию пользователя
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        
        if (data && data.country_code) {
          setUserCountry(data.country_code)
          setUserCity(data.city)
          setIpAddress(data.ip)

          const userLat = data.lat
          const userLon = data.lon
          
          const serversWithDistance = allServers.map(server => {
            const coords = countryCoords[server.country]
            let distance = 9999
            if (coords) {
              distance = getDistance(userLat, userLon, coords[0], coords[1])
            }
            const ping = Math.round(distance / 15 + Math.random() * 20 + 10)
            return { ...server, distance, ping }
          })

          serversWithDistance.sort((a, b) => a.distance - b.distance)
          setServers(serversWithDistance)

          if (serversWithDistance.length > 0) {
            setSelectedServer(serversWithDistance[0].name)
          }
        }
      } catch (err) {
        const fallbackServers = allServers.map((server) => ({
          ...server,
          distance: Math.random() * 5000,
          ping: Math.round(Math.random() * 200 + 20)
        }))
        fallbackServers.sort((a, b) => a.ping - b.ping)
        setServers(fallbackServers)
        setSelectedServer(fallbackServers[0].name)
        setUserCountry('??')
        setUserCity('Unknown')
        setIpAddress('127.0.0.1')
      }
      setDetecting(false)
    }

    detectLocation()
  }, [])

  // Simulate traffic
  useEffect(() => {
    if (connected) {
      const interval = setInterval(() => {
        setTraffic(prev => prev + Math.random() * 2.5)
        setSpeed(Math.random() * 50 + 10)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setSpeed(0)
    }
  }, [connected])

  const handleConnect = () => {
    if (!keyActivated) {
      setKeyError('Сначала активируйте подписку!')
      setActiveTab('subscription')
      return
    }
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setConnected(!connected)
    }, 2000)
  }

  const handleActivateKey = () => {
    if (subscriptionKey.length >= 16) {
      setKeyActivated(true)
      setKeyError('')
    } else {
      setKeyError('Ключ должен быть не менее 16 символов')
    }
  }

  const currentServer = servers.find(s => s.name === selectedServer)

  if (detecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Определяем ваше местоположение...</p>
          <p className="text-gray-600 text-sm mt-2">Выбираем ближайший сервер</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">ShadowVPN</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right mr-2">
            <p className="text-gray-400 text-xs">Ваш IP</p>
            <p className="text-white text-xs font-mono">{ipAddress}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
            connected ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            {connected ? 'Защищён' : 'Не защищён'}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar navigation */}
        <nav className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-800/50 p-4">
          <div className="flex lg:flex-col gap-2">
            {([
              { id: 'connect' as Tab, icon: '🔌', label: 'Подключение' },
              { id: 'servers' as Tab, icon: '🌍', label: 'Серверы' },
              { id: 'subscription' as Tab, icon: '🔑', label: 'Подписка' },
              { id: 'settings' as Tab, icon: '⚙️', label: 'Настройки' },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'connect' && (
            <div className="max-w-lg mx-auto">
              {/* Auto-detected location banner */}
              {userCity && userCountry && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 mb-6 flex items-center gap-3">
                  <span className="text-blue-400">📍</span>
                  <div className="flex-1">
                    <p className="text-blue-300 text-sm">Ваше местоположение определено</p>
                    <p className="text-gray-400 text-xs">{userCity}, {userCountry} • Выбран ближайший сервер</p>
                  </div>
                </div>
              )}

              {/* Connection circle */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative w-56 h-56 mb-8">
                  <div className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                    connected ? 'border-green-500/30' : connecting ? 'border-yellow-500/30 animate-spin' : 'border-gray-700'
                  }`} />
                  {connected && (
                    <div className="absolute inset-4 rounded-full bg-green-500/5 animate-pulse" />
                  )}
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className={`absolute inset-6 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                      connected
                        ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-2 border-green-500/50 shadow-lg shadow-green-500/20'
                        : connecting
                        ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/50'
                        : 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    {connecting ? (
                      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className={`w-12 h-12 mb-2 transition-colors ${connected ? 'text-green-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {connected ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          )}
                        </svg>
                        <span className={`text-sm font-medium ${connected ? 'text-green-400' : 'text-gray-400'}`}>
                          {connected ? 'Отключить' : 'Подключить'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-1">
                    {connected ? 'Защищённое соединение' : connecting ? 'Подключение...' : 'Нажмите для подключения'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {connected && currentServer ? (
                      <>
                        {currentServer.flag} {currentServer.name} • {currentServer.ping}ms • 
                        <span className={currentServer.protocol === 'shadowsocks' ? 'text-orange-400' : 'text-blue-400'}>
                          {' '}{currentServer.protocol === 'shadowsocks' ? 'SS' : 'WG'}
                        </span>
                      </>
                    ) : currentServer ? (
                      `${currentServer.flag} Рекомендуемый: ${currentServer.name}`
                    ) : 'Загрузка...'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              {connected && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Скорость ↓</p>
                    <p className="text-xl font-bold text-blue-400">{speed.toFixed(1)} <span className="text-sm text-gray-500">Мб/с</span></p>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Трафик</p>
                    <p className="text-xl font-bold text-purple-400">{traffic.toFixed(1)} <span className="text-sm text-gray-500">МБ</span></p>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Пинг</p>
                    <p className={`text-xl font-bold ${currentServer && currentServer.ping < 50 ? 'text-green-400' : currentServer && currentServer.ping < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {currentServer?.ping || 0} <span className="text-sm text-gray-500">мс</span>
                    </p>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Протокол</p>
                    <p className={`text-xl font-bold ${currentServer?.protocol === 'shadowsocks' ? 'text-orange-400' : 'text-cyan-400'}`}>
                      {currentServer?.protocol === 'shadowsocks' ? 'SS' : 'WG'}
                    </p>
                  </div>
                </div>
              )}

              {/* Current server */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentServer?.flag}</span>
                  <div>
                    <p className="text-white font-medium">{currentServer?.name || '—'}</p>
                    <p className="text-gray-500 text-xs">
                      {currentServer?.ip}:{currentServer?.port} • 
                      <span className={currentServer?.protocol === 'shadowsocks' ? 'text-orange-400' : 'text-blue-400'}>
                        {' '}{currentServer?.protocol === 'shadowsocks' ? 'Shadowsocks' : 'WireGuard'}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('servers')}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  Сменить →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'servers' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">Серверы</h2>
              <p className="text-gray-400 text-sm mb-6">Отсортированы по расстоянию от вас • {userCity && `${userCity}, ${userCountry}`}</p>
              <div className="space-y-3">
                {servers.map((server, index) => (
                  <button
                    key={server.name}
                    onClick={() => { setSelectedServer(server.name); setActiveTab('connect') }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      selectedServer === server.name
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {index === 0 && (
                        <span className="absolute -top-2 -left-2 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">BEST</span>
                      )}
                      <span className="text-3xl">{server.flag}</span>
                      <div className="text-left">
                        <p className="text-white font-medium flex items-center gap-2">
                          {server.name}
                          {index === 0 && <span className="text-green-400 text-xs">← Рекомендуемый</span>}
                        </p>
                        <p className="text-gray-500 text-xs font-mono">
                          {server.ip}:{server.port}
                          <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
                            server.protocol === 'shadowsocks' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {server.protocol === 'shadowsocks' ? 'SS' : 'WG'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-gray-400 text-xs">{server.distance ? `${Math.round(server.distance)} км` : '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-mono ${server.ping < 50 ? 'text-green-400' : server.ping < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {server.ping} мс
                        </p>
                      </div>
                      <div className="w-16">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={server.load < 50 ? 'text-green-400' : server.load < 75 ? 'text-yellow-400' : 'text-red-400'}>
                            {server.load}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              server.load < 50 ? 'bg-green-500' : server.load < 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${server.load}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-bold mb-2">Активация подписки</h2>
              <p className="text-gray-400 mb-8">Введите ключ, полученный от Telegram бота @ShadowVPN_Bot</p>

              {keyActivated ? (
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">Подписка активна!</h3>
                  <p className="text-gray-400 text-sm mb-4">Тариф: Premium • Истекает: 30 дней</p>
                  <div className="bg-gray-900/50 rounded-lg p-3 font-mono text-sm text-gray-300">
                    {subscriptionKey.slice(0, 8)}-****-****-{subscriptionKey.slice(-4)}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Ключ активации</label>
                    <input
                      type="text"
                      value={subscriptionKey}
                      onChange={(e) => { setSubscriptionKey(e.target.value); setKeyError('') }}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono"
                    />
                    {keyError && <p className="text-red-400 text-sm mt-2">{keyError}</p>}
                  </div>
                  <button
                    onClick={handleActivateKey}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
                  >
                    Активировать
                  </button>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mt-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <span>💡</span> Как получить ключ?
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">1.</span>
                        Откройте Telegram и найдите @ShadowVPN_Bot
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">2.</span>
                        Нажмите /start и выберите тариф
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">3.</span>
                        Оплатите подписку удобным способом
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">4.</span>
                        Скопируйте ключ и вставьте сюда
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-bold mb-6">Настройки</h2>
              <div className="space-y-4">
                {[
                  { label: 'Автоподключение', desc: 'Подключаться при запуске приложения', value: autoConnect, setter: setAutoConnect },
                  { label: 'Kill Switch', desc: 'Блокировать интернет при обрыве VPN', value: killSwitch, setter: setKillSwitch },
                  { label: 'DNS защита', desc: 'Защита от утечки DNS запросов', value: dnsProtection, setter: setDnsProtection },
                  { label: 'Split Tunnel', desc: 'Выбор приложений для VPN', value: splitTunnel, setter: setSplitTunnel },
                  { label: 'Уведомления', desc: 'Показывать уведомления о подключении', value: notifications, setter: setNotifications },
                ].map((setting, i) => (
                  <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{setting.label}</p>
                      <p className="text-gray-500 text-sm">{setting.desc}</p>
                    </div>
                    <button
                      onClick={() => setting.setter(!setting.value)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        setting.value ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow`} style={{ left: setting.value ? '26px' : '2px' }} />
                    </button>
                  </div>
                ))}

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <p className="text-white font-medium mb-3">Протокол</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['WireGuard', 'Shadowsocks', 'IKEv2'].map(proto => (
                      <button
                        key={proto}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          proto === 'WireGuard'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {proto}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <p className="text-white font-medium mb-3">DNS сервер</p>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50">
                    <option>Cloudflare (1.1.1.1)</option>
                    <option>Google (8.8.8.8)</option>
                    <option>Quad9 (9.9.9.9)</option>
                    <option>AdGuard DNS</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
