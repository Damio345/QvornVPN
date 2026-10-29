import { useState, useEffect } from 'react'

interface AdminAppProps {
  onBack: () => void
}

type AdminTab = 'dashboard' | 'vpn' | 'servers' | 'users' | 'keys' | 'logs'

interface UserData {
  id: string
  username: string
  key: string
  server: string
  status: 'online' | 'offline'
  traffic: string
  connected: string
  expires: string
  country: string
  ip: string
  platform: string
}

interface ServerData {
  name: string
  ip: string
  port: number
  country: string
  countryCode: string
  flag: string
  clients: number
  bandwidth: string
  status: 'active' | 'maintenance' | 'offline'
  uptime: string
  protocol: 'wireguard' | 'shadowsocks'
  ssConfig?: {
    method: string
    password: string
  }
}

export default function AdminApp({ onBack }: AdminAppProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [showAddServer, setShowAddServer] = useState(false)
  const [serverInput, setServerInput] = useState('')
  const [detectedServer, setDetectedServer] = useState<Partial<ServerData> | null>(null)
  const [detecting, setDetecting] = useState(false)
  const [detectError, setDetectError] = useState('')
  const [serverName, setServerName] = useState('')

  // VPN подключение для админа (бесплатное)
  const [vpnConnected, setVpnConnected] = useState(false)
  const [vpnConnecting, setVpnConnecting] = useState(false)
  const [vpnSelectedServer, setVpnSelectedServer] = useState('Germany')
  const [vpnTraffic, setVpnTraffic] = useState(0)
  const [vpnSpeed, setVpnSpeed] = useState(0)

  const [users, setUsers] = useState<UserData[]>([
    { id: '1', username: 'alex_dev', key: 'A4F2-****-****-7B21', server: 'Germany', status: 'online', traffic: '2.4 GB', connected: '3ч 24м', expires: '28 дней', country: 'RU', ip: '95.161.x.x', platform: 'Windows' },
    { id: '2', username: 'marina_k', key: 'C8D1-****-****-3E45', server: 'Netherlands', status: 'online', traffic: '890 MB', connected: '1ч 12м', expires: '15 дней', country: 'UA', ip: '178.45.x.x', platform: 'Linux' },
    { id: '3', username: 'darkn1ght', key: 'F2A9-****-****-8C12', server: 'USA East', status: 'offline', traffic: '15.2 GB', connected: '—', expires: '5 дней', country: 'KZ', ip: '2.72.x.x', platform: 'macOS' },
    { id: '4', username: 'pro_gamer', key: 'B7E3-****-****-1D56', server: 'Japan (SS)', status: 'online', traffic: '4.1 GB', connected: '45м', expires: '22 дня', country: 'RU', ip: '188.170.x.x', platform: 'Android' },
    { id: '5', username: 'anon_user', key: 'D5C8-****-****-9A34', server: 'Germany', status: 'offline', traffic: '1.8 GB', connected: '—', expires: '2 дня', country: 'BY', ip: '178.120.x.x', platform: 'iOS' },
    { id: '6', username: 'freedom_x', key: 'E1B4-****-****-6F78', server: 'Singapore', status: 'online', traffic: '3.7 GB', connected: '2ч 10м', expires: '30 дней', country: 'RU', ip: '37.214.x.x', platform: 'Windows' },
    { id: '7', username: 'cyber_punk', key: 'G9H2-****-****-4K90', server: 'United Kingdom', status: 'offline', traffic: '7.3 GB', connected: '—', expires: '18 дней', country: 'DE', ip: '85.25.x.x', platform: 'Linux' },
    { id: '8', username: 'shadow_42', key: 'J3L6-****-****-2M56', server: 'Finland', status: 'online', traffic: '520 MB', connected: '15м', expires: '25 дней', country: 'RU', ip: '46.39.x.x', platform: 'Windows' },
  ])

  const [servers, setServers] = useState<ServerData[]>([
    // WireGuard серверы
    { name: 'Germany', ip: '185.220.101.42', port: 51820, country: 'Germany', countryCode: 'DE', flag: '🇩🇪', clients: 156, bandwidth: '2.4 Gbps', status: 'active', uptime: '99.98%', protocol: 'wireguard' },
    { name: 'USA East', ip: '23.106.215.77', port: 51820, country: 'United States', countryCode: 'US', flag: '🇺🇸', clients: 234, bandwidth: '4.1 Gbps', status: 'active', uptime: '99.91%', protocol: 'wireguard' },
    { name: 'Singapore', ip: '194.163.140.88', port: 51820, country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', clients: 89, bandwidth: '1.5 Gbps', status: 'active', uptime: '99.93%', protocol: 'wireguard' },
    { name: 'United Kingdom', ip: '89.238.178.23', port: 51820, country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', clients: 112, bandwidth: '2.0 Gbps', status: 'maintenance', uptime: '98.50%', protocol: 'wireguard' },
    { name: 'Canada', ip: '172.83.156.44', port: 51820, country: 'Canada', countryCode: 'CA', flag: '🇨🇦', clients: 45, bandwidth: '0.9 Gbps', status: 'active', uptime: '99.89%', protocol: 'wireguard' },
    { name: 'Finland', ip: '91.219.236.12', port: 51820, country: 'Finland', countryCode: 'FI', flag: '🇫🇮', clients: 34, bandwidth: '0.7 Gbps', status: 'active', uptime: '99.96%', protocol: 'wireguard' },
    
    // Shadowsocks серверы
    { name: 'Unknown Server', ip: '130.49.189.158', port: 43558, country: 'Unknown', countryCode: 'US', flag: '🏳️', clients: 23, bandwidth: '0.5 Gbps', status: 'active', uptime: '99.80%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf-poly1305', password: 'MYkM/b5ww6KhyHjBKB6OZifqzcXEnDT2jDIBWwyYAws=' } },
    { name: 'Hong Kong #1', ip: '103.141.221.101', port: 8388, country: 'Hong Kong', countryCode: 'HK', flag: '🇭🇰', clients: 67, bandwidth: '1.1 Gbps', status: 'active', uptime: '99.92%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf', password: 'asd123456' } },
    { name: 'Hong Kong #2', ip: '103.149.182.105', port: 8388, country: 'Hong Kong', countryCode: 'HK', flag: '🇭🇰', clients: 54, bandwidth: '0.9 Gbps', status: 'active', uptime: '99.88%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf', password: 'asd123456' } },
    { name: 'Hong Kong #3', ip: '103.141.221.124', port: 8388, country: 'Hong Kong', countryCode: 'HK', flag: '🇭🇰', clients: 78, bandwidth: '1.3 Gbps', status: 'active', uptime: '99.95%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf', password: 'asd123456' } },
    { name: 'Japan, Shinagawa', ip: '191.223.221.53', port: 8388, country: 'Japan', countryCode: 'JP', flag: '🇯🇵', clients: 42, bandwidth: '0.8 Gbps', status: 'active', uptime: '99.94%', protocol: 'shadowsocks', ssConfig: { method: 'aes-256-gcm', password: 'JuD6MNgtX3nVpCzFzXYVYjDTZ7nsmavT' } },
    { name: 'South Korea, Seoul', ip: '211.178.105.134', port: 6123, country: 'South Korea', countryCode: 'KR', flag: '🇰🇷', clients: 56, bandwidth: '1.0 Gbps', status: 'active', uptime: '99.90%', protocol: 'shadowsocks', ssConfig: { method: 'aes-256-cfb', password: 'qwerREWQ@' } },
    { name: 'Netherlands #1', ip: '82.38.31.185', port: 8080, country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', clients: 89, bandwidth: '1.5 Gbps', status: 'active', uptime: '99.93%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf-poly1305', password: 'k1dBOmOB4oqi7Ump37a1bQ' } },
    { name: 'Netherlands #2', ip: '82.38.31.195', port: 8080, country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', clients: 76, bandwidth: '1.3 Gbps', status: 'active', uptime: '99.91%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf-poly1305', password: 'k1dBOmOB4oqi7Ump37a1bQ' } },
    { name: 'Netherlands #3', ip: '82.38.31.204', port: 8080, country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', clients: 92, bandwidth: '1.6 Gbps', status: 'active', uptime: '99.94%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf-poly1305', password: 'k1dBOmOB4oqi7Ump37a1bQ' } },
    { name: 'Netherlands #4', ip: '82.38.31.11', port: 8080, country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', clients: 65, bandwidth: '1.1 Gbps', status: 'active', uptime: '99.89%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf-poly1305', password: 'oZIoA69Q8yhcQV8ka3Pa3A' } },
    { name: 'Netherlands #5', ip: '82.38.31.149', port: 8080, country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', clients: 71, bandwidth: '1.2 Gbps', status: 'active', uptime: '99.92%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf-poly1305', password: 'oZIoA69Q8yhcQV8ka3Pa3A' } },
    { name: 'Netherlands #6', ip: '82.38.31.174', port: 443, country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', clients: 83, bandwidth: '1.4 Gbps', status: 'active', uptime: '99.95%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf-poly1305', password: 'oZIoA69Q8yhcQV8ka3Pa3A' } },
    { name: 'Netherlands #7', ip: '82.38.31.7', port: 8080, country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', clients: 58, bandwidth: '1.0 Gbps', status: 'active', uptime: '99.88%', protocol: 'shadowsocks', ssConfig: { method: 'chacha20-ietf-poly1305', password: 'oZIoA69Q8yhcQV8ka3Pa3A' } },
  ])

  const countryFlags: Record<string, string> = {
    'DE': '🇩🇪', 'NL': '🇳🇱', 'US': '🇺🇸', 'JP': '🇯🇵', 'SG': '🇸🇬',
    'GB': '🇬🇧', 'CA': '🇨🇦', 'FI': '🇫🇮', 'FR': '🇫🇷', 'PL': '🇵🇱',
    'SE': '🇸🇪', 'CH': '🇨🇭', 'RU': '🇷🇺', 'UA': '🇺🇦', 'BY': '🇧🇾',
    'KZ': '🇰🇿', 'BR': '🇧🇷', 'AU': '🇦🇺', 'IN': '🇮🇳', 'KR': '🇰🇷',
    'IT': '🇮🇹', 'ES': '🇪🇸', 'TR': '🇹🇷', 'IL': '🇮🇱', 'AE': '🇦🇪',
    'HK': '🇭🇰',
  }

  // Парсинг Shadowsocks URL
  const parseShadowsocksURL = (url: string) => {
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
      
      return { host, port: parseInt(port), method, password, name }
    } catch (e) {
      return null
    }
  }

  // Определение сервера по URL или IP
  const detectServer = async () => {
    if (!serverInput.trim()) {
      setDetectError('Введите URL или IP адрес')
      return
    }

    setDetecting(true)
    setDetectError('')
    setDetectedServer(null)

    try {
      // Проверяем это Shadowsocks URL
      if (serverInput.startsWith('ss://')) {
        const ssData = parseShadowsocksURL(serverInput)
        if (ssData) {
          // Определяем страну по IP
          const res = await fetch(`https://ipapi.co/${ssData.host}/json/`)
          const data = await res.json()
          
          if (data && data.country_code) {
            setDetectedServer({
              name: ssData.name || data.country_name,
              ip: ssData.host,
              port: ssData.port,
              country: data.country_name,
              countryCode: data.country_code,
              flag: countryFlags[data.country_code] || '🏳️',
              protocol: 'shadowsocks',
              ssConfig: {
                method: ssData.method,
                password: ssData.password
              }
            })
            setServerName(ssData.name || data.country_name)
          } else {
            setDetectError('Не удалось определить страну сервера')
          }
        } else {
          setDetectError('Неверный формат Shadowsocks URL')
        }
      } else {
        // Обычный IP адрес (WireGuard)
        const res = await fetch(`https://ipapi.co/${serverInput}/json/`)
        const data = await res.json()
        
        if (data && data.country_code) {
          setDetectedServer({
            name: data.country_name,
            ip: serverInput,
            port: 51820,
            country: data.country_name,
            countryCode: data.country_code,
            flag: countryFlags[data.country_code] || '🏳️',
            protocol: 'wireguard'
          })
          setServerName(data.country_name)
        } else {
          setDetectError('Не удалось определить страну. Проверьте IP.')
        }
      }
    } catch (err) {
      setDetectError('Ошибка сети. Попробуйте позже.')
    }
    setDetecting(false)
  }

  const handleAddServer = () => {
    if (!detectedServer || !serverName) return

    const newServer: ServerData = {
      name: serverName,
      ip: detectedServer.ip || '',
      port: detectedServer.port || 51820,
      country: detectedServer.country || '',
      countryCode: detectedServer.countryCode || '',
      flag: detectedServer.flag || '🏳️',
      clients: 0,
      bandwidth: '0 Gbps',
      status: 'active',
      uptime: '100%',
      protocol: detectedServer.protocol || 'wireguard',
      ssConfig: detectedServer.ssConfig
    }

    setServers([...servers, newServer])
    setShowAddServer(false)
    setServerInput('')
    setServerName('')
    setDetectedServer(null)
  }

  // Симуляция трафика для VPN админа
  useEffect(() => {
    if (vpnConnected) {
      const interval = setInterval(() => {
        setVpnTraffic(prev => prev + Math.random() * 3)
        setVpnSpeed(Math.random() * 60 + 15)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setVpnSpeed(0)
    }
  }, [vpnConnected])

  const handleVpnConnect = () => {
    setVpnConnecting(true)
    setTimeout(() => {
      setVpnConnecting(false)
      setVpnConnected(!vpnConnected)
    }, 2000)
  }

  // Обновление данных в реальном времени (симуляция)
  const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const onlineUsers = users.filter(u => u.status === 'online')
  const totalTraffic = '34.7 GB'

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
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-xs font-mono hidden sm:block">
            {currentTime.toLocaleTimeString('ru-RU')}
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Admin
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <nav className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-800/50 p-4">
          <div className="flex lg:flex-col gap-2">
            {([
              { id: 'dashboard' as AdminTab, icon: '📊', label: 'Дашборд' },
              { id: 'vpn' as AdminTab, icon: '🔌', label: 'VPN Подключение' },
              { id: 'users' as AdminTab, icon: '👥', label: 'Пользователи' },
              { id: 'servers' as AdminTab, icon: '🖥️', label: 'Серверы' },
              { id: 'keys' as AdminTab, icon: '🔑', label: 'Ключи' },
              { id: 'logs' as AdminTab, icon: '📋', label: 'Логи' },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Обзор</h2>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Онлайн сейчас</span>
                    <span className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400">🟢</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{onlineUsers.length}</p>
                  <p className="text-green-400 text-xs mt-1">из {users.length} пользователей</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Серверов</span>
                    <span className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">🖥️</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{servers.filter(s => s.status === 'active').length}<span className="text-lg text-gray-500">/{servers.length}</span></p>
                  <p className="text-yellow-400 text-xs mt-1">{servers.filter(s => s.status === 'maintenance').length} на обслуживании</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Трафик сегодня</span>
                    <span className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">📡</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{totalTraffic}</p>
                  <p className="text-cyan-400 text-xs mt-1">↑ 12% vs вчера</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Стран</span>
                    <span className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">🌍</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{new Set(servers.map(s => s.countryCode)).size}</p>
                  <p className="text-purple-400 text-xs mt-1">геозон покрытия</p>
                </div>
              </div>

              {/* Online users */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Активные подключения</h3>
                  <span className="text-green-400 text-sm">{onlineUsers.length} онлайн</span>
                </div>
                <div className="divide-y divide-gray-800/50">
                  {onlineUsers.map(user => (
                    <div key={user.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-800/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center">
                          <span className="text-green-400 text-xs font-bold">{user.username[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{user.username}</p>
                          <p className="text-gray-500 text-xs">{user.country} • {user.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">{servers.find(s => s.name === user.server)?.flag} {user.server}</span>
                        <span className="text-gray-400 hidden sm:inline">{user.connected}</span>
                        <span className="text-blue-400">{user.traffic}</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Server load */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4">Нагрузка серверов</h3>
                <div className="space-y-3">
                  {servers.map(server => (
                    <div key={server.ip} className="flex items-center gap-4">
                      <span className="text-lg w-8">{server.flag}</span>
                      <span className="text-gray-300 text-sm w-28 truncate">{server.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        server.protocol === 'shadowsocks' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {server.protocol === 'shadowsocks' ? 'SS' : 'WG'}
                      </span>
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            server.status === 'maintenance' ? 'bg-yellow-500' : 
                            server.status === 'offline' ? 'bg-red-500' :
                            'bg-gradient-to-r from-blue-500 to-cyan-400'
                          }`}
                          style={{ width: `${Math.min((server.clients / 250) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm w-16 text-right">{server.clients} кл.</span>
                      <span className="text-gray-500 text-xs w-14 text-right">{server.uptime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vpn' && (
            <div className="max-w-lg mx-auto">
              {/* Баннер админа */}
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 mb-6 flex items-center gap-3">
                <span className="text-purple-400">👑</span>
                <div className="flex-1">
                  <p className="text-purple-300 text-sm">Режим администратора</p>
                  <p className="text-gray-400 text-xs">Бесплатное подключение без ограничений и активации ключа</p>
                </div>
              </div>

              {/* Connection circle */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative w-56 h-56 mb-8">
                  <div className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                    vpnConnected ? 'border-green-500/30' : vpnConnecting ? 'border-yellow-500/30 animate-spin' : 'border-gray-700'
                  }`} />
                  {vpnConnected && (
                    <div className="absolute inset-4 rounded-full bg-green-500/5 animate-pulse" />
                  )}
                  <button
                    onClick={handleVpnConnect}
                    disabled={vpnConnecting}
                    className={`absolute inset-6 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                      vpnConnected
                        ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-2 border-green-500/50 shadow-lg shadow-green-500/20'
                        : vpnConnecting
                        ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/50'
                        : 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10'
                    }`}
                  >
                    {vpnConnecting ? (
                      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className={`w-12 h-12 mb-2 transition-colors ${vpnConnected ? 'text-green-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {vpnConnected ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          )}
                        </svg>
                        <span className={`text-sm font-medium ${vpnConnected ? 'text-green-400' : 'text-gray-400'}`}>
                          {vpnConnected ? 'Отключить' : 'Подключить'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-1">
                    {vpnConnected ? 'Защищённое соединение' : vpnConnecting ? 'Подключение...' : 'Нажмите для подключения'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {vpnConnected ? `${servers.find(s => s.name === vpnSelectedServer)?.flag} ${vpnSelectedServer}` : `Рекомендуемый: ${servers.find(s => s.name === vpnSelectedServer)?.flag} ${vpnSelectedServer}`}
                  </p>
                </div>
              </div>

              {/* Stats */}
              {vpnConnected && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Скорость ↓</p>
                    <p className="text-xl font-bold text-blue-400">{vpnSpeed.toFixed(1)} <span className="text-sm text-gray-500">Мб/с</span></p>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Трафик</p>
                    <p className="text-xl font-bold text-purple-400">{vpnTraffic.toFixed(1)} <span className="text-sm text-gray-500">МБ</span></p>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Пинг</p>
                    <p className="text-xl font-bold text-green-400">24 <span className="text-sm text-gray-500">мс</span></p>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Протокол</p>
                    <p className="text-xl font-bold text-cyan-400">WG</p>
                  </div>
                </div>
              )}

              {/* Server selector */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-3">Выбрать сервер</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {servers.filter(s => s.status === 'active').map(server => (
                    <button
                      key={server.ip}
                      onClick={() => setVpnSelectedServer(server.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        vpnSelectedServer === server.name
                          ? 'bg-purple-500/10 border border-purple-500/30'
                          : 'bg-gray-800/50 border border-transparent hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{server.flag}</span>
                        <div className="text-left">
                          <p className="text-white text-sm font-medium">{server.name}</p>
                          <p className="text-gray-500 text-xs font-mono">{server.ip}:{server.port}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          server.protocol === 'shadowsocks' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {server.protocol === 'shadowsocks' ? 'SS' : 'WG'}
                        </span>
                        <span className="text-gray-400 text-xs">{server.clients} кл.</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Пользователи</h2>
                <input
                  type="text"
                  placeholder="Поиск по имени или ключу..."
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 w-64"
                />
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left px-5 py-3 text-gray-400 text-sm font-medium">Пользователь</th>
                        <th className="text-left px-5 py-3 text-gray-400 text-sm font-medium">Страна</th>
                        <th className="text-left px-5 py-3 text-gray-400 text-sm font-medium">Платформа</th>
                        <th className="text-left px-5 py-3 text-gray-400 text-sm font-medium">Сервер</th>
                        <th className="text-left px-5 py-3 text-gray-400 text-sm font-medium">Статус</th>
                        <th className="text-left px-5 py-3 text-gray-400 text-sm font-medium">Трафик</th>
                        <th className="text-left px-5 py-3 text-gray-400 text-sm font-medium">Истекает</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-800/20 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                user.status === 'online' ? 'bg-green-500/20' : 'bg-gray-700'
                              }`}>
                                <span className={`text-xs font-bold ${user.status === 'online' ? 'text-green-400' : 'text-gray-400'}`}>
                                  {user.username[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="text-white text-sm">{user.username}</span>
                                <p className="text-gray-600 text-xs font-mono">{user.ip}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-lg">{countryFlags[user.country] || '🏳️'}</span>
                            <span className="text-gray-400 text-xs ml-1">{user.country}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-gray-300 text-sm">{user.platform}</span>
                          </td>
                          <td className="px-5 py-3 text-gray-300 text-sm">
                            {servers.find(s => s.name === user.server)?.flag} {user.server}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                              user.status === 'online'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-gray-800 text-gray-400 border border-gray-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-green-400' : 'bg-gray-500'}`} />
                              {user.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-300 text-sm">{user.traffic}</td>
                          <td className="px-5 py-3">
                            <span className={`text-sm ${
                              parseInt(user.expires) <= 5 ? 'text-red-400' : parseInt(user.expires) <= 15 ? 'text-yellow-400' : 'text-gray-300'
                            }`}>{user.expires}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'servers' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Серверы</h2>
                <button
                  onClick={() => setShowAddServer(!showAddServer)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить сервер
                </button>
              </div>

              {showAddServer && (
                <div className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>🌐</span> Новый сервер
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">
                        URL сервера или IP адрес
                        <span className="text-gray-600 ml-2">(поддерживается ss:// URL и обычный IP)</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={serverInput}
                          onChange={(e) => { setServerInput(e.target.value); setDetectedServer(null); setDetectError('') }}
                          placeholder="ss://... или 185.220.101.42"
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50 font-mono"
                        />
                        <button
                          onClick={detectServer}
                          disabled={detecting}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                          {detecting ? (
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span>🔍</span>
                          )}
                          {detecting ? 'Определяем...' : 'Определить'}
                        </button>
                      </div>
                      {detectError && <p className="text-red-400 text-sm mt-2">{detectError}</p>}
                    </div>

                    {detectedServer && (
                      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{detectedServer.flag}</span>
                          <div>
                            <p className="text-green-400 font-medium">Сервер определён!</p>
                            <p className="text-gray-400 text-sm">{detectedServer.country} • {detectedServer.ip}:{detectedServer.port}</p>
                            <p className="text-gray-500 text-xs">
                              Протокол: 
                              <span className={detectedServer.protocol === 'shadowsocks' ? 'text-orange-400 ml-1' : 'text-blue-400 ml-1'}>
                                {detectedServer.protocol === 'shadowsocks' ? 'Shadowsocks' : 'WireGuard'}
                              </span>
                              {detectedServer.ssConfig && (
                                <span className="text-gray-600 ml-2">({detectedServer.ssConfig.method})</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Название сервера</label>
                          <input
                            type="text"
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                            placeholder={detectedServer.name}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleAddServer}
                        disabled={!detectedServer || !serverName}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
                      >
                        🚀 Развернуть сервер
                      </button>
                      <button
                        onClick={() => { setShowAddServer(false); setServerInput(''); setServerName(''); setDetectedServer(null) }}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servers.map(server => (
                  <div key={server.ip} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{server.flag}</span>
                        <div>
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            {server.name}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              server.protocol === 'shadowsocks' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {server.protocol === 'shadowsocks' ? 'SS' : 'WG'}
                            </span>
                          </h4>
                          <p className="text-gray-500 text-xs font-mono">{server.ip}:{server.port}</p>
                          <p className="text-gray-600 text-xs">{server.country}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        server.status === 'active'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : server.status === 'maintenance'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {server.status === 'active' ? '● Active' : server.status === 'maintenance' ? '⚠ Maintenance' : '✕ Offline'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-gray-500 text-xs">Клиенты</p>
                        <p className="text-white font-bold">{server.clients}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-gray-500 text-xs">Пропускная</p>
                        <p className="text-white font-bold text-sm">{server.bandwidth}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-gray-500 text-xs">Uptime</p>
                        <p className="text-white font-bold text-sm">{server.uptime}</p>
                      </div>
                    </div>
                    {server.protocol === 'shadowsocks' && server.ssConfig && (
                      <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-2 mb-4 text-xs">
                        <p className="text-orange-400 font-medium mb-1">Shadowsocks Config:</p>
                        <p className="text-gray-400 font-mono">Method: {server.ssConfig.method}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs transition-colors">
                        Перезапустить
                      </button>
                      <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs transition-colors">
                        Конфиг
                      </button>
                      <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs transition-colors border border-red-500/20">
                        Стоп
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Ключи подписки</h2>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">Генерация ключей</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Срок действия</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50">
                      <option>7 дней</option>
                      <option>30 дней</option>
                      <option>90 дней</option>
                      <option>365 дней</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Тариф</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50">
                      <option>Basic (1 устройство)</option>
                      <option>Premium (3 устройства)</option>
                      <option>Unlimited (∞ устройств)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Количество</label>
                    <input
                      type="number"
                      defaultValue={1}
                      min={1}
                      max={100}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20">
                  🔑 Сгенерировать ключи
                </button>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Последние ключи</h3>
                <div className="space-y-2">
                  {[
                    { key: 'XK7F-9M2P-4R8T-1W3Y', duration: '30 дней', created: '2 мин назад', used: false },
                    { key: 'B3N5-L8Q2-6H4J-9C1V', duration: '90 дней', created: '15 мин назад', used: true },
                    { key: 'D6G8-R1T4-2K5M-7P9W', duration: '7 дней', created: '1 час назад', used: false },
                    { key: 'F2H4-N7Q9-3J6L-8C0V', duration: '365 дней', created: '3 часа назад', used: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-cyan-400">{item.key}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${item.used ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {item.used ? 'Использован' : 'Свободен'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{item.duration}</span>
                        <span>{item.created}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Системные логи</h2>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Последние события</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs">Live</span>
                  </div>
                </div>
                <div className="p-4 font-mono text-xs space-y-1 max-h-[500px] overflow-y-auto">
                  {[
                    { time: '14:32:05', level: 'INFO', msg: 'User alex_dev connected to Germany server (WireGuard)' },
                    { time: '14:31:48', level: 'INFO', msg: 'WireGuard handshake completed for 185.220.101.42:51820' },
                    { time: '14:30:22', level: 'WARN', msg: 'Server UK high load detected (89%)' },
                    { time: '14:29:15', level: 'INFO', msg: 'User marina_k connected to Netherlands server (WireGuard)' },
                    { time: '14:28:03', level: 'INFO', msg: 'Key XK7F-9M2P-4R8T-1W3Y generated (30 days)' },
                    { time: '14:27:44', level: 'ERROR', msg: 'Connection timeout for user darkn1ght → USA East' },
                    { time: '14:26:30', level: 'INFO', msg: 'User pro_gamer connected to Japan (SS) server (Shadowsocks)' },
                    { time: '14:25:12', level: 'INFO', msg: 'DNS query blocked: ads.tracker.com (user: freedom_x)' },
                    { time: '14:24:55', level: 'INFO', msg: 'Server Finland: 34 active connections' },
                    { time: '14:23:40', level: 'WARN', msg: 'Key D5C8-****-****-9A34 expires in 2 days' },
                    { time: '14:22:18', level: 'INFO', msg: 'New user registered via Telegram bot' },
                    { time: '14:21:05', level: 'INFO', msg: 'Server Germany: bandwidth 2.4 Gbps' },
                    { time: '14:20:33', level: 'INFO', msg: 'Kill switch activated for user anon_user' },
                    { time: '14:19:17', level: 'INFO', msg: 'User shadow_42 connected to Finland server (WireGuard)' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-3 py-1 hover:bg-gray-800/30 px-2 rounded">
                      <span className="text-gray-600">[{log.time}]</span>
                      <span className={`font-bold w-12 ${
                        log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-yellow-400' : 'text-green-400'
                      }`}>{log.level}</span>
                      <span className="text-gray-300">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
